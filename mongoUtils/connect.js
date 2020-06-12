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
    callFunc(db, client);
  });
};

const mrCheckAndInsert = (db, dbCollections, inputData, collectionName) => {
  if (!dbCollections.includes(collectionName)) {
    db.createCollection(collectionName, function (err, res) {
      if (err) throw err;
      mrInsertOne(collectionName, inputData, () => {
        console.log(`add init ${collectionName}`);
      });
    });
  }
};

const mrInitCollections = () => {
  mrConnect((db) => {
    db.listCollections().toArray(function (err, collections) {
      const dbCollections = collections.map((item) => item.name);
      const inputUserData = {
        userName: "john",
        userPassword: "password123admin",
        role: "admin",
        token: "youraccesstokensecret",
      };
      const inputDataTransaction = {
        refId: "036c4805-229e-4bbd-ae2c-d14fb4be0fc8",
        orderId: "3333",
        callBackUrl: "http://localhost:4001/success",
        amount: "800",
        saleOrderId: "3333",
        SaleReferenceId: 5215660,
      };
      mrCheckAndInsert(db, dbCollections, inputUserData, "users");
      mrCheckAndInsert(db, dbCollections, inputDataTransaction, "transactions");
    });
  });
};

const mrFindAll = (collectionName, callFunc) => {
  mrConnect((db, client) => {
    db.collection(collectionName)
      .find({})
      .toArray((findErr, data) => {
        if (findErr) throw findErr;
        callFunc(data);
      });
    client.close();
  });
};

const mrInsertOne = (collectionName, input, callFunc) => {
  mrConnect((db, client) => {
    db.collection(collectionName).insertOne(input, (findErr, addResult) => {
      if (findErr) throw findErr;
      callFunc(input);
    });
    client.close();
  });
};

const mrUpdate = (collectionName, input, callFunc) => {
  const { id, ResCode,refId } = input;
  mrConnect((db, client) => {
    db.collection(collectionName).update({"refId": refId},{$set: { "ResCode": ResCode}}, (findErr, addResult) => {
      if (findErr) throw findErr;
      callFunc(input);
    });
    client.close();
  });
};

module.exports = {
  mrConnect,
  mrFindAll,
  mrInsertOne,
  mrInitCollections,
  mrCheckAndInsert,
  mrUpdate
};
