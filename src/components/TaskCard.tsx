
import React, { useState } from 'react';
import { Task } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { useAppContext } from '@/context/AppContext';
import { CalendarClock, Clock, MoreVertical, Pencil, Timer, Trash2 } from 'lucide-react';
import TaskForm from './TaskForm';
import TimeTracker from './TimeTracker';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
}

const priorityColor = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { toggleTaskCompletion, deleteTask, syncTaskWithCalendar, state } = useAppContext();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isTimeTrackerOpen, setIsTimeTrackerOpen] = useState(false);
  
  const handleToggleCompletion = () => {
    toggleTaskCompletion(task.id);
  };
  
  const handleDelete = () => {
    deleteTask(task.id);
  };
  
  const handleSyncWithCalendar = () => {
    syncTaskWithCalendar(task.id);
  };
  
  const formattedDueDate = task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : 'No due date';
  const formattedTimeSpent = task.timeSpent > 0 
    ? `${Math.floor(task.timeSpent / 60)}h ${task.timeSpent % 60}m`
    : '0m';
    
  return (
    <Card className={cn("task-card", task.completed ? "opacity-70" : "")}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-2">
            <Checkbox 
              checked={task.completed} 
              onCheckedChange={handleToggleCompletion} 
              className="mt-1"
            />
            <CardTitle className={cn("text-lg", task.completed ? "line-through text-gray-500" : "")}>{task.title}</CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
              {state.isGoogleCalendarConnected && !task.calendarEventId && (
                <DropdownMenuItem onClick={handleSyncWithCalendar}>
                  <CalendarClock className="mr-2 h-4 w-4" />
                  Add to Google Calendar
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-3">
          {task.description || "No description provided"}
        </p>
        <div className="flex flex-wrap gap-2 items-center text-xs text-gray-500">
          <div className="flex items-center">
            <CalendarClock className="h-3 w-3 mr-1" />
            {formattedDueDate}
          </div>
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            Est: {task.duration}m
          </div>
          <div className="flex items-center">
            <Timer className="h-3 w-3 mr-1" />
            Spent: {formattedTimeSpent}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between items-center">
        <div className="flex gap-2">
          <Badge className={priorityColor[task.priority]}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </Badge>
          <Badge variant="outline">{task.category}</Badge>
          {task.calendarEventId && (
            <Badge className="bg-green-100 text-green-800">
              <CalendarClock className="h-3 w-3 mr-1" />
              Google Calendar
            </Badge>
          )}
        </div>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => setIsTimeTrackerOpen(true)}
          disabled={task.completed}
        >
          Track Time
        </Button>
      </CardFooter>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <TaskForm initialData={task} onClose={() => setIsEditDialogOpen(false)} />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isTimeTrackerOpen} onOpenChange={setIsTimeTrackerOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Track Time for {task.title}</DialogTitle>
          </DialogHeader>
          <TimeTracker taskId={task.id} onClose={() => setIsTimeTrackerOpen(false)} />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default TaskCard;
