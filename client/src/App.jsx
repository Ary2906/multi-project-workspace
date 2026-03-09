import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import { Sidebar } from './components/Sidebar';
import { AppHeader } from './components/AppHeader';
import { ErrorBoundary } from './components/ErrorBoundary';
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
      id: project._id || Date.now(),
      ...project,
      archived: false,
      createdAt: new Date()
    };
    setProjects(prev => [...prev, newProject]);
  };

  const removeProject = async (id) => {
    try {
      // Delete from MongoDB
      await fetch(`http://localhost:5000/api/projects/${id}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Error deleting project:', error);
    }
    // Update local state
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const updateProject = async (id, updates) => {
    try {
      // Update in MongoDB
      await fetch(`http://localhost:5000/api/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });
    } catch (error) {
      console.error('Error updating project:', error);
    }
    // Update local state
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

  // Fetch projects from MongoDB on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/projects');
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched projects from MongoDB:', data);
          // Convert MongoDB documents to match our local format
          const formattedProjects = data.map(proj => ({
            id: proj._id || Date.now(),
            name: proj.project_name,
            description: proj.description,
            category: proj.category,
            budget: proj.budget,
            tags: proj.tags,
            project_status: proj.project_status,
            dueDate: proj.due_date,
            archived: false,
            createdAt: new Date(proj.created_at)
          }));
          setProjects(formattedProjects);
        }
      } catch (error) {
        console.error('Error fetching projects from MongoDB:', error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <AppContent 
          projects={projects} 
          setProjects={setProjects}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
        />
      </Router>
    </ErrorBoundary>
  );
}

export default App;
