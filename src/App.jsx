import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import { Sidebar } from './components/Sidebar';
import { AppHeader } from './components/AppHeader';
import { Dashboard } from './pages/Dashboard';
import { CreateProjectNew } from './pages/CreateProjectNew';
import { ProjectDetails } from './pages/ProjectDetails';
import { Settings } from './pages/Settings';

function AppContent({ projects, setProjects, sidebarCollapsed, setSidebarCollapsed }) {
  const [currentPage, setCurrentPage] = useState('/');
  const [settings, setSettings] = useState({
    theme: localStorage.getItem('theme') || 'light',
    notifications: true,
    autoSave: true,
    timeFormat: '24h'
  });
  const location = useLocation();

  useEffect(() => {
    // Apply theme when component mounts or theme changes
    document.documentElement.setAttribute('data-theme', settings.theme);
    const accentColor = localStorage.getItem('accentColor') || '#4CAF50';
    document.documentElement.style.setProperty('--accent-color', accentColor);
  }, [settings.theme]);

  useEffect(() => {
    setCurrentPage(location.pathname);
  }, [location.pathname]);

  const toggleTheme = () => {
    setSettings(prev => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light'
    }));
  };

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
    <div style={{ display: 'flex' }}>
      <Sidebar 
        currentPage={currentPage} 
        navClick={handleSidebarMenuClick}
        onCollapsedChange={handleSidebarCollapsed}
      />

      <div style={{ 
        marginLeft: sidebarCollapsed ? '80px' : '280px', 
        minHeight: '100vh',
        transition: 'margin-left 0.3s ease',
        width: '100%',
      }}>
        {/* main content header */}
        <AppHeader settings={settings} toggleTheme={toggleTheme} />

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
            <Route 
              path="/create" 
              element={
                <CreateProjectNew 
                  onProjectCreate={addProject}
                />
              } 
            />
            <Route 
              path="/edit-project/:projectId" 
              element={
                <ProjectDetails
                  projects={projects}
                  updateProject={updateProject}
                />
              } 
            />
            <Route 
              path="/settings" 
              element={<Settings />} 
            />
          </Routes>
        </div>

      </div>
    </div>
  );
}

function App() {
  const [projects, setProjects] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <Router>
      <AppContent 
        projects={projects} 
        setProjects={setProjects}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      />
    </Router>
  );
}

export default App;
