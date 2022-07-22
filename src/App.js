import './App.css';
import Login from './Components/Auth/login';
import React, { Component } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import axios from 'axios';
import SignUp from './Components/Auth/signup';
import Success from './Components/Auth/success';
import GeneralState from './Context/General/GeneralState';
import { ProtectedRoute, UnProtectedRoute , AdminProtectedRoute } from './protectedRoute';
import Dashboard from './Components/dashboard/dashboard';
import NavBar from './Components/General/NavBar';
import AuthState from './Context/Auth/AuthState';
import ProvideCombinedContext from './Context/CombinedContext';
import AdminLogin from './Components/adminAuth/adminLogin';
import AdminSignUp from './Components/adminAuth/adminSignup';
import AdminDashboard from './Components/dashboard/adminDashboard';
import Category from './Components/Cars/Category';
import Cars from './Components/Cars/Cars';
import CarDetail from './Components/Cars/CarDetail';
import AddCar from './Components/Cars/AddCar';
import AlertBar from './Components/General/Alert';
import Wallet from './Components/Profile/Wallet';
import Otp from './Components/Profile/Otp';
import Profile from './Components/Profile/Profile';

export default class AppClass extends Component {
  render() {
    return (
      <>
        <GeneralState>
          <AuthState>
          <ProvideCombinedContext>
          <BrowserRouter>
          <NavBar />
          <AlertBar />
            <Routes>
              <Route exact path="/login" element={<UnProtectedRoute> <Login /> </UnProtectedRoute>} />
              <Route exact path="/signup" element={<UnProtectedRoute> <SignUp /> </UnProtectedRoute>} />
              <Route exact path="/success" element={<Success />} />
              <Route exact path="/adminLogin" element={<UnProtectedRoute> <AdminLogin /> </UnProtectedRoute>} />
              <Route exact path="/adminSignup" element={<UnProtectedRoute> <AdminSignUp /> </UnProtectedRoute>} />
              <Route exact path="/dashboard" element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>} />
              <Route exact path="/adminDashboard" element={<AdminProtectedRoute> <AdminDashboard /> </AdminProtectedRoute>} />
              <Route exact path="/cars" element={<ProtectedRoute> <Cars /> </ProtectedRoute>} />
              <Route exact path="/cardetail/:id" element={<ProtectedRoute> <CarDetail /> </ProtectedRoute>} />
              <Route exact path="/profile" element={<ProtectedRoute> <Profile /> </ProtectedRoute>} />
              <Route exact path="/profile/wallet" element={<ProtectedRoute> <Wallet /> </ProtectedRoute>} />
              <Route exact path="/profile/wallet/otp" element={<ProtectedRoute> <Otp /> </ProtectedRoute>} />
              <Route exact path="/carCategory" element={<AdminProtectedRoute> <Category /> </AdminProtectedRoute>} />
              <Route exact path="/addCar" element={<AdminProtectedRoute> <AddCar /> </AdminProtectedRoute>} />
              <Route exact path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </BrowserRouter>
          </ProvideCombinedContext>
          </AuthState>
        </GeneralState>
      </>
    )
  }
}


axios.interceptors.request.use(function (config) {
  if(config.url.slice(0,4)!=='http'){
    config.url = 'http://localhost:5000' + config.url
  }
  const token = localStorage.getItem('access_token');
  config.headers.Authorization = 'Bearer ' + token;
  return config;
});

axios.interceptors.response.use(function (config, error) {
  return config;
}, error => {
  if (error.response && error.response.status === 401) {
    let url;
    if(localStorage.getItem('isAdmin')==='true'){
      url='/adminAuth/refresh'
    }else{
      url='/auth/refresh'
    }
    return axios.post(url, { 'refresh_token': localStorage.getItem('refresh_token') }).then(response => {
      if (response.data && response.data.success) {
        localStorage.setItem('access_token', response.data.user.access_token);

        error.response.config.headers['Authorization'] = 'Bearer ' + response.data.user.access_token;
        return axios.request(error.response.config);
      } else {
        //redirect to login page
      }
    }).catch(error => {
      //redirect to login page
      console.log(error);
      return error;
    })
  }
});
