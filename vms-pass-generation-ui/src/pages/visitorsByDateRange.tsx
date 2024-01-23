import React, { useEffect, useState } from "react";
import custom_axios from "../axios/AxiosSetup";
import { ApiConstants } from "../api/ApiConstants";
import { getLoginInfo } from "../utils/LoginInfo";
import { toast } from "react-toastify";
import { utcToZonedTime } from "date-fns-tz";
import { subMonths, subWeeks, startOfToday, subYears } from "date-fns";
import Pagination from "../components/Pagination";
const pageSize =50;

interface VisitorModel {
  indexId: number;
  toMeet: string;
  Department: string;
  validFor: string;
  AuthobyWhome: string;
  vDate: string;
  visitor: {
    vFirstName: string;
    vLastName: string;
    vPhoto: string;
  };
}

const VisitorsByRange: React.FC = () => {
  const [visitors, setVisitors] = useState<VisitorModel[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows,setTotalRows]= useState();
  const [dateRange, setDateRange] = useState<{
    start: Date;
    end: Date;
  }>({
    start: subMonths(startOfToday(), 1), // Default to last month
    end: startOfToday(),
  });
  const HandlePageNext=()=>{
    if(visitors?.length>0 && currentPage< Math.ceil(totalRows/pageSize) ){
        setCurrentPage(currentPage+1)
    }
    
}
const HandlePrevious=()=>{
    if(currentPage>1){
        setCurrentPage(currentPage-1)
    }
    
}
  useEffect(() => {
    const fetchData = async (pageNumber:number) => {
      try {
        const Role = getLoginInfo()?.userType;
        if (Role === 'Admin' || Role === "Receptionist") {
          const formattedStartDate = `${dateRange.start.getFullYear()}-${dateRange.start.getMonth() + 1}-${dateRange.start.getDate()}`;
          const formattedEndDate = `${dateRange.end.getFullYear()}-${dateRange.end.getMonth() + 1}-${dateRange.end.getDate()}`;
          const response = await custom_axios.get(ApiConstants.VISITORS_VISIT_DATE.FINDALLBYDATE(pageNumber,pageSize,formattedStartDate,formattedEndDate));
          setVisitors(response.data.data);
          setTotalRows(response.data.total);
          console.log(response.data.total);
        } else {
          toast.warn('Forbidden Resource');
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(currentPage);
  }, [dateRange,currentPage]);
  function capitalizeFirstLetter(word: any) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
  const handleDateRangeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRange = event.target.value;
    let newStartDate;

    switch (selectedRange) {
      case "today":
        newStartDate = startOfToday();
        break;
      case "lastWeek":
        newStartDate = subWeeks(startOfToday(), 1);
        break;
      case "lastMonth":
        newStartDate = subMonths(startOfToday(), 1);
        break;
      case "lastSixMonths":
        newStartDate = subMonths(startOfToday(), 6);
        break;
      case "custom":
        // If 'Custom' is selected, no need to change the date range
        return;
      default:
        break;
    }

    setDateRange({
      start: newStartDate,
      end: new Date(), // Set the end of today
    });
  };

  const filteredEntries = visitors.filter((record) => {
    const recordUtc = utcToZonedTime(new Date(record.vDate), "UTC");
    return recordUtc >= dateRange.start && recordUtc <= dateRange.end;
  });

  const entriesPerPage = 20;
  const startIndex = currentPage * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const displayedLogs = filteredEntries.slice(startIndex, endIndex);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  return (
    <section className="mx-auto w-full max-w-full px-4 py-4 overflow-x-auto">
  <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">Visitors By Time Period</h1>
    </div>
    <div className="flex mt-4 md:mt-0">
      <label htmlFor="dateRangeSelect" className="font-bold text-base md:text-lg mt-2">
        Select Date Range:
      </label>
      <select
        id="dateRangeSelect"
        value={
          dateRange.start.getTime() === subWeeks(startOfToday(), 1).getTime()
            ? "lastWeek"
            : dateRange.start.getTime() === subMonths(startOfToday(), 1).getTime()
            ? "lastMonth"
            : dateRange.start.getTime() === subMonths(startOfToday(), 6).getTime()
            ? "lastSixMonths"
            : dateRange.start.getTime() === subYears(startOfToday(), 1).getTime()
            ? "lastYear"
            : "custom"
        }
        className="form-control w-full md:w-48 bg-white px-3 py-2 ml-2 md:ml-4 text-sm md:text-base leading-tight text-gray-700 border-2 rounded shadow appearance-none focus:outline-none focus:shadow-outline"
        onChange={handleDateRangeChange}
      >
        <option value="today">Today</option>
        <option value="lastWeek">Last Week</option>
        <option value="lastMonth">Last Month</option>
        <option value="lastSixMonths">Last Six Months</option>
      </select>
    </div>
  </div>

  <div className="mt-6 md:rounded-lg border border-gray-0">
    <table className="table-auto w-full border-collapse">
      <thead className="bg-gray-300 dark:bg-gray-700">
        <tr>
          <th className="border px-12 py-3.5 text-sm font-bold text-gray-700">Visitor</th>
          <th className="border px-12 py-3.5 text-sm font-bold text-gray-700 text-center">To Meet</th>
          <th className="border px-12 py-3.5 text-sm font-bold text-gray-700 text-center">Department</th>
          <th className="border px-12 py-3.5 text-sm font-bold text-gray-700 text-center">Validity</th>
          <th className="border px-12 py-3.5 text-sm font-bold text-gray-700 text-center">Visit Date</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
        {visitors.map((record) => (
          <tr key={record.indexId} className="hover:bg-gray-100 dark:hover:bg-gray-700">
            <td className="border px-2 py-2">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <img
                    className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-cover rounded"
                    src={`data:image/jpeg;base64,` + record.visitor.vPhoto}
                    alt="visitor Image"
                  />
                  <p className="text-sm font-medium text-gray-900">
                    {capitalizeFirstLetter(record.visitor.vFirstName)} 
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                   {capitalizeFirstLetter(record.visitor.vLastName)}
                  </p>
               
                </div>
                
              </div>
            </td>
            <td className="border px-12 py-4 text-sm font-medium text-gray-900">{record.toMeet}</td>
            <td className="border px-4 py-4 text-sm font-medium text-gray-900">{capitalizeFirstLetter(record.Department)}</td>
            <td className="border px-4 py-4 text-sm font-medium text-gray-900">{record.validFor}</td>
            <td className="border px-4 py-4 text-sm font-medium text-gray-900">
              {new Date(record.vDate).toLocaleDateString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
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
          <p 
              className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
             > {currentPage}/{Math.ceil(totalRows / pageSize)}
          </p>
        </div>
      </div>
</section>
  )
}
export default VisitorsByRange;