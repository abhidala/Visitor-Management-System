
// import React, { useState, useCallback, useRef, useEffect } from 'react';
// import Webcam from 'react-webcam';
// import FacesModal from './FacesModal';
// import  axios from 'axios';
// import { toast } from 'react-toastify';
// import { useData } from '../DataContext';
// const ImageCapture =({ onCapture, fieldId,imageData,onRowClickInParent }) => {
//    const {sharedData,updateSharedData}= useData();
//   const [image, setImage] = useState({"base64Image":""});
//   const [responseData,setResponseData]= useState();
//   const [userData,setUserData]=useState();
//   const [imagetoUpdate,setImagetoUpdate] = useState("");
//   const [imageSend,setImageSend]= useState({"base64Image":""});
//   const [openModal,setOpenModal] = useState(false);
//   const webcamRef = useRef(null);
//   const [cameraDevices, setCameraDevices] = useState([]);
//   const [selectedDeviceId, setSelectedDeviceId] = useState(null);
//  useEffect(()=>{
//   updateSharedData(imagetoUpdate);
//  },[imagetoUpdate]);
      
//   const handleImageClick =async (src) => {
    
//     console.log('Clicked image source:', src.substring(23));
//     try{
//       setImagetoUpdate(src.replace(/^[^,]+,\s*/, ''))
//       const requestData= {"Image":src.replace(/^[^,]+,\s*/, '')};
//   const response = await axios.post('http://localhost:5002/api/facesimilarity',requestData);
//   console.log(response.data);
//   if(response && response.data && response.data.completeData && response.data.completeData.length>0){
//     setUserData(response.data.completeData);
// console.log("Match Found:",response.data.completeData);
//   }
//   else{
//     setOpenModal(false);
//     toast.info("No match Found.Please enter the details");
//   }
//   console.log(response);
//     }catch(error){
//       console.error(error);
//     }
//   };
// useEffect(()=>{
// setImageSend({...imageSend,"base64Image":imageData});
// setImage({...image,"base64Image":imageData});
// console.log(imageData);
//  },[imageData])
//   useEffect(() => {
//     // Enumerate available media devices (cameras)
//     navigator.mediaDevices.enumerateDevices().then((devices) => {
//       const cameraDevices = devices.filter((device) => device.kind === 'videoinput');
//       setCameraDevices(cameraDevices);
// // setNumberofCamera(cameraDevices.length);
//       // Select the first camera as the default option (you can change this logic)
//       if (cameraDevices.length > 0) {
//         setSelectedDeviceId(cameraDevices[0].deviceId);
//       }
//     });
//   }, []);
//   useEffect(()=>{
   
//     const fetchData= async()=>{
// if(responseData && Array.isArray(responseData.croppedImages) && responseData.croppedImages.length===1){
//   try{
//     const requestData= {"Image":responseData.croppedImages[0].replace(/^[^,]+,\s*/, '')};
    
    
// const response = await axios.post('http://localhost:5002/api/facesimilarity',requestData);
// console.log(response.data);
// if(response && response.data && response.data.completeData && response.data.completeData.length===0){
//   toast.info("No Match Found.Please enter the details.")
// }
// else if(response && response.data && response.data.completeData && response.data.completeData.length>0){
// setUserData(response.data.completeData);
// setOpenModal(true);
// }
// console.log(response);
//   }catch(error){
//     console.error(error);
//   }
// }}
// fetchData();
//   },[responseData]);
//  const buttonClicked=async ()=>{
  
//   try{
//     const imagetoSend={"base64Image":image.base64Image.replace(/^[^,]+,\s*/, '')};
// const response = await fetch('http://localhost:5002/api/cropImage',{
//   method: 'POST',
//   headers:{
//     'Content-Type': 'application/json',
//   },
  
