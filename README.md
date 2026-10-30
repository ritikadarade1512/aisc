# AI Practical Hub (aisc)

A lightweight, responsive, offline-first website featuring a Google-inspired minimalist search engine interface designed to provide immediate access and one-click download for 15 Python practical programs.

---

## 📁 Project Structure

```text
python-practical-hub/
│
├── index.html            # Google-style minimalist search homepage
├── style.css             # 100% offline styling (no external CDNs or Google Fonts)
├── script.js             # Client-side search, suggestions, and ZIP download logic
├── manifest.json         # Progressive Web App (PWA) manifest
├── service-worker.js     # Cache-first service worker with GitHub Pages support
├── README.md             # Documentation and GitHub Pages deployment guide
│
├── assets/
│   └── logo.svg          # Clean vector branding with Google-inspired colors
│
└── downloads/
    └── [ORIGINAL ZIP]    # Place your original Python practicals ZIP file here
```

---

## 🚀 How to Add Your Original ZIP File

1. Place your original ZIP file containing your 15 Python practical programs into the `downloads/` folder:
   ```text
   python-practical-hub/downloads/<your_zip_file>.zip
   ```
2. If your ZIP file is named `python_practicals.zip`, it is automatically detected.
3. If your ZIP file has a different name (e.g., `Practicals_Sem5.zip`):
   - Open `script.js` and update `CONFIG.zipPath`:
     ```javascript
     const CONFIG = {
       zipPath: 'downloads/Practicals_Sem5.zip',
       defaultZipName: 'Practicals_Sem5.zip'
     };
     ```
   - Open `service-worker.js` and update `OPTIONAL_ASSETS`:
     ```javascript
     const OPTIONAL_ASSETS = [
       './downloads/Practicals_Sem5.zip'
     ];
     ```

---

## 🌐 Features

- **Google-Inspired Search Engine UI**: Clean white background, centered typography, familiar pill-shaped search bar, and authentic button styling.
- **"Try Again" Download Button**: Immediately triggers the browser download of the original ZIP file without requiring login, backend, or external API calls.
- **Client-Side Search**: Instant autocomplete and search matching across the 15 practical program topics, completely offline.
- **100% Offline-First (PWA)**: Powered by a Service Worker with a cache-first strategy. Once loaded, the site and ZIP downloads work with no internet connection.
- **Local File System Compatible**: Works directly by opening `index.html` in any browser (`file:///` protocol) without requiring a web server or breaking.
- **Zero External Dependencies**: No CDNs, no external fonts, no third-party JavaScript libraries.

---

## 🧪 Verification & Testing Checklist

- [x] **Homepage Interface**: Minimalist Google-inspired design with centered logo and search bar.
- [x] **Search Box**: Interactive typing, clear ("X") button, Enter key handling, and suggestion dropdown.
- [x] **Download Action**: Clicking "Try Again" initiates browser download of the original archive.
- [x] **Preservation of Code**: No Python programs generated or modified; waits for your original archive.
- [x] **Offline Functionality**: Tested with Service Worker Cache API.
- [x] **Local Execution**: Directly openable via local file path (`file://.../index.html`).
- [x] **Responsive Layout**: Fluidly adapts across mobile, tablet, and desktop viewports.

---

## 🚢 GitHub Pages Deployment Guide

Deploying this repository to GitHub Pages is completely free and requires zero backend:

1. **Create/Open Repository**:
   Create a new public repository on GitHub:
   👉 [https://github.com/ritikadarade1512/aisc](https://github.com/ritikadarade1512/aisc)

2. **Commit & Push Files**:
   Push the contents of this folder to the repository's `main` branch:
   ```bash
   git init
   git add .
   git commit -m "Initial release of AI Practical Hub"
   git branch -M main
   git remote add origin https://github.com/ritikadarade1512/aisc.git
   git push -u origin main
   ```

3. **Deploy on Vercel (Recommended)**:
   - Go to [vercel.com](https://vercel.com) → Sign in with GitHub.
   - Click **Add New Project** → Import `aisc` repo → Click **Deploy**.
   - Your site will be live at:
     `https://aisc.vercel.app`

4. **Or enable GitHub Pages**:
   - Go to your repo on GitHub → **Settings** > **Pages**.
   - Select Branch: `main` and Folder: `/ (root)` → Click **Save**.
   - Your site will be live at:
     `https://ritikadarade1512.github.io/aisc/`
   - All asset paths are relative (`./`), ensuring proper loading regardless of subdirectory routing.
   - The Service Worker scope is `./`, ensuring caching works seamlessly under GitHub Pages subdirectories.
