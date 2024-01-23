import { useEffect, useRef, useState } from 'react';
import { ApiConstants } from '../api/ApiConstants';
import custom_axios from '../axios/AxiosSetup';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import ReportsFooter from '../components/reportsFooter';
import Pagination from '../components/Pagination';
import ReportsHeader from '../components/reportsHeader';
import 'jspdf-autotable';
import { getLoginInfo } from '../utils/LoginInfo';
import Logo from '../images/logo/LOGO.png';

interface Logs {
  indexId: number;
  LogedInDateTime: string;
  LogedOutDateTime: string;
  userId: number;
}
const entriesPerPage = 20;
const LoginReport = () => {
  const [logs, setLogs] = useState<Logs[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [displayedLogs, setDisplayedLogs] = useState([]);
  const pdfRef = useRef<HTMLDivElement | null>(null);

  const fetchData = async () => {
    try {
      const response = await custom_axios.get(
        ApiConstants.LOGInOutReports.FINDALL,
      );
      setLogs(response.data);
    } catch (error) {
      alert('Data fetching failed');
    }
  };

  useEffect(() => {
    if (logs.length === 0) fetchData();
  }, []);

  const handlePageChange = (selectedPage: any) => {
    setCurrentPage(selectedPage.selected);
  };

  const filterLogsByDateRange = () => {
    const filteredLogs = logs.filter((record) => {
      const logInDateTime = new Date(record.LogedInDateTime);
      return (
        (!startDate || logInDateTime >= new Date(startDate)) &&
        (!endDate || logInDateTime <= new Date(endDate))
      );
    });
    return filteredLogs;
  };

  const startIndex = currentPage * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;

  const displayedLogs1 = filterLogsByDateRange().slice(startIndex, endIndex);
  useEffect(() => {
    console.log(filterLogsByDateRange().slice(startIndex, endIndex).length);
  }, []);
  const handleStartDateChange = (event: any) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event: any) => {
    setEndDate(event.target.value);
  };

  const generatePDF = () => {
    const unit = 'pt';
    const size = 'A4'; // Use A1, A2, A3, or A4
    const orientation = 'landscape'; // portrait or landscape

    const doc = new jsPDF(orientation, unit, size);
    const Mydate = new Date().toLocaleString();
    doc.setFontSize(12);

    const centerText = {
      align: 'center',
      textColor: [0, 102, 204], // Set text color to blue
      resetTextColor: [0], // Reset text color
    };

    const headers = [
      ['INDEX ID', 'USER ID', 'LOGIN DATE/TIME', 'LOGOUT DATE/TIME'],
    ];

    let data = filterLogsByDateRange();
    const visitorData = data.map((data) => [
      data.indexId,
      data.userId,
      data.LogedInDateTime,
      data.LogedOutDateTime,
    ]);

    const tableOptions = {
      startY: 90, // Initial margin from the top for the table
      head: headers,
      body: visitorData,
      rowPageBreak: 'avoid', // This option avoids breaking rows across pages
      alternateRowStyles: { fillColor: [240, 240, 240], textColor: 0 },
      margin: { top: 90 }, // Adjust the top margin to create a gap between header and table content
      didDrawPage: function (data) {
        // Footer on every page
        const footerText = `©2023 ESSI , Fax: +91 - 11 - 41519898, Email:support@elkostaindia.com`;
        const footerTextbottom = `www.elkostaindia.com , 101- Mercantile House, K.G Marg , New Delhi-110001 , Ph: +91 - 11 - 41519899`;
        doc.setTextColor(0, 102, 204); // Set text color to blue
        doc.text(
          footerText,
          doc.internal.pageSize.getWidth() / 2,
          doc.internal.pageSize.getHeight() - 40,
          { align: 'center' },
        );
        doc.text(
          footerTextbottom,
          doc.internal.pageSize.getWidth() / 2,
          doc.internal.pageSize.getHeight() - 20,
          { align: 'center' },
        );
        doc.addImage(Logo, 'JPEG', 40, 0, 80, 80),
          // Header content on each page
          doc.setTextColor(...centerText.textColor);
        doc.text(
          'Login/Logout Report',
          doc.internal.pageSize.getWidth() / 2,
          30,
          centerText,
        );
        doc.setTextColor(...centerText.resetTextColor);
        doc.text(
          'GOVERNMENT OF NCT DELHI',
          doc.internal.pageSize.getWidth() / 2,
          50,
          centerText,
        );
        doc.text(
          'DELHI SACHIVALAYA',
          doc.internal.pageSize.getWidth() / 2,
          60,
          centerText,
        );
        doc.text(
          `Generated on: ${Mydate}`,
          doc.internal.pageSize.getWidth() / 2,
          70,
          centerText,
        );
        doc.text(
          `Report From: ${startDate} | Report To: ${endDate} | Report Generated By: ${getLoginInfo()
            ?.userName}`,
          doc.internal.pageSize.getWidth() / 2,
          80,
          centerText,
        );
        // Page number at the bottom
        const pageCount = doc.internal.getNumberOfPages();
        const currentPage = data.pageNumber;
        doc.text(
          `Page ${currentPage} of ${pageCount}`,
          data.settings.margin.right,
          doc.internal.pageSize.getHeight() - 10,
        );
      },
    };
    doc.autoTable(tableOptions);

    // Save the PDF
    doc.save('login_logout_report.pdf');
  };

  const generateExcel = () => {
    var wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(displayedLogs);

    XLSX.utils.book_append_sheet(wb, ws, 'LoginReport');
    XLSX.writeFile(wb, 'Login Report.xlsx');
  };

  return (
    <>
      <nav className="... sticky top-0 overflow-hidden mt-0 bg-gray-300 w-full z-50">
        <div className="bg-blue-300 mb-8 table-fixed">
          <h1 className="text-2xl text-gray-800 text-center mb-8 font-bold">
            Login/Logout Reports
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
                        IndexId
                      </th>
                      <th
                        scope="col"
                        className="py-3 px-4 text-xs font-bold ml-2 text-center text-gray-900 uppercase dark:text-gray-400"
                      >
                        userId
                      </th>
                      <th
                        scope="col"
                        className="py-3 px-2 text-xs font-bold ml-2  text-center text-gray-900 uppercase dark:text-gray-400"
                      >
                        Loggedin Date / Time
                      </th>
                      <th
                        scope="col"
                        className="py-3 px-2 text-xs font-bold ml-2  text-center text-gray-900 uppercase dark:text-gray-400"
                      >
                        LoggedOut Date / Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {displayedLogs.map((record, index) => {
                      const rowClass =
                        index % 2 === 0 ? 'bg-gray-200' : 'bg-gray-100';

                      return (
                        <tr
                          key={record.indexId}
                          className="hover:bg-gray-100 dark:hover:bg-gray-700 text-center"
                        >
                          <td className="py-4 indent-8 px-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                            {record.indexId}
                          </td>
                          <td className="py-2 indent-8 px-4  text-sm font-medium text-gray-900 whitespace-nowrap">
                            {record.userId}
                          </td>
                          <td className="py-2 indent-12 px-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                            {new Date(record.LogedInDateTime).toLocaleString(
                              undefined,
                              {
                                timeZone: 'Asia/Kolkata',
                              },
                            )}
                          </td>
                          <td className=" ml-4 py-4 indent-12 px-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                            {new Date(record.LogedOutDateTime).toLocaleString(
                              undefined,
                              {
                                timeZone: 'Asia/Kolkata',
                              },
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <div className="text-center mt-4">
                  <ReportsFooter />
                  <h1 className="text-center p-2 font-bold">
                    {currentPage + 1}
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center mb-8 p-4 border-b-2 border-blue-700 mt-4">
        <Pagination
          onPageChange={handlePageChange}
          currentPage={currentPage}
          pageCount={Math.ceil(filterLogsByDateRange().length / entriesPerPage)}
        />
      </div>
    </>
  );
};

export default LoginReport;
