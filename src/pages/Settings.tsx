
import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useAppContext } from '@/context/AppContext';
import { Calendar, Clock, RefreshCcw, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const Settings = () => {
  const { state, connectGoogleCalendar, disconnectGoogleCalendar } = useAppContext();
  
  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      localStorage.removeItem('productivityApp');
      toast.success('All data has been cleared. Refreshing...');
      setTimeout(() => window.location.reload(), 1500);
    }
  };
  
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Configure your productivity app
          </p>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-primary" />
                Calendar Integration
              </CardTitle>
              <CardDescription>
                Connect with Google Calendar to sync your tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
              <div>Google Calendar</div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={state.isGoogleCalendarConnected}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      connectGoogleCalendar();
                    } else {
                      disconnectGoogleCalendar();
                    }
                  }}
                />
                <span>{state.isGoogleCalendarConnected ? 'Connected' : 'Disconnected'}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-primary" />
                Focus Timer Settings
              </CardTitle>
              <CardDescription>
                Configure your focus session preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>Play sound when timer ends</div>
                  <Switch defaultChecked />
                </div>
                <div className="flex justify-between items-center">
                  <div>Show desktop notifications</div>
                  <Switch defaultChecked />
                </div>
                <div className="flex justify-between items-center">
                  <div>Auto-start breaks</div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-red-600">
                <RefreshCcw className="mr-2 h-5 w-5" />
                Reset Application
              </CardTitle>
              <CardDescription>
                Clear all your data and start fresh
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm">
                  This will delete all your tasks, statistics, and settings. This action cannot be undone.
                </p>
                <Button 
                  variant="destructive" 
                  onClick={clearAllData}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear All Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
