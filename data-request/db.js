const { MongoClient } = require('mongodb');

const { DB_URI, DB_NAME } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

let dbo = false;

async function getDB() {
  if (!dbo) {
    const client = await MongoClient.connect(DB_URI, options);
    dbo = client.db(DB_NAME);
  }
  return dbo;
}

module.exports = {
  findUsers: async ({ first_name, last_name }) => {
    const db = await getDB();
    const query = first_name ? { first_name } : {};
    if (last_name) query.last_name = last_name;

    return db.collection('users').find({ ...query }).project({
      id: 1, first_name: 1, last_name: 1, avatar: 1, _id: 0,
    }).toArray();
  },
};
