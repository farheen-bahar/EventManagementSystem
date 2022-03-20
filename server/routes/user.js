const router = require("express").Router();
const { check } = require("express-validator");

const userCtrl = require("../controllers/user");

router.get("/info", userCtrl.signup);
router.put("/update", userCtrl.signup);

module.exports = router;
