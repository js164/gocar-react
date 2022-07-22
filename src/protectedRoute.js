import React from "react";
import { Navigate  } from "react-router-dom";


export const ProtectedRoute = ({ children }) => {
  if (localStorage.getItem('access_token') && localStorage.getItem('refresh_token')) {
    if(localStorage.getItem('isAdmin')==='true' && children[1].type.name==='Dashboard'){
      return <Navigate to="/adminDashboard" />;
    }
    return children;
  }
  return <Navigate to="/login" />;
};



export const UnProtectedRoute = ({ children }) => {
  if (localStorage.getItem('access_token') && localStorage.getItem('refresh_token')) {
    return <Navigate to="/dashboard" />;
  }
  return children;
};


export const AdminProtectedRoute = ({ children }) => {
  if (localStorage.getItem('access_token') && localStorage.getItem('refresh_token') && localStorage.getItem('isAdmin')==='true') {
    return children;
  }
  return <Navigate to="/adminLogin" />;
};