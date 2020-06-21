const express = require("express");
const dotenv = require("dotenv");
const userController = require("../controller/user");

const gatewayGetFactory = require("../factory");
const bPardakht = gatewayGetFactory.createGateway("BPardakht");

const router = express.Router();
dotenv.config();

/* GET home page. */
router.get("/", userController.setInitData);
router.get(`${process.env.API_URL}/`, userController.setInitData);

/* GET users page. */
router.get(`${process.env.API_URL}/users`, userController.getAllUsers);

/* GET transaction page. */
router.get(`${process.env.API_URL}/transactions`, userController.getAllTransaction);

router.post(`${process.env.API_URL}/login`, userController.loginUser);

// Post Pay request from user website
router.post(`${process.env.API_URL}/payRequest`, bPardakht.postPayRequest);

// Post Pay Action from user => success or failed
router.post(`${process.env.API_URL}/payAction`, bPardakht.postPayAction);

// Auto redirect to user website
router.post(`${process.env.API_URL}/completePayment`, bPardakht.postCompletePayment);

module.exports = router;
