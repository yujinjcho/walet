import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Select from 'react-select';

import './ControllerSelect.css'

const ControllerSelect = (props) => {
  const { label, ...selectProps } = props;
  return (
    <Row className='controller-select-row'>
      <Col xs={1} >
        <div>
          {label}
        </div>
      </Col>
      <Col xs={3} >
          <Select
            className='controller-select'
            {...selectProps}
          />
      </Col>
    </Row>
  );
}

export default ControllerSelect;
