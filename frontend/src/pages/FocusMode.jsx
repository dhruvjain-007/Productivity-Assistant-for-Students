import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../hooks/useContexts';
import { focusService } from '../services/api';
import toast from 'react-hot-toast';
import { Play, Pause, RotateCcw, Zap } from 'lucide-react';

const FocusMode = () => {
  const { token } = useAuth();
  const [duration, setDuration] = useState(25);
  const [sessionDuration, setSessionDuration] = useState(25);
  const [isRunning, setIsRunning] = useState(false);
  const [focusScore, setFocusScore] = useState(50);
  const [distractions, setDistractions] = useState(0);
  const [sessionId, setSessionId] = useState(null);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  const handleSessionEnd = async () => {
    setIsRunning(false);
    if (!sessionId) return;

    try {
      await focusService.endSession(sessionId, {
        focusScore,
        distractionsCount: distractions,
      });
      toast.success('Session ended!');
      setSessionId(null);
      setDuration(sessionDuration);
      setFocusScore(50);
      setDistractions(0);
    } catch (error) {
      toast.error('Failed to end session');
    }
  };

  useEffect(() => {
    if (isRunning && duration > 0) {
      intervalRef.current = setInterval(() => {
        setDuration((prev) => prev - 1);
      }, 1000);
    } else if (duration === 0 && isRunning) {
      handleSessionEnd();
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, duration, sessionId, focusScore, distractions, sessionDuration]);

  const handleStart = async () => {
    try {
      const session = await focusService.startSession({
        plannedDuration: sessionDuration,
      });
      setSessionId(session._id);
      setIsRunning(true);
      setDuration(sessionDuration);
      toast.success('Focus session started!');
    } catch (error) {
      toast.error('Failed to start session');
    }
  };

  const handlePause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setDuration(sessionDuration);
    setDistractions(0);
    setFocusScore(50);
  };

  const handleSessionEnd = async () => {
    setIsRunning(false);

    if (sessionId) {
      try {
        await focusService.endSession(sessionId, {
          focusScore,
          distractionsCount: distractions,
          distractionTypes: [],
        });
        toast.success('Focus session completed!');
        setSessionId(null);
        setDuration(sessionDuration);
      } catch (error) {
        toast.error('Failed to end session');
      }
    }
  };

  const handleDistraction = () => {
    setDistractions((prev) => prev + 1);
    setFocusScore((prev) => Math.max(0, prev - 5));
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  };

  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Focus Mode</h1>

      {/* Main Timer */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-xl p-12 text-center text-white">
        <h2 className="text-lg font-medium mb-8 opacity-90">Focus Time</h2>

        <div className="text-7xl font-bold mb-8 font-mono tracking-wider">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>

        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="text-center">
            <p className="text-sm opacity-75">Focus Score</p>
            <p className="text-3xl font-bold">{focusScore}%</p>
          </div>
          <div className="w-px h-12 bg-white opacity-30"></div>
          <div className="text-center">
            <p className="text-sm opacity-75">Distractions</p>
            <p className="text-3xl font-bold">{distractions}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          {!isRunning && sessionId === null && (
            <button
              onClick={handleStart}
              className="flex items-center gap-2 bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              <Play className="w-5 h-5" />
              Start Session
            </button>
          )}

          {isRunning && (
            <button
              onClick={handlePause}
              className="flex items-center gap-2 bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              <Pause className="w-5 h-5" />
              Pause
            </button>
          )}

          {isRunning && (
            <button
              onClick={handleSessionEnd}
              className="px-8 py-3 bg-red-500 hover:bg-red-600 rounded-lg font-semibold transition"
            >
              End Session
            </button>
          )}

          {!isRunning && sessionId !== null && (
            <button
              onClick={handleReset}
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-8 py-3 rounded-lg font-semibold transition"
            >
              <RotateCcw className="w-5 h-5" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Settings */}
      {!isRunning && sessionId === null && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Session Settings</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Duration (minutes)
              </label>
              <input
                type="range"
                min="5"
                max="120"
                step="5"
                value={sessionDuration}
                onChange={(e) => setSessionDuration(parseInt(e.target.value))}
                className="w-full"
              />
              <p className="text-center text-lg font-semibold text-indigo-600 mt-2">
                {sessionDuration} minutes
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Distraction Button */}
      {isRunning && (
        <button
          onClick={handleDistraction}
          className="w-full bg-red-100 hover:bg-red-200 text-red-800 font-semibold py-4 rounded-lg flex items-center justify-center gap-2 transition"
        >
          <Zap className="w-5 h-5" />
          I Got Distracted
        </button>
      )}

      {/* Audio element for notifications */}
      <audio
        ref={audioRef}
        src="data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=="
      />
    </div>
  );
};

export default FocusMode;
