const config = {
  username: "",
  password: "",
  email: {
    // https://github.com/andris9/nodemailer-wellknown#supported-services 支持列表
    service: "",
    port: 465, // SMTP 端口
    secureConnection: true, // 使用 SSL
    auth: {
      user: "",
      pass: "",
    },
  },
  // 100486556 100482108 3A-075
  // 100486652 100482108 3B1-091
  // 100486650 100482108 3B1-089
  // 100486783 100482108 3B2-036
  // 100486801 100485581 3B2-054 有插座
  // 100486800 100485581 3B2-053 有插座
  // 100486799 100485581 3B2-052
  devId: 100486556,
  labId: 100482108,
};
