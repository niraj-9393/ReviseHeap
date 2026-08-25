import { Route, Routes } from "react-router-dom"
import LandingPage from "./pages/Landingpage"
import Login from "./pages/Login"
import Signup from "./pages/Register"
import Dashboard from "./pages/Dashboard"

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<LandingPage/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
    </>
  )
}

export default App