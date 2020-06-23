const express = require("express");

const router= express.Router();

router.get('/', function(req, res) {
    res.end("contest");
});

module.exports = router;