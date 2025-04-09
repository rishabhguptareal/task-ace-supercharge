
import React from 'react';
import Layout from '@/components/Layout';
import { useAppContext } from '@/context/AppContext';
import { Card } from '@/components/ui/card';
import { CalendarIcon, Clock, Target } from 'lucide-react';
import { Calendar as CalendarUI } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

const CalendarPage = () => {
  const { state } = useAppContext();
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
  
  // Filter tasks for the selected date
  const tasksForSelectedDate = selectedDate
    ? state.tasks.filter(task => {
        if (!task.dueDate) return false;
        const taskDate = new Date(task.dueDate);
        return (
          taskDate.getDate() === selectedDate.getDate() &&
          taskDate.getMonth() === selectedDate.getMonth() &&
          taskDate.getFullYear() === selectedDate.getFullYear()
        );
      })
    : [];
    
  // Create a function to check if a date has tasks
  const hasTasksOnDate = (date: Date) => {
    return state.tasks.some(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });
  };
  
  // Custom day render to highlight days with tasks
  const renderDay = (day: Date) => {
    const hasTasks = hasTasksOnDate(day);
    return (
      <div className={`relative ${hasTasks ? 'font-bold' : ''}`}>
        {day.getDate()}
        {hasTasks && (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
        )}
      </div>
    );
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-muted-foreground">
            View and manage your scheduled tasks
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card className="p-4">
              <div className="mb-4 flex items-center">
                <CalendarIcon className="mr-2 h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Calendar</h2>
              </div>
              <CalendarUI
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border w-full"
                components={{
                  Day: ({ day }) => renderDay(day),
                }}
              />
              
              <div className="mt-4 text-sm text-gray-500">
                {state.isGoogleCalendarConnected ? (
                  <div className="flex items-center text-green-600">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    <span>Connected to Google Calendar</span>
                  </div>
                ) : (
                  <div>Connect Google Calendar for better scheduling</div>
                )}
              </div>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Card className="p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center">
                  <Target className="mr-2 h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">
                    Tasks for {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Selected Date'}
                  </h2>
                </div>
              </div>
              
              {tasksForSelectedDate.length === 0 ? (
                <div className="text-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <p className="text-gray-500">No tasks scheduled for this date</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tasksForSelectedDate.map(task => (
                    <div 
                      key={task.id} 
                      className={`p-3 rounded-md border ${
                        task.completed 
                          ? 'bg-gray-50 border-gray-200' 
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input 
                            type="checkbox"
                            checked={task.completed}
                            readOnly
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <span className={`ml-2 ${
                            task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                          }`}>
                            {task.title}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-xs text-gray-500">
                            {task.duration} min
                          </span>
                          
                          {task.priority && (
                            <Badge 
                              className={`ml-2 ${
                                task.priority === 'high' 
                                  ? 'bg-red-100 text-red-800'
                                  : task.priority === 'medium'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {task.priority}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {task.description && (
                        <p className="text-sm text-gray-600 mt-1 ml-6">
                          {task.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CalendarPage;
