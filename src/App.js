
import React, {useRef} from 'react'
import './App.css';
import * as facemesh  from "@tensorflow-models/facemesh"
import Webcam from 'react-webcam';
import { tf } from '@tensorflow/tfjs';
import {drawMesh} from "./utilities.js"



function App() {
  //setup references
  const webcamRef =  useRef(null);
  const canvasRef = useRef(null)

  // load facemesh
  const runFacemesh =  async() => {
    const net = await facemesh.load({
      inputResolution:{width:640, height:480}, scale:0.8
    })
    setInterval(() => {
      detect(net)
    }, 0)

  }

  // Detect function
  const detect =  async(net) => {
    if(typeof webcamRef.current !== "undefined" && webcamRef.current !== null && webcamRef.current.video.readyState === 4){
      // Get video properties
      const video = webcamRef.current.video
      const videoWidth = webcamRef.current.video.videoWidth
      const videoHeight = webcamRef.current.video.videoHeight

      // Set video width
      webcamRef.current.video.width = videoWidth
      webcamRef.current.video.height = videoHeight

      // set canvas width
      canvasRef.current.width = videoWidth
      canvasRef.current.height = videoHeight

      // Make detections
      const face = await net.estimateFaces(video);
      console.log(face)

      // Get canvas context for drawing

      const ctx = canvasRef.current.getContext("2d")
      
      drawMesh(face, ctx)
    }
  }

  runFacemesh()
  return (
    <div className="App">
      <header className='App-header'>
      <Webcam ref={webcamRef} style={ 
        {
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left:0,
          right:0,
          textAlign:"center",
          zIndex:9, 
          width:640,
          height:480
        }
      }/>
      <canvas ref={canvasRef} style={
        {
          position:"absolute",
          marginLeft:"auto",
          marginRight:"auto",
          left:0,
          right:0,
          textAlign:"center",
          zIndex:9,
          width:640,
          height:480
        }
      }/>
      </header>
    </div>
  );
}

export default App;
