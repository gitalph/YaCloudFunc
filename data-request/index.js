const { findUsers } = require('./db');

const answerTemplate = {
  statusCode: 200,
  headers: { 'Content-Type': 'application/json' },
  isBase64Encoded: false,
};

module.exports.handler = async (event) => {
  console.log(event.queryStringParameters);
  if (event.queryStringParameters) {
    const data = await findUsers(event.queryStringParameters);
    return {
      ...answerTemplate,
      body: JSON.stringify(data),
    };
  }
  return {
    ...answerTemplate,
    body: JSON.stringify([]),
  };
};
