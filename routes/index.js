const { Router } = require("express");
const router = Router();

router.use("/", require("./artist"));

module.exports = router;
