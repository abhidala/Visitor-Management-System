import React, { useState, useEffect } from "react";
import custom_axios from '../axios/AxiosSetup';
import { getLoginInfo } from '../utils/LoginInfo';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { ApiConstants } from '../api/ApiConstants';
import ImageCapture from "../components/ImageCapture";
import SignatureCapture from "../signatureComponent/SignatureCapture";



const validationSchema1 = Yup.object().shape({
  vFirstName: Yup.string().required('first name is required'),
  vLastName: Yup.string().required('last name is required'),
  vDateOfBirth: Yup.date()
    .required('DOB is required')
    .max(new Date(), 'DOB can not be in the future')
    .test('valid-date', 'Invalid Date of Birth', (value) => {
      const dob = new Date(value);
      const currentYear = new Date().getFullYear();
      return dob.getFullYear() >= 1900 && dob.getFullYear() <= currentYear;
    }),
  vehicleNo: Yup.string().required('vehicle number is required'),
  vMobileNo: Yup.string().required('Contact Number is required').matches(/^\d{10}$/, 'Contact number must be a 10-digit number'),
  vAddress: Yup.string().required('Address is required'),
  visitorType: Yup.string().required('Visitor Type is required').oneOf(['Normal', 'VIP', 'VVIP'], 'Invalid visitor Type Type'),


});
const validationSchema = Yup.object().shape({
  vFirstName: Yup.string().required('First name is required'),
  vLastName: Yup.string().required('Last name is required'),
  vDateOfBirth: Yup.date()
    .required('Date of Birth is required')
    .max(new Date(), 'Date of Birth cannot be in the future')
    .test('valid-date', 'Invalid Date of Birth', (value) => {
      const dob = new Date(value);
      const currentYear = new Date().getFullYear();
      return dob.getFullYear() >= 1900 && dob.getFullYear() <= currentYear;
    }),
  vehicleNo: Yup.string().required('Vehicle number is required'),
  vMobileNo: Yup.string()
    .required('Contact Number is required')
    .matches(/^\d{10}$/, 'Contact number must be a 10-digit number'),
  vAddress: Yup.string().required('Address is required'),
  visitorType: Yup.string()
    .required('Visitor Type is required')
    .oneOf(['Normal', 'VIP', 'VVIP'], 'Invalid visitor Type Type'),
});

