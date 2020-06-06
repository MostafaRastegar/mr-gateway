const express = require("express");
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { v4: uuidv4 } = require("uuid");
dotenv.config();
const { ACCESS_TOKEN, DB_URL } = process.env;
const url = 'mongodb://localhost:27017';
const dbName = 'test';

// const users = [
//   {
//     userName: "john",
//     userPassword: "password123admin",
//     role: "admin",
//     token: "youraccesstokensecret",
//   },
//   {
//     userName: "anna",
//     userPassword: "password123member",
//     role: "member",
//     token: "youraccesstokensecret",
//   },
// ];

var router = express.Router();
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

/* GET users listing. */
router.post("/login", function (req, res, next) {
  const { userName, userPassword, token } = req.body;
  // Use connect method to connect to the
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    db = client.db(dbName);
    db.collection('users').find({}).toArray((findErr, result) => {
      if (findErr) throw findErr
      // Filter user from the users array by userName and userPassword
      const user = result.find((u) => {
        return u.userName === userName && u.userPassword === userPassword;
      });
      if (user && user.token === ACCESS_TOKEN) {
        res.json({
          status: 'ok'
        });
      } else {
        res.send("Username or userPassword incorrect");
      }
    });
    client.close();
  });
});

router.post("/bank", function (req, res, next) {
  const { orderId, token, callBackUrl, amount, userName, userPassword } = req.body;
  const refId = uuidv4();
  const result = {
    refId,
    orderId,
    callBackUrl,
    amount,
    saleOrderId: orderId,
    SaleReferenceId: Math.floor(Math.random() * 10000000),
  }

  // Use connect method to connect to the
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    db = client.db(dbName);
    db.collection('transaction').insertOne(result, (findErr, addResult) => {
      if (findErr) throw findErr
      res.render("bank", { title: "Bank gateway", result });
      client.close();
    });
  });


});

// router.post("/login", (req, res) => {
//   // Read userName and userPassword from request body
//   const { userName, userPassword, token } = req.body;
//
//   // Filter user from the users array by userName and userPassword
//   const user = users.find((u) => {
//     return u.userName === userName && u.userPassword === userPassword;
//   });
//
//   console.log({
//     ACCESS_TOKEN,
//     user
//   })
//
//   if (user && user.token === ACCESS_TOKEN) {
//     // Generate an access token
//     const accessToken = jwt.sign(
//       { userName: user.userName, role: user.role },
//       ACCESS_TOKEN
//     );
//     const refId = uuidv4(null,null,5);
//
//     // res.json({
//     //   accessToken,
//     // });
//     res.json({
//       refId
//     });
//   } else {
//     res.send("Username or userPassword incorrect");
//   }
// });

module.exports = router;
