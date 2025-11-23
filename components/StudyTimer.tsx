import React, { useState, useEffect, useRef } from 'react';

interface TimerSession {
  duration: number;
  timestamp: number;
}

const StudyTimer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState<TimerSession[]>([]);
  const popupRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        const target = event.target as HTMLElement;
        if (!target.closest('.timer-button')) {
          setIsOpen(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = () => {
    if (time > 0) {
      setSessions([...sessions, { duration: time, timestamp: Date.now() }]);
    }
    setIsRunning(false);
    setTime(0);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
  };

  const formatSessionDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    if (mins === 0) return `${seconds} sec`;
    return `${mins} min`;
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="timer-button fixed bottom-6 left-6 w-14 h-14 bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-40 hover:scale-110"
        style={{ boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)' }}
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      {isOpen && (
        <div
          ref={popupRef}
          className="fixed bottom-24 left-4 sm:left-6 bg-[#121212] text-white rounded-xl p-4 sm:p-5 border border-[#2a2a2a] z-50 w-[calc(100vw-2rem)] sm:w-80 max-w-sm animate-fade-in"
          style={{ boxShadow: '0 0 12px rgba(0,0,0,0.6)' }}
        >
          <h3 className="text-lg font-bold mb-4 text-center tracking-wide">Study Timer</h3>

          <div className="bg-[#1a1a1a] rounded-lg p-4 sm:p-6 mb-4 border border-[#2a2a2a]">
            <div className="text-4xl sm:text-5xl font-mono font-bold text-center mb-4 text-white tracking-wider">
              {formatTime(time)}
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {!isRunning ? (
                <button
                  onClick={handleStart}
                  className="px-4 sm:px-5 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg text-sm"
                  style={{ boxShadow: '0 2px 8px rgba(34, 197, 94, 0.3)' }}
                >
                  Start
                </button>
              ) : (
                <button
                  onClick={handlePause}
                  className="px-4 sm:px-5 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg text-sm"
                  style={{ boxShadow: '0 2px 8px rgba(234, 179, 8, 0.3)' }}
                >
                  Pause
                </button>
              )}
              
              <button
                onClick={handleStop}
                className="px-4 sm:px-5 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg text-sm"
                style={{ boxShadow: '0 2px 8px rgba(220, 38, 38, 0.3)' }}
              >
                Stop
              </button>
              
              <button
                onClick={handleReset}
                className="px-4 sm:px-5 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg text-sm"
              >
                Reset
              </button>
            </div>
          </div>

          {sessions.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2 text-gray-400">Session History</h4>
              <div className="bg-[#1a1a1a] rounded-lg p-3 max-h-40 overflow-y-auto border border-[#2a2a2a]">
                {sessions.slice().reverse().map((session, index) => (
                  <div
                    key={session.timestamp}
                    className="flex justify-between items-center py-2 px-2 hover:bg-[#222] rounded transition-colors"
                  >
                    <span className="text-xs text-gray-400">
                      Session {sessions.length - index}
                    </span>
                    <span className="text-sm font-semibold text-white">
                      {formatSessionDuration(session.duration)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default StudyTimer;
