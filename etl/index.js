// eslint-disable-next-line import/no-unresolved
const fetch = require('node-fetch');
const db = require('./db');

module.exports.handler = async (event, context) => {
  if (event.messages
    && event.messages[0].details
    && event.messages[0].details.trigger_id) {
    const res = await fetch('https://reqres.in/api/users');
    let { data, total_pages: page } = await res.json();
    while (page > 1) {
      fetch(`https://functions.yandexcloud.net/${context.functionName}?page=${page}`);
      page--;
    }
    await db.insertUsers({ data });
    return {};
  }
  if (event.queryStringParameters) {
    const { page } = event.queryStringParameters;
    if (!page) return {};
    const res = await fetch(`https://reqres.in/api/users?page=${page}`);
    const { data } = await res.json();
    await db.insertUsers({ data });
    return {};
  }
};
