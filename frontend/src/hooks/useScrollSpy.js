import { useEffect, useState } from 'react';

/**
 * Reports which section is currently in view. Drives the rail LEDs and the
 * active nav link.
 */
export function useScrollSpy(sectionIds, offset = 120) {
  const [activeId, setActiveId] = useState(sectionIds[0] ?? null);

  useEffect(() => {
    if (!sectionIds.length) return undefined;

    const onScroll = () => {
      const marker = window.scrollY + offset;
      let current = sectionIds[0];
      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element && element.offsetTop <= marker) current = id;
      }
      setActiveId(current);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [sectionIds, offset]);

  return activeId;
}
