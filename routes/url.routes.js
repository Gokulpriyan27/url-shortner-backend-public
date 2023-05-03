const express = require("express");

const router = express.Router();
const {urlPostRoute,gotoUrl,getallUrls, urlCreatedPerDay, urlCreatedperMonth} = require("../controllers/url.controllers")

//get url from the user

router.post("/url/post/:userid",urlPostRoute);

//go to url

router.get("/:shortid",gotoUrl)


//get all urls

router.get("/geturls/:userid",getallUrls)

router.post("/urlday/:userid",urlCreatedPerDay)

router.post("/urlmonth/:userid",urlCreatedperMonth)

module.exports = router;