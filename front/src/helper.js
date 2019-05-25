
const applyRules = (transactions, categoryRules, tagRules, tags, shouldExcludeTags) => {
  const updatedTransactions = applyCategoryRules(transactions, categoryRules);
  const transactionsWithTags = assignTags(updatedTransactions, tagRules);
  const result = applyTagRules(transactionsWithTags, tags, shouldExcludeTags);
  return result;
};

const createSummary = (transactions) => {
  const summary = transactions
    .filter(t => t.show)
    .reduce(
      (acc,x) => {
        if (acc.hasOwnProperty(x.assignedCategory)) {
          acc[x.assignedCategory].amount += x.amount;
          acc[x.assignedCategory].transactions.push(x);
        } else {
          acc[x.assignedCategory] = {
            amount: x.amount,
            transactions: [x]
          }
        }
        return acc;
      }
      ,{})

  return Object.keys(summary).map(c => {return {category: c, amount: summary[c].amount, transactions: summary[c].transactions }});
};

const groupTransactions = (transactions) => {
  return transactions
    .reduce(
      (acc,x) => {
        acc.hasOwnProperty(x.category) ? acc[x.category].push(x) : acc[x.category] = [x];
        return acc;
      }
      ,{})
};

const applyCategoryRules = (transactions, categoryRules) => {
  const transactionIdLookup = createCategoryLookup(categoryRules, 'transaction_id')
  const nameLookup = createCategoryLookup(categoryRules, 'name')
  const nameContainsLookup = createCategoryLookup(categoryRules, 'name_contains')
  const categoryIdLookup = createCategoryLookup(categoryRules, 'category_id')

  return transactions.map(transaction => assignCategory(transaction, transactionIdLookup, nameLookup, nameContainsLookup, categoryIdLookup))
};

const applyTagRules = (transactions, tags, shouldExcludeTags) => {
  return transactions.map(t => {
    const meetsCriteria = intersects(t.tags, tags);
    return Object.assign(t, { show: shouldExcludeTags ? !meetsCriteria : meetsCriteria });
  });
};

const assignTags = (transactions, tagRules) => {
  const ruleFromTransactionIds = tagRules.filter(r => r['target_type'] === 'transaction_id');
  const ruleFromTransactionIdsLookup = createTagLookup(ruleFromTransactionIds, 'transaction_id');

  const ruleFromNames = tagRules.filter(r => r['target_type'] === 'name')
  const ruleFromNamesLookup = createTagLookup(ruleFromNames, 'name');

  const ruleFromNameContains = tagRules.filter(r => r['target_type'] === 'name_contains')
  const ruleFromNameContainsLookup = createTagLookup(ruleFromNameContains, 'name_contains');

  const ruleFromCategories = tagRules.filter(r => r['target_type'] === 'category')
  const ruleFromCategoriesLookup = createTagLookup(ruleFromCategories, 'category');

  return transactions.map(t => {
    const idTags = ruleFromTransactionIdsLookup[t.transaction_id] || [];
    const nameTags = ruleFromNamesLookup[t.name] || [];
    const nameContainsTags = Object.keys(ruleFromNameContainsLookup).flatMap(nameContainsKey => {
      return t.name.toLowerCase().includes(nameContainsKey.toLowerCase())
        ? ruleFromNameContainsLookup[nameContainsKey]
        : []
    });
    const categoryTags = ruleFromCategoriesLookup[t.assignedCategory] || [];
    const tags = Array.from(new Set(idTags.concat(nameTags).concat(nameContainsTags).concat(categoryTags)))

    return Object.assign(t, {tags: tags})
  })
};


const intersects = (ruleTags, tags) => ruleTags.filter(rt => tags.includes(rt)).length > 0;

const createLookup = (rules, targetType, field) => rules
  .filter(x => x.target_type === targetType)
  .reduce((acc, x) => {
    acc[x.target_value] = x[field];
    return acc;
  }, {});

const createTagLookup = (rules, targetType) => createLookup(rules, targetType, 'tags')

const createCategoryLookup = (rules, targetType) => createLookup(rules, targetType, 'category')

const assignCategory = (transaction, transactionIdLookup, nameLookup, nameContainsLookup, categoryIdLookup) => {
  return Object.assign(
    transaction,
    { 'assignedCategory': selectCategory(transaction, transactionIdLookup, nameLookup, nameContainsLookup, categoryIdLookup) }
  )
};

const selectCategory = (transaction, transactionIdLookup, nameLookup, nameContainsLookup, categoryIdLookup) => {
  if (transactionIdLookup.hasOwnProperty(transaction.transaction_id)) {
    return transactionIdLookup[transaction.transaction_id];
  };

  if (nameLookup.hasOwnProperty(transaction.name)) {
    return nameLookup[transaction.name];
  };

  for (const nameContainsPattern of Object.keys(nameContainsLookup)) {
    if (transaction.name.toLowerCase().includes(nameContainsPattern.toLowerCase())) {
      return nameContainsLookup[nameContainsPattern];
    };
  };

  if (categoryIdLookup.hasOwnProperty(transaction.category_id)) {
    return categoryIdLookup[transaction.category_id];
  }

  return transaction.category.length > 0 ? transaction.category[0] : 'N/A';
};

export default {
  createSummary,
  applyRules,
  groupTransactions
};
