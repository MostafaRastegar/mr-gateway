const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const dotenv = require("dotenv");
dotenv.config();
const { DB_URL, DB_NAME } = process.env;

const mrConnect = (callFunc) => {
  MongoClient.connect(DB_URL, function (err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    db = client.db(DB_NAME);
    callFunc(db);
    client.close();
  });
};

const mrFindAll = (collectionName, callFunc) => {
  mrConnect((db) => {
    db.collection(collectionName)
      .find({})
      .toArray((findErr, data) => {
        if (findErr) throw findErr;
        callFunc(data);
      });
  });
};

const mrInsertOne = (collectionName, input, callFunc) => {
  mrConnect((db) => {    
    db.collection(collectionName).insertOne(input, (findErr, addResult) => {
      if (findErr) throw findErr;
      callFunc(input);
    });
  })
};

module.exports = {
  mrConnect,
  mrFindAll,
  mrInsertOne,
};
