
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAppContext } from '@/context/AppContext';
import { Clock, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';

const DashboardStats: React.FC = () => {
  const { state } = useAppContext();
  
  // Calculate stats for today
  const todayTasks = state.tasks.filter(task => {
    if (!task.dueDate) return false;
    const taskDate = new Date(task.dueDate);
    const today = new Date();
    return (
      taskDate.getDate() === today.getDate() &&
      taskDate.getMonth() === today.getMonth() &&
      taskDate.getFullYear() === today.getFullYear()
    );
  });
  
  const completedTasks = todayTasks.filter(task => task.completed);
  const completionPercentage = todayTasks.length > 0
    ? Math.round((completedTasks.length / todayTasks.length) * 100)
    : 0;
  
  // Calculate total time spent today
  const totalTimeSpentToday = state.tasks.reduce((total, task) => {
    return total + (task.timeSpent || 0);
  }, 0);
  
  // Convert minutes to hours and minutes
  const hours = Math.floor(totalTimeSpentToday / 60);
  const minutes = totalTimeSpentToday % 60;
  
  // Calculate percentage toward 14-hour goal
  const hourGoal = 14 * 60; // 14 hours in minutes
  const timePercentage = Math.min(Math.round((totalTimeSpentToday / hourGoal) * 100), 100);
  
  // Determine if user has achieved the goal
  const achievedGoal = completionPercentage >= 80 && totalTimeSpentToday >= hourGoal;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <CheckCircle2 className="h-4 w-4 mr-1 text-primary" />
            Tasks Completed
          </CardTitle>
          <CardDescription>Today's progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {completedTasks.length}/{todayTasks.length}
          </div>
          <Progress value={completionPercentage} className="h-2 mt-2" />
          <div className="text-xs text-muted-foreground mt-1">
            {completionPercentage}% complete
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Clock className="h-4 w-4 mr-1 text-primary" />
            Time Worked
          </CardTitle>
          <CardDescription>Today's progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {hours}h {minutes}m
          </div>
          <Progress value={timePercentage} className="h-2 mt-2" />
          <div className="text-xs text-muted-foreground mt-1">
            {timePercentage}% of 14 hour goal
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <CalendarIcon className="h-4 w-4 mr-1 text-primary" />
            Upcoming
          </CardTitle>
          <CardDescription>Tasks due soon</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {state.tasks.filter(t => !t.completed).length}
          </div>
          <div className="text-xs text-muted-foreground mt-3">
            {state.isGoogleCalendarConnected 
              ? "Google Calendar connected" 
              : "Connect Google Calendar for better scheduling"}
          </div>
        </CardContent>
      </Card>
      
      {achievedGoal && (
        <Card className="md:col-span-3 bg-gradient-to-r from-green-50 to-blue-50 border-green-200 animate-pulse-success">
          <CardContent className="p-6 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-xl font-bold text-green-700 mb-2">
                🎉 Congratulations! 🎉
              </h3>
              <p className="text-green-600">
                You have made it to super 30 by harkirat and aced AIR 7 in DAIICT entrance exam 2025!
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardStats;
