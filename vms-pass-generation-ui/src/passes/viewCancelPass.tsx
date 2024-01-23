import React, { useState } from "react";
import { Link } from "react-router-dom";
import custom_axios from "../axios/AxiosSetup";
import { ApiConstants } from "../api/ApiConstants";
import { useEffect } from "react";
import { getLoginInfo } from "../utils/LoginInfo";
import { toast } from "react-toastify";

interface VisitorModel {

  indexId: number;
  toMeet: string;
  Department: string;
  validFor: string;
  AuthobyWhome: string;
  Access: boolean;
  daysImage:string;
  visitor: {
    vFirstName: string;
    vLastName: string;
    vPhoto: string;
  }
}
const pageSize=50;
const ViewCancelPass: React.FC = () => {
  const [visitors, setVisitors] = React.useState<VisitorModel[]>([]);
  const [filterData, setFilterData] = useState([]);
  const [query, setQuery] = useState('');
  const [totalRows,setTotalRows]= useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [cancellationStatus, setCancellationStatus] = useState<{ [indexId: number]: boolean }>({});
  const HandlePageNext=()=>{
    if(visitors?.length>0 ){
        setCurrentPage(currentPage+1)
    }
    
}
const HandlePrevious=()=>{
    if(currentPage>1){
        setCurrentPage(currentPage-1)
    }
    
}
useEffect(()=>{
console.log(visitors);  
},[visitors])

  useEffect(() => {
    const fetchData = async (pageNumber:number) => {
      const role = getLoginInfo()?.userType;
      if (role === 'Admin' || role === 'Receptionist') {
        try {
          const response = await custom_axios.get(ApiConstants.VISITORS_VISIT_DATE.FINDALL(pageNumber,pageSize));
          setVisitors(response.data.data);
          console.log("response.data.data validity.....",response.data.data);
          setTotalRows(response.data.total);
          setFilterData(response.data.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      } else {
        toast.warn('Forbidden Resource')
      }

    };

    fetchData(currentPage);
  }, [currentPage]);

  const handlesearch = (event: any) => {
    const getSearch = event.target.value;
    if (getSearch.length > 0) {
      // const searchData= users.filter((item)=>item.vFirstName.toLowerCase().includes(getSearch));
      const searchData = visitors.filter((item) => {
        const lowerCaseSearch = getSearch.toLowerCase();
        return (
          item.visitor.vFirstName.toLowerCase().includes(lowerCaseSearch) ||
          item.indexId.toString().includes(getSearch) ||
          item.visitor.vLastName.toLowerCase().includes(lowerCaseSearch)// Assuming `getSearch` is the phone number input
        );
      });
      setVisitors(searchData);
    } else {
      setVisitors(filterData)
    }
    setQuery(getSearch)
  }

  const entriesPerPage = 10;
  const startIndex = currentPage * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  // const displayedLogs = visitors.slice(startIndex, endIndex);
  const handlePageChange = (selectedPage: any) => {
    setCurrentPage(selectedPage.selected)
  }

  function capitalizeFirstLetter(word: any) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
  const handleCancelClick = async (record: VisitorModel) => {
    try {
      const UserId: number | undefined = getLoginInfo()?.userId;
      const response = await custom_axios.patch(ApiConstants.VISITORS_VISIT_DATE.Update(record.indexId, UserId));

      if (response.status === 200) {
        // Update the cancellation status for the specific entry in the state
        setCancellationStatus((prevStatus) => ({
          ...prevStatus,
          [record.indexId]: true, // Set it to true to indicate "Cancelled"
        }));

        // Update the Access property for the corresponding entry in the visitors array
        const updatedVisitors = visitors.map((visitor) => {
          if (visitor.indexId === record.indexId) {
            return {
              ...visitor,
              Access: false, // Set it to false to indicate "Cancelled"
            };
          }
          return visitor;
        });

        // Update the state with the modified visitors array
        setVisitors(updatedVisitors);

        toast.success('Pass Cancelled successfully');
      } else {
        toast.error('Pass Cancellation failed');
      }
    } catch (error) {
      console.error('Error cancelling pass:', error);
      toast.warn('An error occurred while cancelling the pass');
    }
  };



  return (

    <section className="mx-auto w-full max-w-full px-4 py-4">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex justify-between items-center">
          <h1 className="text-xl md:text-3xl lg:text-4xl font-bold">View & Cancel Visitor</h1>
        </div>
        <div className="flex mt-4 md:mt-0">
          <label htmlFor="form-control" className="font-bold text-base md:text-lg mt-2">
            Search:
          </label>
          <input
            type="text"
            name="name"
            value={query}
            className="form-control w-full md:w-48 bg-white px-3 py-2 ml-2 md:ml-4 text-sm md:text-base leading-tight text-gray-700 border-2 rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            onChange={(e) => handlesearch(e)}
            placeholder="Search..."
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col">
        <div className=" overflow-x-auto sm:-mx-4 lg:-mx-6">
          <div className="inline-block min-w-full py-2 align-middle md:px-4 lg:px-6">
            <div className="overflow-hidden border border-gray-200 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr className="divide-x divide-gray-200">
                    {/* ... (same as before) */}
                    <th scope="col" className="px-4 py-3.5 text-sm font-bold text-gray-700 text-center">
                      Visitor
                    </th>
                    <th scope="col" className="px-4 py-3.5 text-sm font-bold text-gray-700 text-center">
                      To Meet
                    </th>


                    <th scope="col" className="px-4 py-3.5 text-sm font-bold text-gray-700 text-center">
                      Validity
                    </th>
                    <th scope="col" className="px-4 py-3.5 text-sm font-bold text-gray-700 text-center">
                      Authorized by
                    </th>



                    <th scope="col" className="px-4 py-3.5 text-sm font-bold text-gray-700 text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {visitors?.map((record) => (
                    
                    <tr key={record.indexId} className="divide-x divide-gray-200">
                      {/* ... (same as before) */}
                      <td className="whitespace-nowrap px-2 py-2 font-bold ">
                        <div className="flex items-center">

                          <div className="flex-shrink-0">
                            <img
                              className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-cover rounded"
                              src={record.daysImage?`data:image/jpeg;base64,` + record.daysImage:`data:image/jpeg;base64,`+record.visitor.vPhoto}
                              alt="visitor Image"
                            />
                            <p className="text-sm font-medium text-gray-900">{capitalizeFirstLetter(record.visitor.vFirstName)}</p>
                            <p className="text-sm font-medium text-gray-900">{capitalizeFirstLetter(record.visitor.vLastName)}</p>
                          </div>
                         
                        </div>
                      </td>


                      <td className="py-2 px-6 text-sm font-medium text-gray-900 whitespace-nowrap  capitalize">
                      {record.toMeet.length > 20
                          ? `${record.toMeet.slice(0, 20)}...`
                          : record.toMeet}
                      </td>
                      <td className="py-2 px-6 text-sm font-medium text-gray-900 whitespace-nowrap  capitalize">{record.validFor}</td>
                      <td className="py-2 px-6 text-sm font-medium text-gray-900 whitespace-nowrap ">{record.AuthobyWhome}</td>



                      <td className="py-2 px-6 text-sm font-medium text-gray-900 whitespace-nowrap ">
                        {record.Access ? (
                          <>
                            {/* <button */}
                            <button
                              onClick={() => handleCancelClick(record)}
                              className="bg-red-400 hover:bg-red-500 rounded-lg px-4 py-2 mr-4 text-gray-900 border-2 border-gray-500 shadow-sm text-xl"
                            >
                              Cancel
                            </button>
                            <Link to={`/Pass/${record.indexId}`} className="bg-red-400 hover:bg-red-500 border-2 border-gray-500 rounded-lg px-4 py-2 text-grsy-900 shadow-sm text-xl">
                              Pass
                            </Link>
                          </>
                        ) : (
                          "Cancelled"
                        )}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
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
    </section>
  )
}
export default ViewCancelPass
  ;