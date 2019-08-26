import React, { useEffect, useState } from 'react';
import { Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import './BudgetSection.css';
import api from '../api';
import values from '../values';
import authHelper from '../authHelper';

const BudgetSection = (props) => {
  const [budgets, setBudgets] = useState({});
  const { categories, month, year } = props;
  const monthNumber = values.months.indexOf(month) + 1;

  const fetchBudget = async () => {
    const headers = {...{ 'Content-Type': 'application/json' }, ...authHelper.header()}
    const result = await api.fetchHelper(`/api/budgets?month=${monthNumber}&year=${year}`, { headers })
      .then(res => res.json())
      .then(res => res.result)
      .catch(_ => {
        console.error('failed to retrieve budget info');
        return [];
      })

    const budgetByName = result.reduce((acc, x) => {acc[x.category_name] = x.budget; return acc}, {})
    setBudgets(budgetByName);
  };

  useEffect(() => {fetchBudget()}, []);

  useEffect(() => {fetchBudget()}, [month]);

  const handleBudgetChange = (categoryName) => (data) => {
    const newBudgetValue = data.target.valueAsNumber || 0;
    setBudgets({...budgets, ...{[categoryName]: newBudgetValue}});
  }

  const updateBudget = () => {
    const request = {
      month: monthNumber,
      year: year,
      budgets: Object.keys(budgets).map(b => {return {categoryName: b, budget: budgets[b]}})
    }
    const headers = {...{ 'Content-Type': 'application/json' }, ...authHelper.header()}
    api.fetchHelper(`/api/budgets`, {
      headers,
      method: 'POST',
      body: JSON.stringify(request)
     })
      .then(_ => fetchBudget())
  }

  // TODO: append section for budgets with no spending
  const categoriesWithSpending = categories.map(x => x.category);
  console.log(categoriesWithSpending);
  const budgetCategoriesWithNoSpending = Object.keys(budgets).filter(x => !categoriesWithSpending.includes(x) )
  console.log(budgetCategoriesWithNoSpending);

  const totalBudget = Object.values(budgets).reduce((a,b) => a + b, 0);
  const totalSpent = categories.map(x => x.amount).reduce((acc,x) => acc + x, 0);
  return (
    <>
      <Table bordered>
        <thead>
          <tr>
            <th style={{width:"55%"}}>Category</th>
            <th style={{width:"15%"}}>Spent</th>
            <th style={{width:"15%"}}>Budget</th>
            <th style={{width:"15%"}}>Remaining</th>
          </tr>
        </thead>

        <tbody>

          { categories.map(category =>
            <tr key={category.category}>
              <td>{category.category}</td>
              <td>{Math.round(category.amount)}</td>
              <td>
                <Form>
                  <Form.Control
                    value={ budgets[category.category] || "0" }
                    as='input'
                    type="number"
                    onChange={handleBudgetChange(category.category)}
                  />
                </Form>
              </td>
              <td>{Math.round((budgets[category.category] || 0) - category.amount)}</td>
            </tr>
          )}

          { budgetCategoriesWithNoSpending.map(category =>
            <tr key={category}>
              <td>{category}</td>
              <td>{0}</td>
              <td>
                <Form>
                  <Form.Control
                    value={ budgets[category] || "0" }
                    as='input'
                    type="number"
                    onChange={handleBudgetChange(category)}
                  />
                </Form>
              </td>
              <td>{Math.round(budgets[category] || 0)}</td>
            </tr>
          )}

          <tr className='budget-total'>
            <td>Total</td>
            <td>{Math.round(totalSpent)}</td>
            <td>{Math.round(totalBudget)}</td>
            <td>{Math.round(totalBudget - totalSpent)}</td>
          </tr>

        </tbody>
      </Table>

      <Container>

      <Row className="float-right">
          <Button onClick={updateBudget}>
            Save Changes
          </Button>
      </Row>

      </Container>
    </>
  );
}

export default BudgetSection;
