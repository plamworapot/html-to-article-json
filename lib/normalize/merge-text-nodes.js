const getTextFormattings = require('../text-formattings');
const generateFunction = require('generate-function');

module.exports = function (opts) {
  const textFormattings = getTextFormattings(opts);
  const sameTypeTextNodes = createSameTypeTextNodes(textFormattings);

  return function (tree) {
    tree.forEach(function (node) {
      if (node.children) {
        node.children = mergeTextNodes(sameTypeTextNodes, node.children);
      }
    });
  };
};

function mergeTextNodes (sameTypeTextNodes, tree) {
  let textNode;
  const merged = [];

  tree.forEach(function (node) {
    if (node.type === 'text') {
      if (textNode) {
        if (sameTypeTextNodes(textNode, node)) {
          textNode.content = textNode.content + node.content;
        } else {
          merged.push(textNode);
          textNode = node;
        }
      } else {
        textNode = node;
      }
    } else {
      if (textNode) {
        merged.push(textNode);
        textNode = null;
      }

      merged.push(node);
    }
  });

  if (textNode) {
    merged.push(textNode);
  }
  return merged;
}

function createSameTypeTextNodes (textFormattings) {
  let fn = generateFunction();
  fn = fn('function (nodeA, nodeB) {');

  fn = fn('return ' + textFormattings
    .map(function (row) {
      return row.property;
    })
    .filter(function (property) {
      return property !== 'content';
    })
    .map(function (property) {
      return 'nodeA[\'' + property + '\'] === nodeB[\'' + property + '\']';
    })
    .join('&&'));

  fn = fn('}');
  return fn.toFunction();
}