import { BrowserRouter, Route, Routes } from "react-router-dom"
import Welcome from "./components/Welcome"
import Service from "./pages/Service"
import Product from "./pages/Product"
import Employee from "./pages/Employee"
import Proposal from "./pages/Proposal"
import Dashboard from "./components/Dashboard"
import ProposalList from "./components/ProposalList"
import Client from "./components/Client"
import Login from "./pages/Login"
import EmployeePage from "./components/EmployeePage"
import ForgetPassword from "./components/ForgetPassword"
import Recycle from "./pages/Recycle"
import EmployeeClientsDashboard from "./pages/Employeeclient"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element= {<Welcome/>}/>
        <Route path="/login" element= {<Login/>}/>
        <Route path="/forgetpassword" element= {<ForgetPassword/>}/>
        <Route path="/employeepage" element={<EmployeePage/>}/>
        <Route element={<Dashboard/>}>
          <Route path="/recycle" element= {<Recycle/>}/>
          <Route path="/service" element={<Service/>}/>
          <Route path="/product" element= {<Product/>}/>
          <Route path="/employee" element= {<Employee/>}/>
          <Route path="/proposal" element= {<Proposal/>}/>
          <Route path="/proposal/:id" element = {<Proposal/>}/>
          <Route path="/proposallist" element = {<ProposalList/>}/>
          <Route path="/ourclient" element = {<Client/>}/>
          <Route path="/employeeclient" element={<EmployeeClientsDashboard/>}/>
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App
