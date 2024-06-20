import { JSCodeshift } from 'jscodeshift';

module.exports = function (fileInfo, api) {
  const j: JSCodeshift = api.jscodeshift;
  const root = j(fileInfo.source);

  const findTransactionContextVariableId = (path) => {
    const firstVariableId = path.value.right.properties
      .find((property) => property.key.name === 'variables')
      .value.properties.find((property2) => {
        return property2.value.properties?.some(
          (property3) => property3.key.name === 'id',
        );
      });

    return firstVariableId
      ? firstVariableId.value.properties.find((p) => p.key.name === 'id')?.value
      : null;
  };

  root
    .find(j.AssignmentExpression, {
      left: {
        object: { name: 'transaction' },
        property: { name: 'context' },
      },
    })
    .forEach((path) => {
      const t = findTransactionContextVariableId(path);
      if (t) {
        const actionsPropertyAssignment = j.objectProperty(
          j.identifier('actions'),
          j.arrayExpression([
            j.templateLiteral(
              t.quasis.map((q) => j.templateElement(q.value, q.tail)),
              t.expressions.map((e) =>
                j.memberExpression(e.object, e.property),
              ),
            ),
          ]),
        );

        path.value.right["properties"].unshift(actionsPropertyAssignment);
      }
    });

  return root.toSource();
};
