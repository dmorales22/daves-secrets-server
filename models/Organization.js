const mongoose = require("mongoose");

const OrganizationSchema = new mongoose.Schema(
  {
    organization_name: {
      type: String,
      default: "",
    },
    organization_type: {
      type: String,
      default: "",
    },
    agent_list: {
      type: [
        { role: String, agent_id: mongoose.Types.ObjectId, active: Boolean },
      ],
      default: [],
    },
    status: {
      type: String,
      default: "active", //active, suspended, orphan
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

module.exports = mongoose.model(
  "Organization",
  OrganizationSchema,
  "Organization"
);
