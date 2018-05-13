const Highlights = require('highlights');

let highlighter = null;

const getOrInitHighlighter = () => {
  if (highlighter === null) {
    highlighter = new Highlights();
  }
  return highlighter;
};

module.exports = function loader(content) {
  const highlighter = getOrInitHighlighter();

  const html = highlighter.highlightSync({
    fileContents: content,
    filePath: this.resourcePath + 'x',
  })

  return `module.exports = ${JSON.stringify(html)}`;
};

module.exports.seperable = true;
