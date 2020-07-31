/* eslint camelcase: 0 */
const fetch = require('node-fetch');

const token = process.env.TG_TOKEN;

const answerTemplate = {
  statusCode: 200,
  headers: { 'Content-Type': 'application/json' },
  isBase64Encoded: false,
};

module.exports = {
  telegramResponse: ({ id }) => ({ text }) => ({
    ...answerTemplate,
    body: JSON.stringify({
      method: 'sendMessage',
      chat_id: id,
      text,
    }),
  }),

  telegramSendUser: ({ id }) => ({ first_name, last_name, avatar }) => {
    if (avatar) {
      return fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
        method: 'post',
        body: JSON.stringify({
          chat_id: id,
          photo: avatar,
          caption: `${first_name} ${last_name}`,
        }),
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'post',
      body: JSON.stringify({
        chat_id: id,
        text: `${first_name} ${last_name}`,
      }),
      headers: { 'Content-Type': 'application/json' },
    });
  },
};
