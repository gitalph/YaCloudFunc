/* eslint camelcase: 0 */
const fetch = require('node-fetch');
const querystring = require('querystring');
const { telegramResponse, telegramSendUser } = require('./tlg');

const findCloudFunc = process.env.FIND_FUNC;

const welcomeText = `интерфейс (самый аскетичный) — введите имя или фамилию
(либо и то и другое через пробел) для выполнения поиска в БД:`;

async function find({ firstName, lastName }) {
  const query = firstName ? { first_name: firstName } : {};
  if (lastName) query.last_name = lastName;

  const res = await fetch(`https://functions.yandexcloud.net/${findCloudFunc}?${querystring.stringify({ ...query })}`);
  return res.json();
}

module.exports.handler = async (event) => {
  const { message: { chat, text } } = JSON.parse(event.body);
  const responseFunc = telegramResponse(chat);
  const sendFunc = telegramSendUser(chat);
  if (!text || text.includes('/')) {
    return responseFunc({ text: welcomeText });
  }

  const [firstName, lastName] = text.split(' ');

  const foundData = await (
    lastName ? find({ firstName, lastName })
      : Promise.all([
        find({ firstName }),
        find({ lastName: firstName }),
      ]).then(([data1, data2]) => {
        const IDS = new Set(data1.map(({ id }) => id));
        return [...data1, ...data2.filter(({ id }) => !IDS.has(id))];
      })
  );

  // eslint-disable-next-line no-restricted-syntax
  for (const user of foundData) {
    // eslint-disable-next-line no-await-in-loop
    await sendFunc(user);
  }

  const res = { query: `${firstName} ${lastName}`, count: foundData.length };

  return responseFunc({ text: JSON.stringify(res) });
};
