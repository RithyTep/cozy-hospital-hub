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
import NotFound from "./pages/NotFound";
import { initializeSampleData } from "./lib/sampleData";

const queryClient = new QueryClient();

// Initialize sample data on app start
initializeSampleData();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/patients" element={<Layout><Patients /></Layout>} />
          <Route path="/patients/new" element={<Layout><PatientForm /></Layout>} />
          <Route path="/patients/:id/edit" element={<Layout><PatientForm /></Layout>} />
          <Route path="/doctors" element={<Layout><Doctors /></Layout>} />
          <Route path="/doctors/new" element={<Layout><DoctorForm /></Layout>} />
          <Route path="/doctors/:id/edit" element={<Layout><DoctorForm /></Layout>} />
          <Route path="/appointments" element={<Layout><Appointments /></Layout>} />
          <Route path="/appointments/new" element={<Layout><AppointmentForm /></Layout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
