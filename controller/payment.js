const dateTime = require("node-datetime");
const serverdateTime = dateTime.create();
const { v4: uuidv4 } = require("uuid");

const gatewayGetFactory = require("../factory");

const {
  mrInitCollections,
  mrFindAll,
  mrInsertOne,
  mrUpdate,
} = require("./connect");
const userController = require("./user");
class PaymentController {
  newGateway = (req) => {
    const { gateWayName } = req.body;
    return gatewayGetFactory.createGateway(gateWayName);
  };
  postPayRequest = (req, res) => {
    this.newGateway(req).postPayRequest(req, res);
  };
  postPayAction = (req, res) => {
    this.newGateway(req).postPayAction(req, res);
  };
  postCompletePayment = (req, res) => {
    this.newGateway(req).postCompletePayment(req, res);
  };
}

const paymentController = new PaymentController();
module.exports = paymentController;
