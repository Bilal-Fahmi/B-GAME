const userhelpers = require("../helpers/userhelpers");
const Banner = require("../models/bannerSchema");
const Product = require("../models/productSchema");
const User = require("../models/usermodel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const Email = process.env.APP_EMAIL;
const Pass = process.env.APP_PASS;
const Name = process.env.APP_NAME;

const errorpage = (req, res) => {
  res.render("404page");
};

const index = async (req, res) => {
  try {
    console.log("index");
    const banner = await Banner.find({});
    const product = await Product.find({}).limit(5);
    if (!banner || !product) {
      return res.redirect("/404");
    }
    res.render("index", { banner: banner, product: product });
  } catch (error) {
    console.log(error);
  }
};

const userLogin = (req, res) => {
  try {
    console.log(req.cookies);
    if (req.cookies.Authorization) {
      // console.log(req.session.adminId)
      res.redirect("/");
    } else {
      let error = req.session.loginError;
      req.session.loginError = false;
      res.render("auth/login", { loginError: error });
    }
  } catch (error) {
    console.log("page not found");
  }
};

const userSignup = (req, res) => {
  try {
    if (req.session.loggedIn) {
      res.redirect("/userHome");
    } else res.render("auth/signup");
  } catch (error) {
    console.log("404 not found", error);
  }
};

const loaduserOtp = (req, res) => {
  try {
    res.render("auth/otp");
  } catch (error) {
    console.log("page not found");
  }
};

const doSignup = async (req, res) => {
  console.log(req.body, "here 10");
  const email = req.body.email;
  try {
    const result = await sendOtp(req, email);
    console.log(result, "here result");
    req.session.loggedIn = true;
    req.session.user = {
      username: req.body.username,
      phone: req.body.phone,
      password: req.body.password,
      email: req.body.email,
      confirmpassword: req.body.password,
    };
    console.log(req.session.user);
    console.log("to otp");
    res.redirect("/otp");
  } catch (error) {
    console.error("Error sending OTP", error);
  }
};

const loggedIn = (req, res) => {
  console.log(req.body);
  userhelpers.doLogin(req, res);
};

const otpVerification = async (req, res) => {
  try {
    const success = await verifyOtp(req);
    if (success) {
      const result = await saveUserData(req);
      req.session.loggedIn = true;
      console.log("data saved");
      res.redirect("/login");
    } else {
      res.redirect("/otp");
    }
  } catch (error) {
    console.error("Error saving data", error);
    res.redirect("/otp");
  }
};

const logout = (req, res) => {
  res.clearCookie("Authorization");

  res.redirect("/");
};

const resendOtp = (req, res) => {
  // otp.sendOtp(res,req=>{
  //     res.render('/otp')
  // })
};

const forgotpass = (req, res) => {
  try {
    res.render("auth/forgotpass");
  } catch (error) {
    console.log(error);
    res.redirect("/login");
  }
};

const forgotpassword = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  req.session.userEmail = email;
  req.session.userPassword = password;
  try {
    const result = await sendOtp(req, email);
    res.render("auth/ForgotPassOtp");
  } catch (error) {
    console.log(error);
    res.redirect("/forgotpass");
  }
};

const verifyOtpAndUpdatePassword = async (req, res) => {
  const otp = req.body.otp;
  const password = req.session.userPassword;
  const email = req.session.userEmail;
  console.log(otp);
  console.log(password);
  console.log(email);
  try {
    //   const email = req.body.email;
    const votp = await verifyOtp(req);
    if (votp) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const updateduser = await User.findOneAndUpdate(
        { email },
        { password: hashedPassword },
        { new: true }
      );
      if (updateduser) {
        res.redirect("/login");
        //   res.json({ message: 'Password updated successfully', user: updateduser });
      } else {
        res.json({ message: "User not found" });
      }
    } else {
      res.json({ message: "Invalid OTP" });
    }
  } catch (error) {
    console.log(error);
    res.json({ message: "Error updating password" });
  }
};

//*******************-FUNCTIONS-**********************/

async function saveUserData(req) {
  try {
    console.log(req.body.otp);
    const { username, phone, password, email } = req.session.user;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({
      username,
      email,
      phone,
      password: hashedPassword,
      confirmpassword: hashedPassword,
    });
    const result = await user.save();
    return result;
  } catch (error) {
    console.log("Error saving user data", error);
    throw error;
  }
}

const createMailTrasporter = () => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: Email,
      pass: Pass,
    },
  });
  return transporter;
};

function sendOtp(req, email) {
  return new Promise((resolve, reject) => {
    const otp = Math.floor(Math.random() * 9000) + 1000;
    req.session.otp = otp;
    const transporter = createMailTrasporter();
    const mailOptions = {
      from: `"${Name}" <${Email}>`,
      to: email,
      subject: "OTP Verification",
      html: ` <h2>OTP for Your Account</h2>
              <p>Dear User,</p>
              <p>Your One-Time Password (OTP) for accessing your account is:</p>
              <p style="font-size: 24px; font-weight: bold; color: #ff0000;">${otp}</p>
              <p>Please enter this OTP in the required field to proceed with your account access.</p>
              <p>If you did not request this OTP, please contact our customer support immediately.</p>
              <p>Best regards,</p>
              <p>The Support Team</p>`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        console.log("Error sending OTP email");
        reject(error);
      } else {
        console.log("OTP email sent successfully");
        resolve(info);
      }
    });
  });
}

async function verifyOtp(req) {
  try {
    console.log(req.body.otp);
    if (req.session && req.session.otp == req.body.otp) {
      console.log("Otp is valid");
      return true;
    } else {
      console.log("Otp is invalid");
      return false;
    }
  } catch (error) {
    console.log("Error verifying OTP", error);
    return false;
  }
}

module.exports = {
  index,
  userLogin,
  userSignup,
  doSignup,
  loggedIn,
  otpVerification,
  logout,
  resendOtp,
  errorpage,
  forgotpass,
  forgotpassword,
  loaduserOtp,
  verifyOtpAndUpdatePassword,
};
