import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Form from './pages/Form';
import Admin from './pages/Admin'; // ✅ Add this line

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/form" element={<Form />} />
        <Route path="/admin" element={<Admin />} /> {/* ✅ Add this route */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
