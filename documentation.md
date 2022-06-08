### Create video captions with Nextjs.

## Introduction

Video captioning is vital for making videos accessible to a larger audience, providing a better ROI, and getting more people to start watching the videos. This article demonstrates how Next js can be used to identify and display captions from videos and will also include an online storage feature. Both elements shall be achieved via Cloudinary online services


## Codesandbox

Check the sandbox demo on  [Codesandbox](/).

<CodeSandbox
title="mergevideos"
id=" "
/>

You can also get the project Github repo using [Github](/).

## Prerequisites

Entry-level javascript and React/Nextjs knowledge.

## Setting Up the Sample Project

In your respective folder, create a new nextjs app : `npx create-next-app videocaptions` in your terminal.
Go to your project root directory `cd videocaptions`
 
We will use Nextjs serverside backend. Here we will set up [Cloudinary](https://cloudinary.com/?ap=em)  for our backend. 
Start by creating your Cloudinary account using [Link](https://cloudinary.com/console) and logging in to it. Each Cloudinary user account will have a dashboard containing the environment variable keys necessary for the Cloudinary integration in our project.

Include Cloudinary in your project dependencies `npm install cloudinary`.
Create a directory `.env.local` in the root directory and use the following guide to feel the dashboard variables to your project.
```
".env.local"


CLOUDINARY_CLOUD_NAME =

CLOUDINARY_API_KEY =

CLOUDINARY_API_SECRET =
```

To load the variables, restart your project: `npm run dev`.

In the `pages/api` folder, create a new directory `pages/api/cloudinary.js`. 
Start by configuring the environment keys and libraries.

```
"pages/cloudinary"

var cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
```

Create a handler function to execute the POST request. Cloudinary has its own set of video transformation capabilities. We will use the POST request to generate speech-to-text transcripts. It is as easy as including the parameters inside the below handler function. Once a file is uploaded. The video will be uploaded and a captioned transcript will be available in a user's account media library.

```
"pages/cloudinary"

export default async function handler(req, res) {
    let uploaded_url = '';
    const fileStr = req.body.data;

    if (req.method === 'POST') {
        try {
            const uploadedResponse = await cloudinary.uploader.upload_large(fileStr, {
                resource_type: "video",
                chunk_size: 6000000,
                raw_convert: "google_speech"
            });
            uploaded_url = uploadedResponse.secure_url;
            console.log(uploadedResponse)
        } catch (error) {
            console.log(error);
        }
        res.status(200).json({ data: uploaded_url });
        console.log('complete!');
    }
}
```

Now we complete the front end. Here, we only need our UI to be able to import a video file and send it to the backend for captioning. Paste the following code in the return function. The css files can be located in the Github repository.

```
pages/index"


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
      "caption complete! Check the captioned text in your Cloudinary media library"
        :
        <button onClick={captionHandler}>Click</button>
      }
    </div>
)
````
Once you paste the css code, the UI should look like the below:

![complete UI](https://res.cloudinary.com/dogjmmett/image/upload/v1654688684/UI_akdxk7.png "complete UI")

Now to instruct our buttons. In the home component, import and declare the following state hooks. We will use them to reference the video elements as we access them inside the functions. 

```
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
      "caption complete! Check the captioned text in your Cloudinary media library"
        :
        <button onClick={captionHandler}>Click</button>
      }
    </div>
  )
};

```

The `select video` button is used to fire the `onChange` function which imports the local video files to be viewed in the video Element. We use the `setVideo` state hook to access the selected file throughout the rest of the functions we'll create. 

We finally use a file reader to encode the selected file into base64 format and send it to the backend for Cloudinary upload. Once the upload is complete the user will be notified to check their accounts media library for the transcript.

Your media library will contain a file like the below:

![captioned transcript](https://res.cloudinary.com/dogjmmett/image/upload/v1654687561/transcript_p3zky1.png "captioned transcript").

That completes the project. You can go through the article to enjoy your experience