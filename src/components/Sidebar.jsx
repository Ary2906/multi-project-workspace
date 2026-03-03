import { LayoutDashboard, Cog, LayersPlus, FolderOpen, ChevronDown, Menu, X } from 'lucide-react';
import { useState } from 'react';
import './Sidebar.css';

export const Sidebar = ({ currentPage, navClick, onCollapsedChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleCollapseToggle = (collapsed) => {
    setIsCollapsed(collapsed);
    if (onCollapsedChange) {
      onCollapsedChange(collapsed);
    }
  };

  const menuItems = [
    { label: 'Dashboard', page: 'dashboard', icon: <LayoutDashboard size={20} /> },
    {
      label: 'Projects',
      path: '/projects',
      icon: <FolderOpen size={20} />,
      children: [
        { label: 'All Projects', path: '/projects/all', page: 'projects-all' },
        { label: 'Active', path: '/projects/active', page: 'projects-active' },
        { label: 'Archived', path: '/projects/archived', page: 'projects-archived' }
      ]
    },
    { label: 'Create Project', page: 'create', icon: <LayersPlus size={20} /> },
    { label: 'Settings', page: 'settings', icon: <Cog size={20} /> }
  ];

  const SidebarItem = ({ item }) => {
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.page || item.path}>
        <button
          className={`sidebar-link ${currentPage === item.page ? 'active' : ''}`}
          onClick={() => {
            if (hasChildren) {
              setExpandedMenu(expandedMenu === item.path ? null : item.path);
            } else {
              navClick(item.page);
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
                key={child.page}
                className={`sidebar-link submenu-link ${
                  currentPage === child.page ? 'active' : ''
                }`}
                onClick={() => {
                  navClick(child.page);
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
