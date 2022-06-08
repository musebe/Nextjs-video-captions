import { useRef, useState } from 'react';

export default function Home() {
  const videoRef = useRef();
  const inputRef = useRef();
  const [video, setVideo] = useState();
  const [sampleselected, setSampleSelected] = useState(false);

  const onChange = async (e) => {
    const file = e.target.files?.item(0);
    setVideo(file)
  }

  function readFile(file) {
    console.log("readFile()=>", file);
    return new Promise(function (resolve, reject) {
      let fr = new FileReader();

      fr.onload = function () {
        resolve(fr.result);
      };

      fr.onerror = function () {
        reject(fr);
      };

      fr.readAsDataURL(file);
    });
  }

  const captionHandler = async () => {
    await readFile(video).then((encoded_file) => {
      console.log(encoded_file)
      try {
        fetch('/api/cloudinary', {
          method: 'POST',
          body: JSON.stringify({ data: encoded_file }),
          headers: { 'Content-Type': 'application/json' },
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data.data);
            setSampleSelected(true)
          });
      } catch (error) {
        console.error(error);
      }
    });
  };

  return (
    <div className="container" >
      <h2>Nextjs Video Captioning</h2>
      <div className="row">
        <div className="column">
          <button onClick={() => {inputRef.current.click()}}>Select video</button>
          <input
            ref={inputRef}
            type="file"
            hidden
            onChange={onChange}
          /><br />
          {video ? (
            <video ref={videoRef} className="Video" controls src={URL.createObjectURL(video)} autoPlay loop/>
          ) :
            <video title="video shows here" controls />
          }<br />
        </div>
      </div>
      {sampleselected?
      "caption complete! Check the captioned text in your cloudinary media library"
        :
        <button onClick={captionHandler}>Click</button>
      }
    </div>
  )
};
