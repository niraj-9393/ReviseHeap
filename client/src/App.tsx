import { Route, Routes } from "react-router-dom"
import LandingPage from "./pages/Landingpage"
import Login from "./pages/Login"
import Signup from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import ImportConsent from "./pages/ImportConsent"
import ImportUpload from "./pages/ImportUpload"

function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<LandingPage/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/import" element={<ImportConsent />} />
      <Route path="/dashboard/import/upload" element={<ImportUpload />} />
    </Routes>
    </>
  )
}

export default App