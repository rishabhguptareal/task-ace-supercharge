
export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date | null;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  duration: number; // in minutes
  timeSpent: number; // in minutes
  category: string;
  calendarEventId?: string;
}

export interface DailyStats {
  date: string; // ISO string
  totalTasksCompleted: number;
  totalTimeWorked: number; // in minutes
  taskCompletionPercentage: number;
}

export interface AppState {
  tasks: Task[];
  dailyStats: DailyStats[];
  isGoogleCalendarConnected: boolean;
}
