import React from 'react';
import { PhaseProvider } from './contexts/PhaseContext';
import { DashboardLayout } from './layouts/DashboardLayout';
import { DashboardHome } from './pages/DashboardHome';

function App() {
  return (
    <PhaseProvider>
      <DashboardLayout>
        <DashboardHome />
      </DashboardLayout>
    </PhaseProvider>
  );
}

export default App;