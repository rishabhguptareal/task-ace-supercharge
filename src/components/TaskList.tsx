
import React, { useState } from 'react';
import { Task } from '@/types';
import TaskCard from './TaskCard';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import TaskForm from './TaskForm';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

const TaskList: React.FC = () => {
  const { state } = useAppContext();
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterCompleted, setFilterCompleted] = useState<'all' | 'active' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'title'>('dueDate');

  const filteredTasks = state.tasks
    .filter((task) => {
      // Filter by search text
      const matchesSearch = 
        task.title.toLowerCase().includes(searchText.toLowerCase()) ||
        task.description.toLowerCase().includes(searchText.toLowerCase()) ||
        task.category.toLowerCase().includes(searchText.toLowerCase());
      
      // Filter by completion status
      const matchesCompletion = 
        filterCompleted === 'all' ||
        (filterCompleted === 'active' && !task.completed) ||
        (filterCompleted === 'completed' && task.completed);
      
      return matchesSearch && matchesCompletion;
    })
    .sort((a, b) => {
      // Sort tasks
      if (sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else if (sortBy === 'priority') {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      } else {
        return a.title.localeCompare(b.title);
      }
    });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search tasks..."
            className="pl-8"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select
            value={filterCompleted}
            onValueChange={(value: 'all' | 'active' | 'completed') => 
              setFilterCompleted(value)
            }
          >
            <SelectTrigger className="w-32 bg-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All tasks</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={sortBy}
            onValueChange={(value: 'dueDate' | 'priority' | 'title') => 
              setSortBy(value)
            }
          >
            <SelectTrigger className="w-32 bg-white">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dueDate">Due date</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="title">Title</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={() => setIsAddTaskDialogOpen(true)}>
            <Plus className="mr-1 h-4 w-4" />
            New Task
          </Button>
        </div>
      </div>
      
      {filteredTasks.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <h3 className="text-lg font-medium">No tasks found</h3>
          <p className="text-gray-500 mt-2">
            {searchText || filterCompleted !== 'all' 
              ? "Try adjusting your filters or search terms" 
              : "Start by creating your first task"}
          </p>
          <Button 
            onClick={() => setIsAddTaskDialogOpen(true)} 
            className="mt-4"
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Task
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
      
      <Dialog open={isAddTaskDialogOpen} onOpenChange={setIsAddTaskDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <TaskForm onClose={() => setIsAddTaskDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskList;
