import React from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import './BudgetSection.css'

const BudgetSection = (props) => {
  const { budget, categories } = props;
  const budgetByName = budget.reduce((acc, x) => {acc[x.category_name] = x.budget; return acc}, {})
  const totalBudget = budget.map(x => x.budget).reduce((a,b) => a + b, 0);
  const totalSpent = categories.map(x => x.amount).reduce((acc,x) => acc + x, 0);
  return (
    <>
      <Table bordered hover>
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
                  <Form.Control value={ budgetByName[category.category] || "0" } as='input' size='sm' type="number" />
                </Form>
              </td>
              <td>{Math.round((budgetByName[category.category] || 0) - category.amount)}</td>
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

    </>
  );
}

export default BudgetSection;
