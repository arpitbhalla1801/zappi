const os = require('os');
const { exec } = require('child_process');
const util = require('util');
const fs = require('fs');
const path = require('path');

const execAsync = util.promisify(exec);

/**
 * Scans for installed applications based on the current OS
 * @returns {Promise<Array>} Array of app objects with name and installed status
 */
async function scanApps() {
  const platform = os.platform();
  console.log(`[scanApps] Scanning apps for platform: ${platform}`);
  try {
    switch (platform) {
      case 'darwin':
        return await scanMacApps();
      case 'win32':
        return await scanWindowsApps();
      case 'linux':
        return await scanLinuxApps();
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  } catch (error) {
    console.error('Error scanning apps:', error);
    // Also log error to a file for user inspection
    try {
      const cwd = process.cwd();
      console.error('[scanApps] Current working directory:', cwd);
      fs.appendFileSync('scan-error.log', `[${new Date().toISOString()}] Error scanning apps: ${error && error.stack ? error.stack : error}\n`);
    } catch (logErr) {
      console.error('[scanApps] Failed to write scan-error.log:', logErr);
    }
    return getSampleApps(); // Return sample data for demo
  }
}

async function scanMacApps() {
  try {
    const { stdout } = await execAsync('ls /Applications');
    const apps = stdout
      .split('\n')
      .filter(app => app.trim() && app.endsWith('.app'))
      .map(app => ({
        name: app.replace('.app', ''),
        installed: true,
        platform: 'darwin'
      }));
    
    return apps.slice(0, 20); // Limit to first 20 for demo
  } catch (error) {
    return getSampleMacApps();
  }
}

async function scanWindowsApps() {
  try {
    let shortcutApps = [];
    const startMenuDirs = [
      `${process.env['ProgramData']}\\Microsoft\\Windows\\Start Menu\\Programs`,
      `${process.env['APPDATA']}\\Microsoft\\Windows\\Start Menu\\Programs`
    ];
    for (const dir of startMenuDirs) {
      try {
        const { stdout } = await execAsync(`powershell -NoProfile -Command \"Get-ChildItem -Path '${dir}' -Recurse -Filter *.lnk | ForEach-Object { $_.BaseName }\"`);
        shortcutApps = shortcutApps.concat(stdout.split('\n').map(f => f.trim()).filter(f => f.length > 0));
      } catch (e) { /* ignore */ }
    }
    // Deduplicate
    const allAppsSet = new Set(shortcutApps);
    const allApps = Array.from(allAppsSet).map(app => ({
      name: app,
      installed: true,
      platform: 'win32'
    }));
    if (allApps.length > 0) return allApps;
    return getSampleWindowsApps();
  } catch (error) {
    return getSampleWindowsApps();
  }
}

async function scanLinuxApps() {
  try {
    const desktopDirs = [
      '/usr/share/applications',
      path.join(os.homedir(), '.local/share/applications')
    ];
    let apps = [];
    for (const dir of desktopDirs) {
      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir).filter(f => f.endsWith('.desktop'));
        apps = apps.concat(
          files.map(f => ({
            name: f.replace('.desktop', ''),
            installed: true,
            platform: 'linux'
          }))
        );
      }
    }
    if (apps.length > 0) return apps;
    return getSampleLinuxApps();
  } catch (error) {
    return getSampleLinuxApps();
  }
}

// Sample data for demo purposes
function getSampleApps() {
  const platform = os.platform();
  switch (platform) {
    case 'darwin':
      return getSampleMacApps();
    case 'win32':
      return getSampleWindowsApps();
    case 'linux':
      return getSampleLinuxApps();
    default:
      return [
        { name: 'Visual Studio Code', installed: true, platform: 'unknown' },
        { name: 'Google Chrome', installed: true, platform: 'unknown' },
        { name: 'Spotify', installed: false, platform: 'unknown' }
      ];
  }
}

function getSampleMacApps() {
  return [
    { name: 'Visual Studio Code', installed: true, platform: 'darwin' },
    { name: 'Google Chrome', installed: true, platform: 'darwin' },
    { name: 'Spotify', installed: true, platform: 'darwin' },
    { name: 'Slack', installed: true, platform: 'darwin' },
    { name: 'Terminal', installed: true, platform: 'darwin' },
    { name: 'Finder', installed: true, platform: 'darwin' },
    { name: 'Safari', installed: true, platform: 'darwin' },
    { name: 'Discord', installed: false, platform: 'darwin' },
    { name: 'Adobe Photoshop', installed: false, platform: 'darwin' },
    { name: 'Microsoft Office', installed: false, platform: 'darwin' }
  ];
}

function getSampleWindowsApps() {
  return [
    { name: 'Visual Studio Code', installed: true, platform: 'win32' },
    { name: 'Google Chrome', installed: true, platform: 'win32' },
    { name: 'Microsoft Office', installed: true, platform: 'win32' },
    { name: 'Adobe Photoshop', installed: true, platform: 'win32' },
    { name: 'Steam', installed: true, platform: 'win32' },
    { name: 'Discord', installed: true, platform: 'win32' },
    { name: 'Spotify', installed: false, platform: 'win32' },
    { name: 'Slack', installed: false, platform: 'win32' },
    { name: 'VLC Media Player', installed: false, platform: 'win32' },
    { name: 'Git', installed: false, platform: 'win32' }
  ];
}

function getSampleLinuxApps() {
  return [
    { name: 'firefox', installed: true, platform: 'linux' },
    { name: 'code', installed: true, platform: 'linux' },
    { name: 'git', installed: true, platform: 'linux' },
    { name: 'vim', installed: true, platform: 'linux' },
    { name: 'curl', installed: true, platform: 'linux' },
    { name: 'wget', installed: true, platform: 'linux' },
    { name: 'chromium', installed: false, platform: 'linux' },
    { name: 'spotify', installed: false, platform: 'linux' },
    { name: 'discord', installed: false, platform: 'linux' },
    { name: 'slack', installed: false, platform: 'linux' }
  ];
}

module.exports = { scanApps };
