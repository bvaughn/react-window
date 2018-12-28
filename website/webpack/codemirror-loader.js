const CodeMirror = require('codemirror/addon/runmode/runmode.node.js');
require('codemirror/mode/javascript/javascript.js');
require('codemirror/mode/jsx/jsx.js');

const LANGUAGE = 'jsx';

const escapeStyle = style => style.replace(/(^|\s+)/g, '$1cm-');
const escapeText = string =>
  string.replace(/[<&]/g, function(ch) {
    return ch === '&' ? '&amp;' : '&lt;';
  });

module.exports = function loader(content) {
  let currentStyle = '';
  let currentText = '';
  let html = '';

  const appendToLine = () => {
    if (currentStyle) {
      html += `<span class="${escapeStyle(currentStyle)}">${escapeText(
        currentText
      )}</span>`;
    } else {
      html += escapeText(currentText);
    }
  };

  CodeMirror.runMode(content, LANGUAGE, (text, style) => {
    if (style !== currentStyle) {
      appendToLine();
      currentStyle = style;
      currentText = text;
    } else {
      currentText += text;
    }
  });
  appendToLine();

  const lines = html.split(/\n/).map(line => {
    if (!line) {
      line = '&nbsp;'; // Don't collapse empty lines
    }

    let className = 'CodeMirror-line';

    if (line.includes('// !!')) {
      line = line.replace('// !!', '');
      className += ' CodeMirror-line-highlight';
    }

    return `<pre class="${className}" role="presentation">${line}</pre>\n`;
  });

  return `module.exports = ${JSON.stringify(lines.join('\n'))}`;
};

module.exports.seperable = true;
