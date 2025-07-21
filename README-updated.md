# Zappi ⚡

Zappi is a cross-platform desktop utility that helps you reinstall your previously used software on a new device with **one click**. Designed for ease of use and speed, Zappi makes setting up a fresh machine as effortless as possible.

## 🚀 Features

- 🔄 One-click reinstallation of your favorite tools and apps
- 📦 Save and manage your personal software list
- 💻 Cross-platform support (Windows, macOS, Linux)
- ☁️ Cloud sync for backed-up app lists
- 🧠 Smart detection of installed and missing software
- ✨ Clean, friendly UI for a smooth experience

## 🛠 Tech Stack

- **Frontend**: Electron.js + React
- **Backend**: Node.js with optional Python scripts
- **Database**: LocalStorage / Cloud sync (e.g., Supabase or Firebase)
- **Packaging**: Electron Forge

## 📥 Installation

```bash
# Clone the repo
git clone https://github.com/arpitbhalla1801/zappi.git
cd zappi

# Install dependencies
npm install

# Run the app
npm start
```

## 🏗️ Development

```bash
# Install development dependencies (if not already installed)
npm install

# Run in development mode
npm run dev

# Build the renderer process (React components)
npm run build-renderer

# Build for distribution
npm run build

# Create distributable packages
npm run dist
```

## 📁 Project Structure

```
zappi/
├── public/
│   └── index.html          # Main HTML file for Electron
├── src/
│   ├── renderer/           # React frontend components
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.js
│   ├── main/               # Electron main process
│   │   ├── main.js         # Main Electron entry point
│   │   ├── ipcHandlers.js  # IPC communication handlers
│   │   └── osDetection.js  # OS detection utilities
│   └── utils/              # Shared utilities
│       ├── appScanner.js   # Application scanning logic
│       ├── appInstaller.js # Application installation logic
│       └── db.js           # Local database management
├── package.json
├── electron-builder.yml    # Electron Builder configuration
├── webpack.config.js       # Webpack configuration for React
└── README.md
```

## 📚 Usage

1. **Launch Zappi**: Run `npm start` or use the built application
2. **Scan Apps**: Click "Scan Installed Apps" to detect your current software
3. **Save List**: Click "Save App List" to store your application list locally
4. **Install Apps**: Click "Install Saved Apps" to reinstall your saved applications on a new device

## 🔧 How It Works

### Application Scanning
- **macOS**: Scans `/Applications` directory for installed apps
- **Windows**: Uses PowerShell and WMI to query installed programs
- **Linux**: Supports multiple package managers (apt, dnf, pacman)

### Application Installation
- **macOS**: Uses Homebrew and Homebrew Cask
- **Windows**: Uses Windows Package Manager (winget) and Chocolatey
- **Linux**: Uses system package managers (apt, dnf, pacman)

### Data Storage
- Apps are stored locally in `~/.zappi/apps.json`
- Includes metadata like installation status, platform, and timestamps
- Future versions will support cloud sync

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request for improvements or features.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test the changes: `npm start`
5. Commit your changes: `git commit -am 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## 📄 License

MIT License

## ⚠️ Security Notice

This application has the ability to install software on your system. Always review the software list before installation and ensure you trust the sources. The current implementation includes safety measures and simulated installations for demonstration purposes.

---

Built with ❤️ for developers who want to set up their new machines quickly and efficiently.
