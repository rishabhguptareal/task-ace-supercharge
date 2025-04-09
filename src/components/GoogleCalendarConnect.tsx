
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Calendar as CalendarIcon } from 'lucide-react';

const GoogleCalendarConnect: React.FC = () => {
  const { connectGoogleCalendar, disconnectGoogleCalendar, state } = useAppContext();
  
  return (
    <div className="mb-6">
      {state.isGoogleCalendarConnected ? (
        <Alert className="bg-green-50 border-green-200">
          <div className="flex justify-between items-center">
            <div>
              <AlertTitle className="text-green-800 flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" /> Google Calendar Connected
              </AlertTitle>
              <AlertDescription className="text-green-700">
                Your tasks can now be synced with Google Calendar for better scheduling.
              </AlertDescription>
            </div>
            <Button 
              variant="outline" 
              className="border-green-300 text-green-700 hover:bg-green-100" 
              onClick={disconnectGoogleCalendar}
            >
              Disconnect
            </Button>
          </div>
        </Alert>
      ) : (
        <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <div className="text-center space-y-3">
            <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto" />
            <div>
              <h3 className="text-lg font-medium">Connect Google Calendar</h3>
              <p className="text-gray-500 mb-4 max-w-md mx-auto">
                Connect your Google Calendar to sync tasks and get reminders for upcoming deadlines.
              </p>
              <Button 
                onClick={connectGoogleCalendar}
                className="google-calendar-button"
              >
                <svg 
                  className="h-5 w-5" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                >
                  <path d="M21.56 10.738l-9.04-8.058c-0.262-0.233-0.602-0.362-0.954-0.362-0.796 0-1.44 0.644-1.44 1.44v4.5c-4.502 0.122-8.126 3.859-8.126 8.412 0 0.902 0.25 1.76 0.68 2.522 0.396 0.697 1.136 1.101 1.916 1.101 0.894 0 1.707-0.573 1.996-1.422 0.601-1.744 2.253-3.042 4.199-3.042h1.336v4.648c0 0.795 0.644 1.44 1.44 1.44 0.352 0 0.692-0.128 0.954-0.362l9.039-8.058c0.523-0.467 0.523-1.284 0-1.751z"></path>
                </svg>
                Connect with Google Calendar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleCalendarConnect;
