const Highlights = require('highlights');

let highlighter = null;

const getOrInitHighlighter = () => {
  if (highlighter === null) {
    highlighter = new Highlights();
    highlighter.requireGrammarsSync({
      modulePath: require.resolve('language-babel/package.json'),
    });
  }
  return highlighter;
};

module.exports = function loader(content) {
  const highlighter = getOrInitHighlighter();

  const html = highlighter.highlightSync({
    fileContents: content,
    filePath: 'code.babel',
  });

  return `module.exports = ${JSON.stringify(html)}`;
};

module.exports.seperable = true;
