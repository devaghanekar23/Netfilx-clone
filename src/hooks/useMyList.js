import { useCallback, useEffect, useState } from 'react';

const KEY = 'netflix-clone-my-list';

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export default function useMyList() {
  const [list, setList] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(list));
    } catch {
      /* storage may be unavailable */
    }
  }, [list]);

  const has = useCallback(
    (item) => list.some((i) => i.id === item.id && i.media_type === item.media_type),
    [list]
  );

  const toggle = useCallback((item) => {
    setList((prev) =>
      prev.some((i) => i.id === item.id && i.media_type === item.media_type)
        ? prev.filter((i) => !(i.id === item.id && i.media_type === item.media_type))
        : [item, ...prev]
    );
  }, []);

  return { list, has, toggle };
}
