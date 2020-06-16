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
  mrFindAll("users", (data) => res.json(data.reverse()));
});

/* GET transaction page. */
router.get("/transactions", function (req, res, next) {
  mrFindAll("transactions", (data) => {
    res.json(data.reverse());
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

// Post Pay request from user website
router.post("/mrPayRequet", function (req, res, next) {
  const {
    userName,
    userPassword,
    terminalId,
    orderId,
  } = req.body;

  mrFindAll("users", (data) => {
    const user = data.find((userItem) => {
      return (
        userItem.userName === userName &&
        userItem.userPassword === userPassword &&
        userItem.terminalId === parseInt(terminalId)
      );
    });
    if (!user) {
      res.send("Username or userPassword incorrect");
    }
    const inputData = {
      ...req.body,
      refId: uuidv4(),
      saleOrderId: orderId,
      saleReferenceId: Math.floor(Math.random() * 10000000),
    };
    mrInsertOne("transactions", inputData, (data) => {
      res.json({
        resCode: 0,
        refId: data.refId,
      });
    });
  });
});

// Post Pay Action from user => success or failed
router.post("/mrPayAction", function (req, res, next) {
  const { refId } = req.body;

  mrFindAll("transactions", (data) => {
    const transaction = data.find((item) => {
      return item.refId === refId;
    });
    if (!transaction) {
      res.send("transaction not found");
    }
    res.render("mrPayAction", {
      title: "Please select your request",
      result: transaction,
    });
  });
});

// Auto redirect to user website
router.post("/mrCompletePayment", function (req, res, next) {
  const inputData = req.body;
  // inputData is {resCode, refCode}
  mrUpdate("transactions", inputData, (data) => {
    res.render("mrCompletePayment", {
      title: "Complete payment",
      result: data,
    });
  });
});

module.exports = router;
