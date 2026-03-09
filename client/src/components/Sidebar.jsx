import { LayoutDashboard, Cog, LayersPlus, FolderOpen, ChevronDown, Menu, X } from 'lucide-react';
import { useState } from 'react';

import './Sidebar.css';
import { useNavigate, useLocation } from 'react-router-dom';

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
