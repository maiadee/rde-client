import { Routes, Route } from "react-router";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";

function App() {
  return (
    <>
      <main>
        <Routes>
          <Route path="/auth/login/" element={<Login />} />
          <Route path="/auth/signup/" element={<Signup />} />
        </Routes>
    </main>
    </>
  )
}

export default App
