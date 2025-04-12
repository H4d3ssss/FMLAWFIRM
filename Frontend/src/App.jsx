import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  Navbar,
  Calendar,
  Sidebar,
  Footer,
  LoginForm,
  RegisterForm,
} from "./components";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/dashboard" element={<Calendar />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
