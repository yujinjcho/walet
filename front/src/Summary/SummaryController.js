import React from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Select from 'react-select';

import values from '../values';

const convertToOptions = (input) => input.map(x => { return { value:x, label:x } });

const SummaryController = (props) => {
  const {
    currentMonth,
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

                <Row className='date-tag-select'>
                  <Col xs={1} >
                    <div>
                      Mode
                    </div>
                  </Col>
                  <Col xs={3} >
                      <Select
                        className='active-date'
                        defaultValue={ modeOptions.find(x => x.value === 'Rules') }
                        options={ modeOptions }
                        onChange={ updateMode }
                      />
                  </Col>
                </Row>

                <Row className='date-tag-select'>
                  <Col xs={1} >
                    <div>
                      Date
                    </div>
                  </Col>
                  <Col xs={3} >
                      <Select
                        className='active-date'
                        label='some label'
                        defaultValue={ monthOptions.find(x => x.value === currentMonth) }
                        options={ monthOptions }
                        onChange= { updateMonth }
                      />
                  </Col>
                </Row>

                <Row className='date-tag-select'>
                  <Col xs={1} >
                    <div>
                      Tags
                    </div>
                  </Col>
                  <Col xs={3} >
                    <Select
                      className="active-tags"
                      isMulti
                      tags
                      value = { selectedTagOptions }
                      options={ tagOptions }
                      onChange = {handleActiveTagChange }
                    />
                  </Col>

                </Row>

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
