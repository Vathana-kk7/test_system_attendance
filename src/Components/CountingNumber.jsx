import React, { useState, useEffect } from 'react';

/**
 * A simple animated counter that ticks from 0 to the provided `number`.
 *
 * Props:
 * - number: target value to count to (required)
 * - duration: how long (ms) the animation should take (default 2000)
 * - ...props: spread onto the containing <span> (e.g. className)
 */
function CountingNumber({ number, duration = 2000, ...props }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = Number(number);
    if (isNaN(end)) return;

    // reset when number changes
    setCount(0);

    const stepTime = 50; // interval in ms
    const steps = Math.ceil(duration / stepTime);
    const increment = end / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.round(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [number, duration]);

  return <span {...props}>{count}</span>;
}

export default CountingNumber;
