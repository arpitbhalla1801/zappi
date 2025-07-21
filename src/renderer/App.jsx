import React, { useState } from 'react';
import './App.css';

const { ipcRenderer } = window.require('electron');

function App() {
  const [apps, setApps] = useState([]);
  const [status, setStatus] = useState('Ready to scan your installed applications');
  const [loading, setLoading] = useState(false);
  const [canSave, setCanSave] = useState(false);

  const scanInstalledApps = async () => {
    setStatus('⚡ Scanning installed applications...');
    setLoading(true);
    
    try {
      const installedApps = await ipcRenderer.invoke('get-installed-apps');
      setApps(installedApps);
      setStatus(`Found ${installedApps.length} installed applications`);
      setCanSave(installedApps.length > 0);
    } catch (error) {
      setStatus('❌ Error scanning applications: ' + error.message);
    }
    
    setLoading(false);
  };

  const saveAppList = async () => {
    if (apps.length === 0) {
      setStatus('❌ No apps to save. Please scan first.');
      return;
    }

    setStatus('💾 Saving application list...');
    setLoading(true);

    try {
      await ipcRenderer.invoke('save-apps', apps);
      setStatus(`✅ Saved ${apps.length} applications to your list`);
    } catch (error) {
      setStatus('❌ Error saving applications: ' + error.message);
    }

    setLoading(false);
  };

  const installSavedApps = async () => {
    setStatus('🚀 Installing saved applications...');
    setLoading(true);

    try {
      const result = await ipcRenderer.invoke('install-saved-apps');
      setStatus(`✅ Installation completed. ${result.installed || 0} apps installed, ${result.failed || 0} failed.`);
    } catch (error) {
      setStatus('❌ Error installing applications: ' + error.message);
    }

    setLoading(false);
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>Zappi ⚡</h1>
        <p>One-click software reinstallation for your new device</p>
      </div>
      
      <div className="main-content">
        <div className="feature-grid">
          <div className="feature-card">
            <h3>🔄 One-Click Install</h3>
            <p>Reinstall all your favorite software with just one click</p>
          </div>
          <div className="feature-card">
            <h3>💻 Cross-Platform</h3>
            <p>Works on Windows, macOS, and Linux systems</p>
          </div>
          <div className="feature-card">
            <h3>🧠 Smart Detection</h3>
            <p>Automatically detects installed and missing software</p>
          </div>
        </div>
        
        <div className="action-buttons">
          <button 
            className="btn btn-primary" 
            onClick={scanInstalledApps}
            disabled={loading}
          >
            Scan Installed Apps
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={saveAppList}
            disabled={!canSave || loading}
          >
            Save App List
          </button>
          <button 
            className="btn btn-primary" 
            onClick={installSavedApps}
            disabled={loading}
          >
            Install Saved Apps
          </button>
        </div>
        
        <div className="status">
          {loading && <span className="loading"></span>}
          {status}
        </div>
        
        <div className="app-list">
          {apps.map((app, index) => (
            <div key={index} className={`app-item ${app.installed ? 'installed' : 'missing'}`}>
              <span>{app.name}</span>
              <span>{app.installed ? '✅ Installed' : '❌ Missing'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
