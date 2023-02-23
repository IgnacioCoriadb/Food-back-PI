const {Router} = require("express");
const {getDiets} = require("../controllers/DietController");

const router = Router();

router.get("/", getDiets);


module.exports = router;