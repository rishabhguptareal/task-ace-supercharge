
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { useAppContext } from '@/context/AppContext';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';
import { toast } from 'sonner';

const FocusPage = () => {
  const { state, trackTime } = useAppContext();
  
  // Timer state
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [sessionLength, setSessionLength] = useState(25); // in minutes
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  
  // Controls timer
  useEffect(() => {
    let intervalId: number;
    
    if (isRunning && timeLeft > 0) {
      intervalId = window.setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      // Record time for the selected task
      if (selectedTaskId) {
        trackTime(selectedTaskId, sessionLength);
        toast.success(`Focus session completed! ${sessionLength} minutes tracked.`, {
          description: "Great job staying focused!",
        });
      }
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRunning, timeLeft, selectedTaskId, sessionLength, trackTime]);
  
  const startTimer = () => {
    if (!selectedTaskId) {
      toast.error("Please select a task first");
      return;
    }
    setIsRunning(true);
  };
  
  const pauseTimer = () => {
    setIsRunning(false);
  };
  
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(sessionLength * 60);
  };
  
  const handleSessionLengthChange = (value: number[]) => {
    const newLength = value[0];
    setSessionLength(newLength);
    setTimeLeft(newLength * 60);
  };
  
  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Filter only incomplete tasks
  const incompleteTasks = state.tasks.filter(task => !task.completed);
  
  // Progress percentage
  const progressPercentage = ((sessionLength * 60 - timeLeft) / (sessionLength * 60)) * 100;
  
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Focus Mode</h1>
          <p className="text-muted-foreground">
            Improve your concentration with focused work sessions
          </p>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-primary" />
              Focus Timer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center justify-center">
              <div className="text-6xl font-mono font-bold mb-4">
                {formatTime(timeLeft)}
              </div>
              <Progress value={progressPercentage} className="h-2 w-full" />
            </div>
            
            <div className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Session Length: {sessionLength} minutes
                </label>
                <Slider 
                  defaultValue={[25]} 
                  max={60}
                  min={5}
                  step={5}
                  value={[sessionLength]}
                  onValueChange={handleSessionLengthChange}
                  disabled={isRunning}
                  className="py-4"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Select Task</label>
                <Select 
                  value={selectedTaskId || ""} 
                  onValueChange={setSelectedTaskId}
                  disabled={isRunning}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Choose a task to focus on" />
                  </SelectTrigger>
                  <SelectContent>
                    {incompleteTasks.length > 0 ? (
                      incompleteTasks.map(task => (
                        <SelectItem key={task.id} value={task.id}>{task.title}</SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>No incomplete tasks</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center space-x-4">
            {!isRunning ? (
              <Button 
                onClick={startTimer} 
                className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2 px-6"
                disabled={!selectedTaskId}
              >
                <Play className="h-5 w-5" />
                Start Focus
              </Button>
            ) : (
              <Button 
                onClick={pauseTimer} 
                variant="destructive"
                className="flex items-center gap-2 px-6"
              >
                <Pause className="h-5 w-5" />
                Pause
              </Button>
            )}
            <Button 
              onClick={resetTimer} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-5 w-5" />
              Reset
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Focus Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">The Pomodoro Technique</h3>
              <p className="text-sm text-gray-600">
                Work in focused 25-minute sessions, followed by a 5-minute break. After 4 sessions, take a longer 15-30 minute break.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">Eliminate Distractions</h3>
              <p className="text-sm text-gray-600">
                Put your phone on silent, close unnecessary browser tabs, and consider using website blockers during focus sessions.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">Set Clear Goals</h3>
              <p className="text-sm text-gray-600">
                Define exactly what you want to accomplish during each focus session before starting the timer.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">Track Progress</h3>
              <p className="text-sm text-gray-600">
                Recording your focused work time helps build momentum and shows your productivity patterns over time.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default FocusPage;
