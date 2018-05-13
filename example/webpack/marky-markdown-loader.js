const marky = require('marky-markdown');

module.exports = function loader(content) {
  const html = marky('```jsx\n' + content + '\n```');

  return `module.exports = ${JSON.stringify(html)}`;
};

module.exports.seperable = true;
