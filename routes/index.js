const express = require('express');
const dotenv = require('dotenv');
const userController = require('../controller/user');
const paymentController = require('../controller/payment');

const router = express.Router();

dotenv.config();

/* GET home page. */
router.get('/', userController.setInitData);
router.get(`${process.env.API_URL}/`, userController.setInitData);

/* GET users page. */
router.get(`${process.env.API_URL}/users`, userController.getAllUsers);

/* GET transaction page. */
router.get(
  `${process.env.API_URL}/transactions`,
  userController.getAllTransaction
);

router.post(`${process.env.API_URL}/login`, userController.loginUser);

// Post Pay request from user website
router.post(
  `${process.env.API_URL}/payRequest`,
  paymentController.postPayRequest
);

// Post Pay Action from user => success or failed
router.post(
  `${process.env.API_URL}/payAction`,
  paymentController.postPayAction
);

// Auto redirect to user website
router.post(
  `${process.env.API_URL}/completePayment`,
  paymentController.postCompletePayment
);

module.exports = router;
