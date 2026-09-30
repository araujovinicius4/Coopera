import { useState } from "react";
import { mockApi } from "../services/mockApi";
export function useDemo() {
  const [state, setState] = useState(() => mockApi.load());
  const [feedback, setFeedback] = useState("");
  function act(operation, message) {
    try {
      setState(operation());
      if (message) setFeedback(message);
    } catch (e) {
      setFeedback(e.message);
    }
  }
  return { state, act, feedback, setFeedback };
}
