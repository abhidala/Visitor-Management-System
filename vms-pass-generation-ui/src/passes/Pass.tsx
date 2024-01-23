
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import custom_axios from "../axios/AxiosSetup";
import { ApiConstants } from "../api/ApiConstants";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Logo from '../images/secretariat.avif'
import essilogo from '../images/logo/LOGO.png';
import { getLoginInfo } from "../utils/LoginInfo";
import Footer from "../components/Footer";
import { toast } from 'react-toastify';
import QRCode from "react-qr-code";
import { useData } from '../DataContext';



const Pass = () => {
    const { indexId } = useParams();
    const {sharedData} =useData();
    const [userData, setUserData] = useState({
    
        indexId: null,
        PassNumber: '',
        purpose: '',
        toMeet: '',
        AuthobyWhome: '',
        Barcode: '',
        vDate: '',
        Department: '',
        validFor: '',
        daysImage:'',
        visitor: {
            vFirstName: '',
            vLastName: '',
            vPhoto: '',
            vSignature: '',
            vAddress: '',
        }
    });

    useEffect(() => {
        const fetchUserData = async () => {
            const role = getLoginInfo()?.userType;
            if (role === 'Admin' || role === "Receptionist") {
                try {
                    const response = await custom_axios.get(ApiConstants.VISITORS_VISIT_DATE.FINDONE(indexId));
                   
                    setUserData(response.data[0]);
                }
                catch (error) {
                    console.log('error fetching data ', error);
                }
            } else {
                toast.warn('Forbidden Resource')
            }

        };
        fetchUserData();
    }, [indexId]);



    //handle pass pdf print
    const handlePrintPDF = async () => {
      const pdf = new jsPDF("p", "mm", "a4"); // Use "mm" units and specify A4 size in portrait
      const pdfContainer = document.getElementById("pdf-container");
  
      if (pdfContainer) {
          const canvas = await html2canvas(pdfContainer, { scale: 3 }); // Adjust the scale factor for 1/3 A4
          const imageData = canvas.toDataURL("image/jpeg");
          pdf.addImage(imageData, "JPEG", 0, 0, 210, 99); // Use 1/3 A4 dimensions in portrait (210mm x 99mm)
  
          // Set autoPrint option to true
          const options = {
              autoPrint: {
                  variant: 'non-conform',
                  tray: 'tray-1',
                  color: false
              }
          };
  
          // Open the print dialog
          pdf.output('dataurlnewwindow', options);
  
          // Note: The autoPrint option might not work in all browsers and environments due to security restrictions.
          // Some browsers may block automatic printing for security reasons.
      }
  };
    const handlePrintPDF1 = async () => {
        const pdf = new jsPDF("p", "mm", "a4"); // Use "mm" units and specify A4 size in portrait
        const pdfContainer = document.getElementById("pdf-container");

        if (pdfContainer) {
            const canvas = await html2canvas(pdfContainer, { scale: 3 }); // Adjust the scale factor for 1/3 A4
            const imageData = canvas.toDataURL("image/jpeg");
            pdf.addImage(imageData, "JPEG", 0, 0, 210, 99); // Use 1/3 A4 dimensions in portrait (210mm x 99mm)
            pdf.save(`${userData.visitor.vFirstName}-EntryPass.pdf`);
        }
    };
    
    // const handlePrint1 = useReactToPrint({
    //         content: () => componentRef.current,
    //         onBeforeGetContent: async() => {
    //           const pdf = new jsPDF("p", "mm", "a4");
    //           // const oneThirdHeight = pdf.internal.pageSize.height / 3;
    //         // Set the content height to 1/3rd of the A4 page height
    //         const oneThirdHeight = pdf.internal.pageSize.height / 3;
    //         // Convert HTML content to an image using html2canvas
    //         const canvas = await html2canvas(componentRef.current, { scale: 3 });
    //         // Add the image to the PDF
    //         pdf.addImage(canvas.toDataURL('image/jpeg'), 'JPEG', 0, 0, 210, 99);
    //         return pdf;
    //         },
    //         documentTitle: 'Visitor Pass',
    //         onAfterPrint: () => console.log('Printed PDF successfully!'),
    //        });

   

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            {userData && (
                <div
                id="pdf-container"
                className="max-w-full md:max-w-4xl border-2 border-t-8 border-black max-h-xl mt-10 p-2 mb-10 shadow-md bg-white relative"
              >
                {/* <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQngItm3E0zyMx8OrFRt52tfdSPfJSsPYVItSNTv9FF-A&s"
                  alt="Watermark"
                  className="absolute inset-0 w-full h-full object-cover opacity-20"
                /> */}
          
                <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-4 md:gap-8">
                  <img className="h-16 mt-2 pb-1 w-16" src={Logo} alt="" />
                  <h1 className="text-2xl font-bold text-center text-black-2">DELHI SECRETARIAT</h1>
                  <img className="h-20 pb-1 w-24" src={essilogo} alt="essi" />
                </div>
          
                <hr className="border-4 border-dashed border-black" />
                <h2 className="text-center font-bold text-xl mb-4  text-black-2">Government of NCT Delhi</h2>
          
                <div className="flex flex-col md:flex-row mb-4 space-y-4 md:space-y-0 md:space-x-4">
                  <div className="w-full md:w-1/3 flex border-2 rounded p-2 bg-green-100">
                    <div className="">
                      <img
                        alt="Photo"
                        src={userData.daysImage?`data:image/jpeg;base64,` + userData.daysImage:`data:image/jpeg;base64,`+userData.visitor.vPhoto}
                        className="mr-3 rounded ml-5 mt-4 h-32 w-36 object-cover"
                      />
                      <h2 className="ml-5 text-base font-bold mt- capitalize text-black-2">
                        {userData.visitor.vFirstName} {userData.visitor.vLastName}
                      </h2>
                      <p className="text-sm ml-4 mt-4 mb-2 text-black">
                        Entry Valid for one person only.
                      </p>
                      <p className="text-sm ml-4 mb-2 text-black">
                        This slip should be returned at the gate duly signed by the
                        official visited, at the time of exit from the building.
                      </p>
                    </div>
                  </div>
          
                  <div className="w-full md:w-1/3 max-w-xl bg-green-100 border-2 rounded p-2">
                    <p className="text-md font-bold text-black">
                      PASS NO: <span className='text-sm'>{userData.PassNumber}</span>
                    </p>
                    <div className="flex">
                      <p className="text-md font-bold text-black">PURPOSE:
                        <span className='text-sm'>{userData.purpose}</span></p>
                    </div>
                   <div className="flex">
                      <p className="text-md font-bold text-black">DEPARTMENT:
                      <span className="text-sm">{userData.Department}</span></p>
                  </div>
                    <div className="flex">
                      <p className="text-md font-bold text-black">ADDRESS:
                      <span className="text-sm">
                        {userData.visitor.vAddress}
                      </span></p>
                    </div>
                    <div className="flex">
                      <p className="text-md font-bold text-black">VALID FOR:
                      <span className="text-sm capitalize">
                        {userData.validFor}
                      </span></p>
                    </div>
                    <QRCode className='mt-1'
                      size={289}
                      style={{ height: "40%", width: "90%" }}
                      value={userData.Barcode + userData.indexId}
                    />
                  </div>
          
                  <div className="w-full md:w-1/3 bg-green-100 border-2 rounded p-2">
                    <p className="text-md font-bold text-black">
                      Pass Generated By: {getLoginInfo()?.userName} (
                      {getLoginInfo()?.userId})
                    </p>
                    <p className="text-md font-bold text-black">{userData.vDate}</p>
                    <p className="text-md font-bold text-black">To Meet:</p>
                    <div className="flex mt-2">
                      <p className="text-md font-bold text-black">Name:
                      <span className="text-sm ">{userData.toMeet}</span></p>
                    </div>
                    <div className="flex mt-2">
                      <p className="text-md font-bold text-black mb-20">Signature:</p>
                    </div>
                    <p className="text-md font-bold text-black">
                      Visitor Signature:
                    </p>
                    <img
                      src={`data:image/jpeg;base64,${userData.visitor.vSignature}` }
                      alt="signature"
                      className="w-56 h-20 mt-2 rounded-lg shadow-md object-cover"
                    />
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-center items-center">
                <button
                    id="handlePrintPDF"
                    className="bg-black hover:bg-red-500 border-2 border-white font-bold text-white px-6 py-4 rounded"
                    onClick={handlePrintPDF}
                >
                    Print
                </button>
            </div>
            {/* <Footer /> */}
        </div>
      
    );
}

export default Pass;