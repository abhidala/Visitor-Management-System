import React, { useEffect, useState } from "react";
// import NewNavBar from "../components/NewNavbar";
import custom_axios from "../axios/AxiosSetup";
import { getLoginInfo } from "../utils/LoginInfo";
import { ApiConstants } from "../api/ApiConstants";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import Footer from "../components/Footer";

const ChangePassword = () => {
  let navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loggedInUserId, setLoggedInUserId] = useState<number | undefined>(
    undefined
  );
  const [looggedInUserType, setLoggedInUserType] = useState<string | undefined>();

  useEffect(() => {
    const userInfo = getLoginInfo();
    const userId = userInfo?.userId;
    setLoggedInUserId(userId);
    setLoggedInUserType(userInfo?.userType);
  }, []);
  const HandleSubmit = async () => {
    const userId = getLoginInfo()?.userId;

    if (userId) {
      try {
        await custom_axios.put(ApiConstants.LOGInOutReports.LOGOUT(userId), {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        });
        localStorage.removeItem("token");
        navigate("/loginPage");
      } catch (error) {
        alert("something went wrong , try again");
      }
    }
  };
  //   const userInfo = getLoginInfo();
  //   const loggedInUserId = userInfo?.userId || ''; // Use the userId from the decoded token
  //  console.log(loggedInUserId)
  const handleChangePassword = async () => {
    // Perform client-side validation
    if (!newPassword || !confirmNewPassword) {
      alert("Please fill in both password fields.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      if (loggedInUserId === undefined) {
        alert("Please log in to change you password");
        return;
      }
      // Make the PATCH API request to update the user password by user ID
      const response = await custom_axios.patch(
        ApiConstants.USER.UPDATE(loggedInUserId, "self"),
        {
          password: newPassword,
        }
      );

      // Check the response status
      if (response.status === 200) {
        toast.success("Password changed successfully!");
        HandleSubmit();
        // navigate("/visitors");

        // Optionally, you can redirect the user to a different page after successful password change
      } else {
        alert("Failed to change password. Please try again.");
      }
    } catch (error) {
      // Handle any errors that occurred during the API request
      alert("An error occurred while changing the password.");
      console.error(error);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-center mt-10">
        <div className="w-full mb-24 max-w-lg">
          <div className="bg-blue-300 border-2 border-gray-700 shadow-2xl rounded px-12 mt-10 pt-6 pb-8 mb-4">
            <div className="mb-4 ">
              <label className="block text-gray-700 text-base font-bold mb-2" htmlFor="password">
                New Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="password"
                placeholder="Password..."
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-base font-bold mb-2" htmlFor="confirmPassword">
                Confirm New Password
              </label>
              <input
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                type="password"
                placeholder="Confirm..."
              />
            </div>
            <div className="flex items-center justify-center">
              <button
                onClick={handleChangePassword}
                className="w-full lg:w-1/2 md:w-2/4 sm:w-3/6 border-white border-2 px-4 py-2 font-bold text-white bg-black rounded-lg hover:bg-blue-700 focus:outline-none focus:shadow-outline"
              >
                Submit
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
