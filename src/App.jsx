
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Flag, Save, Trash2, Clock, TrendingUp, Award } from 'lucide-react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import AdvancedStopwatch from './components/AdvancedStopwatch'

function App() {
  return (
    <div className="App">
      <AdvancedStopwatch />
    </div>
  )
}

export default App