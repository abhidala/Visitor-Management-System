import React, { useRef, useState } from 'react';
import { getLoginInfo } from '../utils/LoginInfo';
import custom_axios from '../axios/AxiosSetup';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import { ApiConstants } from '../api/ApiConstants';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ReportsFooter from '../components/reportsFooter';
import Pagination from '../components/Pagination';
import ReportsHeader from '../components/reportsHeader';
const pageSize = 10;
interface UserModel {
  Id: number;
  indexId: number;
  vFirstName: string;
  vLastName: string;
  vDateOfBirth: string;
  vMobileNo: string;
  vAddress: string;
  vehicleNo: string;
  visitorType: string;
  vPhoto: string;
  vSignature: string;
  vCommingDate: string;
}
const entriesPerPage = 10;
const VisitorReport: React.FC = React.memo(() => {
  const [users, setUsers] = React.useState<UserModel[]>([]);
  const [totalRows, setTotalRows] = useState();
  const defaultEndDate = new Date();
  const defaultStartDate = new Date();
  defaultStartDate.setFullYear(defaultStartDate.getFullYear() - 1);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const pdfRef = useRef<HTMLDivElement | null>(null);
  const HandlePageNext = () => {
    if (users.length > 0 && currentPage < Math.ceil(totalRows / pageSize)) {
      setCurrentPage(currentPage + 1);
    }
  };
  const HandlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const getAllUsers = async (pageNumber: number, start: any, end: any) => {
    const role = getLoginInfo()?.userType;
    if (start === undefined) {
      const formattedDate = `${defaultStartDate.getFullYear()}-${
        defaultStartDate.getMonth() + 1
      }-${defaultStartDate.getDate()}`;
      start = formattedDate;
    }
    if (end === undefined) {
      const formattedDate = `${defaultEndDate.getFullYear()}-${
        defaultEndDate.getMonth() + 1
      }-${defaultEndDate.getDate()}`;
      end = formattedDate;
    }
    if (role != null) {
      try {
        const response = await custom_axios.get(
          ApiConstants.VISITORS.FIND_ALL_BY_DATE(
            pageNumber,
            pageSize,
            start,
            end,
          ),
          {
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
          },
        );
        setUsers(response.data.data);

        setTotalRows(response.data.total);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('An error occurred while fetching user data.');
      }
    } else {
      toast.info('Forbidden Resource');
    }
  };

  React.useEffect(() => {
    getAllUsers(currentPage, startDate, endDate);
  }, [currentPage, endDate, startDate]);

  // Handle page change
  const handlePageChange = (selectedPage: any) => {
    setCurrentPage(selectedPage.selected);
  };

  const handleStartDateChange = (event: any) => {
    setStartDate(event.target.value);
   
  };

  const handleEndDateChange = (event: any) => {
    setEndDate(event.target.value);
  };

  const filterLogsByDateRange = () => {
    const filteredLogs = users.filter((record) => {
      const DateTime = new Date(record.vCommingDate);
      return (
        (!startDate || DateTime >= new Date(startDate)) &&
        (!endDate || DateTime <= new Date(endDate))
      );
    });
    return filteredLogs;
  };

  const startIndex = currentPage * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;

  // Slice the logs array to get entries for the current page
  const displayedLogs = filterLogsByDateRange().slice(startIndex, endIndex);

  const generatePDF = () => {
    const input = pdfRef.current;
    if (input) {
      html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'px', 'a4', true);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 10;
        pdf.addImage(
          imgData,
          'PNG',
          imgX,
          imgY,
          imgWidth * ratio,
          imgHeight * ratio,
        );
        pdf.save('VisitorReport.pdf');
      });
    }
  };

  const generateExcel = () => {
    const newData = displayedLogs.map(
      ({ vPhoto, vSignature, ...rest }) => rest,
    );
    var wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(newData);

    XLSX.utils.book_append_sheet(wb, ws, 'LoginReport');
    XLSX.writeFile(wb, 'Login Report.xlsx');
  };

  return (
    <div>
      <nav className="... sticky top-0 overflow-hidden mt-0">
        <div className="bg-blue-300 mb-8 table-fixed">
          <h1 className="text-2xl text-gray-800 text-center mb-8 font-bold">
            Visitors Reports
          </h1>
          <div className="flex flex-col lg:flex-row justify-center my-4">
            <label
              htmlFor="start-date"
              className="font-bold text-l mt-2 lg:mt-0 lg:mr-4"
            >
              Start Date
            </label>
            <input
              type="date"
              id="start-date"
              name="start-date"
              value={startDate}
              onChange={handleStartDateChange}
              className="form-control w-full lg:w-40 h-8 px-2 mb-4 lg:mb-0 lg:mr-10 text-sm leading-tight text-gray-700 border-2 rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            />
            <label
              htmlFor="end-date"
              className="font-bold text-l mt-2 lg:mt-0 lg:mr-4"
            >
              End Date
            </label>
            <input
              type="date"
              id="end-date"
              name="end-date"
              value={endDate}
              onChange={handleEndDateChange}
              className="form-control w-full lg:w-40 h-8 px-2 mb-4 lg:mb-0 lg:mr-10 text-sm leading-tight text-gray-700 border-2 rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            />
            <button
              onClick={generatePDF}
              className="form-control w-full lg:w-40 h-8 px-2 mb-4 lg:mb-0 lg:mr-10 text-sm leading-tight text-gray-900 hover:text-black border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-md text-center me-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800"
            >
              Export PDF
            </button>
            <button
              onClick={generateExcel}
              className="form-control w-full lg:w-40 h-8 px-2 mb-4 lg:mb-0 lg:mr-10 text-sm leading-tight text-gray-900 hover:text-black border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-md text-center me-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800"
            >
              Export Excel
            </button>
          </div>
        </div>
      </nav>
      <div className="">
        <div id="report" className="flex flex-col">
          <div className="overflow-x-auto shadow-md sm:rounded-lg">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden mr-4" ref={pdfRef}>
                <div className="border-b-2 p-4 border-gray-500">
                  <ReportsHeader
                    startingDate={startDate}
                    endingDate={endDate}
                  />
                </div>
                <table className="min-w-full border divide-y divide-gray-200 table-fixed dark:divide-gray-700 dark:bg-gray-800">
                  <thead className="bg-gray-700">
                    <tr>
                      <th
                        scope="col"
                        className="py-3 px-4 text-xs font-bold  ml-2 text-center text-gray-900 uppercase dark:text-gray-400"
                      >
                        Index Id
                      </th>
                      <th
                        scope="col"
                        className="py-3 px-4 text-xs font-bold  ml-2 text-center text-gray-900 uppercase dark:text-gray-400"
                      >
                        Visitor
                      </th>
                      <th
                        scope="col"
                        className="py-3 px-4 text-xs font-bold  ml-2 text-center text-gray-900 uppercase dark:text-gray-400"
                      >
                        Date Of Birth
                      </th>

                      <th
                        scope="col"
                        className="py-3 px-4 text-xs font-bold  ml-2 text-center text-gray-900 uppercase dark:text-gray-400"
                      >
                        address
                      </th>
                      <th
                        scope="col"
                        className="py-3 px-4 text-xs font-bold  ml-2 text-center text-gray-900 uppercase dark:text-gray-400"
                      >
                        Vehicle No.
                      </th>
                      <th
                        scope="col"
                        className="py-3 px-4 text-xs font-bold  ml-2 text-center text-gray-900 uppercase dark:text-gray-400"
                      >
                        Mobile No.
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {users.map((user, index) => {
                      const rowClass =
                        index % 2 === 0 ? 'bg-gray-200' : 'bg-gray-100';

                      return (
                        <tr
                          key={user.Id}
                          className="hover:bg-gray-100 dark:hover:bg-gray-700 text-center"
                        >
                          <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap text-gray-700 ">
                            {user.indexId}
                          </td>
                          <td className="py-4 px-6 text-sm font-medium text-gray-500 whitespace-nowrap text-gray-700 capitalize">
                            <div className="flex items-center">
                              <img
                                src={`data:image/jpeg;base64,` + user.vPhoto}
                                alt="Photo"
                                className="w-16 h-16 object-cover rounded-full mr-2 sm:w-20 sm:h-20"
                              />
                              <div>
                                <p className="text-sm sm:text-base">
                                  {user.vFirstName} {user.vLastName}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap text-gray-700">
                            {user.vDateOfBirth ? user.vDateOfBirth : 'NA'}
                          </td>
                          <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap text-gray-700 capitalize">
                            {user.vAddress.length > 20
                              ? `${user.vAddress.slice(0, 20)}...`
                              : user.vAddress}
                          </td>
                          <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap text-gray-700 capitalize">
                            {user.vehicleNo ? user.vehicleNo : 'NA'}
                          </td>
                          <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap text-gray-700">
                            {user.vMobileNo}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className="text-center mt-4">
                  <ReportsFooter />
                  <h1 className="text-center p-2 font-bold">{currentPage}</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 w-full border-gray-300">
        <div className="mt-2 flex items-center justify-between">
          <div className="space-x-2">
            <button
              onClick={HandlePrevious}
              type="button"
              className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              &larr; Previous
            </button>
            <button
              onClick={HandlePageNext}
              type="button"
              className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              Next &rarr;
            </button>
          </div>
          <p className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">
            {currentPage}/{Math.ceil(totalRows / pageSize)}
          </p>
        </div>
      </div>
    </div>
  );
});
export default VisitorReport;