//   body: JSON.stringify(imagetoSend),
// }) ;
// if (!response.ok) {
//   throw new Error(`HTTP error! Status: ${response.status}`);
// }
// const data = await response.json();
// setUserData(null);
// setResponseData(data);
// if(data.croppedImages.length>1){
//   setOpenModal(true);
// }  else if(data.croppedimages.length===1){
//   setImagetoUpdate(data.croppedImages[0].replace(/^[^,]+,\s*/, ''));
// }
//       console.log('POST Request Response:', data);
//   }catch(error){
// console.error(error);
//   }
// }
//   const capture = useCallback(() => {
//     const imageSrc = webcamRef.current.getScreenshot();
//     console.log("Captured Image:",imageSrc);
//     setImage({...image,"base64Image":imageSrc});
//     setImageSend({...imageSend,"base64Image":imageSrc});
//    // console.log(imageSrc)
//     onCapture(imageSrc.replace(/^[^,]+,\s*/, ''));
//   }, [onCapture]);

//   const handleDeviceChange = (event) => {
//     setSelectedDeviceId(event.target.value);
//   };

//   return (
//     <div className="webcam-container">
//       <div className="webcam-img">
//         {image.base64Image === "" || image.base64Image ==="data:image/jpeg;base64,undefined" ? (
//           <>
//             <Webcam
//               audio={false}
//               height={200}
//               ref={webcamRef}
//               screenshotFormat="image/jpeg"
//               width={220}
//               videoConstraints={{
//                 width: 220,
//                 height: 200,
//                 facingMode: 'user',
//                 deviceId: selectedDeviceId, // Specify the selected camera device
//               }}
//             />
//             <select onChange={handleDeviceChange} value={selectedDeviceId}>
//               {cameraDevices.map((device) => (
//                 <option key={device.deviceId} value={device.deviceId}>
//                   {device.label}
//                 </option>
//               ))}
//             </select>
//           </>
//         ) : (
//           <img src={(image.base64Image)} alt="Captured" />
//         )}
//       </div>
//       <div >
//         {image.base64Image !=="data:image/jpeg;base64,undefined" && image.base64Image !=="" ? (
//           <button
//           type='button'
//             onClick={() => {
//               setImage({...image,"base64Image":""});
//             }}
//             className="webcam-btn w-md px-4 py-2 font-bold text-white bg-black border-white border-2 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline"
//           >
//             Retake Image
//           </button>
//         ) : (
//           <button
//           type='button'
//           className="webcam-btn w-md px-4 py-2 font-bold text-white bg-black border-white border-2 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline"
//           onClick={capture}
//           >
//             Capture photo
//           </button>
          
//          )}
//          <br/>
//          <button type='button' onClick={buttonClicked} 
//             className="webcam-btn w-md px-4 py-2 font-bold text-white bg-black border-white border-2 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline"
//             disabled={false}>Confirm</button>
//            {responseData && responseData.croppedImages ?(openModal && (    
//           <FacesModal
//           data={userData || responseData}
//             setOpenModal={setOpenModal}
//             handleImageClick={handleImageClick}
//             onRowClickInParent={onRowClickInParent}
//           />
//         )):(responseData && responseData.croppedImages && console.log(responseData.croppedImages.length))}  
//       </div>
//     </div>
//   );
// };

// export default ImageCapture;

// // import React, { useState, useCallback, useRef, useEffect } from 'react';
// // import Webcam from 'react-webcam';

// // const ImageCapture =React.memo( ({ onCapture, fieldId,imageData }) => {
// //   const [image, setImage] = useState('');
// //   const webcamRef = useRef(null);
// //   const [cameraDevices, setCameraDevices] = useState([]);
// //   const [selectedDeviceId, setSelectedDeviceId] = useState(null);
// //  useEffect(()=>{
// // setImage(imageData)
// //  },[imageData])
// //   useEffect(() => {
// //     // Enumerate available media devices (cameras)
// //     navigator.mediaDevices.enumerateDevices().then((devices) => {
// //       const cameraDevices = devices.filter((device) => device.kind === 'videoinput');
// //       setCameraDevices(cameraDevices);
// // // setNumberofCamera(cameraDevices.length);
// //       // Select the first camera as the default option (you can change this logic)
// //       if (cameraDevices.length > 0) {
// //         setSelectedDeviceId(cameraDevices[0].deviceId);
// //       }
// //     });
// //   }, []);

