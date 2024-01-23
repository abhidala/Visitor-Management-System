import React, { useRef, useState } from 'react';
import custom_axios from '../axios/AxiosSetup';
import { ApiConstants } from '../api/ApiConstants';
import { useEffect } from 'react';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import ReportsFooter from '../components/reportsFooter';
import Pagination from '../components/Pagination';
import ReportsHeader from '../components/reportsHeader';
import { getLoginInfo } from '../utils/LoginInfo';
import Logo from '../images/logo/LOGO.png';

interface VisitorModel {
  indexId: number;
  toMeet: string;
  Department: string;
  validFor: string;
  AuthobyWhome: string;
  vDate: string;
  purpose: string;
  visitor: {
    vFirstName: string;
    vLastName: string;
    vPhoto: string;
  };
}
const pageSize = 50;
const entriesPerPage = 12;
const VisitDateReport: React.FC = React.memo(() => {
  const [visitors, setVisitors] = React.useState<VisitorModel[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState();
  const [totalRows, setTotalRows] = useState();
  const [endDate, setEndDate] = useState();
  const pdfRef = useRef<HTMLDivElement | null>(null);
  const defaultEndDate = new Date();
  const defaultStartDate = new Date();
  defaultStartDate.setFullYear(defaultStartDate.getFullYear() - 1);
  useEffect(() => {
    const fetchData = async (pageNumber, start, end) => {
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
      try {
        const response = await custom_axios.get(
          ApiConstants.VISITORS_VISIT_DATE.FINDALLBYDATE(
            pageNumber,
            pageSize,
            start,
            end,
          ),
        );
        setVisitors(response.data.data);
        console.log(response.data.total);
        setTotalRows(response.data.total);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(currentPage, startDate, endDate);
  }, [currentPage, startDate, endDate]);

  const handleStartDateChange = (event: any) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event: any) => {
    setEndDate(event.target.value);
  };

  const filterLogsByDateRange = () => {
    const filteredLogs = visitors.filter((record) => {
      const DateTime = new Date(record.vDate);
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

  // Handle page change
  const handlePageChange = (selectedPage: any) => {
    setCurrentPage(selectedPage.selected);
  };
  const generatePDF = async () => {
    const unit = 'pt';
    const size = 'A4';
    const orientation = 'landscape';

    const doc = new jsPDF(orientation, unit, size);
    const Mydate = new Date().toLocaleString();
    doc.setFontSize(12);

    const centerText = {
      align: 'center',
      textColor: [0, 102, 204],
      resetTextColor: [0],
    };

    const headers = [
      [
        'INDEX ID',
        'VISITOR NAME',
        'TO MEET',
        'DEPARTMENT',
        'AUTHORIZED BY',
        'PURPOSE',
        'VISIT DATE',
      ],
    ];

    const totalPages = Math.ceil(totalRows / pageSize);

    for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
      const data = await custom_axios.get(
        ApiConstants.VISITORS_VISIT_DATE.FINDALLBYDATE(
          currentPage,
          pageSize,
          startDate,
          endDate,
        ),
      );

      const visitorData = data.data.data.map((vData) => [
        vData.indexId,
        `${vData.visitor.vFirstName} ${vData.visitor.vLastName}`,
        vData.toMeet,
        vData.Department,
        vData.AuthobyWhome,
        vData.purpose,
        vData.vDate,
      ]);

      const tableOptions = {
        startY: currentPage === 1 ? 90 : 10,
        head: headers,
        body: visitorData,
        rowPageBreak: 'avoid',
        alternateRowStyles: { fillColor: [240, 240, 240], textColor: 0 },
        margin: { top: 10 },
        didDrawPage: function (data) {
          const footerText = `©2023 ESSI , Fax: +91 - 11 - 41519898, Email:support@elkostaindia.com`;
          const footerTextbottom = `www.elkostaindia.com , 101- Mercantile House, K.G Marg , New Delhi-110001 , Ph: +91 - 11 - 41519899`;
          doc.setTextColor(0, 102, 204);
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
            doc.setTextColor(...centerText.textColor);
          doc.text(
            'GOVERNMENT OF NCT DELHI',
            doc.internal.pageSize.getWidth() / 2,
            30,
            centerText,
          );
          doc.setTextColor(...centerText.resetTextColor);
          doc.text(
            'Visitor Visit Date Report',
            doc.internal.pageSize.getWidth() / 2,
            50,
            centerText,
          );
          doc.text(
            `Generated on: ${Mydate}`,
            doc.internal.pageSize.getWidth() / 2,
            65,
            centerText,
          );
          doc.text(
            `Report From: ${startDate} | Report To: ${endDate} | Report Generated By: ${getLoginInfo()
              ?.userName}`,
            doc.internal.pageSize.getWidth() / 2,
            80,
            centerText,
          );
          const pageCount = doc.internal.getNumberOfPages();
          doc.text(
            `Page ${currentPage} / ${pageCount}`,
            data.settings.margin.right,
            doc.internal.pageSize.getHeight() - 10,
          );
        },
      };

      doc.autoTable(tableOptions);

      if (currentPage <= totalPages) {
        doc.addPage();
      }
    }

    doc.save('visitorVisitDate_report.pdf');
  };

  // const fetchDataForPage = async (pageNumber, start, end) => {
  //   try {
  //     const response = await custom_axios.get(
  //       ApiConstants.VISITORS_VISIT_DATE.FINDALLBYDATE(
  //         pageNumber,
  //         pageSize,
  //         start,
  //         end
  //       )
  //     );
  //     return response.data.data;
  //   } catch (error) {
  //     console.error("Error fetching data for page:", error);
  //     return [];
  //   }
  // };

  const generateExcel = () => {
    var wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(displayedLogs);

    XLSX.utils.book_append_sheet(wb, ws, 'LoginReport');
    XLSX.writeFile(wb, 'Login Report.xlsx');
  };

  const HandlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const HandlePageNext = () => {
    if (visitors.length > 0 && currentPage < Math.ceil(totalRows / pageSize)) {
      setCurrentPage(currentPage + 1);
    }
  };
  return (
    <div>
      <nav className="... sticky top-0 overflow-hidden mt-0 bg-blue-300 z-50">
        <div className="bg-blue-300 mb-8 table-fixed">
          <h1 className="text-2xl text-gray-800 text-center mb-8 font-bold">
            Visitor Visit Date Report
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
                      <th className="py-3 px-4 text-xs font-bold  ml-2 text-center text-gray-900 uppercase dark:text-gray-400">
                        Index Id
                      </th>
                      <th className="py-3 px-4 text-xs font-bold  ml-2 text-center text-gray-900 uppercase dark:text-gray-400">
                        Visitor Name
                      </th>
                      <th className="py-3 px-4 text-xs font-bold  ml-2 text-center text-gray-900 uppercase dark:text-gray-400">
                        To Meet
                      </th>
                      <th className="py-3 px-4 text-xs font-bold  ml-2 text-center text-gray-900 uppercase dark:text-gray-400">
                        Department
                      </th>
                      <th className="py-3 px-4 text-xs font-bold  ml-2 text-center text-gray-900 uppercase dark:text-gray-400">
                        Authorized by
                      </th>
                      <th className="py-3 px-4 text-xs font-bold  ml-2 text-center text-gray-900 uppercase dark:text-gray-400">
                        Purpose
                      </th>
                      <th className="py-3 px-4 text-xs font-bold  ml-2 text-center text-gray-900 uppercase dark:text-gray-400">
                        Visit Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {visitors.map((record, index) => {
                      const rowClass =
                        index % 2 === 0 ? 'bg-gray-200' : 'bg-gray-100';

                      return (
                        <tr
                          key={record.indexId}
                          className={`hover:bg-gray-300 ${rowClass}`}
                        >
                          <td className="py-4 px-4 text-sm font-small text-gray-800 whitespace-nowrap  text-center">
                            {record.indexId}
                          </td>
                          <td className="py-4 px-4 text-sm font-small text-gray-700 whitespace-nowrap capitalize">
                            {record.visitor.vFirstName}{' '}
                            {record.visitor.vLastName}
                          </td>
                          <td className="py-4 px-4 text-sm font-small text-gray-800 whitespace-nowrap capitalize">
                            {record.toMeet}
                          </td>
                          <td className="py-4 px-4 text-sm font-small text-gray-800 whitespace-nowrap capitalize">
                            {record.Department}
                          </td>
                          <td className="py-4 px-4 text-sm font-small text-gray-800 whitespace-nowrap capitalize">
                            {record.AuthobyWhome}
                          </td>
                          <td className="py-4 px-4 text-sm font-small text-gray-800 whitespace-nowrap capitalize">
                            {record.purpose}
                          </td>
                          <td className="py-4 px-4 text-sm font-small text-gray-800 whitespace-nowrap">
                            {new Date(record.vDate).toLocaleString()}
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
      {/* <div className="flex justify-center mb-2 p-2 mt-6">
        <Pagination
          onPageChange={handlePageChange}
          currentPage={currentPage}
          pageCount={Math.ceil(filterLogsByDateRange().length / entriesPerPage)}
        />

      </div> */}
    </div>
  );
});
export default VisitDateReport;
