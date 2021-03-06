import React from 'react';
import './MenuTypesDesktop.css';

const MenuTypesDesktop = ({ types, selectedType, onSelect }) => {
  return (
    <div className="menu-types">
      <h1 className="menu-types__heading">Menu</h1>
      <ul>
        {types.map((t) => (
          <li
            key={t.id}
            className={selectedType === t.type ? 'active' : ''}
            onClick={onSelect.bind(null, t.type)}
          >
            {t.type}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenuTypesDesktop;
