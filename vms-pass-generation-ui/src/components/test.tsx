
import { useEffect, useState } from "react";
import custom_axios from "../axios/AxiosSetup";
import { ApiConstants } from "../api/ApiConstants";

interface UserModel{
userId:number,
userName: string;
  shiftTime: string;
  designation: string;
  contactNumberL: number;
  contactNumberM:number;
  address: string;
  userType: string;
  photoImage: string;
}
export function Test() {
    const[users,setUsers] = useState<UserModel[]>([]);

    const[currentPage , setCurrentPage]=useState(1);

    const fetchUserData=async(pageCount)=>{
        const response = await custom_axios.get(ApiConstants.USER.FINDALL,{
            headers:{Authorization: "Bearer"+localStorage.getItem('token')},
            params:{page:pageCount,
            limit:10
            },

        })
        setUsers(response.data)
    }
    useEffect(()=>{
        fetchUserData(currentPage);
    },[currentPage])

    const HandlePageNext=()=>{
        if(users.length>0){
            setCurrentPage(currentPage+1)
        }
        
    }
    const HandlePrevious=()=>{
        if(currentPage>1){
            setCurrentPage(currentPage-1)
        }
        
    }


    
  return (
    <>
      <section className="mx-auto w-full max-w-7xl px-4 py-4">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h2 className="text-lg font-semibold">Employees</h2>
            <p className="mt-1 text-sm text-gray-700">
              This is a list of all employees. You can add new employees, edit or delete existing
              ones.
            </p>
          </div>
          <div>
            <button
              type="button"
              className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              Add new employee
            </button>
          </div>
        </div>
        <div className="mt-6 flex flex-col">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden border border-gray-200 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr className="divide-x divide-gray-200">
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-left text-sm font-normal text-gray-500"
                      >
                        <span>Employee</span>
                      </th>
                      <th
                        scope="col"
                        className="px-12 py-3.5 text-left text-sm font-normal text-gray-500"
                      >
                        Title
                      </th>

                      <th
                        scope="col"
                        className="px-4 py-3.5 text-left text-sm font-normal text-gray-500"
                      >
                        Status
                      </th>

                      <th
                        scope="col"
                        className="px-4 py-3.5 text-left text-sm font-normal text-gray-500"
                      >
                        Role
                      </th>
                      <th scope="col" className="relative px-4 py-3.5">
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {users.map((person) => (
                      <tr key={person.userId} className="divide-x divide-gray-200">
                        <td className="whitespace-nowrap px-4 py-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={person.photoImage}
                                alt=""
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{person.userName}</div>
                              <div className="text-sm text-gray-500">{person.userType}</div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-12 py-4">
                          <div className="text-sm text-gray-900">{person.designation}</div>
                          <div className="text-sm text-gray-500">{person.shiftTime}</div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-4">
                          <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-gray-700">
                            Active
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
                          {person.contactNumberL}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-medium">
                          <a href="#" className="text-gray-500 hover:text-indigo-600">
                            Edit
                          </a>
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
          <div className="mt-2 flex items-center justify-end">
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
          </div>
        </div>
      </section>
    </>
  )
}
export default Test;

// import React, { useState } from 'react';

// const Test = () => {
//   const [displayedLogs, setDisplayedLogs] = useState([
//     { id: 1, name: 'Person 1', isBlacklisted: false },
//     { id: 2, name: 'Person 2', isBlacklisted: false },
//     // Add more data as needed
//   ]);

//   const handleToggleBlacklist = (id) => {
//     setDisplayedLogs((prevLogs) =>
//       prevLogs.map((log) =>
//         log.id === id ? { ...log, isBlacklisted: !log.isBlacklisted } : log
//       )
//     );
//     console.log(id)
//   };

//   return (
//     <table className="min-w-full">
//       <thead>
//         <tr>
//           <th>Name</th>
//           <th>Action</th>
//         </tr>
//       </thead>
//       <tbody>
//         {displayedLogs.map((person) => (
//           <tr key={person.id}>
//             <td>{person.name}</td>
//             <td>
//               <button
//                 className={`${
//                   person.isBlacklisted ? 'bg-red-500' : 'bg-green-500'
//                 } text-white px-4 py-2 rounded`}
//                 onClick={() => handleToggleBlacklist(person.id)}
//               >
//                 {person.isBlacklisted ? 'Unblacklist' : 'Blacklist'}
//               </button>
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// };

// export default Test;
