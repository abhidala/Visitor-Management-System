import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { ApiConstants } from '../api/ApiConstants';
import custom_axios from '../axios/AxiosSetup';
import { useNavigate } from 'react-router-dom';
import { getLoginInfo } from '../utils/LoginInfo';



const validationSchema = Yup.object().shape({
    fName: Yup.string().required('First Name is required').matches(/^[A-Za-z\s]+$/, 'First name must contain text only'),
    lName: Yup.string().required('Last Name is required').matches(/^[A-Za-z\s]+$/, 'Last name must contain text only'),
    DateofBirth: Yup.date()
        .required('Date of Birth is required')
        .max(new Date(), 'Date of Birth cannot be in the future')
        .test('valid-date', 'Invalid Date of Birth', (value) => {
            const dob = new Date(value);
            const currentYear = new Date().getFullYear();
            return dob.getFullYear() >= 1900 && dob.getFullYear() <= currentYear;
        }),
    vehicleNo: Yup.string().required('Vehicle Option is required'),
    mobileNo: Yup.string().required('Mobile number is required').matches(/^\d{10}$/, 'Mobile number must be a 10-digit number'),
    address: Yup.string().required('Address is required'),
    AuthorizedBy: Yup.string().required('Employee Name is required'),
    EmpId: Yup.string().required('Employee ID is required'),
});


const CreateAppointment = () => {

    let navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            fName: '',
            lName: '',
            DateofBirth: '',
            vehicleOption: '',
            vehicleNo: '',
            mobileNo: '',
            address: '',
            AuthorizedBy: '',
            EmpId: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            const role = getLoginInfo()?.userType;
            const resetAdmin = getLoginInfo()?.resetAdmin;
            if (role === "Admin" || role === "Receptionist" && resetAdmin === false) {
                try {
                    const formData = new FormData();
                    formData.append("fName", values.fName);
                    formData.append("lName", values.lName);
                    formData.append("DateofBirth", values.DateofBirth);
                    formData.append("address", values.address);
                    formData.append("mobileNo", values.mobileNo);
                    formData.append("vehicleNo", values.vehicleNo);
                    formData.append("AuthorizedBy", values.AuthorizedBy);
                    formData.append("EmpId", values.EmpId);
                    //  formData.forEach(function(value, key){
                    //  console.log(key, value);
                    //  });

                    const response = await custom_axios.post(
                        ApiConstants.APPOINTMENT.CREATE,
                        formData
                    );

                    toast.success("Appointment added successfully!!!");
                    navigate("/appointment");
                } catch (error) {
                    console.error(error);
                    toast.error("Error adding user. Please try again.");
                }
            } else {
                toast.info("Forbidden Resource");
            }
        }
    });




    return (


        <div className="container mx-auto h-screen min-h-screen">
            <div className="px-4 lg:px-0 w-full">
                <div className="flex justify-center items-center">
                    <div className="lg:w-full md:w-11/12 sm:w-full bg-blue-300 px-8 shadow-2xl rounded-lg overflow-hidden">
                        <h1 className="text-center font-bold text-xl border-b-2 border-black py-4">
                            Create An Appointment
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
                                        {...formik.getFieldProps('fName')}
                                        className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                                        id="vFirstName"
                                        type="text"
                                        placeholder="First Name"
                                    />
                                    {formik.touched.fName && formik.errors.fName && (
                                        <p className="text-red-500">{formik.errors.fName}</p>
                                    )}
                                </div>

                                <div className="md:ml-2 w-full md:w-1/2">
                                    <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="password">
                                        Last Name
                                    </label>
                                    <input
                                        {...formik.getFieldProps('lName')}
                                        className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                                        id="vLastName"
                                        type="text"
                                        placeholder="Last Name"
                                    />
                                    {formik.touched.lName && formik.errors.lName && (
                                        <p className="text-red-500">{formik.errors.lName}</p>
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
                                    {/* {formik.touched.vehicleNo && formik.errors.vehicleNo && (
                                        <p className="text-red-500">{formik.errors.vehicleNo}</p>
                                    )} */}
                                </div>

                                <div className="md:ml-2 w-full md:w-1/2">
                                    {/* Mobile Number Input */}
                                    <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="contactNumberL">
                                        Mobile Number
                                    </label>
                                    <input
                                        {...formik.getFieldProps('mobileNo')}
                                        className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                                        id="vMobileNo"
                                        // type="number"
                                        placeholder="Mobile Number"
                                    />
                                    {formik.touched.mobileNo && formik.errors.mobileNo && (
                                        <p className="text-red-500">{formik.errors.mobileNo}</p>
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
                                        {...formik.getFieldProps('DateofBirth')}
                                        className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                                        id="DateofBirth"
                                        type="date"
                                        placeholder="Date of birth here!"
                                    />
                                    {formik.touched.DateofBirth && formik.errors.DateofBirth && (
                                        <p className="text-red-500">{formik.errors.DateofBirth}</p>
                                    )}
                                </div>
                                <div className="w-full md:w-1/2 md:ml-2">
                                    {/* Address Input */}
                                    <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="userName">
                                        Address
                                    </label>
                                    <input
                                        {...formik.getFieldProps('address')}
                                        className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                                        id="address"
                                        type="text"
                                        placeholder="Address"
                                    />
                                    {formik.touched.address && formik.errors.address && (
                                        <p className="text-red-500">{formik.errors.address}</p>
                                    )}
                                </div>
                            </div>
                            <h1 className="text-center font-bold text-xl  py-4">
                                Authorized By
                            </h1>
                            <div className="mb-4 md:flex md:justify-between">
                                <div className="w-full md:w-1/2 md:mr-2">
                                    {/* Date of Birth Input */}
                                    <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="shiftTime">
                                        Employee Name
                                    </label>
                                    <input
                                        {...formik.getFieldProps('AuthorizedBy')}
                                        className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                                        id="AuthorizedBy"
                                        type="text"
                                        placeholder="Authorized By"
                                    />
                                    {formik.touched.AuthorizedBy && formik.errors.AuthorizedBy && (
                                        <p className="text-red-500">{formik.errors.AuthorizedBy}</p>
                                    )}
                                </div>
                                <div className="w-full md:w-1/2 md:ml-2">
                                    {/* Visitor Type Select */}
                                    <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="contactNumberM">
                                        Employee ID
                                    </label>
                                    <input
                                        {...formik.getFieldProps('EmpId')}
                                        className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                                        id="EmpId"
                                        type="text"
                                        placeholder="Employee ID"
                                    />
                                    {formik.touched.EmpId && formik.errors.EmpId && (
                                        <p className="text-red-500">{formik.errors.EmpId}</p>
                                    )}
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
    );
}
export default CreateAppointment;