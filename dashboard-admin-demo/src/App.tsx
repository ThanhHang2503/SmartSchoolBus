import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import MainLayout from "./layouts/MainLayout";
import AdminDashboard from "./pages/adminDashboard";

// import Dashboard from "./pages/Dashboard";
// import Map from "./pages/Map";
// import Users from "./pages/Users";
// import Reports from "./pages/Reports";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminDashboard/>} /> 
        {/* <Route element={<MainLayout />}>
          
          
        </Route> */}
        
      </Routes>
    </Router>
  );
}

export default App;
