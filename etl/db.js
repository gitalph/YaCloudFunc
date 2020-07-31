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
  insertUsers: async ({ data }) => {
    try {
      const db = await getDB();
      await db.createIndex('users', { id: 1 }, { unique: true });
      await db.createIndex('users', { first_name: 1, last_name: 1 });
      await db.createIndex('users', { last_name: 1 });
      await db.collection('users').insertMany(data, {
        ordered: false,
      });
    } catch (e) {
      if (e.writeErrors) console.log(`duplicate key error count: ${e.writeErrors.length}`);
    }
  },
};
