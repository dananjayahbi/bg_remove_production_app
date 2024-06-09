import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Home from "./Pages/Home";
import "./App.css";

const App = () => {
  const isLogged = window.localStorage.getItem("LoggedIn");

  return (
    <>
      <Routes>
        {isLogged ? (
          <Route path="*" element={<Home />} />
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  )
}

export default App