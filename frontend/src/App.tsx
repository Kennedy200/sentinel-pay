import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import About from './components/About/About';
import FAQ from './components/FAQ/FAQ';
import Footer from './components/Footer/Footer';
import Docs from './pages/Docs/Docs';
import Signup from './pages/Auth/Signup';
import Login from './pages/Auth/Login';
import PrivateRoute from './components/PrivateRoute';
import DashboardLayout from './pages/Dashboard/DashboardLayout';
import Overview from './pages/Dashboard/Overview/Overview';
import BehavioralDNA from './pages/Dashboard/DNA/BehavioralDNA';
import Simulator from './pages/Dashboard/Simulator/Simulator';
import RiskLogs from './pages/Dashboard/Logs/RiskLogs';
import Settings from './pages/Dashboard/Settings/Settings';
import DeveloperHub from './pages/Dashboard/Developer/DeveloperHub'; // ADDED THIS IMPORT

// Component that holds the entire landing page
const LandingPage = () => (
  <>
    <Header />
    <About />
    <FAQ />
    <Footer />
  </>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* --- PROTECTED DASHBOARD ROUTES --- */}
        
        {/* 1. Dashboard Overview */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <DashboardLayout><Overview /></DashboardLayout>
          </PrivateRoute>
        } />

        {/* 2. Behavioral DNA Profile Page */}
        <Route path="/dashboard/dna" element={
          <PrivateRoute>
            <DashboardLayout><BehavioralDNA /></DashboardLayout>
          </PrivateRoute>
        } />

        {/* 3. Transaction Simulator Page */}
        <Route path="/dashboard/simulator" element={
          <PrivateRoute>
            <DashboardLayout><Simulator /></DashboardLayout>
          </PrivateRoute>
        } />

        {/* 4. Risk Logs Page */}
        <Route path="/dashboard/logs" element={
          <PrivateRoute>
            <DashboardLayout><RiskLogs /></DashboardLayout>
          </PrivateRoute>
        } />

        {/* 5. Profile & Security Settings Page */}
        <Route path="/dashboard/settings" element={
          <PrivateRoute>
            <DashboardLayout><Settings /></DashboardLayout>
          </PrivateRoute>
        } />

        {/* 6. Developer Hub Page (NEWLY ADDED ROUTE) */}
        <Route path="/dashboard/developer" element={
          <PrivateRoute>
            <DashboardLayout><DeveloperHub /></DashboardLayout>
          </PrivateRoute>
        } />

      </Routes>
    </Router>
  );
}

export default App;