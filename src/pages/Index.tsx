
import React, { Suspense } from 'react';
import Layout from '@/components/Layout';
import TaskList from '@/components/TaskList';
import DashboardStats from '@/components/DashboardStats';
import GoogleCalendarConnect from '@/components/GoogleCalendarConnect';
import { AppProvider } from '@/context/AppContext';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/AuthContext';

const LoadingSkeleton = () => (
  <div className="space-y-6">
    <Skeleton className="h-[200px] w-full rounded-lg" />
    <Skeleton className="h-[100px] w-full rounded-lg" />
    <Skeleton className="h-[300px] w-full rounded-lg" />
  </div>
);

const Index = () => {
  const { state: authState } = useAuth();

  return (
    <AppProvider>
      <Layout>
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">
              Welcome, {authState.user?.name || 'User'}
            </h1>
            <p className="text-muted-foreground">
              Track your tasks and improve productivity
            </p>
          </div>
          
          <Suspense fallback={<LoadingSkeleton />}>
            <DashboardStats />
            <GoogleCalendarConnect />
            <TaskList />
          </Suspense>
        </div>
      </Layout>
    </AppProvider>
  );
};

export default Index;
