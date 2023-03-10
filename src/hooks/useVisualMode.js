import { useState } from "react";

export default function useVisualMode(initial) {
  const [history, setHistory] = useState([initial]);

  /**
   * Transition adds a new mode to the stack unless 'replace' is true, in which case
   * we remove the current mode and replace it with the given new mode.
   */
  const transition = function (newMode, replace = false) {
    setHistory(prev => 
        replace ? [...prev.slice(0, prev.length - 1), newMode] : [...prev, newMode]
    );
  };

  /**
   * Remove the last mode from the stack (set mode to the previous value).
   * Validate that the stack has at least 2 elements so as not to remove the initial mode.
   */
  const back = function () {
    if (history.length < 2) {
      return;
    }
    setHistory(prev => prev.slice(0, prev.length - 1));
  };

  return { mode: history[history.length - 1], transition, back };
};
