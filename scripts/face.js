
var video = document.getElementById('inputVideo');
var MODEL_URL = 'models/';


var mtcnnForwardParams = {
  // number of scaled versions of the input image passed through the CNN
  // of the first stage, lower numbers will result in lower inference time,
  // but will also be less accurate
  // maxNumScales: 5,
  // // scale factor used to calculate the scale steps of the image
  // // pyramid used in stage 1
  // scaleFactor: 0.709,
  // // the score threshold values used to filter the bounding
  // // boxes of stage 1, 2 and 3
  // scoreThresholds: [0.6, 0.7, 0.7],
  // mininum face size to expect, the higher the faster processing will be,
  // but smaller faces won't be detected
  minFaceSize: 50
}

Promise.all([
  faceapi.loadTinyFaceDetectorModel(MODEL_URL),
  faceapi.loadFaceRecognitionModel(MODEL_URL),
  faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
  faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL),
  faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
  faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL)
])
.then( () => {
  if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
      video.srcObject = stream; 
    });
    console.log(faceapi);
  }
});


// video.addEventListener('play', () => {
  
//   detectAllFaces();
// })

function detectAllFaces(){
  let canvas = document.getElementById('overlay');
  console.log(new faceapi.TinyFaceDetectorOptions());
  faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
  .withFaceLandmarks({useTinyModel: true})
  .withFaceExpressions()
  .withAgeAndGender()
  .withFaceDescriptor()
  .then( results => {
    // console.log(video, canvas);
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    canvas.setAttribute('width' , canvas.width);
    canvas.setAttribute('height', canvas.height);

    console.log(results);
    if(results){

      if(results.expressions.happy >= 0.9) {
        canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight);  
        // console.log(results);
        canvas.toBlob(blob => {
          // console.log(blob);
          document.getElementById("image").src = window.URL.createObjectURL(blob);
        });
      }
      
      // faceapi.draw.drawDetections(canvas, results);
      // faceapi.draw.options.anchorPosition = 'BOTTOM_LEFT';
      faceapi.draw.drawFaceLandmarks(canvas, results);
      faceapi.draw.drawFaceExpressions(canvas, results);
      faceapi.draw.DrawTextField(canvas, results);
      
    }

    
    // drawBox.draw(canvas);
    
    console.log(faceapi.draw);

    // faceapi.draw.drawDetections(canvas, results.map(res => res.detection), drawOptions);
    // faceapi.draw.drawFaceLandmarks(canvas, results.map(res => res.landmarks));
   
    console.log('detecting ...');
    setTimeout(() => {
      detectAllFaces();
    }, 0);
  })
  
}