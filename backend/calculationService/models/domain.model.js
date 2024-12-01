const mongoose = require("../utils/conn").mongoose;

const domainSchema = mongoose.Schema({
  domainName: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 200,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// Register the 'domain' model with Mongoose
const Domain = mongoose.model("Domain", domainSchema); // The first argument should be the singular form of the collection name

module.exports = Domain;
