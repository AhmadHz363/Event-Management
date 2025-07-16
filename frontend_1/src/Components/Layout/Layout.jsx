import React from "react";
import { useSidebar } from "../../Contexts/SidebarContext";
import AppNavbar from "./LayoutCompnents/Navbar";
import AppSidebar from "./LayoutCompnents/Sidebar";
import AppFooter from "./LayoutCompnents/Footer";
import "./Layout.css";

const Layout = ({ children }) => {
  const { isSidebarOpen } = useSidebar();

  return (
    <div className="app-container">
      <AppNavbar />
      
      <div className="main-content-wrapper">
        <AppSidebar />
        
        <main className="main-content">
          <div className="content-wrapper">{children}</div>
          <AppFooter />
        </main>
        
        {isSidebarOpen && <div className="sidebar-overlay" />}
      </div>
    </div>
  );
};

export default Layout;