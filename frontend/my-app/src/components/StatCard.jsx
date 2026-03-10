import React from 'react';

const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className="card stat-card" style={{ borderLeft: `4px solid ${color}` }}>
      <div className="stat-info">
        <h3>{title}</h3>
        <p className="stat-value">{value}</p>
      </div>
      <div className="stat-icon" style={{ color: color }}>
        {icon}
      </div>
    </div>
  );
};

export default StatCard;