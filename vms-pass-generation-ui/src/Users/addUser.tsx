import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { ApiConstants } from '../api/ApiConstants';
import custom_axios from '../axios/AxiosSetup';
import { getLoginInfo } from '../utils/LoginInfo';
import ImageCapture from '../components/ImageCapture';

const validationSchema = Yup.object().shape({
  userName: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
  shiftTime: Yup.string().required('Shift Time is required').matches(/^[0-9] to [0-9]$/, 'Invalid format. Must be in the form "9 to 5"'),
  designation: Yup.string().required('Designation is required'),
  contactNumberL: Yup.string().required('Contact Number is required').matches(/^\d{10}$/, 'Contact number must be a 10-digit number'),
  contactNumberM: Yup.string().required('Contact Number is required').matches(/^\d{10}$/, 'Contact number must be a 10-digit number'),
  address: Yup.string().required('Address is required'),
  userType: Yup.string().required('User Type is required').oneOf(['Admin', 'Receptionist', 'Guard', 'Compliance_Officer'], 'Invalid User Type'),


  // palmImage:  Yup.mixed().required({ message: "Please select an image" }),

  //   photoImage: Yup.mixed().required('Photo Image is required'),
});

const AddUser = () => {
  let navigate = useNavigate();
  const [photoImage, setPhotoImage] = useState('');

  const handleCapture = (imageSrc) => {
    setPhotoImage(imageSrc);
  }

  const formik = useFormik({
    initialValues: {
      userName: '',
      password: '',
      shiftTime: '',
      designation: '',
      contactNumberL: '',
      contactNumberM: '',
      address: '',
      userType: '',

      photoImage: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      const role = getLoginInfo()?.userType;
      if (role === 'Admin') {
        try {
          const formData = new FormData();
          formData.append('userName', values.userName);
          formData.append('password', values.password);
          formData.append('shiftTime', values.shiftTime);
          formData.append('designation', values.designation);
          formData.append('contactNumberL', values.contactNumberL);
          formData.append('contactNumberM', values.contactNumberM);
          formData.append('address', values.address);
          formData.append('userType', values.userType);
          formData.append('photoImage', photoImage);

          formData.forEach(function (value, key) {
            console.log(key, value);
          });


          const response = await custom_axios.post(ApiConstants.USER.ADD, formData);
          console.log(response.data);
          toast.success('User added successfully!!!');

          navigate('/users')
        } catch (error) {
          console.error(error);
          toast.error('Error adding user. Please try again.');
          alert('error your task was failed.');
        }
      } else {
        toast.info('Forbidden Resource');
      }
    },
  });

  return (
    <div className="container mx-auto h-screen min-h-screen">
  <div className="px-4 lg:px-0 w-full">
    <div className="flex justify-center items-center">
      <div className="lg:w-full md:w-11/12 sm:w-full bg-blue-300 px-8 shadow-2xl rounded-lg overflow-hidden">
        <h1 className="text-center font-bold text-xl border-b-2 border-black py-4">Register an Employee!</h1>
        <form className="px-4 lg:px-8 pt-2 pb-8 bg-blue-300 rounded" onSubmit={formik.handleSubmit}>

          {/* Username and Password */}
          <div className="mb-4 md:flex md:justify-between">
            <div className="mb-4 md:w-1/2 md:mr-4">
              <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="userName">
                UserName
              </label>
              <input
                {...formik.getFieldProps('userName')}
                className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                id="userName"
                type="text"
                placeholder="Username"
              />
              {formik.touched.userName && formik.errors.userName && (
                <p className="text-red-500">{formik.errors.userName}</p>
              )}
            </div>

            <div className="mb-4 md:w-1/2">
              <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="password">
                Password
              </label>
              <input
                {...formik.getFieldProps('password')}
                className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="Password"
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500">{formik.errors.password}</p>
              )}
            </div>
          </div>

          {/* Shift Time and Designation */}
          <div className="mb-4 md:flex md:justify-between">
            <div className="mb-4 md:w-1/2 md:mr-4">
              <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="shiftTime">
                Shift Time
              </label>
              <input
                {...formik.getFieldProps('shiftTime')}
                className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                id="shiftTime"
                type="text"
                placeholder="from - to"
              />
              {formik.touched.shiftTime && formik.errors.shiftTime && (
                <p className="text-red-500">{formik.errors.shiftTime}</p>
              )}
            </div>

            <div className="mb-4 md:w-1/2">
              <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="designation">
                Designation
              </label>
              <input
                {...formik.getFieldProps('designation')}
                className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                id="designation"
                type="string"
                placeholder="Designation"
              />
              {formik.touched.designation && formik.errors.designation && (
                <p className="text-red-500">{formik.errors.designation}</p>
              )}
            </div>
          </div>

          {/* Contact Numbers */}
          <div className="mb-4 md:flex md:justify-between">
            <div className="mb-4 md:w-1/2 md:mr-4">
              <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="contactNumberL">
                Contact No. Landline
              </label>
              <input
                {...formik.getFieldProps('contactNumberL')}
                className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                id="contactNumberL"
                placeholder="landline no."
              />
              {formik.touched.contactNumberL && formik.errors.contactNumberL && (
                <p className="text-red-500">{formik.errors.contactNumberL}</p>
              )}
            </div>

            <div className="mb-4 md:w-1/2">
              <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="contactNumberM">
                Mobile no.
              </label>
              <input
                {...formik.getFieldProps('contactNumberM')}
                className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                id="contactNumberM"
                placeholder="mobile no."
              />
              {formik.touched.contactNumberM && formik.errors.contactNumberM && (
                <p className="text-red-500">{formik.errors.contactNumberM}</p>
              )}
            </div>
          </div>

          {/* Address and User Type */}
          <div className="mb-4 md:flex md:justify-between">
            <div className="mb-4 md:w-1/2 md:mr-4">
              <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="address">
                Address
              </label>
              <input
                {...formik.getFieldProps('address')}
                className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                id="address"
                type="text"
                placeholder="Address"
              />
              {formik.touched.address && formik.errors.address && (
                <p className="text-red-500">{formik.errors.address}</p>
              )}
            </div>

            <div className="mb-4 md:w-1/2">
              <label className="w-full block mb-2 text-sm font-bold text-gray-700" htmlFor="userType">
                User Type
              </label>
              <select
                {...formik.getFieldProps('userType')}
                className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                id="userType"
                defaultValue=""
              >
                <option value="" disabled>
                  Select User Type
                </option>
                <option value="Admin">Admin</option>
                <option value="Receptionist">Receptionist</option>
                <option value="Guard">Guard</option>
                <option value="Compliance_Officer">Compliance_Officer</option>
              </select>
              {formik.touched.userType && formik.errors.userType && (
                <p className="text-red-500">{formik.errors.userType}</p>
              )}
            </div>
          </div>

          {/* Photo Image */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="photoImage">
              Photo Image
            </label>
            <div id="photoImage" {...formik.getFieldProps('photoImage')}>
              {/* Assuming ImageCapture is a component that captures an image */}
              <ImageCapture onCapture={handleCapture} fieldId="vPhoto" />
              {formik.touched.photoImage && formik.errors.photoImage && (
                <p className="text-red-500">{formik.errors.photoImage}</p>
              )}
            </div>
          </div>

          {/* Register Button */}
          <div className="mb-8 text-center">
            <button
              type="submit"
              className="w-full px-4 py-2 border-2 border-white font-bold text-white bg-black rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline"
            >
              Register
            </button>
          </div>

          {/* Horizontal Line */}
          <hr className="mb-4 border-t" />
        </form>
      </div>
    </div>
  </div>
</div>

    // <div className="container mx-auto h-screen min-h-screen">
    //   <div className="px-4 lg:px-0 w-full">
    //     <div className="flex justify-center items-center">
    //       <div className="lg:w-full md:w-11/12 sm:w-full bg-blue-300 px-8 shadow-2xl rounded-lg overflow-hidden">
    //         <h1 className="text-center font-bold text-xl border-b-2 border-black py-4">Register an Employee!</h1>
    //         <form
    //           className="px-4 lg:px-8 pt-2 pb-8 bg-blue-300 rounded"
    //           onSubmit={formik.handleSubmit}
    //         >
    //           {/* Username and Password */}
    //           <div className="mb-4 md:flex md:justify-between">
    //             <div className="mb-4 md:mr-2 md:mb-0 w-full md:w-1/2">
    //               <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="userName">
    //                 UserName
    //               </label>
    //               <input
    //                 {...formik.getFieldProps('userName')}
    //                 className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
    //                 id="userName"
    //                 type="text"
    //                 placeholder="Username"
    //               />
    //               {formik.touched.userName && formik.errors.userName && (
    //                 <p className="text-red-500">{formik.errors.userName}</p>
    //               )}
    //             </div>

    //             <div className="md:ml-2 w-full md:w-1/2">
    //               <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="password">
    //                 Password
    //               </label>
    //               <input
    //                 {...formik.getFieldProps('password')}
    //                 className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
    //                 id="password"
    //                 type="password"
    //                 placeholder="Password"
    //               />
    //               {formik.touched.password && formik.errors.password && (
    //                 <p className="text-red-500">{formik.errors.password}</p>
    //               )}
    //             </div>
    //           </div>

    //           <div className="mb-4 md:flex md:justify-between">
    //             <div className="mb-4 md:mr-2 md:mb-0 w-full md:w-1/2">
    //               <label className="block mb-2 text-sm font-bold text-gray-700"
    //                 htmlFor="shiftTime"
    //               >
    //                 Shift Time
    //               </label>
    //               <input
    //                 {...formik.getFieldProps('shiftTime')}
    //                 className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
    //                 id="shiftTime"
    //                 type="text"
    //                 placeholder="from - to"
    //               />
    //               {formik.touched.shiftTime && formik.errors.shiftTime && (
    //                 <p className="text-red-500">{formik.errors.shiftTime}</p>
    //               )}
    //             </div>
    //             <div className="mb-4 md:flex md:justify-between">
    //               <div className="mb-4 md:mr-2 md:mb-0">
    //                 <label
    //                   className="block mb-2 text-sm font-bold text-gray-700"
    //                   htmlFor="designation"
    //                 >
    //                   Designation
    //                 </label>
    //                 <input
    //                   {...formik.getFieldProps('designation')}
    //                   className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
    //                   id="designation"
    //                   type="string"
    //                   placeholder="Designation"
    //                 />
    //                 {formik.touched.designation && formik.errors.designation && (
    //                   <p className="text-red-500">{formik.errors.designation}</p>
    //                 )}

    //               </div>
    //               <div className="md:ml-2">
    //                 <label
    //                   className="block mb-2 text-sm font-bold text-gray-700"
    //                   htmlFor="contactNumberL"
    //                 >
    //                   Contact No. Landline
    //                 </label>
    //                 <input
    //                   {...formik.getFieldProps('contactNumberL')}
    //                   className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
    //                   id="contactNumberL"
    //                   type="number"
    //                   placeholder="contactNumberL"
    //                 />
    //                 {formik.touched.contactNumberL && formik.errors.contactNumberL && (
    //                   <p className="text-red-500">{formik.errors.contactNumberL}</p>
    //                 )}
    //               </div>
    //             </div>
    //             <div className="mb-4">
    //               <label
    //                 className="block mb-2 text-sm font-bold text-gray-700"
    //                 htmlFor="contactNumberM"
    //               >
    //                 Mobile no.
    //               </label>
    //               <input
    //                 {...formik.getFieldProps('contactNumberM')}
    //                 className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
    //                 id="contactNumberM"
    //                 type="Number"
    //                 placeholder="contact numberM"
    //               />
    //               {formik.touched.contactNumberM && formik.errors.contactNumberM && (
    //                 <p className="text-red-500">{formik.errors.contactNumberM}</p>
    //               )}
    //             </div>

    //             <div className="mb-8 md:flex md:justify-between">
    //               <div className="mb-4 md:mr-2 md:mb-0">
    //                 <label
    //                   className="block mb-2 text-sm font-bold text-gray-700"
    //                   htmlFor="address"
    //                 >
    //                   Address
    //                 </label>
    //                 <input
    //                   {...formik.getFieldProps('address')}
    //                   className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
    //                   id="address"
    //                   type="text"
    //                   placeholder="Address"
    //                 />
    //                 {formik.touched.address && formik.errors.address && (
    //                   <p className="text-red-500">{formik.errors.address}</p>
    //                 )}

    //               </div>

    //               <div className="md:ml-2">
    //                 <label className="w-full block mb-2 text-sm font-bold text-gray-700" htmlFor="userType">
    //                   User Type
    //                 </label>
    //                 <select
    //                   {...formik.getFieldProps('userType')}
    //                   className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
    //                   id="userType"
    //                   defaultValue=""
    //                 >
    //                   <option value="" disabled>
    //                     Select User Type
    //                   </option>
    //                   <option value="Admin">Admin</option>
    //                   <option value="Receptionist">Receptionist</option>
    //                   <option value="Guard">Guard</option>
    //                   <option value="Compliance_Officer">Compliance_Officer</option>

    //                 </select>
    //                 {formik.touched.userType && formik.errors.userType && (
    //                   <p className="text-red-500">{formik.errors.userType}</p>
    //                 )}

    //               </div>
    //             </div>
    //           </div>

    //           <div className="mb-4">
    //             <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="PhotoImage">
    //               Photo Image
    //             </label>
    //             <div
    //               id="photoImage"
    //               {...formik.getFieldProps('photoImage')}
    //             >
    //               <ImageCapture


    //                 onCapture={handleCapture}
    //                 fieldId='vPhoto'
    //               />
    //               {formik.touched.photoImage && formik.errors.photoImage && (
    //                 <p className="text-red-500">{formik.errors.photoImage}</p>
    //               )}
    //             </div>
    //           </div>

    //           <div className="mb-8 text-center">
    //             <button
    //               type="submit"
    //               className="w-full px-4 py-2 border-2 border-white font-bold text-white bg-black rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline"
    //             >
    //               Register
    //             </button>
    //           </div>
    //           <hr className="mb-4 border-t" />
    //         </form>
    //       </div>
    //     </div>
    //   </div>
    // </div>

  );
};

export default AddUser;
