import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { getLoginInfo } from '../utils/LoginInfo';
import custom_axios from '../axios/AxiosSetup';
import { ApiConstants } from '../api/ApiConstants';
import { toast } from 'react-toastify';
import { PDFDownloadLink, StyleSheet, Document, Page, Text, View } from '@react-pdf/renderer';
import Pagination from '../components/Pagination';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface UserModel {
  id: number,
  fName: string;
  lName: string;
  AppointmentId: number;
  mobileNo: number;
  address: string;
  DateofBirth: string;

}

export function AppointmentsNew() {
  let navigate = useNavigate();
  const [users, setUsers] = React.useState<UserModel[]>([]);
  const [filterData, setFilterData] = useState([]);
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [userData, setUserData] = useState({

    id: null,
    fName: '',
    lName: '',
    AppointmentId: '',
    mobileNo: '',
    address: '',
    DateofBirth: '',
  });

  const getAllUsers = async () => {
    const Role = getLoginInfo()?.userType;
    if (Role === 'Admin' || Role === 'Receptionist') {
      const response = await custom_axios.get(ApiConstants.APPOINTMENT.GET_ALL, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      });
      setUsers(response.data);
      setFilterData(response.data)
    } else {
      toast.warn('Forbidden Resource')
      navigate('/');
    }

  }

  React.useEffect(() => {
    if (users.length == 0)
      getAllUsers();
  }, [users]);

  const entriesPerPage = 10;
  const handlePageChange = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected)
  }
  const startIndex = currentPage * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const displayedUsers = users.slice(startIndex, endIndex);
  function capitalizeFirstLetter(word: any) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
  const handlesearch = (event: any) => {
    const getSearch = event.target.value;
    if (getSearch.length > 0) {
      // const searchData= users.filter((item)=>item.vFirstName.toLowerCase().includes(getSearch));
      const searchData = users.filter((item) => {
        const lowerCaseSearch = getSearch.toLowerCase();
        return (
          item.fName.toLowerCase().includes(lowerCaseSearch) ||
          item.AppointmentId.toString().includes(getSearch) ||
          // Assuming `getSearch` is the phone number input
          item.mobileNo.toString().includes(getSearch)
        );
      });
      setUsers(searchData);
    } else {
      setUsers(filterData)
    }
    setQuery(getSearch)
  }
  const handlePrintPDF1 = async (user: UserModel) => {
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfContainer = document.getElementById("pdf-container");

    if (pdfContainer) {
      const canvas = await html2canvas(pdfContainer, { scale: 3 });
      const imageData = canvas.toDataURL("image/jpeg");
      pdf.addImage(imageData, "JPEG", 0, 0, 210, 99);
      pdf.save(`${user.fName}-EntryPass.pdf`);
    }
  };
  const handlePrintPDF = async () => {
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfContainer = document.getElementById("pdf-container");

    if (pdfContainer) {
      const canvas = await html2canvas(pdfContainer);
      pdf.addImage(canvas.toDataURL("image/jpeg"), "JPEG", 0, 0, 210, 297); // A4 size
      pdf.save("`${user.fName}-appointment.pdf`");
    }
  };
  const generatePdfContent = (user: UserModel) => (
    <div>
      <h1>User Information</h1>
      <p>Name: {`${user.fName} ${user.lName}`}</p>
      <p>Appointment Id: {user.AppointmentId}</p>
      <p>Mobile No.: {user.mobileNo}</p>
      <p>Date Of Birth: {user.DateofBirth}</p>
      <p>Address: {user.address}</p>
    </div>
  );



  return (
    <>

      <section className="mx-auto w-full max-w-7xl px-4 py-4 overflow-x-auto">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">Appointments</h1>
          </div>

          <div className="flex items-center md:ml-4 lg:ml-8">
            <label className="text-xl font-bold mx-2" htmlFor="search">
              Search
            </label>
            <input
              id="search"
              value={query}
              className="border-2 border-blue-300 rounded shadow py-2 px-4 md:h-10"
              placeholder="Search"
              type="text"
              onChange={(e) => handlesearch(e)}
            />
          </div>
        </div>

        <div className="mt-6 overflow-x-auto shadow-md border border-gray-200 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 bg-gray-800 border border-gray-700 rounded-md">
            <thead className="bg-gray-50">
              <tr className="text-left">
                <th className="border px-4 py-3.5 font-bold text-gray-700 text-center">Name</th>
                <th className="border px-12 py-3.5 text-sm font-bold text-gray-700 text-center">Appointment Id</th>
                <th className="border px-4 py-3.5 text-sm font-bold text-gray-700 text-center">Mobile No.</th>
                <th className="border px-4 py-3.5 text-sm font-bold text-gray-700 text-center">Date Of Birth</th>
                <th className="border px-4 py-3.5 text-sm font-bold text-gray-700 text-center">Address</th>
                <th className="border px-4 py-3.5 text-center">Action</th>
                {/* <th className="border px-4 py-3.5 text-center">Download Appointment</th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-center">
              {displayedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                  <td className="border px-4 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0"></div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {capitalizeFirstLetter(user.fName)} {capitalizeFirstLetter(user.lName)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="border px-12 py-4 text-sm text-gray-900">{user.AppointmentId}</td>
                  <td className="border px-4 py-4">
                    <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                      {user.mobileNo ? user.mobileNo : 'NA'}
                    </span>
                  </td>
                  <td className="border px-4 py-4 text-sm text-gray-700">{user.DateofBirth ? user.DateofBirth : 'NA'}</td>
                  <td className="border px-4 py-4 text-sm text-gray-700">{user.address}</td>
                  <td className="border px-4 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() => navigate("/pass/AddVisitor")}
                      className="form-control w-full lg:w-30 h-8 px-2 mb-4 lg:mb-0 lg:mr-10 text-sm leading-tight text-gray-900 hover:text-black border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-md text-center me-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800"
                    >
                      Continue
                    </button>
                  </td>
                  {/* <td className="border px-4 py-4 text-right text-sm font-medium">
                    <PDFDownloadLink
                      document={generatePdfContent(user)}
                      fileName={`${user.fName}-EntryPass.pdf`}
                    >
                      <button 
                      className="form-control w-full lg:w-30 h-8 px-2 mb-4 lg:mb-0 lg:mr-10 text-sm leading-tight text-gray-900 hover:text-black border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-md text-center me-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800"
                      >
                        Download
                      </button>
                    </PDFDownloadLink>

                  </td> */}
                </tr>  
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className='mb-8'>
        <Pagination
          pageCount={Math.ceil(users.length / entriesPerPage)}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />

      </div>


    </>
  )
}
