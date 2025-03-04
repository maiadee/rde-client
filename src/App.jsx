import { Routes, Route } from "react-router";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import NavMenu from "./components/Nav/Nav";
import Homepage from "./components/Homepage/Homepage";
import AllTalent from "./components/TalentIndex/TalentIndex";
import TalentProfile from "./components/TalentShow/TalentShow";
import CreateProposal from "./components/CreateProposal/CreateProposal";
import AllProposals from "./components/ProposalIndex/ProposalIndex";
import UpdateProposal from "./components/UpdateProposal/UpdateProposal";

function App() {
  return (
    <>
      <main>
        <NavMenu />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/talent" element={<AllTalent />} />
          <Route path="/talent/:talentId" element={<TalentProfile />} />
          <Route path="/proposal/user" element={<AllProposals />} />
          <Route path="/proposal/admin" element={<AllProposals />} />
          <Route path="/proposal" element={<CreateProposal />} />
          <Route path="/proposal/:proposalId/update" element={<UpdateProposal />} />
          <Route path="/auth/login/" element={<Login />} />
          <Route path="/auth/signup/" element={<Signup />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
