import { useCallback, useState } from "react";

export function usePasswordToggle(defaultVisible = false) {
  const [visible, setVisible] = useState(defaultVisible);

  const toggle = useCallback(() => {
    setVisible((prev) => !prev);
  }, []);

  return {
    visible,
    toggle,
    type: visible ? "text" : "password",
  };
}