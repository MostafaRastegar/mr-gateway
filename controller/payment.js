const dateTime = require("node-datetime");
const serverdateTime = dateTime.create();
const { v4: uuidv4 } = require("uuid");

const {
  mrInitCollections,
  mrFindAll,
  mrInsertOne,
  mrUpdate,
} = require("./connect");
const userController = require("./user");
class PaymentController {
  postPayRequest = (req, res) => {
    const {
      orderId,
      callBackUrl,
      amount,
      terminalId,
      localDate,
      localTime,
      payerId,
      additionalData,
      userName,
      userPassword,
    } = req.body;

    mrFindAll("users", (data) => {
      const user = userController.getOneUser(data, {
        userName,
        userPassword,
        terminalId,
      });
      if (!user) {
        return res.status(404).json({
          success: "false",
          message: "Username or userPassword incorrect",
          data: {},
        });
      }
      const inputData = {
        orderId,
        callBackUrl,
        amount,
        terminalId,
        localDate,
        localTime,
        payerId,
        additionalData,
        refId: uuidv4(),
        saleOrderId: orderId,
        saleReferenceId: Math.floor(Math.random() * 10000000),
      };
      mrInsertOne("transactions", inputData, (data) => {
        return res.status(200).json({
          success: "true",
          message: "Create refId successfully",
          data: {
            resCode: 0,
            refId: data.refId,
          },
        });
      });
    });
  };

  postPayAction = (req, res) => {
    const { refId } = req.body;

    mrFindAll("transactions", (data) => {
      const transaction = data.find((item) => {
        return item.refId === refId;
      });
      if (!transaction) {
        return res.status(404).json({
          success: "false",
          message: "transaction not found",
          data: {},
        });
      }
      return res.status(200).render("payAction", {
        success: "true",
        message: "Please select your request",
        data: {
          title: "Please select your request",
          result: transaction,
        },
      });
    });
  };
  postCompletePayment = (req, res) => {
    const { refId, resCode } = req.body;
    const inputDataUpdate = {
      selector: { refId },
      data: { resCode },
    };
    mrUpdate("transactions", inputDataUpdate, (transData) => {
      mrFindAll("transactions", (data) => {
        const transaction = data.find((item) => {
          if (item.refId === transData.refId) {
            return res.status(200).render("completePayment", {
              success: "true",
              message: "Complete payment",
              data: {
                title: "Complete payment",
                result: item,
              },
            });
          }
        });
      });
    });
  };
}

const paymentController = new PaymentController();
module.exports = paymentController;
