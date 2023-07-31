const mongoose = require("mongoose");

const TempSecretSchema = new mongoose.Schema(
  {
    active: {
      type: Boolean,
      default: true,
    },
    name: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    key: String, //hashed
    content: String,
    qr_code: {
      type: String,
      default: "",
    },
    weblink: {
      type: String,
      default: "",
    },
    one_time_access: {
      type: Boolean,
      default: false,
    },
    expiration_date: {
      type: Date,
      default: null,
    },
    agent_access_only: {
      type: Boolean,
      default: false,
    },
    agent_access_list: { type: [mongoose.Schema.Types.ObjectId], default: [] },
    ip_access_list: {
      type: [String],
      default: [],
    },
    use_ip_access_list: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TempSecret", TempSecretSchema, "TempSecret");
