# Zenith - Personal Multi-Project Workspace

A comprehensive React-based workspace management application built with React Router, localStorage persistence, and advanced theming capabilities. Perfect for managing multiple projects with budget tracking, prioritization, and categorization.

## 🎯 Features

### Core Features
- **Multi-Project Management**: Create, organize, and manage multiple projects with unique budgets and categories
- **Persistent Data**: All data is stored locally using localStorage with automatic synchronization
- **Dark/Light Mode**: Toggle between light and dark themes with smooth transitions
- **Custom Color Theming**: Choose from preset colors or create custom accent colors
- **Responsive Design**: Mobile-first approach with full mobile, tablet, and desktop support
- **Advanced Filtering**: Filter projects by category, status (Active/Archived), and search terms
- **Budget Tracking**: Monitor budget allocation, spending, and remaining funds with visual progress bars

### Navigation & UI
- **Multi-level Sidebar**: Hierarchical menu with expandable project categories
- **Hamburger Menu**: Mobile-responsive menu that collapses on small screens
- **Breadcrumb Navigation**: Visual navigation path showing your current location
- **Active Link Highlighting**: Clear indication of which section you're currently viewing
- **Smooth Transitions**: CSS-based animations for theme changes and menu interactions

### Projects & Workspaces
- **Project Creation**: Multi-step form with validation for project setup
- **Budget Management**: Set budgets, track spending, and see remaining funds
- **Categories**: Organize projects by Work, Personal, Side Hustle, Education, or Other
- **Priority Levels**: Mark projects as Low, Medium, or High priority
- **Status Management**: Keep projects Active or Archive them for later reference
- **Archive/Restore**: Easily archive projects without deleting them

### Dashboard Overview
- **Quick Stats**: View total projects, budget, spending, and remaining funds at a glance
- **Recent Projects**: See your most recently created projects
- **Budget Overview**: Visual bar chart showing spending across all projects
- **Category Breakdown**: See how many projects exist in each category
- **Over-Budget Alerts**: Visual indicators when you've exceeded your budget

## 🚀 Quick Start

### Installation

1. Clone or download the project
2. Install dependencies:
```bash
npm install
```

### Development

Start the development server:
```bash
npm run dev
```

The application will open at `http://localhost:5173/`

### Build

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── components/
│   ├── Breadcrumbs.jsx          # Navigation breadcrumbs
│   ├── ProjectForm.jsx          # Create/edit projects
│   ├── ProjectForm.css          # Form styling
│   ├── Sidebar.jsx              # Main navigation sidebar
│   └── Sidebar.css              # Responsive sidebar styles
├── hooks/
│   └── useLocalStorage.js       # Custom hook for localStorage
├── pages/
│   ├── Dashboard.jsx            # Main dashboard overview
│   ├── Dashboard.css            # Dashboard styling
│   ├── ProjectList.jsx          # Projects grid view
│   ├── ProjectList.css          # Projects grid styling
│   ├── Settings.jsx             # Settings & preferences
│   └── Settings.css             # Settings styling
├── styles/
│   ├── index.css                # Main global styles
│   └── theme.css                # CSS variables & theming
├── App.jsx                      # Router setup & main app
└── main.jsx                     # App entry point
```

## 🎨 Theming & Customization

### CSS Variables

The application uses CSS variables for complete theming control. Edit [src/styles/theme.css](src/styles/theme.css) to modify:

- `--bg-primary`: Main background color
- `--bg-sidebar`: Sidebar background
- `--text-main`: Primary text color
- `--accent`: Primary accent color
- `--border`: Border colors
- `--sidebar-width`: Sidebar width on desktop

### Theme Toggle

Switch between Light and Dark modes using the button in the header. Your preference is automatically saved.

### Custom Colors

In Settings, choose from preset colors (Indigo, Purple, Blue, Green, Rose) or create your own custom color using the color picker.

## 📱 Responsive Behavior

The application is fully responsive:

- **Desktop (≥769px)**: Fixed sidebar on the left, full content area
- **Tablet & Mobile (<769px)**: Hamburger menu that slides out, full-width content

## 🔧 Technologies Used

- **React 18**: UI component framework
- **React Router v6**: Client-side routing
- **Lucide React**: Icon library
- **CSS Variables**: Dynamic theming
- **localStorage API**: Data persistence
- **Vite**: Build tool & dev server

## 💾 Data Storage

All project data is stored in your browser's localStorage under the key `zenith_projects`. 

**Note**: 
- Data is stored locally on your device only
- Clearing browser data will delete all projects
- Data is not synced across browsers or devices
- No data is sent to external servers

## 🎯 User Stories Implemented

1. **Smart Navigation**: Multi-level responsive sidebar with active state highlighting
2. **Project Architect**: Form with real-time validation for project creation
3. **Memory Feature**: LocalStorage persistence for projects and preferences
4. **Aesthetic Shift**: Dark/Light mode with smooth transitions and custom colors
5. **Organized Architecture**: Create workspaces with budget limits and categories
6. **Seamless Navigator**: Hierarchical menu that works on all devices
7. **Never-Lost Session**: Automatic persistence of all settings and data
8. **Dashboard Overview**: Quick view of all projects and budget status

## 🎮 Usage Guide

### Creating a Project

1. Click "Create Project" in sidebar or dashboard
2. Fill in:
   - **Project Name**: Required, must be unique
   - **Budget**: Required, must be positive number
   - **Category**: Choose from predefined categories
   - **Priority**: Set task importance level
3. Click "Create Workspace"
4. You'll be redirected to the All Projects view

### Managing Projects

- **View All**: Go to Projects > All Projects
- **Active Only**: Go to Projects > Active
- **Archived**: Go to Projects > Archived
- **Search**: Use the search box in the projects view
- **Filter**: Select category to filter results
- **Archive**: Click Archive button to move to archived section
- **Restore**: Click Restore to move back to active
- **Delete**: Click Delete to permanently remove

### Dashboard

- View your total budget and spending
- See budget allocation across projects
- Quick access to recent projects
- Category breakdown

### Settings

- Toggle Dark/Light mode
- Choose custom accent colors
- Reset to default settings
- View app information

## 📄 License

This project is open source and available for personal and commercial use.

---

**Version**: 1.0.0  
**Last Updated**: February 2026  
**Built with**: React, React Router, Lucide Icons, Vite
