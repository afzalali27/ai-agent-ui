import React from "react";
import "regenerator-runtime/runtime";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import AIChatAgent from "./AIChatAgent";

const App: React.FC = () => (
  <div className="app-container">
    <AIChatAgent />
    <ToastContainer />
  </div>
);


export default App;
