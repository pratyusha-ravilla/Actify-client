import React, { useEffect, useState } from "react";
import "./Stats.css";

const StatItem = ({ label, value, duration = 1500 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = Math.ceil(value / (duration / 16));

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, duration]);

  return (
    <div className="stat-card">
      <h3>{count}+</h3>
      <p>{label}</p>
    </div>
  );
};

export default function Stats() {
  return (
    <section className="stats-section" id="stats">
      <StatItem label="Activity Reports" value={700} />
      <StatItem label="Faculty Members" value={80} />
      <StatItem label="Departments" value={6} />
    </section>
  );
}
