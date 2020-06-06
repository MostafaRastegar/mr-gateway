const express = require("express");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { v4: uuidv4 } = require("uuid");
dotenv.config();
const { ACCESS_TOKEN } = process.env;

const users = [
  {
    username: "john",
    password: "password123admin",
    role: "admin",
    token: "youraccesstokensecret",
  },
  {
    username: "anna",
    password: "password123member",
    role: "member",
    token: "youraccesstokensecret",
  },
];

var router = express.Router();
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

/* GET users listing. */
router.post("/login", function (req, res, next) {
  const { username, password, token } = req.body;
  console.log({
    token,
    username,
    password,
  });
  // Filter user from the users array by username and password
  const user = users.find((u) => {
    return u.username === username && u.password === password;
  });

  if (user && user.token === ACCESS_TOKEN) {
    res.json({
      status: 'ok'
    });
  } else {
    res.send("Username or password incorrect");
  }
});

router.post("/bank", function (req, res, next) {
  const { orderId, token, backLink, price, username, password } = req.body;
  const refId = uuidv4();
  const result = {
    refId,
    orderId,
    backLink,
    price,
    saleOrderId: orderId,
    SaleReferenceId: Math.floor(Math.random() * 10000000)
  }
  res.render("bank", { title: "Bank gateway", result });
});

// router.post("/login", (req, res) => {
//   // Read username and password from request body
//   const { username, password, token } = req.body;
//
//   // Filter user from the users array by username and password
//   const user = users.find((u) => {
//     return u.username === username && u.password === password;
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
//       { username: user.username, role: user.role },
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
//     res.send("Username or password incorrect");
//   }
// });

module.exports = router;
