import { useState } from 'react';
import './Settings.css';

export const Settings = () => {
  const [settings, setSettings] = useState({
    theme: 'light',
    notifications: true,
    autoSave: true,
    timeFormat: '24h'
  });

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
          <h3>Appearance</h3>
          <div className="settings-item">
            <label htmlFor="theme">Theme</label>
            <select 
              id="theme" 
              name="theme" 
              value={settings.theme}
              onChange={handleSelectChange}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
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
