const User = require("../models/usermodel");

const blockUser = async (req, res) => {
  try {
    const id = req.params.id;
    await User.findOneAndUpdate(
      { _id: id },
      { $set: { status: "Blocked" } }
    ).then(() => {
      res.redirect("/admin/usertable");
    });
  } catch (err) {
    console.log(err);
  }
};

const unblockUser = async (req, res) => {
  try {
    const id = req.params.id;
    await User.findOneAndUpdate(
      { _id: id },
      { $set: { status: "Unblocked" } }
    ).then(() => {
      res.redirect("/admin/usertable");
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  blockUser,
  unblockUser,
};
