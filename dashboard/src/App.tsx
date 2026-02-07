import React from 'react';
import { PhaseProvider } from './contexts/PhaseContext';
import { DashboardLayout } from './layouts/DashboardLayout';

function App() {
  return (
    <PhaseProvider>
      <DashboardLayout />
    </PhaseProvider>
  );
}

export default App;