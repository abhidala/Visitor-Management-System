import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { Link, useNavigate, useParams } from "react-router-dom";
import custom_axios from "../axios/AxiosSetup";
import { ApiConstants } from "../api/ApiConstants";
import { toast } from "react-toastify";
import { getLoginInfo } from "../utils/LoginInfo";
import { useData } from "../DataContext";
const validationSchema = Yup.object().shape({
  toMeet: Yup.string().required('to meet is required'),
  Department: Yup.string().required('Please select a department').oneOf(['Any other Department', 'Minister of Health/Revenue/Flood control',
    'Minister of Food & Supply or Development ', 'Minister of Social welfare/women & child', ' Minister of Labour & industries/Election Commision',
    'Minister of PWD & SC/ST/Urban Development.', 'Minister of Transport & Education(6A) ', 'A/c Plant', 'Administration Reform(7C)', 'Amul Counter (GF)',
    'Art Culture and Language Department', 'Audit Department', 'Auditorium(GF) ', 'Bhagidari cell(3A)', 'C1 India/ Room -129', 'Canteen(GF)', 'cheif Minister Office(3A)',
    'Cheif Minister Office Room-315', 'Cheif Secretary Office(5A)', 'CM Control Room /Room-108.', 'Common wealth Games(5A ,10)', 'Delhi Kalyan Samiti(4A)',
    'Dispensary(2C)', 'Environment Department(6C)', 'Finance Deparment(4A)', 'Freedom Fighter cell(2c)', 'General Administration Department(2A)', 'General Administration Department Store',
    'Hall no 1 (2A)', 'Hall no 2 (2a)', 'Hall no 3 (2c)', 'Health Department(4B,9A)', 'Health Department(3B)', 'Higher Education Department(7c)', 'Home Department', 'Home press (5A)', 'IT Department (9B)',
    'Law Deparment(8C)', 'Library(3C)', 'MTNL', 'Multi Purpose Hall (GF)', 'National Information Centre (3B)', 'Parliament sey (8)', 'Pay and Accounts Office No X',
    'Planning Deparment (4B,6B)', 'Planning Department (6B)', 'Power Advisor Department(5A)', 'Power Deparment(8B)', 'Public Grievance Cell(2c)',
    'Public Work Department (5B)', 'Public Work Department civil/elec(2C)', 'Reception(GF)', 'Samajik Suvidha Sangam(M/C) (4B,10)', 'Security Room',
    'Services I,III,IV(7B)', 'Services II Department(5A)', 'Survey of India(8B)', 'Synd Bank(GF)', 'Telephone Exchange', 'Union Leaders Room / Room-126',
    'Urban Development Department(9C,10)', 'VAT Department (4C)', 'vigilance Department (4c)', 'Vigilance Department (6C)', '']),
  purpose: Yup.string().required('purpose is required').oneOf(['Personal', 'Official']),
  AllowedGates: Yup.string().required('allowed gates is required').oneOf(['All', 'GroupA', 'GroupB', 'GroupC', 'GroupD']),
  validFor: Yup.string().required('valid for is required').oneOf(['one day', 'one week', 'one month', 'three months']),
  AuthobyWhome: Yup.string().required('Authorized by  is required').oneOf(['CSS', 'Officer'],),


});
const VisitingInfo = () => {
  const {sharedData} = useData();
  const { Id } = useParams();
  let navigate = useNavigate();
  React.useEffect(()=>{
    console.log(sharedData)
  },[sharedData]);
  const formik = useFormik({
    initialValues: {
      toMeet: '',
      Department: "",
      purpose: "",
      AllowedGates: "",
      validFor: "",
      AuthobyWhome: "",

    },
    
    validationSchema,
    onSubmit: async (values) => {
      const Role = getLoginInfo()?.userType;
      if (Role === "Admin" || Role === 'Receptionist') {
        
        try {
          const response = await custom_axios.post(ApiConstants.VISITORS_VISIT_DATE.ADD(Id), {
            toMeet: values.toMeet,
            Department: values.Department,
            purpose: values.purpose,
            AllowedGates: values.AllowedGates,
            validFor: values.validFor,
            AuthobyWhome: values.AuthobyWhome,
          daysImage:sharedData,
          });

          const IndexId = response.data.indexId;

          toast.success('Details saved successfully , pass is now ready');
          console.log(response.data ,'visitinginfo added');

          navigate(`/pass/${IndexId}`);
        } catch (error) {
          console.log("Error occured", error);
          toast.error('Something went wrong , please try again.')

        }
      } else {
        toast.warn("Forbidden Resource")
      }
    },
  })
  return (

    <div className="container mx-auto h-screen min-h-screen">
      <div className="flex justify-center items-center">
        <div className="lg:w-full md:w-11/12 sm:w-full bg-blue-300 px-8 shadow-2xl rounded-lg overflow-hidden">
          <h1 className="text-center font-bold text-xl border-b-2 border-black py-4">
            Enter Visitor Information
          </h1>
          <form className="px-4 lg:px-8 pt-2 pb-8 bg-blue-300 rounded" onSubmit={formik.handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-2">
                <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="toMeet">
                  To Meet
                </label>
                <input
                  {...formik.getFieldProps('toMeet')}
                  className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  id="toMeet"
                  type="text"
                  placeholder="to Meet"
                />
                {formik.touched.toMeet && formik.errors.toMeet && (
                  <p className="text-red-500">{formik.errors.toMeet}</p>
                )}
              </div>

              <div className="mb-2">
                <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="Department">
                  Department
                </label>
                <select
                  {...formik.getFieldProps('Department')}
                  className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  id="Department"
                  defaultValue=""
                >
                  {/* Options for department */}
                  <option value="" disabled>
                    Select Department
                  </option>

                  <option value="Any other Department">Any other Department</option>
                  <option value="Minister of Health/Revenue/Flood control"> Minister of Health/Revenue/Flood control</option>
                  <option value="Minister of Food & Supply or Development">Minister of Food & Supply or Development </option>
                  <option value="Minister of Social welfare/women & child">Minister of Social welfare/women & child</option>
                  <option value=" Minister of Labour & industries/Election Commision"> Minister of Labour & industries/Election Commision</option>
                  <option value="Minister of PWD & SC/ST/Urban Development.">Minister of PWD & SC/ST/Urban Development. </option>
                  <option value="Minister of Transport & Education(6A) "> Minister of Transport & Education(6A) </option>
                  <option value="A/c Plant">A/c Plant </option>
                  <option value="Administration Reform(7C) ">Administration Reform(7C) </option>
                  <option value="Amul Counter (GF)">Amul Counter (GF)</option>
                  <option value="Art Culture and Language Department">Art Culture and Language Department</option>
                  <option value="Audit Department">Audit Department</option>
                  <option value="Auditorium(GF)">Auditorium(GF) </option>
                  <option value="Bhagidari cell(3A)">Bhagidari cell(3A)</option>
                  <option value="C1 India/ Room -129">C1 India/ Room -129</option>
                  <option value="Canteen(GF)">Canteen(GF)</option>
                  <option value="cheif Minister Office(3A)">cheif Minister Office(3A)</option>
                  <option value="Cheif Minister Office Room-315">Cheif Minister Office Room-315</option>
                  <option value="Cheif Secretary Office(5A)">Cheif Secretary Office(5A)</option>
                  <option value="CM Control Room /Room-108.">CM Control Room /Room-108.</option>
                  <option value="Common wealth Games(5A ,10)">Common wealth Games(5A ,10)</option>
                  <option value="Delhi Kalyan Samiti(4A)">Delhi Kalyan Samiti(4A)</option>
                  <option value="Dispensary(2C)">Dispensary(2C)</option>
                  <option value="Environment Department(6C)">Environment Department(6C)</option>
                  <option value="Finance Deparment(4A)">Finance Deparment(4A)</option>
                  <option value="Freedom Fighter cell(2c)">Freedom Fighter cell(2c)</option>
                  <option value="General Administration Department(2A)">General Administration Department(2A)</option>
                  <option value="General Administration Department Store">General Administration Department Store</option>
                  <option value="Hall no 1 (2A)">Hall no 1 (2A)</option>
                  <option value="Hall no 2 (2a)">Hall no 2 (2a)</option>
                  <option value="Hall no 3 (2c)">Hall no 3 (2c)</option>
                  <option value="Health Department(4B,9A)">Health Department(4B,9A)</option>
                  <option value="Health Department(3B)">Health Department(3B)</option>
                  <option value="Higher Education Department(7c)">Higher Education Department(7c)</option>
                  <option value="Home Department">Home Department (5c)</option>
                  <option value="Home press (5A)">Home press (5A)</option>
                  <option value="IT Department (9B)">IT Department (9B)</option>
                  <option value="Law Deparment(8C)">Law Deparment(8C)</option>
                  <option value="Library(3C)">Library(3C)</option>
                  <option value="MTNL">MTNL</option>
                  <option value="Multi Purpose Hall (GF) ">Multi Purpose Hall (GF) </option>
                  <option value="National Information Centre (3B)">National Information Centre (3B)</option>
                  <option value="Parliament sey (8)">Parliament sey (8)</option>
                  <option value="Pay and Accounts Office No X">Pay and Accounts Office No X</option>
                  <option value="Planning Deparment (4B,6B)">Planning Deparment (4B,6B)</option>
                  <option value="Planning Department (6B)">Planning Department (6B)</option>
                  <option value="Power Advisor Department(5A)">Power Advisor Department(5A)</option>
                  <option value="Power Deparment(8B)">Power Deparment(8B)</option>
                  <option value="Public Grievance Cell(2c)">Public Grievance Cell(2c)</option>
                  <option value="Public Work Department (5B)">Public Work Department (5B)</option>
                  <option value="Public Work Department civil/elec(2C)">Public Work Department civil/elec(2C)</option>
                  <option value="Reception(GF)">Reception(GF)</option>
                  <option value="Samajik Suvidha Sangam(M/C) (4B,10)">Samajik Suvidha Sangam(M/C) (4B,10)</option>
                  <option value="Security Room<">Security Room</option>
                  <option value="Services I,III,IV(7B)">Services I,III,IV(7B)</option>
                  <option value="Services II Department(5A)">Services II Department(5A)</option>
                  <option value="Survey of India(8B)">Survey of India(8B)</option>
                  <option value="Synd Bank(GF)">Synd Bank(GF)</option>
                  <option value="Telephone Exchange">Telephone Exchange</option>
                  <option value="Union Leader's Room / Room-126">Union Leader's Room / Room-126</option>
                  <option value="Urban Development Department(9C,10)">Urban Development Department(9C,10)</option>
                  <option value="VAT Department (4C)">VAT Department (4C)</option>
                  <option value="vigilance Department (4c)">vigilance Department (4c)</option>
                  <option value="Vigilance Department (6C)">Vigilance Department (6C)</option>
                  <option value="nmjk">nmjk</option>
                </select>
                {formik.touched.Department && formik.errors.Department && (
                  <p className="text-red-500"> Please Select Department </p>
                )}
              </div>

              <div className="mb-2">
                <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="AuthobyWhome">
                  Authorized By
                </label>
                <select
                  {...formik.getFieldProps('AuthobyWhome')}
                  className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  id="AuthobyWhome"
                  defaultValue=""
                >
                  {/* Options for authorized by */}
                  <option value="" disabled>
                    Select Authorized by
                  </option>
                  <option value="CSS"> CSS </option>
                  <option value="Officer">Officer</option>
                </select>
                {formik.touched.AuthobyWhome && formik.errors.AuthobyWhome && (
                  <p className="text-red-500">{formik.errors.AuthobyWhome}</p>
                )}
              </div>

              <div className="mb-2">
                <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="purpose">
                  Visit Purpose
                </label>
                <select
                  {...formik.getFieldProps('purpose')}
                  className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  id="purpose"
                  defaultValue=""
                >
                  {/* Options for visit purpose */}
                  <option value="" disabled>
                    Select Purpose
                  </option>
                  <option value="Official">Official</option>
                  <option value="Personal">Personal</option>
                </select>
                {formik.touched.purpose && formik.errors.purpose && (
                  <p className="text-red-500">{formik.errors.purpose}</p>
                )}
              </div>

              <div className="mb-2">
                <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="AllowedGates">
                  Gates Access
                </label>
                <select
                  {...formik.getFieldProps('AllowedGates')}
                  className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  id="AllowedGates"
                  defaultValue=""
                >
                  {/* Options for allowed gates */}
                  <option value="" disabled>
                    Select Allowed Gates
                  </option>
                  <option value="All">All</option>
                  <option value="GroupA">Group 1</option>
                  <option value="GroupB">Group 2</option>
                  <option value="GroupC">Group 3</option>
                  <option value="GroupD">Group 4</option>
                </select>
                {formik.touched.AllowedGates && formik.errors.AllowedGates && (
                  <p className="text-red-500">{formik.errors.AllowedGates}</p>
                )}
              </div>

              <div className="mb-2">
                <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="validFor">
                  Pass Valid For
                </label>
                <select
                  {...formik.getFieldProps('validFor')}
                  className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  id="validFor"
                  defaultValue=""
                >
                  {/* Options for valid for */}
                  <option value="" disabled>
                    Select valid for
                  </option>

                  <option value="one day">one day</option>
                  <option value="one week">one week</option>
                  <option value="one month">one month</option>
                  <option value="three months">three months </option>
                </select>
                {formik.touched.validFor && formik.errors.validFor && (
                  <p className="text-red-500">{formik.errors.validFor}</p>
                )}
              </div>
            </div>

            <div className="mb-8 text-center">
              <button
                type="submit"
                className="mt-8 w-full lg:w-1/4 md:w-2/6 sm:w-3/8 border-white border-2 px-4 py-2 font-bold text-white bg-black rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                >
                Save
              </button>
            </div>
          </form>
        </div>
      </div >
    </div >


    //  <div className="container mx-auto h-screen min-h-screen">
    // <div className="px-4 lg:px-0 w-full">
    //   <div className="flex justify-center items-center">
    //     <div className="lg:w-full md:w-11/12 sm:w-full bg-blue-300 px-8 shadow-2xl rounded-lg overflow-hidden">
    //       <h1 className="text-center font-bold text-xl border-b-2 border-black py-4">
    //         Enter Visitor Information
    //       </h1>
    //       <form
    //         className="px-4 lg:px-8 pt-2 pb-8 bg-blue-300 rounded"
    //         onSubmit={formik.handleSubmit}
    //       >
    //         <div>
    //           <div className="">
    //               <div className="mb-2 ">
    //                       <label
    //                         className="block mb-2 text-sm font-bold text-gray-700"
    //                         htmlFor="toMeet"
    //                       >
    //                         To Meet
    //                       </label>
    //                       <input
    //                         {...formik.getFieldProps('toMeet')}
    //                         className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
    //                         id="toMeet"
    //                         type="text"
    //                         placeholder="to Meet"
    //                       />
    //                               {formik.touched.toMeet && formik.errors.toMeet && (
    //                       <p className="text-red-500">{formik.errors.toMeet}</p>
    //                       )}

    //               </div>

    //               </div>  

    //               <div className="mb-2 ">
    //                       <label
    //                         className="block mb-2 text-sm font-bold text-gray-700"
    //                         htmlFor="Department"
    //                       >
    //                         Department
    //                       </label>
    //                       <select
    //                         {...formik.getFieldProps('Department')}
    //                         className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
    //                         id="Department"
    //                         defaultValue=""
    //                       >
    //                         <option value="" disabled>
    //                           Select Department
    //                         </option>

    //                         <option value="Any other Department">Any other Department</option>
    //                         <option value="Minister of Health/Revenue/Flood control"> Minister of Health/Revenue/Flood control</option>
    //                         <option value="Minister of Food & Supply or Development">Minister of Food & Supply or Development </option>
    //                         <option value="Minister of Social welfare/women & child">Minister of Social welfare/women & child</option>
    //                         <option value=" Minister of Labour & industries/Election Commision"> Minister of Labour & industries/Election Commision</option>
    //                         <option value="Minister of PWD & SC/ST/Urban Development.">Minister of PWD & SC/ST/Urban Development. </option>
    //                         <option value="Minister of Transport & Education(6A) "> Minister of Transport & Education(6A) </option>
    //                         <option value="A/c Plant">A/c Plant </option>
    //                         <option value="Administration Reform(7C) ">Administration Reform(7C) </option>
    //                         <option value="Amul Counter (GF)">Amul Counter (GF)</option>
    //                         <option value="Art Culture and Language Department">Art Culture and Language Department</option>
    //                         <option value="Audit Department">Audit Department</option>
    //                         <option value="Auditorium(GF)">Auditorium(GF) </option>
    //                         <option value="Bhagidari cell(3A)">Bhagidari cell(3A)</option>
    //                         <option value="C1 India/ Room -129">C1 India/ Room -129</option>
    //                         <option value="Canteen(GF)">Canteen(GF)</option>
    //                         <option value="cheif Minister Office(3A)">cheif Minister Office(3A)</option>
    //                         <option value="Cheif Minister Office Room-315">Cheif Minister Office Room-315</option>
    //                         <option value="Cheif Secretary Office(5A)">Cheif Secretary Office(5A)</option>
    //                         <option value="CM Control Room /Room-108.">CM Control Room /Room-108.</option>
    //                         <option value="Common wealth Games(5A ,10)">Common wealth Games(5A ,10)</option>
    //                         <option value="Delhi Kalyan Samiti(4A)">Delhi Kalyan Samiti(4A)</option>
    //                         <option value="Dispensary(2C)">Dispensary(2C)</option>
    //                         <option value="Environment Department(6C)">Environment Department(6C)</option>
    //                         <option value="Finance Deparment(4A)">Finance Deparment(4A)</option>
    //                         <option value="Freedom Fighter cell(2c)">Freedom Fighter cell(2c)</option>
    //                         <option value="General Administration Department(2A)">General Administration Department(2A)</option>
    //                         <option value="General Administration Department Store">General Administration Department Store</option>
    //                         <option value="Hall no 1 (2A)">Hall no 1 (2A)</option>
    //                         <option value="Hall no 2 (2a)">Hall no 2 (2a)</option>
    //                         <option value="Hall no 3 (2c)">Hall no 3 (2c)</option>
    //                         <option value="Health Department(4B,9A)">Health Department(4B,9A)</option>
    //                         <option value="Health Department(3B)">Health Department(3B)</option>
    //                         <option value="Higher Education Department(7c)">Higher Education Department(7c)</option>
    //                         <option value="Home Department">Home Department (5c)</option>
    //                         <option value="Home press (5A)">Home press (5A)</option>
    //                         <option value="IT Department (9B)">IT Department (9B)</option>
    //                         <option value="Law Deparment(8C)">Law Deparment(8C)</option>
    //                         <option value="Library(3C)">Library(3C)</option>
    //                         <option value="MTNL">MTNL</option>
    //                         <option value="Multi Purpose Hall (GF) ">Multi Purpose Hall (GF) </option>
    //                         <option value="National Information Centre (3B)">National Information Centre (3B)</option>
    //                         <option value="Parliament sey (8)">Parliament sey (8)</option>
    //                         <option value="Pay and Accounts Office No X">Pay and Accounts Office No X</option>
    //                         <option value="Planning Deparment (4B,6B)">Planning Deparment (4B,6B)</option>
    //                         <option value="Planning Department (6B)">Planning Department (6B)</option>
    //                         <option value="Power Advisor Department(5A)">Power Advisor Department(5A)</option>
    //                         <option value="Power Deparment(8B)">Power Deparment(8B)</option>
    //                         <option value="Public Grievance Cell(2c)">Public Grievance Cell(2c)</option>
    //                         <option value="Public Work Department (5B)">Public Work Department (5B)</option>
    //                         <option value="Public Work Department civil/elec(2C)">Public Work Department civil/elec(2C)</option>
    //                         <option value="Reception(GF)">Reception(GF)</option>
    //                         <option value="Samajik Suvidha Sangam(M/C) (4B,10)">Samajik Suvidha Sangam(M/C) (4B,10)</option>
    //                         <option value="Security Room<">Security Room</option>
    //                         <option value="Services I,III,IV(7B)">Services I,III,IV(7B)</option>
    //                         <option value="Services II Department(5A)">Services II Department(5A)</option>
    //                         <option value="Survey of India(8B)">Survey of India(8B)</option>
    //                         <option value="Synd Bank(GF)">Synd Bank(GF)</option>
    //                         <option value="Telephone Exchange">Telephone Exchange</option>
    //                         <option value="Union Leader's Room / Room-126">Union Leader's Room / Room-126</option>
    //                         <option value="Urban Development Department(9C,10)">Urban Development Department(9C,10)</option>
    //                         <option value="VAT Department (4C)">VAT Department (4C)</option>
    //                         <option value="vigilance Department (4c)">vigilance Department (4c)</option>
    //                         <option value="Vigilance Department (6C)">Vigilance Department (6C)</option>
    //                         <option value="nmjk">nmjk</option>

    //                       </select>
    //                       {formik.touched.Department && formik.errors.Department && (
    //                           <p className="text-red-500">{formik.errors.Department}</p>
    //                       )}

    //               </div>




    //               <div className="mb-2">
    //                       <label className="w-full block mb-2 text-sm font-bold text-gray-700" htmlFor="AuthoByWhome">
    //                        Authorized By
    //                       </label>
    //                       <select
    //                         {...formik.getFieldProps('AuthobyWhome')}
    //                         className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
    //                         id="AuthobyWhome"
    //                         defaultValue=""
    //                       >
    //                         <option value="" disabled>
    //                           Select Authorized by
    //                         </option>
    //                         <option value="CSS"> CSS </option>
    //                         <option value="Officer">Officer</option>
    //                       </select>
    //                       {formik.touched.AuthobyWhome && formik.errors.AuthobyWhome && (
    //                           <p className="text-red-500">{formik.errors.AuthobyWhome}</p>
    //                       )}

    //                     </div>






    //              <div className="mb-2">
    //                       <label
    //                         className="block mb-2 text-sm font-bold text-gray-700"
    //                         htmlFor="validFor"
    //                       >
    //                         Visit Purpose
    //                       </label>
    //                       <select
    //                         {...formik.getFieldProps('purpose')}
    //                         className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
    //                         id="purpose"
    //                         defaultValue=""
    //                       >
    //                         <option value="" disabled>
    //                            Select Purpose
    //                         </option>
    //                         <option value="Official">Official</option>
    //                         <option value="Personal">Personal</option>

    //                       </select>
    //                       {formik.touched.purpose && formik.errors.purpose && (
    //                           <p className="text-red-500">{formik.errors.purpose}</p>
    //                       )}


    //               </div>



    //              <div className="mb-2">
    //                       <label
    //                         className="block mb-2 text-sm font-bold text-gray-700"
    //                         htmlFor="validFor"
    //                       >
    //                         Gates Access
    //                       </label>
    //                       <select
    //                         {...formik.getFieldProps('AllowedGates')}
    //                         className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
    //                         id="AllowedGates"
    //                         defaultValue=""
    //                       >
    //                         <option value="" disabled>
    //                            Select Allowed Gates
    //                         </option>
    //                         <option value="All">All</option>
    //                         <option value="GroupA">Group 1</option>
    //                         <option value="GroupB">Group 2</option>
    //                         <option value="GroupC">Group 3</option>
    //                         <option value="GroupD">Group 4</option>
    //                       </select>
    //                       {formik.touched.AllowedGates && formik.errors.AllowedGates && (
    //                           <p className="text-red-500">{formik.errors.AllowedGates}</p>
    //                       )}


    //               </div>

    //               <div className="mb-2">
    //                       <label
    //                         className="block mb-2 text-sm font-bold text-gray-700"
    //                         htmlFor="validFor"
    //                       >
    //                         Pass Valid For
    //                       </label>
    //                       <select
    //                         {...formik.getFieldProps('validFor')}
    //                         className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
    //                         id="validFor"
    //                         defaultValue=""
    //                       >
    //                         <option value="" disabled>
    //                            Select valid for
    //                         </option>

    //                         <option value="one day">one day</option>
    //                         <option value="one week">one week</option>
    //                         <option value="one month">one month</option>
    //                         <option value="three months">three months </option>
    //                       </select>
    //                       {formik.touched.validFor && formik.errors.validFor && (
    //                           <p className="text-red-500">{formik.errors.validFor}</p>
    //                       )}


    //               </div>
    //               <br />
    //                   <div className="mb-8 text-center">
    //                   <button
    //                       type="submit"
    //                       className="w-full px-4 py-2 font-bold text-white bg-black rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline"
    //                   >
    //                       Save
    //                   </button>
    //                   {/* <Link to={`/pass/${formik.values.indexId}`} className="bg-red-400 hover:bg-red-500 rounded-lg px-4 py-2 text-white shadow-sm text-xl" >
    //                    Generate Pass

    //                   </Link> */}

    //                   </div>
    //                </div>
    //           <hr className="mb-4 border-t" />
    //         </form>
    //       </div>
    //     </div>
    //   </div>

    //   </div>
  )
}
export default VisitingInfo;