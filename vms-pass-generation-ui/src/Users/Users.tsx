import React, { useState } from "react";
import { ApiConstants } from "../api/ApiConstants";
import custom_axios from "../axios/AxiosSetup";
import { getLoginInfo } from "../utils/LoginInfo";
import { toast } from "react-toastify";
import Pagination from "../components/Pagination";
import { useNavigate } from "react-router-dom";
interface UserModel {
  userId: number,
  userName: string;
  shiftTime: string;
  designation: string;
  contactNumberL: string;
  contactNumberM: string;
  address: string;
  userType: string;
  photoImage: string;

}

const Users = () => {
  let navigate = useNavigate();
  const [users, setUsers] = React.useState<UserModel[]>([]);
  const [filterData, setFilterData] = useState([]);
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
const [displayedLogs,setDisplayedLogs] = useState();
  const getAllUsers = async () => {
    const role = getLoginInfo()?.userType;
    if (role != null && role == "Admin") {
      const response = await custom_axios.get(ApiConstants.USER.FIND_ALL, { headers: { Authorization: "Bearer " + localStorage.getItem("token") } });
      setUsers(response.data);
      setFilterData(response.data)
    } else {
      toast.info("Forbidden Resource");
    }
  };

  React.useEffect(() => {
    if (users.length == 0) getAllUsers();
  }, []);

  const handlesearch = (event) => {
    const getSearch = event.target.value;
    if (getSearch.length > 0) {
      // const searchData= users.filter((item)=>item.vFirstName.toLowerCase().includes(getSearch));
      const searchData = users.filter((item) => {
        const lowerCaseSearch = getSearch.toLowerCase();
        return (
          item.userName.toLowerCase().includes(lowerCaseSearch) ||
          item.userId.toString().includes(getSearch) ||
          item.contactNumberL.toString().includes(getSearch) ||
          item.contactNumberM.toString().includes(getSearch)// Assuming `getSearch` is the phone number input
        );
      });
      setUsers(searchData);
    } else {
      setUsers(filterData)
    }
    setQuery(getSearch)
  }

  const entriesPerPage = 10;
  const startIndex = currentPage * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  // const displayedLogs = users.slice(startIndex, endIndex)
  React.useEffect(()=>{
    const newLogs= users.slice(startIndex,endIndex);
    setDisplayedLogs(newLogs);
  },[users,currentPage])
  const handlePageChange = (selectedPage) => {
    // console.log(`selectedPage :- ${JSON.stringify(selectedPage)}`)
    setCurrentPage(selectedPage.selected)
  }

  return (
    <>
      <section className="mx-auto w-full max-w-full px-4 py-4">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">Employees</h1>
          </div>
          <div className="flex flex-row items-center space-x-2">
            <button
              onClick={() => navigate("/adduser")}
              type="button"
              className="form-control w-full md:w-48 h-10 px-2 text-md leading-tight text-gray-900 hover:text-black border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-md text-center me-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800"
            >
              Add employee
            </button>

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
        </div>





        <div className="mt-6 flex flex-col">
          <div className="-mx-2 overflow-x-auto sm:-mx-4 lg:-mx-6">
            <div className="inline-block min-w-full py-2 align-middle md:px-4 lg:px-6">
              <div className="overflow-hidden border border-gray-200 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr className="divide-x divide-gray-200">
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-bold text-gray-700 text-center"
                      >
                        <span>Employee</span>
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-bold text-gray-700 text-center"
                      >
                        Designation
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
                        Landline No.
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-bold text-gray-700 text-center"
                      >
                        Address
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-bold text-gray-500"
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {displayedLogs?.map((user) => (
                      <tr key={user.userId} className="divide-x divide-gray-200">
                        <td className="whitespace-nowrap px-2 py-2 font-bold">
                          {/* ... Remaining code for the first column ... */}
                          <div className="flex items-center">

                            <div className="flex-shrink-0">
                              <img
                                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 object-cover rounded"
                                src={`data:image/jpeg;base64,`+user.photoImage}
                                alt="visitor Image"
                              />
                              <p className="text-sm font-medium text-gray-900">{user.userName}</p>
                              <p className="text-sm text-gray-500">{user.userType}</p>
                            </div>
                          </div>
                        </td>
                        {/* ... Remaining code for other columns ... */}
                        <td className="whitespace-nowrap px-4 py-4">
                          <div className="text-sm text-gray-500">{user.designation}</div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-4">
                            {user.contactNumberM}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4">
                            {user.contactNumberL}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
                          {user?.address?.length > 20
                          ? `${user.address.slice(0, 20)}...`
                          : user.address}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-medium">
                          <button
                            hidden={user.userType == "Admin" ? true : false}
                            onClick={async () => {
                              const response = await custom_axios.delete(ApiConstants.USER.DELETE(user.userId), { headers: { Authorization: "Bearer " + localStorage.getItem("token") } });
                              getAllUsers();
                              console.log(response.data)
                              toast.success("User Deleted Sucessfully!!");
                            }}
                            className="form-control w-full lg:w-30 h-8 px-2 mb-4 lg:mb-0 lg:mr-10 text-sm leading-tight text-gray-900 hover:text-black border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-md text-center me-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800"
                          >
                            Delete
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

        <div className="mt-4 ">
          <Pagination
            pageCount={Math.ceil(users.length / entriesPerPage)}
            onPageChange={handlePageChange}
            currentPage={currentPage}
          />
        </div>
      </section>
    </>
  )
}
export default Users;