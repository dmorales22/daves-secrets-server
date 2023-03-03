const Contact = require("../models/Contact");
const mongoose = require("mongoose");

/**
 *
 * @param req
 * @param res
 * @returns {Promise<*>}
 * @author David Morales
 */
exports.createContact = async (req, res) => {
  try {
    const newContact = await Contact.create({
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
exports.getContactById = async (req, res) => {
  if (
    !req.body.contact_id ||
    !mongoose.isObjectIdOrHexString(req.body.contact_id)
  ) {
    return res.status(400).send({
      result: false,
      msg: "Error. Something is wrong with this request.",
    });
  }

  try {
    const contact_id = mongoose.Types.ObjectId(req.body.contact_id);

    Contact.findOne(
      {
        _id: contact_id,
      },
      (err, contact) => {
        if (err) {
          return res.status(500).send({
            result: false,
            msg: "There was a server error.",
          });
        }
        return res.send(contact);
      }
    );
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ result: false, msg: "There was a server error." });
  }
};

/**
 * This function gets all contacts in the database
 * @param req
 * @param res
 * @returns {Promise<void>}
 * @author David Morales
 */
exports.getContacts = async (req, res) => {
  try {
    Contact.find({}, (err, contact) => {
      if (err) {
        return res
          .status(500)
          .send({ result: false, msg: "There was a server error." });
      }
      return res.send(contact);
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ result: false, msg: "There was a server error." });
  }
};

/**
 *
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.updateContact = async (req, res) => {
  if (
    !req.body.contact_id ||
    !mongoose.isObjectIdOrHexString(req.body.contact_id)
  ) {
    return res.status(400).send({
      result: false,
      msg: "Error. Something is wrong with this request.",
    });
  }

  try {
    const contact_id = mongoose.Types.ObjectId(req.body.contact_id);
    Contact.findOne(
      {
        _id: contact_id,
      },
      (err, contact) => {
        if (err) return res.send(err);
        return res.send(contact);
      }
    );
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ result: false, msg: "There was a server error." });
  }
};

/**
 *
 * @param req
 * @param res
 * @returns {Promise<*>}
 * @author David Morales
 */
exports.removeContact = async (req, res) => {
  if (
    !req.body.contact_id ||
    !mongoose.isObjectIdOrHexString(req.body.contact_id)
  ) {
    return res.status(400).send({
      result: false,
      msg: "Error. Something is wrong with this request.",
    });
  }

  try {
    Contact.findByIdAndDelete(req.body.contact_id, (err, contact) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .send({ result: false, msg: "There was a server." });
      }
      return res.send({
        result: true,
        msg: "Contact was successfully delete.",
      });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ result: false, msg: "There was a server." });
  }
};
