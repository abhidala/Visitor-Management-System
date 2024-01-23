import React from 'react';
import Logo from '../images/logo/LOGO.png';
import loginImg from '../images/logo/login1.jpg'
import { useNavigate } from 'react-router-dom';
import { ApiConstants } from "../api/ApiConstants";
import custom_axios from "../axios/AxiosSetup";
import { toast } from "react-toastify";

const LoginPage = () => {
  let navigate = useNavigate();
  let userName: any = React.useRef();
  let password: any = React.useRef();

  const loginApp = async () => {
    if (userName.current.value == "" || password.current.value == "") {
      toast.info("Please fill the information");
      return;
    }
    try {
      const response = await custom_axios.post(ApiConstants.LOGIN, {
        userName: userName.current.value,
        password: password.current.value,
      });
      if (response?.data?.token) {
        console.log('reached')
        localStorage.setItem("token", response.data.token);
        dispatchEvent(new Event("storage"));
        navigate("/visitors");
      } else {
        console.log('else part')
        toast.error('Invalid Credentials!')
      }
    } catch (error: any) {
      if (error.response.status == 401) toast.warn(error.response.data.message);
    }

    // navigate("/");   
  };
  return (
    <section className="min-h-screen min-w-screen bg-gray-50 dark:bg-gray-900 bg-cover bg-center overflow-hidden" style={{ backgroundImage: `url(${loginImg})` }}>
      <div className="flex flex-col items-center justify-center px-4 sm:px-8 py-4 sm:py-8 md:py-12 lg:py-16">
        <a href="/loginPage" className="flex items-center text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
          <img className="w-32 h-24 sm:w-40 sm:h-30" src={Logo} alt="logo" />
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border mt-10 md:mt-8 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 opacity-90">
          <div className="p-4 sm:p-6 space-y-4 md:space-y-6">
            <h1 className="text-xl sm:text-2xl font-bold leading-tight tracking-tight text-black text-center">
              Login in to your account
            </h1>
              <label htmlFor="username" className="block mb-1 text-sm font-medium text-black">UserName</label>
              <input
                ref={userName}
                type="username"
                name="userName"
                value={userName.current?.value}
                onChange={(e) => (userName.current.value = e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Username"
                required
              />
              <label htmlFor="password" className="block mb-1 text-sm font-medium text-black">Password</label>
              <input
                ref={password}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline"
                value={password.current?.value}
                onChange={(e) => (password.current.value = e.target.value)}
                type="password"
                placeholder="Password"
                name="password"
                autoComplete="current-password"
                required
              />
            <button onClick={loginApp} className="w-full text-white bg-primary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary dark:hover:bg-primary dark:focus:ring-primary-800">
              Sign in
            </button>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <span className="font-bold p-3 text-xl text-blue-600 flex justify-center items-center gap-2">
          <img src={Logo} className="mr-2 sm:mr-5 ml-2 sm:ml-10 h-10 sm:h-27 w-40 sm:w-35" alt="logo" />
          <p className="text-center text-gray-500 text-sm sm:text-lg">
            Fax: +91-11-41519898 Email: support@elkostaindia.com, www.elkostaindia<br />
            101 - Mercantile House, K.G. Marg, New Delhi - 110001, ph.: +91-11-41519899
          </p>
        </span>
      </div>
    </section>
  );
}
export default LoginPage;