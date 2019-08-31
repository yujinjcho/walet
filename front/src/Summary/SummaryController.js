import React from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import values from '../values';
import ControllerSelect from './ControllerSelect';
import Select from 'react-select';

import './SummaryController.css';

const convertToOptions = (input) => input.map(x => { return { value:x, label:x } });

const SummaryController = (props) => {
  const {
    currentMonth,
    currentYear,
    currentMode,
    selectTags,
    accounts,
    selectAccounts,
    tags,
    handleActiveTagChange,
    handleAccountChange,
    toggleShouldExcludeTags,
    updateMode,
    updateMonth,
    updateYear,
  } = props;
  const modeOptions = convertToOptions(values.modes);
  const accountOptions = convertToOptions(accounts);
  const monthOptions = convertToOptions(values.months);
  const tagOptions = convertToOptions(tags);
  const yearOptions = convertToOptions(values.years);

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

                {/* update years */}
                <Row className='controller-select-row'>
                  <Col xs={1} >
                    <div>
                      {'Date'}
                    </div>
                  </Col>
                  <Col xs={3} >
                      <Select
                        options={ monthOptions }
                        defaultValue={ monthOptions.find(x => x.value === currentMonth) }
                        onChange= { updateMonth }
                      />
                  </Col>
                  <Col xs={2} >
                      <Select
                        defaultValue={ yearOptions.find(y => y.value === currentYear.toString()) }
                        options={ yearOptions }
                        onChange= { updateYear }
                      />
                  </Col>
                </Row>

                <ControllerSelect
                  label='Accounts'
                  isMulti
                  tags
                  value = { convertToOptions(selectAccounts) }
                  options={ accountOptions }
                  onChange = {handleAccountChange }
                />

                <ControllerSelect
                  label='Tags'
                  isMulti
                  tags
                  value = { convertToOptions(selectTags) }
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
