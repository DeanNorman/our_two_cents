import React from 'react';
import { DashboardLayout } from './layouts/DashboardLayout';
import { DashboardHome } from './pages/DashboardHome';

function App() {
  return (
    <DashboardLayout>
      <DashboardHome />
    </DashboardLayout>
  );
}

export default App;