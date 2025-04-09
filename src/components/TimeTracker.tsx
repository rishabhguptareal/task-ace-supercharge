
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppContext } from '@/context/AppContext';
import { DialogFooter } from './ui/dialog';
import { PauseCircle, PlayCircle, Save } from 'lucide-react';

interface TimeTrackerProps {
  taskId: string;
  onClose: () => void;
}

const TimeTracker: React.FC<TimeTrackerProps> = ({ taskId, onClose }) => {
  const { trackTime } = useAppContext();
  const [isTracking, setIsTracking] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [manualMinutes, setManualMinutes] = useState(0);
  const [timerStartTime, setTimerStartTime] = useState<number | null>(null);
  
  useEffect(() => {
    let intervalId: number;
    
    if (isTracking) {
      intervalId = window.setInterval(() => {
        if (timerStartTime) {
          const now = Date.now();
          const elapsed = Math.floor((now - timerStartTime) / 1000);
          setElapsedSeconds(elapsed);
        }
      }, 1000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isTracking, timerStartTime]);
  
  const startTimer = () => {
    setTimerStartTime(Date.now());
    setIsTracking(true);
  };
  
  const stopTimer = () => {
    setIsTracking(false);
  };
  
  const saveTime = () => {
    if (isTracking && elapsedSeconds > 0) {
      const minutes = Math.max(1, Math.round(elapsedSeconds / 60));
      trackTime(taskId, minutes);
    } else if (manualMinutes > 0) {
      trackTime(taskId, manualMinutes);
    }
    onClose();
  };
  
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Track time automatically</h3>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-mono">{formatTime(elapsedSeconds)}</div>
          <div className="flex space-x-2">
            {!isTracking ? (
              <Button 
                onClick={startTimer} 
                size="sm" 
                className="flex items-center gap-2"
              >
                <PlayCircle size={18} />
                Start
              </Button>
            ) : (
              <Button 
                onClick={stopTimer} 
                size="sm" 
                variant="destructive"
                className="flex items-center gap-2"
              >
                <PauseCircle size={18} />
                Pause
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <div className="space-y-2 pt-4 border-t">
        <h3 className="text-sm font-medium">Or enter time manually</h3>
        <div className="flex items-center space-x-2">
          <Input
            type="number"
            min="0"
            placeholder="Minutes"
            value={manualMinutes.toString()}
            onChange={(e) => setManualMinutes(parseInt(e.target.value) || 0)}
            disabled={isTracking}
          />
          <span className="text-sm text-gray-500">minutes</span>
        </div>
      </div>
      
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={saveTime} className="flex items-center gap-2">
          <Save size={18} />
          Save Time
        </Button>
      </DialogFooter>
    </div>
  );
};

export default TimeTracker;