// //   const capture = useCallback(() => {
// //     const imageSrc = webcamRef.current.getScreenshot();
// //     setImage(imageSrc);
// //    // console.log(imageSrc)
// //     onCapture(imageSrc);
// //   }, [onCapture]);

// //   const handleDeviceChange = (event) => {
// //     setSelectedDeviceId(event.target.value);
// //   };

// //   return (
// //     <div className="webcam-container">
// //       <div className="webcam-img">
// //         {image === '' ? (
// //           <>
// //             <Webcam
// //               audio={false}
// //               height={200}
// //               ref={webcamRef}
// //               screenshotFormat="image/jpeg"
// //               width={220}
// //               videoConstraints={{
// //                 width: 220,
// //                 height: 200,
// //                 facingMode: 'user',
// //                 deviceId: selectedDeviceId, // Specify the selected camera device
// //               }}
// //             />
// //             <select onChange={handleDeviceChange} value={selectedDeviceId}>
// //               {cameraDevices.map((device) => (
// //                 <option key={device.deviceId} value={device.deviceId}>
// //                   {device.label}
// //                 </option>
// //               ))}
// //             </select>
// //           </>
// //         ) : (
// //           <img src={image} alt="Captured" />
// //         )}
// //       </div>
// //       <div>
// //         {image !== '' ? (
// //           <button
// //           type='button'
// //             onClick={() => {
// //               setImage('');
// //             }}
// //             className="webcam-btn w-md px-4 py-2 font-bold text-white bg-black border-2 border-gray rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline"
// //           >
// //             Retake Image
// //           </button>
// //         ) : (
// //           <button
// //           type='button'
// //             className="webcam-btn w-md px-4 py-2  mt-2 font-bold text-white border-2 bg-black border-white-2 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline"
// //             onClick={capture}
// //           >
// //             Capture photo
// //           </button>
// //         )}
// //       </div>
// //     </div>
// //   );
// // });

// // export default ImageCapture;

