const Env = require("../models/Env");
const mongoose = require("mongoose");

/**
 *
 * @param req
 * @param res
 * @returns {Promise<*>}
 * @author David Morales
 */
exports.createEnv = async (req, res) => {
  try {
    const newEnv = await Env.create({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      phone: req.body.phone,
      email: req.body.email,
    });

    newContact.save();
    return res.status(200).send(newContact);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ result: false, msg: "There was a server." });
  }
};

/**
 *
 * @param req
 * @param res
 * @returns {Promise<*>}
 * @author David Morales
 */
exports.getEnvById = async (req, res) => {
  try {
  } catch (err) {
    console.log(err);
    return res.status(500).send({ result: false, msg: "There was a server." });
  }
};

/**
 *
 * @param req
 * @param res
 * @returns {Promise<*>}
 * @author David Morales
 */
exports.updateEnvById = async (req, res) => {
  try {
  } catch (err) {
    console.log(err);
    return res.status(500).send({ result: false, msg: "There was a server." });
  }
};

/**
 *
 * @param req
 * @param res
 * @returns {Promise<*>}
 * @author David Morales
 */
exports.softDeleteEnv = async (req, res) => {
  try {
  } catch (err) {
    console.log(err);
    return res.status(500).send({ result: false, msg: "There was a server." });
  }
};

/**
 *
 * @param req
 * @param res
 * @returns {Promise<*>}
 * @author David Morales
 */
exports.hardDeleteEnv = async (req, res) => {
  try {
  } catch (err) {
    console.log(err);
    return res.status(500).send({ result: false, msg: "There was a server." });
  }
};
