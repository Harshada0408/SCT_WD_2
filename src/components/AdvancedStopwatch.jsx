import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Flag, Save, Trash2, Clock, TrendingUp, Award } from 'lucide-react';
import { formatTime } from '../utils/timeHelpers';

export default function AdvancedStopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const [savedSessions, setSavedSessions] = useState([]);
  const [sessionName, setSessionName] = useState('');
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(t => t + 10);
      }, 10);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };

  const handleLap = () => {
    if (time > 0) {
      const lapTime = time - (laps.length > 0 ? laps[laps.length - 1].totalTime : 0);
      setLaps([...laps, {
        id: laps.length + 1,
        lapTime: lapTime,
        totalTime: time,
        timestamp: new Date().toLocaleTimeString()
      }]);
    }
  };

  const handleSaveSession = () => {
    if (time > 0) {
      const name = sessionName.trim() || `Session ${savedSessions.length + 1}`;
      setSavedSessions([...savedSessions, {
        id: Date.now(),
        name,
        totalTime: time,
        laps: [...laps],
        date: new Date().toLocaleDateString(),
        timestamp: new Date().toLocaleTimeString()
      }]);
      setSessionName('');
      handleReset();
    }
  };

  const deleteSavedSession = (id) => {
    setSavedSessions(savedSessions.filter(s => s.id !== id));
  };

  const getStatistics = () => {
    if (laps.length === 0) return null;
    
    const lapTimes = laps.map(l => l.lapTime);
    const fastest = Math.min(...lapTimes);
    const slowest = Math.max(...lapTimes);
    const average = lapTimes.reduce((a, b) => a + b, 0) / lapTimes.length;
    
    return { fastest, slowest, average };
  };

  const stats = getStatistics();
  const currentTime = formatTime(time);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Clock className="w-10 h-10 text-purple-400" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">Stopwatch Pro</h1>
          </div>
          <p className="text-purple-300">Advanced Time Tracking & Analytics</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="text-center mb-8">
                <div className="flex justify-center items-baseline gap-2 font-mono">
                  <div className="text-5xl md:text-7xl font-bold text-white">
                    {currentTime.hours}:{currentTime.minutes}:{currentTime.seconds}
                  </div>
                  <div className="text-3xl md:text-5xl font-bold text-purple-300">
                    .{currentTime.milliseconds}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={handleStartPause}
                  className={`flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white transition-all transform hover:scale-105 shadow-lg ${
                    isRunning 
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600' 
                      : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                  }`}
                >
                  {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  {isRunning ? 'Pause' : 'Start'}
                </button>

                <button
                  onClick={handleLap}
                  disabled={time === 0}
                  className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <Flag className="w-5 h-5" />
                  Lap
                </button>

                <button
                  onClick={handleReset}
                  disabled={time === 0 && laps.length === 0}
                  className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <RotateCcw className="w-5 h-5" />
                  Reset
                </button>
              </div>
            </div>

            {stats && (
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                  <h3 className="text-xl font-bold text-white">Lap Statistics</h3>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-500/20 rounded-xl border border-green-500/30">
                    <div className="text-green-300 text-sm mb-1">Fastest</div>
                    <div className="text-white font-mono font-bold">
                      {formatTime(stats.fastest).minutes}:{formatTime(stats.fastest).seconds}.{formatTime(stats.fastest).milliseconds}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-blue-500/20 rounded-xl border border-blue-500/30">
                    <div className="text-blue-300 text-sm mb-1">Average</div>
                    <div className="text-white font-mono font-bold">
                      {formatTime(stats.average).minutes}:{formatTime(stats.average).seconds}.{formatTime(stats.average).milliseconds}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-red-500/20 rounded-xl border border-red-500/30">
                    <div className="text-red-300 text-sm mb-1">Slowest</div>
                    <div className="text-white font-mono font-bold">
                      {formatTime(stats.slowest).minutes}:{formatTime(stats.slowest).seconds}.{formatTime(stats.slowest).milliseconds}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {laps.length > 0 && (
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4">Lap Times</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                  {laps.slice().reverse().map((lap, idx) => {
                    const actualLap = laps[laps.length - 1 - idx];
                    const isFastest = stats && actualLap.lapTime === stats.fastest;
                    const isSlowest = stats && actualLap.lapTime === stats.slowest;
                    
                    return (
                      <div
                        key={actualLap.id}
                        className={`flex justify-between items-center p-4 rounded-xl transition-all ${
                          isFastest ? 'bg-green-500/20 border border-green-500/50' :
                          isSlowest ? 'bg-red-500/20 border border-red-500/50' :
                          'bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-purple-300 font-bold">#{actualLap.id}</span>
                          {isFastest && <Award className="w-4 h-4 text-green-400" />}
                          {isSlowest && <Award className="w-4 h-4 text-red-400" />}
                          <span className="text-gray-400 text-sm">{actualLap.timestamp}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-mono font-bold">
                            {formatTime(actualLap.lapTime).minutes}:{formatTime(actualLap.lapTime).seconds}.{formatTime(actualLap.lapTime).milliseconds}
                          </div>
                          <div className="text-gray-400 text-xs">
                            Total: {formatTime(actualLap.totalTime).minutes}:{formatTime(actualLap.totalTime).seconds}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {time > 0 && (
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4">Save Current Session</h3>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Session name (optional)"
                    value={sessionName}
                    onChange={(e) => setSessionName(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    onClick={handleSaveSession}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transition-all transform hover:scale-105 shadow-lg"
                  >
                    <Save className="w-5 h-5" />
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20 sticky top-4">
              <h3 className="text-xl font-bold text-white mb-4">Saved Sessions</h3>
              {savedSessions.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No saved sessions yet</p>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
                  {savedSessions.slice().reverse().map((session) => (
                    <div key={session.id} className="bg-white/5 hover:bg-white/10 rounded-xl p-4 transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="text-white font-bold">{session.name}</div>
                          <div className="text-gray-400 text-xs">{session.date} at {session.timestamp}</div>
                        </div>
                        <button
                          onClick={() => deleteSavedSession(session.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-purple-300 font-mono font-bold text-lg">
                        {formatTime(session.totalTime).hours}:{formatTime(session.totalTime).minutes}:{formatTime(session.totalTime).seconds}
                      </div>
                      <div className="text-gray-400 text-sm mt-1">
                        {session.laps.length} lap{session.laps.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(168, 85, 247, 0.7);
        }
      `}</style>
    </div>
  );
}