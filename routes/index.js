const express = require("express");
const dotenv = require("dotenv");
const { mrConnect, mrFindAll, mrInsertOne } = require("../mongoUtils/connect");
const { v4: uuidv4 } = require("uuid");
const { ACCESS_TOKEN } = process.env;
const router = express.Router();
dotenv.config();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
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
  const { userName, userPassword, token } = req.body;
  mrFindAll("users", (data) => {
    const user = data.find((u) => {
      return u.userName === userName && u.userPassword === userPassword;
    });
    if (user && user.token === ACCESS_TOKEN) {
      res.json({
        status: "ok",
      });
    } else {
      res.send("Username or userPassword incorrect");
    }
  });
});

router.post("/bank", function (req, res, next) {
  const {
    orderId,
    token,
    callBackUrl,
    amount,
    userName,
    userPassword,
  } = req.body;
  const refId = uuidv4();

  const inputData = {
    refId,
    orderId,
    callBackUrl,
    amount,
    saleOrderId: orderId,
    SaleReferenceId: Math.floor(Math.random() * 10000000),
  };

  mrInsertOne("transactions", inputData, (data) => {
    res.render("bank", { title: "Bank gateway", result: data });
  });
});

module.exports = router;
