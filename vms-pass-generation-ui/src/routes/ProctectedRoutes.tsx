import jwt_decode, { JwtPayload } from "jwt-decode";
import React from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
interface MyToken {
  name: string;
  exp: number;
  address: string;
  designation: string;
  iat: number;
  indexId: number;
  userId: number;
  userName: string;
  userType: string
}

const ProtectedRoute = (props: any) => {
  const token = localStorage.getItem("token");
  if (token != null) {
    const decodedToken = jwt_decode<MyToken>(token);
    //console.log(decodedToken);
    const currentTime = Date.now() / 1000;
    const isTokenExpired = decodedToken.exp < currentTime;
    if (isTokenExpired) {
      return <div><Navigate to="/"></Navigate>;
        {toast.info('your sessionn has expired please login again!')}
      </div>
    }
  }
  if (token == undefined) {
    return <div><Navigate to="/loginPage"></Navigate>;
    {toast.warn('please login first')}
    </div>
  }

  return props.children;
};

export default ProtectedRoute;