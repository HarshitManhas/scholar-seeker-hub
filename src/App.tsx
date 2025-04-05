
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from 'sonner';
import { AuthProvider } from './hooks/useAuth';
import ScholarshipDetail from './pages/ScholarshipDetail';
import { seedScholarships } from './data/mockScholarships';

function App() {
  useEffect(() => {
    // Seed the database with mock scholarships on app startup
    seedScholarships();
  }, []);
  
  return (
    <ThemeProvider defaultTheme="system" storageKey="theme">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/scholarship/:id" element={<ScholarshipDetail />} />
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
