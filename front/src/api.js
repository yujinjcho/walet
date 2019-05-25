
import values from './values';
import authHelper from './authHelper';

const loadTransactions = (accountId, monthName) => {
  const month = values.months.indexOf(monthName) + 1;

  return fetch(`/api/transactions?month=${month}`, { headers: authHelper.header() })
    .then(res => res.json())
    .catch(e => {
      console.warn("loadTransaction failed: ")
      console.warn(e)
    })
}

const loadCategoryRules = (accountId) => {
  return fetch(`/api/category_rules`, { headers: authHelper.header() })
    .then(res => res.json())
    .catch(e => {
      console.warn("loadCategoryRules failed: ")
      console.warn(e)
    })
};

const loadTagRules = (accountId) => {
  return fetch(`/api/tag_rules`, { headers: authHelper.header() })
    .then(res => res.json())
    .catch(e => {
      console.warn("loadTagRules failed: ")
      console.warn(e)
    })
};

const loadCategories = (accountId) => {
  return fetch(`/api/categories`, { headers: authHelper.header() })
    .then(res => res.json())
    .catch(e => {
      console.warn("loadCategories failed: ")
      console.warn(e)
    })
}

const loadTags = (accountId) => {
  return fetch(`/api/tags`, { headers: authHelper.header() })
    .then(res => res.json())
    .catch(e => {
      console.warn("loadTags failed: ")
      console.warn(e)
    })
}

export default {
  loadTransactions,
  loadCategoryRules,
  loadTagRules,
  loadCategories,
  loadTags
};
