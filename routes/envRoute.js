const express = require("express");
const Env = require("../controllers/envController");
const router = express.Router();

router.post("/api/v1/env", function (req, res) {
  Env.createEnv(req, res);
});

router.post("/api/v1/env/id", function (req, res) {
  Env.getEnvById(req, res);
});

router.patch("/api/v1/env/id", function (req, res) {
  Env.getEnvById(req, res);
});

router.patch("/api/v1/env/delete", function (req, res) {
  Env.softDeleteEnv(req, res);
});

module.exports = router;
