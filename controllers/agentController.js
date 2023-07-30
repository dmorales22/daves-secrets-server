const Agent = require("../models/Agent");
const argon2 = require("argon2");
const mongoose = require("mongoose");
const {
  createSecretKey,
  encrypt,
  decrypt,
  generatePBKDF,
} = require("../utilities/crypto");

/**
 * This function is to create an agent in the database.
 * @param req
 * @param res
 * @returns {Promise<*>}
 * @author David Morales
 */
exports.createAgent = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    if (!(email && password && first_name && last_name)) {
      return res
        .status(400)
        .send({ result: false, msg: "All input is required." }); // A controller method to create an Agent in the database. Creates a token for this user.
    }

    const existing_agent = await Agent.findOne({ email: email });

    if (existing_agent) {
      return res
        .status(409)
        .send({ result: false, msg: "Agent already exists in the system." });
    }

    const hashed_password = await argon2.hash(password);
    const agent_secret_key = createSecretKey(32); //Generates agent secret key

    const pbkdf_password_object = generatePBKDF(password); //Generate PBKDF (Password-Based Key Derivation Function 2)
    const pbkdf_password_key = pbkdf_password_object.derived_key;
    const pbkdf_password_salt = pbkdf_password_object.salt;

    const agent_secret_key_hashed = await argon2.hash(agent_secret_key);
    const encrypted_agent_secret_key = encrypt(
      agent_secret_key,
      pbkdf_password_key
    ); //Used PBKDF to encrypt master key

    const agent_pbkdf = {
      salt: pbkdf_password_salt,
      key: await argon2.hash(pbkdf_password_key), //hashed
    };

    const agent = await Agent.create({
      first_name,
      last_name,
      email,
      agent_pbkdf: agent_pbkdf,
      agent_secret_key_hashed: agent_secret_key_hashed,
      agent_secret_key_encrypted: encrypted_agent_secret_key,
      password: hashed_password,
    });

    return res.send({
      result: true,
      msg: "Agent has been successfully created.",
      data: {
        first_name: agent.first_name,
        last_name: agent.last_name,
      },
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ result: false, msg: "There was a server error." });
  }
};

/**
 * This function is to signin  an Agent in the database.
 * Creates a token cookie for this user to use the system and routes.
 * @param req
 * @param res
 * @returns {Promise<*>}
 * @author David Morales
 */
exports.signInAgent = async (req, res) => {
  try {
    let email = req.body.email;
    const password = req.body.password;

    if (!(email && password)) {
      return res
        .status(400)
        .send({ result: false, msg: "Email and password are required." });
    }

    email = email.toLowerCase();
    const agent = await Agent.findOne({ email });

    if (!agent) {
      return res
        .status(401)
        .send({ result: false, msg: "Invalid credentials." });
    }

    if (!(await argon2.verify(agent.password, password))) {
      return res
        .status(401)
        .send({ result: false, msg: "Invalid credentials." });
    }

    let organization_id = "";

    if (agent.organization_id) {
      organization_id = organization_id.toString();
    }

    //You can add additional attributes to the req.session objects
    req.session.agent_id = agent._id.toString();
    req.session.agent_secret_key = "";
    req.session.organization_id = organization_id;

    return res.send({
      result: true,
      msg: "Agent authentication is successful.",
      token: token,
      data: {
        first_name: agent.first_name,
        middle_name: agent.middle_name,
        last_name: agent.last_name,
        email: agent.email,
      },
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ result: false, msg: "There was a server error." });
  }
};

/**
 * This function will log out the agent by destroying session data and clear out the cookie.
 * @param req
 * @param res
 * @returns {Promise<void>}
 * @author David Morales
 */
exports.logoutAgent = async (req, res) => {
  req.session.destroy(function (err) {
    res.send("You are signed out.");
  });
};

/**
 * This function is used to get an Agent from the by using its ID
 * @param req
 * @param res
 * @returns {Promise<*>}
 * @author David Morales
 */
exports.getAgentById = async (req, res) => {
  if (
    !req.body.agent_id ||
    !mongoose.isObjectIdOrHexString(req.body.agent_id)
  ) {
    return res.status(400).send({
      result: false,
      msg: "Error. Something is wrong with this request.",
    });
  }

  try {
    const agent_id = req.body.agent_id;
    Agent.findById(agent_id, (err, agent) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .send({ result: false, msg: "There was a server error." });
      }
      return res.send(agent);
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ result: false, msg: "There was a server error." });
  }
};

/**
 * This function is used to get all agents from the database.
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.getAllAgents = async (req, res) => {
  try {
    Agent.find({}, (err, agent) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .send({ result: false, msg: "There was a server error." });
      }
      return res.send(agent);
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ result: false, msg: "There was a server error." });
  }
};

/**
 * This function is used to update an agent's information.
 * @param req
 * @param res
 * @returns {Promise<*>}
 * @author David Morales
 */
exports.updateAgent = async (req, res) => {
  if (
    !req.body.agent_id ||
    !mongoose.isObjectIdOrHexString(req.body.agent_id)
  ) {
    return res.status(400).send({
      result: false,
      msg: "Error. Something is wrong with this request.",
    });
  }

  try {
    Agent.findByIdAndUpdate(
      req.body.agent_id,
      req.body,
      { new: true },
      (err, agent) => {
        if (err) {
          console.log(err);
          return res.send(err);
        }
        return res.send(agent);
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).send({
      result: false,
      msg: "There was a server error.",
    });
  }
};
