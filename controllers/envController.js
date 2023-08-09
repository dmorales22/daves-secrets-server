const Agent = require("../models/Agent");
const Env = require("../models/Env");
const mongoose = require("mongoose");
const argon2 = require("argon2");
const { encrypt, decrypt, createSecretKey } = require("../utilities/crypto");

/**
 * This function creates an Env document in the database.
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

    master_key = createSecretKey(16);

    if (req.body.content) {
      const content = req.body.content;
      //todo check schema of content for accepted data types
      const content_string = content.toString(); //Converts array into string
      encrypted_content = encrypt(content_string, master_key);
    } else {
      encrypted_content = encrypt("[]", master_key); //Empty array string if no content is passed
    }

    const hashed_master_key = await argon2.hash(master_key);
    const agent_access_key = createSecretKey(16);
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
      master_key: hashed_master_key,
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
  if (
    !req.body.env_id ||
    !mongoose.isObjectIdOrHexString(req.body.env_id) ||
    !req.session.agent_id ||
    !mongoose.isObjectIdOrHexString(req.session.agent_id)
  ) {
    return res.status(400).send({
      result: false,
      msg: "There's something wrong with this request.",
    });
  }
  try {
    const env_id = req.body.env_id;
    const agent_id = req.session.agent_id;
    const agent_secret_key = req.session.agent_secret_key;
    const env_filter = {
      _id: mongoose.Types.ObjectId(env_id),
    };
    let env = await Env.findOne(env_filter);

    if (!env) {
      return res
        .status(404)
        .send({ result: false, msg: "Env document does not exist!" });
    }

    if (!env?.agent_directory[agent_id]) {
      return res.status(403).send({
        result: false,
        msg: "User does not have access to this resource.",
      });
    }

    //todo write ip address checker
    //todo write device checker
    //todo write application checker

    const agent_entry = env.agent_directory[agent_id];
    const decrypted_master_key = decrypt(agent_entry.key, agent_secret_key);
    const decrypted_env_content = decrypt(
      env.encrypted_content,
      decrypted_master_key
    );
    const parsed_env_content = JSON.parse(decrypted_env_content);
    //todo check keys for agent permissions
    const env_document = {
      env_name: env.env_name,
      env_type: env.env_type,
      env_status: env.env_status,
      content: parsed_env_content,
      description: env.description,
      tags: env.tags,
      is_backup_env: env.is_backup_env,
      organization_id: env.organization_id
    }

    return res.send(env_document);
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
