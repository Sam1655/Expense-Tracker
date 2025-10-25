import { Route } from "react-router-dom";
import "./App.css";
import { Routes } from "react-router";
import NetWorthTracker from "./NWTracker/NetWorthTracker";

function App() {
  return (
    <>
      <Routes>
        <Route path="/NetWorthTracker" element={<NetWorthTracker />} />
      </Routes>
    </>
  );
}

export default App;
