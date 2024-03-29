//const config = require("./config");
require("dotenv").config();

const config = {
  port: process.env.PORT || 8080,
  mongoUri: process.env.MONGO_URI,
  recaptcha: process.env.RECAPTCHA,
  skipAuth: true,
  VKONTAKTE_APP_ID: process.env.VKONTAKTE_APP_ID,
  VKONTAKTE_APP_SECRET: process.env.VKONTAKTE_APP_SECRET,
  VK_CALLBACK: process.env.VK_CALLBACK,
  secret: process.env.SECRET
};

module.exports = config;
