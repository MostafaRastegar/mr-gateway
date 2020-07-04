const { v4: uuidv4 } = require('uuid');

const { mrFindAll, mrInsertOne, mrUpdate } = require('../controller/connect');

class BPardakhtController {
  postPayRequest(req, res) {
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
      gateWayName,
    } = req.body;

    mrFindAll('users', (data) => {
      const user = this.getOneUser(data, {
        userName,
        userPassword,
        terminalId,
      });
      if (user) {
        const inputData = {
          orderId,
          callBackUrl,
          amount,
          terminalId,
          localDate,
          localTime,
          payerId,
          additionalData,
          gateWayName,
          refId: uuidv4(),
          saleOrderId: orderId,
          saleReferenceId: Math.floor(Math.random() * 10000000),
        };

        return mrInsertOne('transactions', inputData, (dataInsert) =>
          res.status(200).json({
            success: 'true',
            message: 'Create refId successfully',
            data: {
              resCode: 0,
              refId: dataInsert.refId,
              gateWayName: dataInsert.gateWayName,
            },
          })
        );
      }
      return res.status(404).json({
        success: 'false',
        message: 'Username or userPassword incorrect',
        data: {},
      });
    });
  }

  postPayAction(req, res) {
    const { refId } = req.body;

    mrFindAll('transactions', (data) => {
      const transaction = data.find((item) => item.refId === refId);
      if (!transaction) {
        return res.status(404).json({
          success: 'false',
          message: 'transaction not found',
          data: {},
        });
      }
      return res.status(200).render('payAction', {
        success: 'true',
        message: 'Please select your request',
        data: {
          title: 'Please select your request',
          result: transaction,
        },
      });
    });
  }

  postCompletePayment(req, res) {
    const { refId, resCode } = req.body;
    const inputDataUpdate = {
      selector: { refId },
      data: { resCode },
    };

    mrUpdate('transactions', inputDataUpdate, (transData) => {
      mrFindAll('transactions', (data) => {
        data.find((item) => {
          if (item.refId !== transData.refId) {
            return res.status(404).render('completePayment', {
              success: 'false',
              message: 'Error Complete page',
              data: {},
            });
          }
          return res.status(200).render('completePayment', {
            success: 'true',
            message: 'Complete payment',
            data: {
              title: 'Complete payment',
              result: item,
            },
          });
        });
      });
    });
  }

  getOneUser(data, userParams) {
    const user = data.find(
      (userItem) =>
        userItem.userName === userParams.userName &&
        userItem.userPassword === userParams.userPassword &&
        userItem.terminalId === parseInt(userParams.terminalId, 10)
    );
    return user;
  }
}

const bPardakhtController = new BPardakhtController();
module.exports = bPardakhtController;
