import React, { useState } from 'react';
import { getLoginInfo } from '../utils/LoginInfo';
import custom_axios from '../axios/AxiosSetup';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { ApiConstants } from '../api/ApiConstants';
import Pagination from '../components/Pagination';

const pageSize = 50;
interface UserModel {
  Id: number;
  vFirstName: string;
  vLastName: string;
  vDateOfBirth: string;
  vMobileNo: string;
  vAddress: string;
  vehicleNo: string;
  vPhoto: string;
  blacklisted: boolean;
}

const UpdateVisitor: React.FC = () => {
  const [users, setUsers] = React.useState<UserModel[]>([]);
  const [filterData, setFilterData] = useState([]);
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState();
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
      setFilterData(response.data);
    } else {
      toast.info('Forbidden Resource');
    }
  };

  React.useEffect(() => {
    getAllUsers(currentPage);
  }, [currentPage]);

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
  const handlesearch = (event) => {
    const getSearch = event.target.value;

    if (getSearch.length > 0) {
      // const searchData= users.filter((item)=>item.vFirstName.toLowerCase().includes(getSearch));
      const searchData = users.filter((item) => {
        const lowerCaseSearch = getSearch.toLowerCase();
        return (
          item.vFirstName.toLowerCase().includes(lowerCaseSearch) ||
          item.vMobileNo?.toString().includes(getSearch) // Assuming `getSearch` is the phone number input
        );
      });
      setUsers(searchData);
    } else {
      setUsers(filterData);
    }
    setQuery(getSearch);
  };

  const entriesPerPage = 10;
  const startIndex = currentPage * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  // const displayedLogs = users.slice(startIndex,endIndex);
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };
  function capitalizeFirstLetter(word: any) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  return (
    <section className="mx-auto w-full max-w-full px-4 py-4">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
            Update Visitor
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
            className="form-control w-full md:w-48 bg-white px-3 py-2 ml-2 md:ml-4 text-sm md:text-base leading-tight text-gray-700 border-2 rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            onChange={(e) => handlesearch(e)}
            placeholder="Search..."
          />
        </div>
      </div>
      <div className="mt-6 flex flex-col">
        <div className="overflow-x-auto sm:-mx-4 lg:-mx-6">
          <div className="inline-block min-w-full py-2 align-middle md:px-4 lg:px-6">
            <div className="overflow-hidden border border-gray-200 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr className="divide-x divide-gray-200">
                    <th
                      scope="col"
                      className="px-4 py-3.5 text-sm font-bold text-gray-700 text-center"
                    >
                      Visitor
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3.5 text-sm font-bold text-gray-700 text-center"
                    >
                      Date Of Birth
                    </th>

                    <th
                      scope="col"
                      className="px-4 py-3.5 text-sm font-bold text-gray-700 text-center"
                    >
                      address
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3.5 text-sm font-bold text-gray-700 text-center"
                    >
                      Vehicle No.
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3.5 text-sm font-bold text-gray-700 text-center"
                    >
                      Mobile No.
                    </th>

                    <th
                      scope="col"
                      className="px-4 py-3.5 text-sm font-bold text-gray-700 text-center"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => {
                    return (
                      !user.blacklisted && (
                        <tr key={user.Id} className="divide-x divide-gray-200">
                          <td className="whitespace-nowrap px-2 py-2 font-bold ">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                <img
                                  className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-cover rounded"
                                  src={`data:image/jpeg;base64,` + user.vPhoto}
                                  alt="visitor Image"
                                />
                                <p className="text-sm font-medium text-gray-900">
                                  {capitalizeFirstLetter(user.vFirstName)}
                                </p>
                                <p className="text-sm font-medium text-gray-900">
                                  {capitalizeFirstLetter(user.vLastName)}
                              </p>
                              </div>
                              
                            </div>
                          </td>

                          <td className="py-2 px-6 text-sm font-medium text-gray-900 whitespace-nowrap  capitalize">
                            {user.vDateOfBirth ? user.vDateOfBirth : 'NA'}
                          </td>
                          <td className="py-2 px-6 text-sm font-medium text-gray-900 whitespace-nowrap  capitalize">
                            {user?.vAddress?.length > 20
                              ? `${user.vAddress.slice(0, 20)}...`
                              : user.vAddress}
                          </td>
                          <td className="py-2 px-6 text-sm font-medium text-gray-900 whitespace-nowrap  capitalize">
                            {user.vehicleNo ? user.vehicleNo : 'NA'}
                          </td>
                          <td className="py-2 px-6 text-sm font-medium text-gray-900 whitespace-nowrap  capitalize">
                            {user.vMobileNo}
                          </td>
                          <td className="py-2 px-6 text-sm font-medium text-gray-900 whitespace-nowrap">
                            <Link
                              to={`/UpdateVisitorForm/${user.Id}`}
                              className="bg-red-400 hover:bg-red-500 border-2 border-gray-500 rounded-lg px-4 py-2 text-grsy-900 shadow-sm text-xl"
                            >
                              Update
                            </Link>
                          </td>
                        </tr>
                      )
                    );
                  })}
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
export default UpdateVisitor;
