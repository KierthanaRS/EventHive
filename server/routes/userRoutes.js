const express = require("express");
const { getDashboard,getUserIdFromToken,updateUser } = require("../controllers/userController");

const router = express.Router();

router.get("/dashboard",getDashboard);
router.get("/userId",getUserIdFromToken);
router.put("/updateUser",updateUser);


module.exports = router;