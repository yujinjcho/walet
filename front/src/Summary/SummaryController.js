import React from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import values from '../values';
import ControllerSelect from './ControllerSelect';

import './SummaryController.css';

const convertToOptions = (input) => input.map(x => { return { value:x, label:x } });

const SummaryController = (props) => {
  const {
    currentMonth,
    currentMode,
    selectTags,
    tags,
    handleActiveTagChange,
    toggleShouldExcludeTags,
    updateMode,
    updateMonth
  } = props;
  const modeOptions = convertToOptions(values.modes);
  const monthOptions = convertToOptions(values.months);
  const tagOptions = convertToOptions(tags);
  const selectedTagOptions = convertToOptions(selectTags);

  return (
      <Row className='summary-controller'>
        <Col xs={12} >
          <ListGroup>
            <ListGroup.Item className='controller-section'>
              <Container>

                <ControllerSelect
                  label='Mode'
                  defaultValue={ modeOptions.find(x => x.value === currentMode) }
                  options={ modeOptions }
                  onChange={ updateMode }
                />

                <ControllerSelect
                  label='Date'
                  defaultValue={ monthOptions.find(x => x.value === currentMonth) }
                  options={ monthOptions }
                  onChange= { updateMonth }
                />

                <ControllerSelect
                  label='Tags'
                  isMulti
                  tags
                  value = { selectedTagOptions }
                  options={ tagOptions }
                  onChange = {handleActiveTagChange }
                />

                <Row className='toggle-tags'>
                  <Col xs={3} >
                    <Form.Check
                      defaultChecked
                      type="radio"
                      label='Exclude tags'
                      name="excludeTags"
                      id="exclude"
                      onClick = { toggleShouldExcludeTags }
                    />
                  </Col>

                  <Col xs={3} >
                    <Form.Check
                      type="radio"
                      label='Only show tags'
                      name="excludeTags"
                      id="notExclude"
                      onClick = { toggleShouldExcludeTags }
                    />
                  </Col>
                </Row>

              </Container>

            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>

  )
}

export default SummaryController
