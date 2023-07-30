const Agent = require("../models/Agent");
const Env = require("../models/Env");
const mongoose = require("mongoose");
const { nanoid, customAlphabet } = require("nanoid");
const argon2 = require("argon2");
const { encrypt, decrypt, createSecretKey } = require("../utilities/crypto");
const crypto = require("crypto");

/**
 *
 * @param req
 * @param res
 * @returns {Promise<*>}
 * @author David Morales
 */
exports.createEnv = async (req, res) => {
  if (
    !req.session.agent_id ||
    !mongoose.isObjectIdOrHexString(req.session.agent_id) ||
    !req.session.agent_secret_key
  ) {
    return res.status(400).send({
      result: false,
      msg: "There's something wrong with this request.",
    });
  }
  try {
    let encrypted_content = "";
    let master_key = "";
    let agent_directory = {};
    let owner_agent_id = null;
    let organization_id = null;

    if (
      req.session.agent_id &&
      mongoose.isObjectIdOrHexString(req.session.agent_id)
    ) {
      owner_agent_id = mongoose.Types.ObjectId(req.session.agent_id);
    }

    if (
      req.session.organization_id &&
      mongoose.isObjectIdOrHexString(req.session.organization_id)
    ) {
      organization_id = mongoose.Types.ObjectId(req.session.organization_id);
    }

    master_key = createSecretKey(32);
    const agent_access_key = createSecretKey(32);
    const agent_secret_key = req.session.agent_secret_key;

    agent_directory[req.session.agent_id] = {
      permissions: {
        add_agents: true,
        remove_agents: true,
        add_keys: true,
        update_keys: true,
        delete_keys: true,
      },
      ip_whitelist: [],
      agent_access_key: await argon2.hash(agent_access_key), //hashed
      env_key: encrypt(master_key, agent_secret_key), //encrypted master key (encrypted by agent_secret_key)
    };

    const newEnv = await Env.create({
      env_name: req.body.env_name,
      env_type: req.body.env_type,
      encrypted_content: encrypted_content,
      description: req.body.description,
      tags: req.body.tags,
      master_key: master_key,
      agent_directory: agent_directory,
      application_access_list: req.body.application_access_list,
      use_application_access_list: req.body.use_application_access_list,
      device_access_list: req.body.device_access_list,
      use_device_access_list: req.body.use_device_access_list,
      ip_access_list: req.body.ip_access_list,
      use_ip_access_list: req.body.use_ip_access_list,
      use_organization_settings: req.body.use_organization_settings,
      owner_agent_id: owner_agent_id,
      is_backup_env: req.body.is_backup_env,
      organization_id: organization_id,
    });

    let agent_update_object = {};
    const env_file_entry = {
      env_id: newEnv._id,
      key: encrypt(agent_access_key, agent_secret_key),
    };
    agent_update_object["$push"] = {
      env_files: env_file_entry,
    };

    await Agent.updateOne({ _id: owner_agent_id }, agent_update_object);

    await newEnv.save();
    return res.send({ result: true, msg: "New Env was successfully created." });
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
