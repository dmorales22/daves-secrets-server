const mongoose = require("mongoose");

const AgentSchema = new mongoose.Schema(
  {
    agent_type: {
      type: String,
      default: "generic", //generic, employee, developer, sysadmin
    },
    first_name: {
      type: String,
      default: "",
    },
    middle_name: {
      type: String,
      default: "",
    },
    last_name: {
      type: String,
      default: "",
    },
    password: String,
    token: String,
    email: {
      type: String,
      unique: true,
    },
    phone: {
      type: String,
      unique: true,
    },
    api_enabled: {
      type: Boolean,
      default: false,
    },
    agent_secret_key_encrypted: {
      type: String, //encrypted by password
      default: "",
    },
    agent_secret_key_hashed: {
      type: String, //hashed
      default: "",
    },
    auth_tokens: {
      type: [
        {
          token_type: {
            type: String,
            default: "application", //application, api,
          },
          token_key: String, //hashed key
          content: String, //encrypted content
          active: {
            type: Boolean,
            default: true,
          },
        },
      ],
      default: [],
    },
    env_files: {
      type: [
        {
          env_id: mongoose.Types.ObjectId,
          key: String, //encrypted by agent key
        },
      ],
      default: [],
    },
    organization_id: {
      type: mongoose.Types.ObjectId,
      default: null,
    },
    allow_email_notifications: {
      type: Boolean,
      default: false,
    },
    allow_sms_notifications: {
      type: Boolean,
      default: false,
    },
    enable_multi_factor: {
      type: Boolean,
      default: false,
    },
    api: {
      type: mongoose.Types.Mixed,
      default: null,
    },
    additional_data: {
      type: mongoose.Types.Mixed,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Agent", AgentSchema, "Agent");
