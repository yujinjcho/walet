import React, { useEffect, useState } from 'react';
import { Row, ButtonToolbar } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import './BudgetSection.css';
import api from '../api';
import values from '../values';
import authHelper from '../authHelper';
import CellNumber from './CellNumber';

const defaultMonthIndex = -1;

const getBudgets = async (month, year, callback) => {
  const headers = {...{ 'Content-Type': 'application/json' }, ...authHelper.header()}
  const result = await api.fetchHelper(`/api/budgets?month=${month}&year=${year}`, { headers })
    .then(res => res.json())
    .then(res => res.result)
    .catch(_ => {
      console.error('failed to retrieve budget info');
      return [];
    });
  callback(result);
}

const budgetToMap = (budgets) => budgets.reduce((acc, x) => {acc[x.category_name] = x.budget; return acc}, {})

const BudgetSection = (props) => {
  const [budgets, setBudgets] = useState({});
  const { categories, month, year } = props;
  const monthNumber = values.months.indexOf(month) + 1;

  const fetchBudget = () => getBudgets(monthNumber, year, (r) => setBudgets(budgetToMap(r)));

  useEffect(() => {fetchBudget()}, []);

  useEffect(() => {fetchBudget()}, [month]);

  const handleBudgetChange = (categoryName) => (data) => {
    const newBudgetValue = data.target.valueAsNumber || 0;
    setBudgets({...budgets, ...{[categoryName]: newBudgetValue}});
  }

  const updateBudget = (month, callback) => () => {
    const request = {
      month,
      year,
      budgets: Object.keys(budgets).map(b => {return {categoryName: b, budget: budgets[b]}})
    }
    const headers = {...{ 'Content-Type': 'application/json' }, ...authHelper.header()}
    api.fetchHelper(`/api/budgets`, {
      headers,
      method: 'POST',
      body: JSON.stringify(request)
     })
      .then(_ => callback())
  }

  const categoriesWithSpending = categories.map(x => x.category);
  const budgetCategoriesWithNoSpending = Object.keys(budgets).filter(x => !categoriesWithSpending.includes(x) )

  const totalBudget = Object.values(budgets).reduce((a,b) => a + b, 0);
  const totalSpent = categories.map(x => x.amount).reduce((acc,x) => acc + x, 0);
  return (
    <>
      <Table bordered>
        <thead>
          <tr>
            <th style={{width:"55%"}}>Category</th>
            <th style={{width:"15%", textAlign: 'center'}}>Spent</th>
            <th style={{width:"15%", textAlign: 'center'}}>Budget</th>
            <th style={{width:"15%", textAlign: 'center'}}>Remaining</th>
          </tr>
        </thead>

        <tbody>

          { categories.map(category =>
            <tr key={category.category}>
              <td>{category.category}</td>
              <td className='cell-numbers'>
                 <CellNumber value={Math.round(category.amount)} />
              </td>
              <td>
                <Form>
                  <Form.Control
                    className='input-cell-numbers'
                    value={ budgets[category.category] || "0" }
                    as='input'
                    type="number"
                    onChange={handleBudgetChange(category.category)}
                  />
                </Form>
              </td>
              <td className='cell-numbers'>
                <CellNumber value={Math.round((budgets[category.category] || 0) - category.amount)} />
              </td>
            </tr>
          )}

          { budgetCategoriesWithNoSpending.map(category =>
            <tr key={category}>
              <td>{category}</td>
              <td>
                <CellNumber value={0} />
              </td>
              <td>
                <Form>
                  <Form.Control
                    className='input-cell-numbers'
                    value={ budgets[category] || "0" }
                    as='input'
                    type="number"
                    onChange={handleBudgetChange(category)}
                  />
                </Form>
              </td>
              <td>
                <CellNumber value={Math.round(budgets[category] || 0)} />
              </td>
            </tr>
          )}

          <tr className='budget-total'>
            <td>Total</td>
            <td>
              <CellNumber value={Math.round(totalSpent)} />
            </td>
            <td>
              <CellNumber value={Math.round(totalBudget)} />
            </td>
            <td>
              <CellNumber value={Math.round(totalBudget - totalSpent)} />
            </td>
          </tr>

        </tbody>
      </Table>

      <Container>

      <Row className="float-right">
        <Button className='budget-update-button' onClick={updateBudget(monthNumber, fetchBudget)}>
          Update Month
        </Button>
        <Button
          className='budget-update-button'
          variant={'success'}
          onClick={updateBudget(defaultMonthIndex, () => alert('default settings have been saved'))}
        >
          Save as Default
        </Button>
      </Row>

      </Container>
    </>
  );
}

export default BudgetSection;
