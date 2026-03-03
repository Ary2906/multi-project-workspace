import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';



function App() {
 
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [projects, setProjects] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSidebarMenuClick = (page) => {
    setCurrentPage(page);
  }

  const handleSidebarCollapsed = (collapsed) => {
    setSidebarCollapsed(collapsed);
  }

  const addProject = (project) => {
    const newProject = {
      id: Date.now(),
      ...project,
      archived: false,
      createdAt: new Date()
    };
    setProjects(prev => [...prev, newProject]);
  };

  const removeProject = (id) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const updateProject = (id, updates) => {
    setProjects(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  return (
    <Router>
      <div>
        <Sidebar 
          currentPage={currentPage} 
          navClick={handleSidebarMenuClick}
          onCollapsedChange={handleSidebarCollapsed}
        />

        <div style={{ 
          marginLeft: sidebarCollapsed ? '80px' : '280px', 
          minHeight: '100vh',
          transition: 'margin-left 0.3s ease'
        }}>
          {/* main content header */}
          <div style={{ padding: '20px', borderBottom: '1px solid #e0e5f2' }}>
            <h1>{currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}</h1>
          </div>

          {/* main content body */}
          <div>
            <Routes>
              <Route 
                path="/" 
                element={
                  <Dashboard 
                    projects={projects}
                    removeProject={removeProject}
                    updateProject={updateProject}
                    status="all"
                  />
                } 
              />
              <Route
                path="/projects/all"
                element={
                  <Dashboard
                    projects={projects}
                    removeProject={removeProject}
                    updateProject={updateProject}
                    status="all"
                  />
                }
              />
              <Route
                path="/projects/active"
                element={
                  <Dashboard
                    projects={projects}
                    removeProject={removeProject}
                    updateProject={updateProject}
                    status="active"
                  />
                }
              />
              <Route
                path="/projects/archived"
                element={
                  <Dashboard
                    projects={projects}
                    removeProject={removeProject}
                    updateProject={updateProject}
                    status="archived"
                  />
                }
              />
              <Route path="/create" element={<div>Create Project Page (to be implemented)</div>} />
              <Route path="/settings" element={<div>Settings Page (to be implemented)</div>} />
            </Routes>
          </div>

        </div>

      </div>
    </Router>
  );
}

export default App;
