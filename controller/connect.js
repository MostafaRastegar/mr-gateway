const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const dotenv = require("dotenv");
dotenv.config();
const {
  MONGO_DB,
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_HOSTNAME,
  MONGO_PORT,
} = process.env;
const checkedMongoUserPass =
  MONGO_USERNAME && MONGO_PASSWORD
    ? MONGO_USERNAME + ":" + MONGO_PASSWORD + "@"
    : "";
const dbUrl = `mongodb://${checkedMongoUserPass}${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;
const mrConnect = (callFunc) => {
  MongoClient.connect(dbUrl, function (err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    db = client.db(MONGO_DB);
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
        userName: "mr_gateway",
        userPassword: "mr_gateway_123456",
        terminalId: 442530,
      };
      const inputDataTransaction = {
        orderId: "3355",
        callBackUrl: "http://localhost:4001/success",
        amount: "650000",
        localDate: "20201606",
        localTime: "101920",
        payerId: "10",
        additionalData: "this is for test",
        refId: "e363b21d-c8fa-445e-8c8d-d6b2c1250c8e",
        saleOrderId: "3355",
        saleReferenceId: 9012415,
        resCode: "0",
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
  const { selector, data } = input;
  mrConnect((db, client) => {
    db.collection(collectionName).update(
      selector,
      { $set: data },
      (findErr, addResult) => {
        if (findErr) throw findErr;
        callFunc({ ...input.selector });
      }
    );
    client.close();
  });
};

module.exports = {
  mrConnect,
  mrFindAll,
  mrInsertOne,
  mrInitCollections,
  mrCheckAndInsert,
  mrUpdate,
};
