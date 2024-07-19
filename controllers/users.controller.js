const md5 = require("md5");
const Users = require("../models/users.model");
const ForgotPassword = require("../models/forgotPassword.model");
const generate = require("../helpers/generate.helper");
const sendMail = require("../helpers/sendMail.helper");

const register = async (req, res) => {
  try {
    req.body.password = md5(req.body.password);
    const existEmail = await Users.findOne({
      email: req.body.email,
      deleted: false,
    });
    if (!existEmail) {
      const user = new Users({
        fullName: req.body.fullName,
        email: req.body.email,
        password: req.body.password,
      });
      await user.save();
      res.cookie("token", user.token);
      res.json({
        status: 200,
        message: "Registered successfully",
        token: user.token,
      });
    } else {
      res.json({
        status: 400,
        message: "Email already exists",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: 400,
      message: "Failed to register",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const emailExist = await Users.findOne({
      email: email,
      deleted: false,
    });
    if (!emailExist) {
      res.json({
        status: 400,
        message: "Email does not exist",
      });
      return;
    }

    if (emailExist.password !== md5(password)) {
      res.json({
        status: 400,
        message: "Wrong password",
      });
      return;
    }

    res.cookie("token", emailExist.token);
    res.json({
      status: 200,
      message: "Login successfully",
      token: emailExist.token,
    });
  } catch (error) {
    console.log(error);
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const emailExist = await Users.findOne({
      email: email,
      deleted: false,
    });
    if (!emailExist) {
      res.json({
        status: 400,
        message: "Email does not exist",
      });
      return;
    }

    const otp = generate.generateRandomString(5);
    const timeExpire = 5;
    const forgotPassword = {
      email,
      otp,
      expireAt: Date.now() + timeExpire * 60,
    };

    const objForgotPassword = new ForgotPassword(forgotPassword);
    await objForgotPassword.save();

    const subject = "OTP to reset password";
    const html = `
        <p>This is your OTP: ${otp}</p>
    `;

    sendMail.sendMail(email, subject, html);

    res.json({
      status: 200,
      message: "Already sent OTP to your email, please check",
    });
  } catch (error) {
    console.log(error);
  }
};

const otp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const otpExist = await ForgotPassword.findOne({ otp: otp, email: email });

    if (!otpExist) {
      res.json({
        status: 400,
        message: "Wrong OTP",
      });
      return;
    }

    const user = await Users.findOne({ email: email });
    res.cookie("token", user.token);
    res.json({
      status: 200,
      message: "Valid OTP",
      token: user.token,
    });
  } catch (error) {
    console.log(error);
  }
};

const resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body;
    const user = await Users.findOne({ token: token });
    if (!user) {
      res.json({
        status: 400,
        message: "User does not exist",
      });
      return;
    }

    if (password !== confirmPassword) {
      res.json({
        status: 400,
        message: "Password does not match",
      });
      return;
    }

    await Users.updateOne(
      {
        token: token,
      },
      {
        password: md5(password),
      }
    );

    res.json({
      status: 200,
      message: "Reset password successfully",
      token: token,
    });
  } catch (error) {
    console.log(error);
  }
};

const getProfile = async (req, res) => {
  try {
    const token = req.cookies.token;
    const user = await Users.findOne({ token: token, deleted: false }).select(
      "fullName email avatar"
    );
    res.json({
      status: 200,
      data: user,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  otp,
  resetPassword,
  getProfile,
};
