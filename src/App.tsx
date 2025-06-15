import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import PatientForm from "./pages/PatientForm";
import Doctors from "./pages/Doctors";
import DoctorForm from "./pages/DoctorForm";
import Appointments from "./pages/Appointments";
import AppointmentForm from "./pages/AppointmentForm";
import MedicalRecords from "./pages/MedicalRecords";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { initializeSampleData } from "./lib/sampleData";

const queryClient = new QueryClient();

// Initialize sample data on app start
initializeSampleData();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Login />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
            <Route path="/patients" element={<ProtectedRoute><Layout><Patients /></Layout></ProtectedRoute>} />
            <Route path="/patients/new" element={<ProtectedRoute><Layout><PatientForm /></Layout></ProtectedRoute>} />
            <Route path="/patients/:id/edit" element={<ProtectedRoute><Layout><PatientForm /></Layout></ProtectedRoute>} />
            <Route path="/doctors" element={<ProtectedRoute><Layout><Doctors /></Layout></ProtectedRoute>} />
            <Route path="/doctors/new" element={<ProtectedRoute><Layout><DoctorForm /></Layout></ProtectedRoute>} />
            <Route path="/doctors/:id/edit" element={<ProtectedRoute><Layout><DoctorForm /></Layout></ProtectedRoute>} />
            <Route path="/appointments" element={<ProtectedRoute><Layout><Appointments /></Layout></ProtectedRoute>} />
            <Route path="/appointments/new" element={<ProtectedRoute><Layout><AppointmentForm /></Layout></ProtectedRoute>} />
            <Route path="/records" element={<ProtectedRoute><Layout><MedicalRecords /></Layout></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
