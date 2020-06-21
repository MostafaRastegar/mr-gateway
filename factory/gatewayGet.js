const BPardakht = require('./bPardakht');
const gatewayGet = { BPardakht };

const createGateway = (type) => {
    const GateWayGetType = gatewayGet[type];
    return GateWayGetType;
}

module.exports = {
    createGateway
};
