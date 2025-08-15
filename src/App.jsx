import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Form from './pages/Form';
import Admin from './pages/Admin'; 
import SubmissionSuccess from "./pages/SubmissionSuccess";
import { ToastContainer } from "react-toastify";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/form" element={<Form />} />
        <Route path="/admin" element={<Admin />} /> 
        <Route path="/submission-success" element={<SubmissionSuccess />} />
      </Routes>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        toastClassName={() =>
          "relative flex p-6 rounded-lg bg-black text-white shadow-lg"
        }
        bodyClassName={() => "text-sm font-orbitron tracking-wide"}
        progressClassName="bg-primary-red"
      />
    </BrowserRouter>
  );
}

export default App;
