
import React, { useState } from 'react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/context/AppContext';
import { format, isEqual, parse } from 'date-fns';
import { Task } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import TaskForm from '@/components/TaskForm';

interface TaskEvent {
  task: Task;
  startTime: string;
  endTime: string;
}

const Calendar = () => {
  const { state } = useAppContext();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);

  // Group tasks by date
  const tasksByDate = state.tasks.reduce<Record<string, Task[]>>((acc, task) => {
    if (task.dueDate) {
      const dateStr = format(new Date(task.dueDate), 'yyyy-MM-dd');
      if (!acc[dateStr]) {
        acc[dateStr] = [];
      }
      acc[dateStr].push(task);
    }
    return acc;
  }, {});

  // Get tasks for the selected date
  const getTasksForDate = (date: Date | undefined): Task[] => {
    if (!date) return [];
    const dateStr = format(date, 'yyyy-MM-dd');
    return tasksByDate[dateStr] || [];
  };

  // Function to determine if a day has tasks
  const isDayWithTasks = (date: Date): boolean => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return !!tasksByDate[dateStr] && tasksByDate[dateStr].length > 0;
  };

  const selectedDateTasks = getTasksForDate(selectedDate);

  // Generate time slots for the day
  const timeSlots = Array.from({ length: 24 }).map((_, i) => {
    const hour = i;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-muted-foreground">
            View and manage your scheduled tasks
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
                <CardDescription>Select a date to view tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                  modifiers={{
                    hasTasks: (date) => isDayWithTasks(date),
                  }}
                  modifiersClassNames={{
                    hasTasks: "bg-primary/20",
                  }}
                />
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>
                    {selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : 'Select a date'}
                  </CardTitle>
                  <CardDescription>
                    {selectedDateTasks.length} tasks scheduled
                  </CardDescription>
                </div>
                <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">Add Task</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Task</DialogTitle>
                    </DialogHeader>
                    <TaskForm 
                      initialData={undefined} 
                      onClose={() => setIsTaskDialogOpen(false)} 
                    />
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {selectedDateTasks.length > 0 ? (
                  <div className="space-y-4">
                    {selectedDateTasks.map((task) => (
                      <div
                        key={task.id}
                        className={`p-3 rounded-md border cursor-pointer ${
                          task.completed ? 'bg-green-50 border-green-200' : 'bg-white'
                        }`}
                        onClick={() => {
                          setSelectedTask(task);
                          setIsTaskDialogOpen(true);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <h3 className={`font-medium ${task.completed ? 'line-through text-green-700' : ''}`}>
                            {task.title}
                          </h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            task.priority === 'high'
                              ? 'bg-red-100 text-red-800'
                              : task.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {task.description || 'No description'}
                        </p>
                        <div className="flex justify-between mt-2 text-xs text-gray-500">
                          <span>Duration: {task.duration} minutes</span>
                          <span>Category: {task.category}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No tasks scheduled for this date
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Task Dialog */}
        <Dialog open={isTaskDialogOpen && !!selectedTask} onOpenChange={(open) => {
          if (!open) {
            setIsTaskDialogOpen(false);
            setSelectedTask(undefined);
          }
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
            </DialogHeader>
            <TaskForm
              initialData={selectedTask}
              onClose={() => {
                setIsTaskDialogOpen(false);
                setSelectedTask(undefined);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Calendar;
