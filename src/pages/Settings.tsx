
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useAppContext } from '@/context/AppContext';
import { Calendar, Clock, Download, RefreshCcw, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/context/AuthContext';

const Settings = () => {
  const { state, connectGoogleCalendar, disconnectGoogleCalendar, exportUserData, importUserData } = useAppContext();
  const { updateProfile } = useAuth();
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [exportedData, setExportedData] = useState('');
  const [importData, setImportData] = useState('');
  
  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      localStorage.removeItem('productivityApp');
      toast.success('All data has been cleared. Refreshing...');
      setTimeout(() => window.location.reload(), 1500);
    }
  };
  
  const handleExport = () => {
    const data = exportUserData();
    setExportedData(data);
    setExportDialogOpen(true);
  };
  
  const handleImport = () => {
    if (!importData.trim()) {
      toast.error('Please provide data to import');
      return;
    }
    
    const success = importUserData(importData);
    if (success) {
      setImportDialogOpen(false);
      setImportData('');
    }
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(exportedData)
      .then(() => toast.success('Data copied to clipboard'))
      .catch(() => toast.error('Failed to copy data'));
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
              <CardTitle className="flex items-center">
                <Download className="mr-2 h-5 w-5 text-primary" />
                Data Management
              </CardTitle>
              <CardDescription>
                Export or import your tasks and settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    variant="outline" 
                    onClick={handleExport}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export Data
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setImportDialogOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Import Data
                  </Button>
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
      
      {/* Export Dialog */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Export Your Data</DialogTitle>
            <DialogDescription>
              Copy the data below and save it securely.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea 
              value={exportedData}
              readOnly
              className="h-[200px] font-mono text-xs"
            />
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setExportDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={copyToClipboard}>
              Copy to Clipboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Import Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Import Data</DialogTitle>
            <DialogDescription>
              Paste your previously exported data below.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea 
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              className="h-[200px] font-mono text-xs"
              placeholder="Paste your exported data here..."
            />
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setImportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleImport}>
              Import Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Settings;
