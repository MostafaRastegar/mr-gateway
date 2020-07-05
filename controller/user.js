const { mrInitCollections, mrFindAll } = require('../services/utils');

class UserController {
  constructor() {
    this.loginUser = this.loginUser.bind(this);
  }

  setInitData(req, res) {
    mrInitCollections();
    // res.render("index", { title: "mr-gateway" });
    try {
      return res.status(200).render('index', {
        success: true,
        message: 'Add Collections to database successfully',
        data: {
          title: 'Add Collections to database successfully',
        },
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: 'Can not add collectios to database',
        data: {
          title: 'Can not add collectios to database',
        },
      });
    }
  }

  getAllUsers(req, res) {
    mrFindAll('users', (data) => {
      try {
        return res.status(200).json({
          success: true,
          message: 'users received successfully',
          data,
        });
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: 'users not fond',
          data: [],
        });
      }
    });
  }

  getAllTransaction(req, res) {
    mrFindAll('transactions', (data) => {
      try {
        return res.status(200).json({
          success: true,
          message: 'transactions received successfully',
          data,
        });
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: 'transactions not fond',
          data: [],
        });
      }
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

  loginUser(req, res) {
    const userParams = req.body;
    mrFindAll('users', (data) => {
      const user = this.getOneUser(data, userParams);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'user not found',
          data: [],
        });
      }
      return res.status(200).json({
        success: true,
        message: 'user received successfully',
        data: user,
      });
    });
  }
}

const userController = new UserController();
module.exports = userController;
