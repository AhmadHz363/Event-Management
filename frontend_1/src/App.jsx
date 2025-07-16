import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Pages/AuthenticationPages/Login";
import { SidebarProvider } from "./Contexts/SidebarContext";
import { AuthProvider } from "./Contexts/AuthContext";
import ProtectedRoute from "./Contexts/ProtectedRoute";
import Dashboard from "./Pages/Dashboard/dashboard";
import HomePage from "./Pages/Home";
import "./App.css";
import AllEvents from "./Pages/Events/All_Events";
import CreateEventPage from "./Pages/Events/CreateEventPage";
import EditEvent from "./Pages/Events/Edit_Event";

function App() {
  return (
    <AuthProvider>
      <SidebarProvider>
        <Router>
          <Routes>
            {/* Public route */}
            <Route path="/" element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<HomePage />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/Events" element={<AllEvents/>}/>
                <Route path="/Events/create" element={<CreateEventPage/>}/>
                <Route path="/Events/:id/edit" element={<EditEvent />} />

              </Route>
            </Route>
          </Routes>
        </Router>
      </SidebarProvider>
    </AuthProvider>
  );
}

export default App;
