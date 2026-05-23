import { useState, useEffect } from "react";
import { getMutualsState, subscribeMutuals } from "../../utils/mutualsStorage";

export function useMutuals() {
  const [s, setS] = useState(getMutualsState());
  useEffect(() => subscribeMutuals(setS), []);
  return s;
}
