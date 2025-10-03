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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element= {<Welcome/>}/>
        <Route path="/login" element= {<Login/>}/>
        <Route path="/employeepage" element={<EmployeePage/>}/>
        <Route element={<Dashboard/>}>
          <Route path="/service" element={<Service/>}/>
          <Route path="/product" element= {<Product/>}/>
          <Route path="/employee" element= {<Employee/>}/>
          <Route path="/proposal" element= {<Proposal/>}/>
          <Route path="/proposal/:id" element = {<Proposal/>}/>
          <Route path="/proposallist" element = {<ProposalList/>}/>
          <Route path="/ourclient" element = {<Client/>}/>
          
          {/* <Route path="/proposal/edit/:id" element={<ProposalForm />} /> */}
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App
