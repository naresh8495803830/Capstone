const User = require("../models/user.model").User;

const convertBatchToArrays = async (req, res) => {
  try {
    let users = await User.find();
    console.log(users);
    for (let item of users) {
      if (!Array.isArray(item.batchId)) {
        item.batchId = [item.batchId];
        await item.save();
      }
    }

    res.status(200).send({ users: users });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e });
  }
};

module.exports = { convertBatchToArrays };
