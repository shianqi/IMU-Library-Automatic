/**
 * S-Killer 邮件模块
 * Created by killer on 2017/2/5.
 */
const nodemailer = require("nodemailer");
const config = require("../env");
const { email } = config;
const transporter = nodemailer.createTransport(email);

const email = function(
  title = "【自动预约系统】",
  html = "<b>好像出了点儿问题~</b>",
  emailAddress = "",
) {
  const mailOptions = {
    from: "", // 发件地址
    to: emailAddress, // 收件列表
    subject: title, // 标题
    html,
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) return console.log(error);
    console.log(`Mail sent: ${info.response} sent to ${emailAddress}`);
  });
};

module.exports = email;
