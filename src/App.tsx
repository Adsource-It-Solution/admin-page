import { BrowserRouter, Route, Routes } from "react-router-dom"
import Welcome from "./components/Welcome.tsx"
import Service from "./pages/Service"
import Product from "./pages/Product"
import Employee from "./pages/Employee"
import Proposal from "./pages/Proposal"
import Dashboard from "./components/Dashboard.tsx"
// import Proposalpagepdf from "./components/Proposalpagepdf.tsx"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element= {<Welcome/>}/>
        <Route element={<Dashboard/>}>
          <Route path="/service" element={<Service/>}/>
          <Route path="/product" element= {<Product/>}/>
          <Route path="/employee" element= {<Employee/>}/>
          <Route path="/proposal" element= {<Proposal/>}/>
          {/* <Route path="/pdf" element= {<Proposalpagepdf/>}/> */}
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App
