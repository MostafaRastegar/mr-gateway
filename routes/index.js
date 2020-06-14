const express = require("express");
const dotenv = require("dotenv");
const dateTime = require("node-datetime");
const serverdateTime = dateTime.create();

const {
  mrConnect,
  mrFindAll,
  mrInsertOne,
  mrInitCollections,
  mrUpdate,
} = require("../mongoUtils/connect");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();
dotenv.config();

/* GET home page. */
router.get("/", function (req, res, next) {
  mrInitCollections();
  res.render("index", { title: "mr-gateway" });
});

/* GET users page. */
router.get("/users", function (req, res, next) {
  mrFindAll("users", (data) =>
    res.render("users", { title: "Users table", result: data })
  );
});

/* GET transaction page. */
router.get("/transactions", function (req, res, next) {
  mrFindAll("transactions", (data) => {
    res.render("transactions", {
      title: "Transactions table",
      result: data.reverse(),
    });
  });
});

router.post("/login", function (req, res, next) {
  const { userName, userPassword, terminalId } = req.body;
  mrFindAll("users", (data) => {
    const user = data.find((userItem) => {
      return (
        userItem.userName === userName &&
        userItem.userPassword === userPassword &&
        userItem.terminalId === parseInt(terminalId)
      );
    });
    console.log(user)
    if (user) {
      res.json({
        status: "true",
      });
    } else {
      res.json({
        status: "false",
      });
    }
  });
});

// Post Pay request
router.post("/mrPayRequet", function (req, res, next) {
  const {
    orderId,
    callBackUrl,
    amount,
    userName,
    userPassword,
    terminalId,
  } = req.body;

  mrFindAll("users", (data) => {
    const user = data.find((userItem) => {
      return (
        userItem.userName === userName &&
        userItem.userPassword === userPassword &&
        userItem.terminalId === parseInt(terminalId)
      );
    });
    if (user) {
      const inputData = {
        orderId,
        callBackUrl,
        amount,
        dateTime: serverdateTime.format("Y-m-d H:M:S"),
        refId: uuidv4(),
        saleOrderId: orderId,
        saleReferenceId: Math.floor(Math.random() * 10000000),
      };

      mrInsertOne("transactions", inputData, (data) => {
        // res.json(data)
        res.render("mrPayRequet", { title: "Mr gateway", result: data });
      });
    } else {
      res.send("Username or userPassword incorrect");
    }
  });
});

router.post("/mrCompletePayment", function (req, res, next) {
  mrUpdate("transactions", req.body, (data) => {
    res.render("mrCompletePayment", {
      title: "complete payment",
      result: data,
    });
  });
});

module.exports = router;
