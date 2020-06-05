var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

/* GET users listing. */
router.post("/bank", function (req, res, next) {
  const { orderId, token, backLink, price } = req.body;
  console.log({
    orderId,
    token,
    backLink,
    price,
  });
  // res.redirect(backLink);
  res.render("bank", { title: "Bank gateway", orderId, token, price });
});
// router.get('/bank/:id/:token', function(req, res, next) {
//   const { id,token, backLink } = req.params;
//   // res.redirect(backLink);
//   res.render('bank', { title: 'Users', id,token });
//
// });

// router.post('/user/submit', function(req, res, next) {
//   const { id } = req.body;
//   console.log(id);
//   res.redirect(`/users/${id}`);
// });

module.exports = router;
