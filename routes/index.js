const express = require("express");
const router = express.Router();
const schedule = require("node-schedule");
const mail = require("./email");
const config = require("../env");
const login = require("./service").login;
const logout = require("./service").logout;
const setResv = require("./service").setResv;
const checkResv = require("./service").checkResv;
const signInResv = require("./service").signInResv;
const signOutResv = require("./service").signOutResv;

const dateList = [
  {
    start: [7, 30],
    end: [11, 30],
  },
  {
    start: [11, 30],
    end: [15, 30],
  },
  {
    start: [15, 30],
    end: [19, 30],
  },
  {
    start: [19, 30],
    end: [22, 0],
  },
];

const { username, password, devId, labId } = config;

/* GET home page. */
router.get("/", function(req, res, next) {
  const getMessage = async function() {
    try {
      await login(username, password);
      const resvMessage = await checkResv();
      const { status } = resvMessage.length > 0 ? resvMessage[0] : {};
      await logout();
      res.render("index", { title: status });
    } catch (e) {
      res.render("index", { title: "Error" });
    }
  };
  getMessage().then();
});

router.get("/checkIn", function() {});

/**
 * 预约座位
 * @param start 开始时间
 * @param end 结束时间
 * @returns {Promise.<void>}
 */
const reservation = async function(start, end) {
  try {
    const now = new Date();
    if (now.valueOf() <= end.valueOf()) {
      await login(USERNAME, PASSWORD);
      await setResv(
        devId,
        labId,
        start.valueOf() > now.valueOf() ? start : now,
        end,
      );
      await logout();
    }
  } catch (e) {
    console.log(new Date().toLocaleString(), "错误：", e);
  }
};

/**
 * 预约两天内
 * @returns {Promise.<void>}
 */
const priorReservation = async function() {
  try {
    const now = new Date();
    for (let i = 0; i < dateList.length; i++) {
      const start = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        dateList[i].start[0],
        dateList[i].start[1],
        0,
      );
      const end = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        dateList[i].end[0],
        dateList[i].end[1],
        0,
      );
      const startTomorrow = new Date(start.valueOf() + 24 * 60 * 60 * 1000);
      const endTomorrow = new Date(end.valueOf() + 24 * 60 * 60 * 1000);
      await reservation(start, end);
      await reservation(startTomorrow, endTomorrow);
    }
  } catch (e) {
    console.log(e);
  }
};

/**
 * 签退
 * @returns {Promise.<void>}
 */
const signOut = async function() {
  try {
    await login(USERNAME, PASSWORD);
    const resvMessage = await checkResv();
    const { id = "", status } = resvMessage.length > 0 ? resvMessage[0] : {};
    if (status > 8000) {
      await signOutResv(id);
    }
    await logout();
  } catch (e) {
    console.log(new Date().toLocaleString(), "签退错误：", e);
  }
};

/**
 * 签到
 * @returns {Promise.<void>}
 */
const singIn = async function() {
  try {
    await login(USERNAME, PASSWORD);
    const resvMessage = await checkResv();
    const { devId, labId, id = "" } =
      resvMessage.length > 0 ? resvMessage[0] : {};
    await signInResv(devId, labId, id);
    await logout();
  } catch (e) {
    mail("【自动预约系统】", `出问题啦！原因：${e}`);
    console.log(new Date().toLocaleString(), "签到错误：", e);
  }
};

/**
 * 7:31 11:31 15:31 19:31 自动签退签到
 */
schedule.scheduleJob("31 7,11,15,19 * * *", async function() {
  await singIn();
});

/**
 * 7:21 11:21 15:21 19:21 自动签退签到
 */
schedule.scheduleJob("21 7,11,15,19 * * *", async function() {
  await signOut();
});

/**
 * 每天7:10分自动预约当天和明天
 */
schedule.scheduleJob("0 10 7 * * *", async function() {
  await priorReservation();
});

const init = async function() {
  await priorReservation();
  await singIn();
};

init();

module.exports = router;
