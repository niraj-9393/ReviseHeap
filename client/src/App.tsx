import { Route, Routes } from "react-router-dom"
import LandingPage from "./pages/Landingpage"
import Login from "./pages/Login"
import Signup from "./pages/Register"

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<LandingPage/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/signup" element={<Signup />} />
    </Routes>
    </>
  )
}

export default App