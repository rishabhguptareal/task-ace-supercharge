
import React from 'react';
import Layout from '@/components/Layout';
import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, LineChart, PieChart, XAxis, YAxis, Tooltip, Legend, Bar, Line, Pie, Cell, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';

const Analytics = () => {
  const { state } = useAppContext();
  
  // Prepare data for last 7 days
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    
    const stats = state.dailyStats.find(stat => stat.date === dateStr) || {
      date: dateStr,
      totalTasksCompleted: 0,
      totalTimeWorked: 0,
      taskCompletionPercentage: 0
    };
    
    return {
      date: format(date, 'MMM dd'),
      tasksCompleted: stats.totalTasksCompleted,
      hoursWorked: Math.round(stats.totalTimeWorked / 60 * 10) / 10, // Convert minutes to hours with 1 decimal
      completionRate: stats.taskCompletionPercentage
    };
  });
  
  // Prepare data for task categories
  const tasksByCategory = state.tasks.reduce((acc, task) => {
    const category = task.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category]++;
    return acc;
  }, {} as Record<string, number>);
  
  const categoryData = Object.entries(tasksByCategory).map(([name, value]) => ({
    name,
    value
  }));
  
  // Prepare data for priority distribution
  const tasksByPriority = state.tasks.reduce((acc, task) => {
    if (!acc[task.priority]) {
      acc[task.priority] = 0;
    }
    acc[task.priority]++;
    return acc;
  }, {} as Record<string, number>);
  
  const priorityData = Object.entries(tasksByPriority).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }));
  
  // Define chart colors
  const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f97316', '#ec4899'];
  
  // Calculate overall stats
  const totalTasks = state.tasks.length;
  const completedTasks = state.tasks.filter(task => task.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const totalTimeSpent = state.tasks.reduce((total, task) => total + (task.timeSpent || 0), 0);
  const totalHoursSpent = Math.round(totalTimeSpent / 60 * 10) / 10; // Convert to hours with 1 decimal
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">
            Track your productivity and task completion metrics
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTasks}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {completedTasks} completed ({completionRate}%)
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Time Tracked</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalHoursSpent}h</div>
              <p className="text-xs text-muted-foreground mt-1">
                Total hours spent on tasks
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Task Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Object.keys(tasksByCategory).length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Different categories of tasks
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Productivity Over Time</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={last7Days}>
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="tasksCompleted" 
                    name="Tasks Completed"
                    stroke="#3b82f6" 
                    activeDot={{ r: 8 }} 
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="hoursWorked" 
                    name="Hours Worked"
                    stroke="#10b981" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Completion Rate (last 7 days)</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={last7Days}>
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completionRate" name="Completion Rate (%)" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Tasks by Category</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Tasks by Priority</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    <Cell fill="#f97316" /> {/* High - Orange */}
                    <Cell fill="#eab308" /> {/* Medium - Yellow */}
                    <Cell fill="#3b82f6" /> {/* Low - Blue */}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;
