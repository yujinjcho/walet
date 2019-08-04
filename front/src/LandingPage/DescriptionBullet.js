import React from 'react';

import './DescriptionBullet.css'

const DescriptionBullet = (props) => {
  return (
    <div className='description-bullet-container'>
      <h2>
        {props.title}
      </h2>
      <div>
        {props.description}
      </div>
    </div>
  );
}

export default DescriptionBullet;
