import React from 'react';
import { Container, Navbar } from 'react-bootstrap';
import { useSidebar } from '../../../Contexts/SidebarContext';
const AppFooter = () => {
  const { isSidebarOpen } = useSidebar();
  return (
    <Navbar className={`app-footer ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <Container fluid className="footer-container">
        <div className="footer-content">
          <span className="footer-text">
            &copy; {new Date().getFullYear()}{' '}
            <span className="system-name">Event Management system</span>
          </span>
          
        </div>
      </Container>
    </Navbar>
  );
};

export default AppFooter;