import { useState } from "react";

export default function useVisualMode(initial) {
  // Set state of mode and history with the initial mode provided
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);
  // Use a copy of history to manage state
  let newHistory = [...history];

  const transition = function (newMode, replace = false) {
    console.log(`in transition fn, newMode = ${newMode}, replace = ${replace}`);
    // Replace (remove current mode before adding a new one)
    if (replace) {
      newHistory.pop();
    }
    // Transition (add a mode to the stack)
    setMode(newMode);
    newHistory = [...newHistory, newMode];
    setHistory(newHistory);
  };

  const back = function () {
    console.log(`in back fn`);
    // Avoid removing the initial mode
    if (newHistory.length < 2) {
      return;
    }
    newHistory.pop();
    setMode(newHistory[newHistory.length - 1]);
    setHistory(newHistory);
  };

  return { mode, transition, back };
};
