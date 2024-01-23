import React, { useState, useEffect } from "react";
import { STPadServerLibDefault } from "./STPadServerLib-3.3.0";
import { STPadServerLibCommons } from "./STPadServerLib-3.3.0";
import { toast } from 'react-toastify';
import CanvasModal from "./CanvasModal";

const SignatureCapture = ({onCapture}) => {
  const [scaleFactorX, setScaleFactorX] = useState(0);
  const [scaleFactorY, setScaleFactorY] = useState(0);
  const [message, setMessage] = useState("");
  const [clearCanvas, setClearCanvas] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [data, setData] = useState(null);
  const handleDataFromCanvas = (data) => {
    setMessage(data);
   
  };
  const fetchData = async () => {
    function onOpen(connection) {
      let sampleRate = 0;
      console.log(STPadServerLibDefault.handleConfirmSignature);
      console.log("Signotec Sigma Pad connected");
      STPadServerLibDefault.handleConfirmSignature = async function () {
        try {
          // if (signatureQueue.length === 0) {
          //   await STPadServerLibDefault.retrySignature();
          //  // req.io.emit("popup", {});
          // } else {
          var awaitConfirmSignature =
            await STPadServerLibDefault.confirmSignature();
          const countedPoints = awaitConfirmSignature.countedPoints;

          const valueforSignature = countedPoints / sampleRate;
          console.log(valueforSignature);
          var params = new STPadServerLibDefault.Params.getSignatureImage();
          params.setFileType(STPadServerLibDefault.FileType.PNG);
          params.setPenWidth(5);
          var awaitgetSignatureImage =
            await STPadServerLibDefault.getSignatureImage(params);
          const base64 = awaitgetSignatureImage.file;
          //  console.log(base64);
          setMessage(base64);
          setModalOpen(false);

          await STPadServerLibDefault.closePad(params4);
          await STPadServerLibCommons.destroyConnection();
          //}
        } catch (error) {
          console.error(error);
          if (
            (error.errorMessage =
              "The function could not be executed because no signature capture process was started.")
          ) {
            toast.info("Please draw a signature");
            return await STPadServerLibDefault.retrySignature();
          }
        }
      };

      STPadServerLibDefault.handleRetrySignature = async function () {
        await STPadServerLibDefault.retrySignature();
        setClearCanvas(true);
      };
      STPadServerLibDefault.handleCancelSignature = async function () {
        await STPadServerLibDefault.cancelSignature();
        var params = new STPadServerLibDefault.Params.closePad(0);
        await STPadServerLibDefault.closePad(params);
        await STPadServerLibCommons.destroyConnection();
        setModalOpen(false);
      };

      const signatureQueue = []; // Queue to store signature points

      STPadServerLibCommons.handleNextSignaturePoint = async function (
        x,
        y,
        p
      ) {
        const signaturePoint = { x: x, y: y, p: p };
        // console.log(signaturePoint);
        setData(signaturePoint);
        signatureQueue.push({ x, y, p });
      };

      async function performOperations(
        params1,
        params2,
        params3,
        getSignatureDataParams
      ) {
        try {
          const result1 = await STPadServerLibDefault.searchForPads(params1);
          console.log(result1);
          const result2 = await STPadServerLibDefault.openPad(params2);
          const result3 = await STPadServerLibDefault.startSignature(
            params3,
            STPadServerLibDefault.handleCancelSignature,
            STPadServerLibDefault.handleRetrySignature,
            STPadServerLibDefault.handleConfirmSignature,
            STPadServerLibCommons.handleNextSignaturePoint
          );

          const padHeight = result2.padInfo.displayHeight;
          const padWidth = result2.padInfo.displayWidth;
          const xResolution = result2.padInfo.xResolution;
          const yResolution = result2.padInfo.yResolution;
          sampleRate = result2.padInfo.samplingRate;
          setScaleFactorX(padWidth / xResolution);
          setScaleFactorY(padHeight / yResolution);
        } catch (error) {
          if(error.errorMessage==="No compatible devices connected or the connection to a device has been cut.")
          {toast.info("Please connect a signing pad")}
          STPadServerLibCommons.destroyConnection();
          
          console.error(error);
          return "No Pad Found";
        }
      }

      var params1 = new STPadServerLibDefault.Params.searchForPads();
      var params2 = new STPadServerLibDefault.Params.openPad(0);
      var params4 = new STPadServerLibDefault.Params.closePad(0);
      var params3 = new STPadServerLibDefault.Params.startSignature();
      params3.setFieldName("Customer Sign");
      params3.setCustomText("Please sign");
      params1.setPadSubset("HID");
      var getSignatureDataParams =
        new STPadServerLibDefault.Params.getSignatureData();
      getSignatureDataParams.setRsaScheme("PSS");

      performOperations(params1, params2, params3, getSignatureDataParams);
    }
    function onClose(connection) {
      console.log("Signotec Sigma Pad disconnected");
    }

    function onError(connection, error) {
      console.log("Signotec Sigma Pad error:", error);
    }

    try {
      await STPadServerLibCommons.createConnection(
        "wss://local.signotecwebsocket.de:49494/",
        onOpen,
        onClose,
        onError
      );
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    STPadServerLibCommons.destroyConnection();
  }, []);
useEffect(()=>{
  if(message!==""){
  onCapture(message);
}},[message]);
  const handleButtonClick = async () => {
   const result= await fetchData();
  //  console.log(result);
  if(result==="No Pad Found"){
    setModalOpen(false);}
  else {
    setModalOpen(true);
  }
  };
  const handleButtonClickRetake = () => {
    setMessage("");
    const result= fetchData();
    
    if(result==="No Pad Found"){
      setModalOpen(false);}
    else {
      setModalOpen(true);
    }
  };
  return (
    <div
      className="webcam-container"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <div>
        <div style={{ flex: 1, paddingRight: "10px" }}>
          {message && (
            <img
              src={`data:image/png;base64,${message}`}
              alt="Base64 Image"
              style={{ maxWidth: "100%", marginBottom: "10px" }}
            />
          )}
        </div>

        {message !== "" ? (
          <button
            type="button"
            onClick={() => {
              handleButtonClickRetake();
            }}
            style={{ alignSelf: "flex-start" }}
            className="webcam-btn w-md px-4 py-2 font-bold  text-white bg-black border-white border-2 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline"
          >
            Retake Signature
          </button>
        ) : (
          <button
            type="button"
            className="webcam-btn w-md px-4 py-2 font-bold text-white bg-black border-white border-2 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline"
            onClick={handleButtonClick}
            style={{ alignSelf: "flex-start" }}
          >
            Capture Signature
          </button>
        )}

        {modalOpen && (
          <CanvasModal
          
            liveImageData={data}
            setOpenModal={setModalOpen}
            sendDatatoMain={handleDataFromCanvas}
            clearCanvas={clearCanvas}
            scaleFactorhorizontal={scaleFactorX}
            scaleFactorvertical={scaleFactorY}
          />
        )}
      </div>
    </div>
  );
};

export default SignatureCapture;
