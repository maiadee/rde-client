import { Routes, Route } from "react-router";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import NavMenu from "./components/Nav/Nav";
import Homepage from "./components/Homepage/Homepage";

function App() {
  return (
    <>
      <main>
        <NavMenu />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/auth/login/" element={<Login />} />
          <Route path="/auth/signup/" element={<Signup />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
