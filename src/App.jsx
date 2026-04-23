import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Register from './pages/Register';
import LoanApply from './pages/LoanApply';
import Approval from './pages/Approval';
import Payments from './pages/Payments';
import Interest from './pages/Interest';
import Reports from './pages/Reports';
import Support from './pages/Support';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/loan-apply" element={<LoanApply />} />
            <Route path="/approval" element={<Approval />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/interest" element={<Interest />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/support" element={<Support />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AppProvider>
  );
}
