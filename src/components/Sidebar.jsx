import { LayoutDashboard, Cog, LayersPlus, FolderOpen, ChevronDown, Menu, X } from 'lucide-react';
import { useState } from 'react';

import './Sidebar.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { PlusCircle, Moon, Sun } from 'lucide-react';

const AppHeader = ({ settings, toggleTheme }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const pageTitle = location.pathname.replace('/', '').replace(/-/g, ' ') || 'dashboard';

    return (
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
                <h1 className="text-2xl font-bold capitalize">{pageTitle}</h1>
                <p className="text-[var(--text-muted)]">Welcome back, here's what's happening today.</p>
            </div>
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--accent)]"
                >
                    {settings.theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>
                <button onClick={() => navigate('/create')} className="btn-primary flex items-center gap-2">
                    <PlusCircle size={18} /> <span>New Project</span>
                </button>
            </div>
        </header>
    );
};

export default AppHeader;


export const Sidebar = ({ currentPage, navClick, onCollapsedChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  

  const handleCollapseToggle = (collapsed) => {
    setIsCollapsed(collapsed);
    if (onCollapsedChange) {
      onCollapsedChange(collapsed);
    }
  };

  const menuItems = [
    { label: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    {
      label: 'Projects',
      path: '/projects',
      icon: <FolderOpen size={20} />,
      children: [
        { label: 'All Projects', path: '/projects/all' },
        { label: 'Active', path: '/projects/active' },
        { label: 'Archived', path: '/projects/archived' }
      ]
    },
    { label: 'Create Project', path: '/create', icon: <LayersPlus size={20} /> },
    { label: 'Settings', path: '/settings', icon: <Cog size={20} /> }
  ];

  const SidebarItem = ({ item }) => {
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.path}>
        <button
          className={`sidebar-link ${currentPage === item.path ? 'active' : ''}`}
          onClick={() => {
            if (hasChildren) {
              setExpandedMenu(expandedMenu === item.path ? null : item.path);
            } else {
              navigate(item.path);
              navClick && navClick(item.path);
              setIsOpen(false);
            }
          }}
          title={item.label}
        >
          {item.icon}
          <span className={isCollapsed ? 'hidden' : ''}>{item.label}</span>
          {hasChildren && !isCollapsed && (
            <ChevronDown
              size={16}
              className={`chevron ${expandedMenu === item.path ? 'expanded' : ''}`}
            />
          )}
        </button>
        {hasChildren && expandedMenu === item.path && !isCollapsed && (
          <div className="sidebar-submenu">
            {item.children.map(child => (
              <button
                key={child.path}
                className={`sidebar-link submenu-link ${
                  currentPage === child.path ? 'active' : ''
                }`}
                onClick={() => {
                  navigate(child.path);
                  navClick && navClick(child.path);
                  setIsOpen(false);
                }}
                title={child.label}
              >
                <span>{child.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <aside className={`sidebar ${isOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <h2 className={isCollapsed ? 'hidden' : ''}>Zenith</h2>
          <button 
            className="sidebar-toggle"
            onClick={() => handleCollapseToggle(!isCollapsed)}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <SidebarItem key={item.label} item={item} />
          ))}
        </nav>
      </aside>

      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />}
    </>
  );
};
