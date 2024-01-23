import React, { useEffect, useState } from 'react';
import { getLoginInfo } from '../utils/LoginInfo';
import custom_axios from '../axios/AxiosSetup';
import { ApiConstants } from '../api/ApiConstants';
import { toast } from 'react-toastify';
import Pagination from '../components/Pagination';
import { Link } from 'react-router-dom';
import { useData } from '../DataContext';
const pageSize = 50;
interface UserModel {
  vistorId: number;
  vFirstName: string;
  vLastName: string;
  vDateOfBirth: string;
  vMobileNo: string;
  vAddress: string;
  vehicleNo: string;
  vPhoto: string;
}

// interface isopenModel {
//   index: number;
//   isOpen: boolean;
// }
const VisitorsNew = () => {
  //const {sharedData,updateSharedData}= useData();

  const [users, setUsers] = React.useState<UserModel[]>([]);
  const [filterData, setFilterData] = useState([]);
  const [query, setQuery] = useState('');
  const [searchData,setSearchData] = useState("");
  const [totalRows, setTotalRows] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageNumber,setCurrentPageNumber]= useState(1);
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
  const getAllUsersByNumber=async(data,pageNumber)=>{
    const role = getLoginInfo()?.userType;
    if (role === 'Admin' || role === 'Receptionist') {
      const response = await custom_axios.get(
        ApiConstants.VISITORS.FIND_ALL_BY_NUMBER(data,pageNumber, pageSize),
        {
          headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
        },
      );
      setUsers(response.data.data);
      setTotalRows(response.data.total);
      console.log(response.data.total);
      setFilterData(response.data.data);
    } else {
      toast.info('Forbidden Resource');
    }


  }
  useEffect(() => {
    if(searchData.length===0)
    getAllUsers(currentPage);
  else if(searchData.length){
    getAllUsersByNumber(searchData,currentPageNumber)

  }
  }, [currentPage,searchData]);
  const getAllUsers = async (pageNumber: number) => {
    const role = getLoginInfo()?.userType;
    if (role === 'Admin' || role === 'Receptionist') {
      const response = await custom_axios.get(
        ApiConstants.VISITORS.FIND_ALL(pageNumber, pageSize),
        {
          headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
        },
      );
      setUsers(response.data.data);
      setTotalRows(response.data.total);
      console.log(response.data.total);
      setFilterData(response.data.data);
    } else {
      toast.info('Forbidden Resource');
    }
  };

  // React.useEffect(() => {
  //   if (users.length == 0)
  //     getAllUsers();
  // }, [users]);
  // React.useEffect(()=>{
  // updateSharedData("null");
  // },[])

  //black list
  const blacklist = async (personId: number) => {
    try {
      const response = await custom_axios.patch(
        ApiConstants.VISITORS.UPDATEBLACKLIST(personId),
      );

      if (response.data.success) {
        // let indexOfUpdatedUser = users.findIndex(user => user.Id === personId)
        // users[indexOfUpdatedUser].blacklisted = !users[indexOfUpdatedUser].blacklisted
        // setUsers(users)
        toast.success('Updated Successfully!');
        setTimeout(async () => {
          const result = await fetch(
            `http://localhost:3000/pass/findAllVisitors/${currentPage}/${pageSize}`,
            {
              method: 'GET',
              headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token'),
              },
            },
          );
          const final_result = await result.json();
          console.log('final_result :- ', final_result);
          setUsers(final_result.data);
        }, 1000);
      } else {
        toast.error('unable to update the visitor');
      }
    } catch (error) {
      toast.error('Error occurred while updating blacklist');
      console.error('Error updating blacklist', error);
    }
  };
  
  //search function
  const handlesearch = (event: any) => {
    const getSearch = event.target.value;
    setQuery(getSearch);
    setSearchData(getSearch);
    if(getSearch.length>0){
     
    
    setCurrentPage(1);}
    // if (getSearch.length > 0) {
    //   // const searchData= users.filter((item)=>item.vFirstName.toLowerCase().includes(getSearch));
    //   const searchData = users.filter((item) => {
    //     const lowerCaseSearch = getSearch.toLowerCase();
    //     return (
    //       item.vFirstName.toLowerCase().includes(lowerCaseSearch) ||
    //       item.vMobileNo.toString().includes(getSearch) // Assuming `getSearch` is the phone number input
    //     );
    //   });
    //   setUsers(searchData);
    // } else {
    //   setUsers(filterData);
    // }
    // setQuery(getSearch);
  };
  function capitalizeFirstLetter(word: any) {
    return word?.charAt(0).toUpperCase() + word?.slice(1);
  }
  //pagination
  const entriesPerPage = 20;
  const startIndex = currentPage * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const displayedLogs = users.slice(startIndex, endIndex);
  const handlePageChange = (selectedPage: any) => {
    setCurrentPage(selectedPage.selected);
  };

  // useEffect(() => {
  //   let newdisplay = users.slice(startIndex, endIndex);
  //   setDisplayedLogs(newdisplay);
  // }, [users]);

  // useEffect(() => {
  //   console.log(displayedLogs);
  // }, [displayedLogs]);

  return (
    <section className="mx-auto w-full max-w-full px-4 py-4">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex justify-between items-center">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">
            Visitors
          </h1>
        </div>
        <div className="flex mt-4 md:mt-0">
          <label
            htmlFor="form-control"
            className="font-bold text-base md:text-lg mt-2"
          >
            Search:
          </label>
          <input
            type="text"
            name="name"
            value={query}
            className="form-control w-full md:w-40 bg-white px-3 py-2 ml-2 md:ml-4 text-sm md:text-base leading-tight text-gray-700 border-2 rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            onChange={(e) => handlesearch(e)}
            placeholder="search..."
          />
        </div>
      </div>
      <div className="mt-6 flex flex-col">
        <div className=" overflow-x-auto sm:-mx-4 lg:-mx-6">
          <div className="inline-block min-w-full py-2 align-middle md:px-4 lg:px-6">
            <div className="overflow-hidden border border-gray-200 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr className="divide-x divide-gray-400">
                    <th
                      scope="col"
                      className="px-1 sm:px-2 md:px-3 py-3.5 text-sm font-bold text-gray-700 text-center"
                    >
                      <span>Visitor</span>
                    </th>
                    <th
                      scope="col"
                      className="px-1 sm:px-2 md:px-3 py-3.5 text-sm font-bold text-gray-700 text-center"
                    >
                      Contact Number
                    </th>
                    <th
                      scope="col"
                      className="px-1 sm:px-2 md:px-3 py-3.5 text-sm font-bold text-gray-700 text-center"
                    >
                      Vehicle No.
                    </th>
                    <th
                      scope="col"
                      className="px-1 sm:px-2 md:px-3 py-3.5 text-sm font-bold text-gray-700 text-center"
                    >
                      Date Of Birth
                    </th>
                    <th
                      scope="col"
                      className="px-1 sm:px-2 md:px-3 py-3.5 text-sm font-bold text-gray-700 text-center"
                    >
                      Address
                    </th>
                    <th
                      scope="col"
                      className="px-1 sm:px-2 md:px-4 py-3.5 text-sm font-bold text-gray-700 text-center"
                      colSpan={2}
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users?.map((person, index) => (
                    <tr key={person.Id} className="divide-x divide-gray-200">
                      <td className="whitespace-nowrap px-1 sm:px-2 md:px-3 py-4 font-bold">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <img
                              className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-28 lg:h-24 object-cover rounded"
                              src={`data:image/jpeg;base64,` + person.vPhoto}
                              alt="visitor Image"
                            />
                            <p className="text-sm font-medium mt-1 text-gray-900">
                              {capitalizeFirstLetter(person.vFirstName)}
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                              {capitalizeFirstLetter(person.vLastName)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-1 sm:px-2 md:px-3 py-4">
                        <div className="text-sm text-gray-900">
                          {person.vMobileNo}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-1 sm:px-2 md:px-3 py-4">
                        <div className="text-sm text-gray-500">
                          {person.vehicleNo ? person.vehicleNo : 'NA'}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-1 sm:px-2 md:px-3 py-4">
                        <div className="text-sm text-gray-500">
                        {person.vDateOfBirth ? person.vDateOfBirth : 'NA'}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-1 sm:px-2 md:px-3 py-4 text-sm text-gray-500">
                        {person?.vAddress?.length > 20
                          ? `${person?.vAddress?.slice(0, 20)}...`
                          : person.vAddress}
                      </td>
                      <td className="whitespace-nowrap px-1 sm:px-2 md:px-3 py-4 text-sm text-gray-500 sm:px-4 mt-2 text-sm font-medium text-center whitespace-nowrap flex flex-row items-center md:flex-col md:items-center">
                        <Link
                          to={`/VisitingInfo/${person.vistorId}`}
                          className="form-control w-full lg:w-30 md:w-28 h-10 px-1 mb-2 lg:mb-2 lg:mr-2 md:mr-2 text-base lg:text-lg font-bold leading-tight text-gray-900 hover:text-black border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-md text-center dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800"
                        >
                          Pass
                        </Link>
                        <button
                          hidden={false}
                          onClick={() => {
                            blacklist(person.vistorId);
                          }}
                          className="form-control w-full lg:w-30 md:w-28 h-10 px-1 mb-2 mt-2 lg:mb-0 lg:mr-2 md:mr-2 text-base lg:text-lg font-bold leading-tight text-gray-900 hover:text-black border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-md text-center dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800"
                        >
                          {person?.blacklisted ? 'Unblacklist' : 'Blacklist'}
                        </button>
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
  );
};
export default VisitorsNew;
