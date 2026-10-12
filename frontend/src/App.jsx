import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import { ToastProvider } from './components/ToastNotification';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import AddTask from './pages/AddTask';
import EditTask from './pages/EditTask';
import TaskDetails from './pages/TaskDetails';

function NotFound() {
  return (
    <main className="page-content" style={{ textAlign: 'center', paddingTop: '4rem' }}>
      <p style={{ fontSize: '4rem' }}>🔍</p>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--gray-800)', margin: '1rem 0 0.5rem' }}>
        404 — Page Not Found
      </h1>
      <p style={{ color: 'var(--gray-500)' }}>
        The page you're looking for doesn't exist.
      </p>
      <a href="/" className="btn btn-primary" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
        ← Go Home
      </a>
    </main>
  );
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BrowserRouter>
      <ToastProvider>
        <div className="app-layout">
          {/* Sidebar (desktop persistent, mobile drawer) */}
          <Sidebar
            mobileOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          {/* Main content area */}
          <div className="main-content">
            {/* Mobile top navbar */}
            <Navbar onMenuToggle={() => setSidebarOpen((prev) => !prev)} />

            {/* Page routes */}
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/tasks/new" element={<AddTask />} />
              <Route path="/tasks/:id" element={<TaskDetails />} />
              <Route path="/tasks/:id/edit" element={<EditTask />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </ToastProvider>
    </BrowserRouter>
  );
}
