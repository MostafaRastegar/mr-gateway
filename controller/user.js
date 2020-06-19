const { mrInitCollections, mrFindAll } = require("./connect");
class UserController {
  // constructor(params) {
  //     // Chain constructor with super
  //     super(params);
  //
  //     // Add a new property
  //     this.getOneUser = params.getOneUser;
  // }
  setInitData = (req, res) => {
    mrInitCollections();
    // res.render("index", { title: "mr-gateway" });
    return res.status(200).render("index", {
      success: "true",
      message: "Add Collections to database successfully",
      data: {
        title: "Add Collections to database successfully",
      },
    });
  };
  getAllUsers = (req, res) => {
    mrFindAll("users", (data) => {
      return res.status(200).json({
        success: "true",
        message: "users retrieved successfully",
        data,
      });
    });
  };

  getAllTransaction = (req, res) => {
    mrFindAll("transactions", (data) => {
      return res.status(200).json({
        success: "true",
        message: "transactions retrieved successfully",
        data,
      });
    });
  };

  getOneUser = (data, userParams) => {
    const user = data.find(
      (userItem) =>
        userItem.userName === userParams.userName &&
        userItem.userPassword === userParams.userPassword &&
        userItem.terminalId === parseInt(userParams.terminalId)
    );
    return user;
  };

  loginUser = (req, res) => {
    const userParams = req.body;
    mrFindAll("users", (data) => {
      const user = this.getOneUser(data, userParams);
      if (!user) {
        return res.status(404).json({
          success: "false",
          message: "user not found",
          data: [],
        });
      }
      return res.status(200).json({
        success: "true",
        message: "user retrieved successfully",
        data: user,
      });
    });
  };
}

const userController = new UserController();
module.exports = userController;