const AddVisitor = () => {

  let navigate = useNavigate();
  const [vPhoto, setVphoto] = useState("");
  
  const [vSignature, setVsignature] = useState("");
  const [selectedRowData, setSelectedRowData] = useState("");
 
  const handleRowClickInGrandparent = (rowData) => {
    // Do something with the rowData in the grandparent component
    // console.log('Row clicked in grandparent:', rowData);
    console.log(rowData,"777777");
    setSelectedRowData(rowData.visitorDetails);
  };
  
  useEffect(() => {
    // formik.setValues({
    //   vFirstName: selectedRowData.vFirstName || "",
    //   vLastName: selectedRowData.vLastName || "",
    //   vDateOfBirth: selectedRowData.vDateOfBirth || "",
    //   vehicleNo: selectedRowData.vehicleNo || "",
    //   vMobileNo: selectedRowData.vMobileNo || "",
    //   vAddress: selectedRowData.vAddress || "",
    //   visitorType: selectedRowData.visitorType || "",
    //   vPhoto: `data:image/jpeg;base64,`+selectedRowData.vPhoto || "", // Add vPhoto here if needed
    //   vSignature: selectedRowData.vSignature || "", // Add vSignature here if needed
    // });
    if (selectedRowData) {
      console.log(selectedRowData);

      navigate(`/VisitingInfo/${selectedRowData.vistorId}`)
    }
  }, [selectedRowData])
  const handleCapture = (imageSrc) => {
    setVphoto(imageSrc);
  };
  const handleSignatureCapture = (data) => {
    if (data !== "") {
      setVsignature(`data:image/png;base64,${data}`);
    }
  };
  useEffect(() => {
    console.log(vSignature, "this is form data");
  }, [vSignature]);

  const formik = useFormik({
    initialValues: {
      vFirstName: "",
      vLastName: "",
      vDateOfBirth: "",
      vehicleNo: "",
      vMobileNo: "",
      vAddress: "",
      visitorType: "",
      vPhoto: "",
      vSignature: "",
    },
    validationSchema,

    onSubmit: async (values) => {
      const role = getLoginInfo()?.userType;
      const resetAdmin = getLoginInfo()?.resetAdmin;
      if (role === "Admin" || role === "Receptionist" && resetAdmin === false) {
        try {
          const formData = new FormData();
          formData.append("vFirstName", values.vFirstName);
          formData.append("vLastName", values.vLastName);
          formData.append("vDateOfBirth", values.vDateOfBirth);
          formData.append("vAddress", values.vAddress);
          formData.append("vMobileNo", values.vMobileNo);
          formData.append("vehicleNo", values.vehicleNo);
          formData.append("visitorType", values.visitorType);
          formData.append("vPhoto", vPhoto || values.vPhoto.replace(/^[^,]+,\s*/, ''));
          formData.append("vSignature", vSignature);

          //  formData.forEach(function(value, key){
          //  console.log(key, value);
          //  });

          const response = await custom_axios.post(
            ApiConstants.VISITORS.ADD,
            formData
          );

          toast.success("Visitor added successfully!!!");
          navigate("/visitors");
        } catch (error) {
          console.error(error);
          toast.error("Error adding user. Please try again.");
        }
      } else {
        toast.info("Forbidden Resource");
      }
    },
  });

  return (
    <div className="container mx-auto h-screen min-h-screen">
      <div className="px-4 lg:px-0 w-full">
        <div className="flex justify-center items-center">
          <div className="lg:w-full md:w-11/12 sm:w-full bg-blue-300 px-8 shadow-2xl rounded-lg overflow-hidden">
            <h1 className="text-center font-bold text-xl border-b-2 border-black py-4">
              Register New Visitor
            </h1>
            <form
              className="px-4 lg:px-8 pt-2 pb-8 bg-blue-300 rounded"
              onSubmit={formik.handleSubmit}
            >
              <div className="mb-4 md:flex md:justify-between">
                <div className="mb-4 md:mr-2 md:mb-0 w-full md:w-1/2">
                  <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="userName">
                    First Name
                  </label>
                  <input
                    {...formik.getFieldProps('vFirstName')}
                    className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    id="vFirstName"
                    type="text"
                    placeholder="First Name"
                  />
                  {formik.touched.vFirstName && formik.errors.vFirstName && (
                    <p className="text-red-500">{formik.errors.vFirstName}</p>
                  )}
                </div>

                <div className="md:ml-2 w-full md:w-1/2">
                  <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="password">
                    Last Name
                  </label>
                  <input
                    {...formik.getFieldProps('vLastName')}
                    className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    id="vLastName"
                    type="text"
                    placeholder="Last Name"
                  />
                  {formik.touched.vLastName && formik.errors.vLastName && (
                    <p className="text-red-500">{formik.errors.vLastName}</p>
                  )}
                </div>
              </div>
              {/* ... other form fields ... */}
              <div className="mb-4 md:flex md:justify-between">
                <div className="mb-4 md:mr-2 md:mb-0 w-full md:w-1/2">
                  {/* Vehicle Number Input */}
                  <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="vehicleNo">
                    Vehicle Number


                  </label>
                  <input
                    {...formik.getFieldProps('vehicleNo')}
                    className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    id="VehicleNo"
                    type="text"
                    placeholder="Vehicle Number"
                  />
                  {formik.touched.vehicleNo && formik.errors.vehicleNo && (
                    <p className="text-red-500">{formik.errors.vehicleNo}</p>
                  )}
                </div>
                
                <div className="md:ml-2 w-full md:w-1/2">
                  {/* Mobile Number Input */}
                  <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="contactNumberL">
                    Mobile Number
                  </label>
                  <input
                    {...formik.getFieldProps('vMobileNo')}
                    className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    id="vMobileNo"
                    // type="number"
                    placeholder="Mobile Number"
                  />
                  {formik.touched.vMobileNo && formik.errors.vMobileNo && (
                    <p className="text-red-500">{formik.errors.vMobileNo}</p>
                  )}
                </div>
              </div>
              <div className="mb-4 md:flex md:justify-between">
                <div className="w-full md:w-1/2 md:mr-2">
                  {/* Date of Birth Input */}
                  <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="shiftTime">
                    Date of Birth
                  </label>
                  <input
                    {...formik.getFieldProps('vDateOfBirth')}
                    className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    id="DateOfBirth"
                    type="date"
                    placeholder="Date of birth here!"
                  />
                  {formik.touched.vDateOfBirth && formik.errors.vDateOfBirth && (
                    <p className="text-red-500">{formik.errors.vDateOfBirth}</p>
                  )}
                </div>
                <div className="w-full md:w-1/2 md:ml-2">
                  {/* Visitor Type Select */}
                  <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="contactNumberM">
                    Visitor Type
                  </label>
                  <select
                    {...formik.getFieldProps('visitorType')}
                    className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    id="VisitorType"
                    defaultValue=""
                  >
                    <option value="">Select Visitor Type</option>
                    <option value="Normal">Normal</option>
                    <option value="VIP">VIP</option>
                    <option value="VVIP">VVIP</option>
                  </select>
                  {formik.touched.visitorType && formik.errors.visitorType && (
                    <p className="text-red-500">{formik.errors.visitorType}</p>
                  )}
                </div>
              </div>
              <div className="mb-4">
                {/* Address Input */}
                <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="userName">
                  Address
                </label>
                <input
                  {...formik.getFieldProps('vAddress')}
                  className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  id="vAddress"
                  type="text"
                  placeholder="Visitor Address"
                />
                {formik.touched.vAddress && formik.errors.vAddress && (
                  <p className="text-red-500">{formik.errors.vAddress}</p>
                )}
              </div>
              <div className="mb-4 md:flex md:justify-between">
                <div className="w-full md:w-1/2 md:mr-2 mb-4 md:mb-0">
                  <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="PhotoImage">
                    Photo Image
                  </label>
                  <div id="vPhoto" {...formik.getFieldProps('vPhoto')}>
                    <div id="vPhoto" {...formik.getFieldProps('vPhoto')}>
                      <ImageCapture
                        imageData={formik.values.vPhoto}
                        onCapture={handleCapture}
                        fieldId="vPhoto"
                        onRowClickInParent={handleRowClickInGrandparent}
                        
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-1/2 md:ml-2 mb-4 md:mb-0">
                  <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="vSignature">
                    Signature
                  </label>
                  <div id="vSignature" {...formik.getFieldProps('vSignature')}>
                    <div className="flex justify-center items-center">
                      <SignatureCapture onCapture={handleSignatureCapture} />
                    </div>
                  </div>
                </div>
              </div>
              {/* ... other form fields ... */}
              <div className="mb-8 text-center">
                <button
                  type="submit"
                  className="w-full lg:w-1/4 md:w-2/6 sm:w-3/8 border-white border-2 px-4 py-2 font-bold text-white bg-black rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                >
                  Register
                </button>
              </div>
              <hr className="mb-4 border-t" />
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
export default AddVisitor;