import React, { useState, useCallback, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import FacesModal from './FacesModal';
import  axios from 'axios';
import { useData } from '../DataContext';
import { toast } from 'react-toastify';
const endpoint1 = 'http://192.168.0.249:8000/faces/';
    const endpoint2 = 'http://192.168.0.249:8001/newface/';
    const endpoint3 = 'http://192.168.0.249:8002/face/'
const ImageCapture =({ onCapture, fieldId,imageData,onRowClickInParent }) => {
  const { sharedData, updateSharedData } = useData();
  const [image, setImage] = useState({"base64Image":""});
  const [responseData,setResponseData]= useState();
  const [userData,setUserData]=useState();
  const [imageSend,setImageSend]= useState({"base64Image":""});
  const [openModal,setOpenModal] = useState(false);
  const webcamRef = useRef(null);
  const [imagetoUpdate,setImagetoUpdate] = useState("");
  const [cameraDevices, setCameraDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  useEffect(()=>{
updateSharedData(imagetoUpdate);
  },[imagetoUpdate])
  const handleImageClick =async (src) => {
    
    console.log(src);
    try{
      setImagetoUpdate(src.Image.replace(/^[^,]+,\s*/, ''));
      // const requestData= {"Image":src.replace(/^[^,]+,\s*/, '')};
  const response = await axios.post('http://192.168.0.234:8000/faces/',src);
  
  if(response && response.data){
    console.log(response.data,"9999999")
    setUserData(response.data);

  }
  else{
    setOpenModal(false);
    toast.info("No match Found.Please enter the details");
  }
  
    }catch(error){
      console.error(error);
    }
  };
useEffect(()=>{
setImageSend({...imageSend,"base64Image":imageData});
setImage({...image,"base64Image":imageData});

 },[imageData])
  useEffect(() => {
    // Enumerate available media devices (cameras)
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const cameraDevices = devices.filter((device) => device.kind === 'videoinput');
      setCameraDevices(cameraDevices);
// setNumberofCamera(cameraDevices.length);
      // Select the first camera as the default option (you can change this logic)
      if (cameraDevices.length > 0) {
        setSelectedDeviceId(cameraDevices[0].deviceId);
      }
    });
  }, []);
//   useEffect(()=>{
    
//     const fetchData= async()=>{
// if(responseData && Array.isArray(responseData.croppedImages) && responseData.croppedImages.length===1){
//   try{
   
//     const requestData= {"Image":responseData.croppedImages[0].replace(/^[^,]+,\s*/, '')};
    
    
// const [response1,response2,response3] = await axios.all([axios.post(endpoint1, requestData),
// axios.post(endpoint2, requestData),axios.post(endpoint3,requestData)]);

// const response= response1.data + response2.data +response3.data


// if(response && response.data && response.data.matchedFaces && response.data.matchedFaces.length===0){
//   toast.info("No Match Found.Please enter the details.")
// }
// else if(response && response.data && response.data.matchedFaces && response.data.matchedFaces.length>0){
// setUserData(response.data.matchedFaces);

// setOpenModal(true);
// }

//   }catch(error){
//     console.error(error);
//   }
// }}
// fetchData();
//   },[responseData]);
 const buttonClicked=async ()=>{
 
  
  try{
    const imagetoSend={"base64Image":image.base64Image.replace(/^[^,]+,\s*/, '')};
const response = await fetch('http://192.168.0.234:8000/new/',{
  method: 'POST',
  headers:{
    'Content-Type': 'application/json',
  },
  
  body: JSON.stringify(imagetoSend),
}) ;
if (!response.ok) {
  throw new Error(`HTTP error! Status: ${response.status}`);
}
const data = await response.json();
setUserData(null);
setResponseData(data);
if(data.croppedImages.length>=1){
  setOpenModal(true);

} 
// else if(data.croppedImages.length===1){
//   setImagetoUpdate(data.croppedImages[0].replace(/^[^,]+,\s*/, ''))
// }
  }catch(error){
console.error(error);
  }
}
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    
    setImage({...image,"base64Image":imageSrc});
    setImageSend({...imageSend,"base64Image":imageSrc});
   // console.log(imageSrc)
    onCapture(imageSrc.replace(/^[^,]+,\s*/, ''));
  }, [onCapture]);

  const handleDeviceChange = (event) => {
    setSelectedDeviceId(event.target.value);
  };

  return (
    <div className="webcam-container">
      <div className="webcam-img">
        {image.base64Image === "" || image.base64Image ==="data:image/jpeg;base64,undefined" ? (
          <>
            <Webcam
              audio={false}
              height={200}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={220}
              videoConstraints={{
                width: 220,
                height: 200,
                facingMode: 'user',
                deviceId: selectedDeviceId, // Specify the selected camera device
              }}
            />
            <select onChange={handleDeviceChange} value={selectedDeviceId}>
              {cameraDevices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label}
                </option>
              ))}
            </select>
          </>
        ) : (
          <img src={(image.base64Image)} alt="Captured" />
        )}
      </div>
      <div >
        {image.base64Image !=="data:image/jpeg;base64,undefined" && image.base64Image !=="" ? (
          <button
          type='button'
            onClick={() => {
              setImage({...image,"base64Image":""});
            }}
            className="mt-2 w-full lg:w-1/4 md:w-2/6 sm:w-3/8 border-white border-2 px-4 py-2 font-bold text-white bg-black rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline"
            >
            Retake
          </button>
        ) : (
          <button
          type='button'
          className="mt-2 w-full lg:w-1/4 md:w-2/6 sm:w-3/8 border-white border-2 px-4 py-2 font-bold text-white bg-black rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline"
          onClick={capture}
          >
            Capture
          </button>
          
         )}
         <br/>
         <button type='button' onClick={buttonClicked} 
              className="mt-2 w-full lg:w-1/4 md:w-2/6 sm:w-3/8 border-white border-2 px-4 py-2 font-bold text-white bg-black rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline"
              disabled={false}>Confirm</button>
           {responseData && responseData.croppedImages ?(openModal && (
          <FacesModal
          data={userData || responseData}
            setOpenModal={setOpenModal}
            handleImageClick={handleImageClick}
            onRowClickInParent={onRowClickInParent}
          />
        )):(responseData && responseData.croppedImages && console.log(responseData.croppedImages.length))}  
      </div>
    </div>
  );
};

export default ImageCapture;
