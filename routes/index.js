const express = require("express");
const userController = require("../controller/user");
const paymentController = require("../controller/payment");
const router = express.Router();

/* GET home page. */
router.get("/", userController.setInitData);

/* GET users page. */
router.get("/users", userController.getAllUsers);

/* GET transaction page. */
router.get("/transactions", userController.getAllTransaction);

router.post("/login", userController.loginUser);

// Post Pay request from user website
router.post("/mrPayRequet", paymentController.postPayRequest);

// Post Pay Action from user => success or failed
router.post("/mrPayAction", paymentController.postPayAction);

// Auto redirect to user website
router.post("/mrCompletePayment", paymentController.postCompletePayment);

module.exports = router;
