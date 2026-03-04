import { useState, useEffect } from 'react';
import './Settings.css';

export const Settings = () => {
  const [settings, setSettings] = useState({
    theme: localStorage.getItem('theme') || 'light',
    accentColor: localStorage.getItem('accentColor') || '#4CAF50',
    notifications: true,
    autoSave: true,
    timeFormat: '24h'
  });

  const ACCENT_COLORS = [
    '#4CAF50', // Green
    '#2196F3', // Blue
    '#FF5722', // Red
    '#FF9800', // Orange
    '#FFC107', // Amber
    '#E91E63', // Pink
    '#9C27B0', // Purple
    '#00BCD4', // Cyan
  ];

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', settings.theme);
    document.documentElement.style.setProperty('--accent-color', settings.accentColor);
    
    // Save to localStorage
    localStorage.setItem('theme', settings.theme);
    localStorage.setItem('accentColor', settings.accentColor);
  }, [settings.theme, settings.accentColor]);

  const handleThemeChange = (theme) => {
    setSettings(prev => ({
      ...prev,
      theme
    }));
  };

  const handleAccentColorChange = (color) => {
    setSettings(prev => ({
      ...prev,
      accentColor: color
    }));
  };

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    console.log('Settings saved:', settings);
    // Add actual save logic here (localStorage, API call, etc.)
  };

  return (
    <div className="settings-container">
      <div className="settings-card">
        <h2>Settings</h2>
        
        <div className="settings-section">
          <h3>Appearance & Interface</h3>
          
          {/* Theme Selection */}
          <div className="settings-item">
            <label>Theme</label>
            <div className="theme-buttons">
              <button
                type="button"
                className={`theme-btn ${settings.theme === 'light' ? 'active' : ''}`}
                onClick={() => handleThemeChange('light')}
              >
                ☀️ Light
              </button>
              <button
                type="button"
                className={`theme-btn ${settings.theme === 'dark' ? 'active' : ''}`}
                onClick={() => handleThemeChange('dark')}
              >
                🌙 Dark
              </button>
              <button
                type="button"
                className={`theme-btn ${settings.theme === 'system' ? 'active' : ''}`}
                onClick={() => handleThemeChange('system')}
              >
                ⚙️ System
              </button>
            </div>
          </div>

          {/* Accent Color Selection */}
          <div className="settings-item">
            <label>Accent Color</label>
            <div className="color-palette">
              {ACCENT_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`color-btn ${settings.accentColor === color ? 'active' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleAccentColorChange(color)}
                  title={color}
                />
              ))}
            </div>
          </div>

          <div className="settings-item">
            <label htmlFor="timeFormat">Time Format</label>
            <select 
              id="timeFormat" 
              name="timeFormat" 
              value={settings.timeFormat}
              onChange={handleSelectChange}
            >
              <option value="24h">24 Hour</option>
              <option value="12h">12 Hour</option>
            </select>
          </div>
        </div>

        <div className="settings-section">
          <h3>Notifications</h3>
          <div className="settings-item toggle">
            <label htmlFor="notifications">Enable Notifications</label>
            <input
              type="checkbox"
              id="notifications"
              checked={settings.notifications}
              onChange={() => handleToggle('notifications')}
            />
          </div>
        </div>

        <div className="settings-section">
          <h3>General</h3>
          <div className="settings-item toggle">
            <label htmlFor="autoSave">Auto Save</label>
            <input
              type="checkbox"
              id="autoSave"
              checked={settings.autoSave}
              onChange={() => handleToggle('autoSave')}
            />
          </div>
        </div>

        <button className="btn-save" onClick={handleSave}>
          Save Settings
        </button>
      </div>
    </div>
  );
};
