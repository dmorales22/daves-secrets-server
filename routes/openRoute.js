const express = require("express");
const Agent = require("../controllers/agentController");
const router = express.Router();

router.post('/api/v1/agent', function (req, res){
    Agent.createAgent(req, res);
});
router.post('/public/v1/agent', function (req, res){
    Agent.createAgent(req, res);
});

module.exports = router;
