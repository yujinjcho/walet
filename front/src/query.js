import { parse } from 'qs';

const parameters = () => parse(window.location.search, { ignoreQueryPrefix: true });

export default {
  parameters
};
