/**
 * useUndoRedo — Command pattern-based undo/redo stack.
 * Records actions with inverse operations for full reversibility.
 */
import { useState, useCallback, useRef } from 'react';

export interface UndoAction {
  type: string;
  description: string;
  execute: () => void;
  undo: () => void;
}

const MAX_HISTORY = 50;

export function useUndoRedo() {
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const historyRef = useRef<UndoAction[]>([]);
  const indexRef = useRef(-1);

  const updateState = useCallback(() => {
    setCanUndo(indexRef.current >= 0);
    setCanRedo(indexRef.current < historyRef.current.length - 1);
  }, []);

  const pushAction = useCallback(
    (action: UndoAction) => {
      // Truncate any redo history
      historyRef.current = historyRef.current.slice(0, indexRef.current + 1);
      historyRef.current.push(action);
      if (historyRef.current.length > MAX_HISTORY) {
        historyRef.current.shift();
      } else {
        indexRef.current++;
      }
      action.execute();
      updateState();
    },
    [updateState]
  );

  const undo = useCallback(() => {
    if (indexRef.current < 0) return;
    const action = historyRef.current[indexRef.current];
    action.undo();
    indexRef.current--;
    updateState();
  }, [updateState]);

  const redo = useCallback(() => {
    if (indexRef.current >= historyRef.current.length - 1) return;
    indexRef.current++;
    const action = historyRef.current[indexRef.current];
    action.execute();
    updateState();
  }, [updateState]);

  const clear = useCallback(() => {
    historyRef.current = [];
    indexRef.current = -1;
    updateState();
  }, [updateState]);

  return { pushAction, undo, redo, canUndo, canRedo, clear };
}
