const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/usermodel");
const { createToken } = require("./userhelpers");

const doadLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    console.log(user, "yoooo");
    if (user && user.authenticate(password)) {
      let token = createToken(user);
      res.cookie("Authorization", `Bearer ${token}`);
      console.log("admin login success");
      res.redirect("/admin/dashboard");
    } else {
      console.log("admin not found");
      res.redirect("/admin");
    }
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  doadLogin,
};
