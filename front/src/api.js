import values from './values';
import authHelper from './authHelper';

const baseUrl = process.env.REACT_APP_SERVICES_BASE_URL || '';

const fetchHelper = (url, options = {}) => fetch(baseUrl + url, options);

const loadTransactions = (accountId, monthName) => {
  const month = values.months.indexOf(monthName) + 1;

  return fetchHelper(`/api/transactions?month=${month}`, { headers: authHelper.header() })
    .then(res => res.json())
    .catch(e => {
      console.warn("loadTransaction failed: ")
      console.warn(e)
    })
}

const loadCategoryRules = (accountId) => {
  return fetchHelper(`/api/category_rules`, { headers: authHelper.header() })
    .then(res => res.json())
    .catch(e => {
      console.warn("loadCategoryRules failed: ")
      console.warn(e)
    })
};

const loadTagRules = (accountId) => {
  return fetchHelper(`/api/tag_rules`, { headers: authHelper.header() })
    .then(res => res.json())
    .catch(e => {
      console.warn("loadTagRules failed: ")
      console.warn(e)
    })
};

const loadCategories = (accountId) => {
  return fetchHelper(`/api/categories`, { headers: authHelper.header() })
    .then(res => res.json())
    .catch(e => {
      console.warn("loadCategories failed: ")
      console.warn(e)
    })
}

const loadTags = (accountId) => {
  return fetchHelper(`/api/tags`, { headers: authHelper.header() })
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
  loadTags,
  fetchHelper
};
