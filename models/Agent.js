const mongoose = require("mongoose");

/**
 *
 * @type {module:mongoose.Schema<any, Model<any, any, any, any>, {}, {}, {}, {}, {timestamps: boolean}, {password: StringConstructor, last_name: StringConstructor, first_name: StringConstructor, email: {unique: boolean, type: StringConstructor}, token: StringConstructor}>}
 */
const AgentSchema = new mongoose.Schema(
  {
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
    is_hidden: {
      type: Boolean,
      default: false,
    },
    api_enabled: {
      type: Boolean,
      default: false,
    },
    api_key: {
      type: String, //to be hashed
      default: "",
    },
    auth_tokens: {
      type: [
        {
          token_type: {
            type: String,
            default: "application",
          },
          token: String,
          active: {
            type: Boolean,
            default: false,
          },
        },
      ],
      default: [],
    },
    env_files: {
      type: [
        {
          env_id: mongoose.Types.ObjectId,
          key: String, //hashed
          api_key: String, //hashed
        },
      ],
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
