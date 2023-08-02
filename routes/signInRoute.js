const express = require("express");
const Agent = require("../controllers/agentController");
const router = express.Router();

router.get("/logout", function (req, res) {
  Agent.logoutAgent(req, res);
});

router.post("/dashboard/v1/agent/sign-in", function (req, res) {
  Agent.signInAgent(req, res);
});

module.exports = router;
