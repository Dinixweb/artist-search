const { Router } = require("express");
const router = Router();
const artist = require("../controllers/artist");

router.use("/findArtistByName", artist.findUserByName);

module.exports = router;
