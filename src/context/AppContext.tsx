
import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { Task, DailyStats, AppState } from '../types';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface AppContextType {
  state: AppState;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  trackTime: (id: string, timeInMinutes: number) => void;
  connectGoogleCalendar: () => void;
  disconnectGoogleCalendar: () => void;
  syncTaskWithCalendar: (taskId: string) => void;
}

const defaultState: AppState = {
  tasks: [],
  dailyStats: [],
  isGoogleCalendarConnected: false,
};

// Get initial state from localStorage if available
const getInitialState = (): AppState => {
  const storedState = localStorage.getItem('productivityApp');
  return storedState ? JSON.parse(storedState) : defaultState;
};

type Action = 
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'TOGGLE_TASK_COMPLETION'; payload: string }
  | { type: 'TRACK_TIME'; payload: { id: string; timeInMinutes: number } }
  | { type: 'CONNECT_GOOGLE_CALENDAR' }
  | { type: 'DISCONNECT_GOOGLE_CALENDAR' }
  | { type: 'SYNC_TASK_WITH_CALENDAR'; payload: { id: string; eventId: string } }
  | { type: 'UPDATE_DAILY_STATS' };

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };
    case 'TOGGLE_TASK_COMPLETION': {
      const newTasks = state.tasks.map((task) =>
        task.id === action.payload ? { ...task, completed: !task.completed } : task
      );
      
      // Check task completion percentage
      const todaysTasks = newTasks.filter(task => {
        if (!task.dueDate) return false;
        return format(new Date(task.dueDate), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
      });
      
      const completedTasks = todaysTasks.filter(task => task.completed);
      const completionPercentage = todaysTasks.length > 0 
        ? (completedTasks.length / todaysTasks.length) * 100 
        : 0;
      
      // Calculate total time worked today
      const totalTimeWorked = newTasks.reduce((total, task) => {
        return total + (task.timeSpent || 0);
      }, 0);
      
      // Show congratulations message if conditions met
      if (completionPercentage >= 80 && totalTimeWorked >= 14 * 60) {
        toast.success("Congratulations! You've made it to super 30 by harkirat and aced AIR 7 in DAIICT entrance exam 2025!");
      }
      
      return {
        ...state,
        tasks: newTasks,
      };
    }
    case 'TRACK_TIME': {
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id
            ? { ...task, timeSpent: (task.timeSpent || 0) + action.payload.timeInMinutes }
            : task
        ),
      };
    }
    case 'CONNECT_GOOGLE_CALENDAR':
      return {
        ...state,
        isGoogleCalendarConnected: true,
      };
    case 'DISCONNECT_GOOGLE_CALENDAR':
      return {
        ...state,
        isGoogleCalendarConnected: false,
        tasks: state.tasks.map((task) => ({
          ...task,
          calendarEventId: undefined,
        })),
      };
    case 'SYNC_TASK_WITH_CALENDAR':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id
            ? { ...task, calendarEventId: action.payload.eventId }
            : task
        ),
      };
    case 'UPDATE_DAILY_STATS': {
      const today = format(new Date(), 'yyyy-MM-dd');
      const todaysTasks = state.tasks.filter(task => {
        if (!task.dueDate) return false;
        return format(new Date(task.dueDate), 'yyyy-MM-dd') === today;
      });
      
      const completedTasks = todaysTasks.filter(task => task.completed);
      const totalTimeWorked = state.tasks.reduce(
        (total, task) => total + (task.timeSpent || 0),
        0
      );
      
      const completionPercentage = todaysTasks.length > 0 
        ? (completedTasks.length / todaysTasks.length) * 100 
        : 0;
      
      const existingStatsIndex = state.dailyStats.findIndex(
        (stats) => stats.date === today
      );
      
      let newDailyStats = [...state.dailyStats];
      
      const todaysStats = {
        date: today,
        totalTasksCompleted: completedTasks.length,
        totalTimeWorked,
        taskCompletionPercentage: completionPercentage,
      };
      
      if (existingStatsIndex >= 0) {
        newDailyStats[existingStatsIndex] = todaysStats;
      } else {
        newDailyStats.push(todaysStats);
      }
      
      return {
        ...state,
        dailyStats: newDailyStats,
      };
    }
    default:
      return state;
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, getInitialState());

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('productivityApp', JSON.stringify(state));
  }, [state]);

  // Update daily stats every time tasks change
  useEffect(() => {
    dispatch({ type: 'UPDATE_DAILY_STATS' });
  }, [state.tasks]);

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      timeSpent: 0,
    };
    dispatch({ type: 'ADD_TASK', payload: newTask });
    toast.success('Task added successfully!');
  };

  const updateTask = (task: Task) => {
    dispatch({ type: 'UPDATE_TASK', payload: task });
    toast.success('Task updated successfully!');
  };

  const deleteTask = (id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
    toast.success('Task deleted successfully!');
  };

  const toggleTaskCompletion = (id: string) => {
    dispatch({ type: 'TOGGLE_TASK_COMPLETION', payload: id });
  };

  const trackTime = (id: string, timeInMinutes: number) => {
    dispatch({
      type: 'TRACK_TIME',
      payload: { id, timeInMinutes },
    });
    toast.success(`Added ${timeInMinutes} minutes to task!`);
  };

  const connectGoogleCalendar = () => {
    // Mock implementation - in a real app, this would use Google OAuth
    dispatch({ type: 'CONNECT_GOOGLE_CALENDAR' });
    toast.success('Connected to Google Calendar!');
  };

  const disconnectGoogleCalendar = () => {
    dispatch({ type: 'DISCONNECT_GOOGLE_CALENDAR' });
    toast.success('Disconnected from Google Calendar!');
  };

  const syncTaskWithCalendar = (taskId: string) => {
    // Mock implementation - in a real app, this would create an actual Google Calendar event
    const eventId = `event-${Date.now()}`;
    dispatch({
      type: 'SYNC_TASK_WITH_CALENDAR',
      payload: { id: taskId, eventId },
    });
    toast.success('Task synced with Google Calendar!');
  };

  return (
    <AppContext.Provider
      value={{
        state,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
        trackTime,
        connectGoogleCalendar,
        disconnectGoogleCalendar,
        syncTaskWithCalendar,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
