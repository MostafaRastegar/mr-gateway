const gatewayGetFactory = require('../factory');

class PaymentController {
  constructor() {
    this.postPayRequest = this.postPayRequest.bind(this);
    this.postPayAction = this.postPayAction.bind(this);
    this.postCompletePayment = this.postCompletePayment.bind(this);
  }

  newGateway(req) {
    const { gateWayName } = req.body;
    return gatewayGetFactory.createGateway(gateWayName);
  }

  postPayRequest(req, res) {
    this.newGateway(req).postPayRequest(req, res);
  }

  postPayAction(req, res) {
    this.newGateway(req).postPayAction(req, res);
  }

  postCompletePayment(req, res) {
    this.newGateway(req).postCompletePayment(req, res);
  }
}

const paymentController = new PaymentController();
module.exports = paymentController;
