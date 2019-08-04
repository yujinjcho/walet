import React from 'react';

import './DescriptionIcon.css'

const DescriptionIcon = (props) => {
  return (
    <div className='description-icon'>
      <i className={`fas fa-${props.icon} fa-2x`}></i>
    </div>
  );
}

export default DescriptionIcon;
