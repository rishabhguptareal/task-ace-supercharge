
import React from 'react';
import Layout from '@/components/Layout';
import TaskList from '@/components/TaskList';
import DashboardStats from '@/components/DashboardStats';
import GoogleCalendarConnect from '@/components/GoogleCalendarConnect';
import { AppProvider } from '@/context/AppContext';

const Index = () => {
  return (
    <AppProvider>
      <Layout>
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Track your tasks and improve productivity
            </p>
          </div>
          
          <DashboardStats />
          <GoogleCalendarConnect />
          <TaskList />
        </div>
      </Layout>
    </AppProvider>
  );
};

export default Index;
