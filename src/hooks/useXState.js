import { useState, useCallback } from "react";

const useXState = initialState => {
  const [state, setState] = useState(initialState);

  const updateState = useCallback(
    newState => setState(prev => ({ ...prev, ...newState })),
    [],
  );

  return [state, updateState, setState];
};

export default useXState;
