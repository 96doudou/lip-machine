//比例系数
let scaleCoe = document.documentElement.clientWidth / 750;

let pageAudio; //audio 标签
let insertAudio; //audio 标签
let currentTime; //播放进度
let pageAudioUrl =
  'https://file.diyring.cc/KuYinPlusCDN/1023/themes/onlinelist/skin/lipMachine/images/page.mp3'
let insertAudioUrl =
  'https://file.diyring.cc/KuYinPlusCDN/1023/themes/onlinelist/skin/lipMachine/images/insert.mp3'
//关卡配置信息
let levelConfig;
let moveFrame; //定时器
let frameTimer; //整体的定时器
let countDownTimer; //倒计时
let divisionTimer; //西瓜分离计数器

//游戏对象
let game = {
  init: null, //初始化上下文
  drawBg: null,
  drawSlideLips: null,
  drawCenterLip: null,
  drawXigua: null,
  drawMoveLip: null,
  drawRotateLip: null,
  drawCurLevel: null,
  drawCountDown: null,
  reset: null,
  pass: null,
  over: null,
  canCollision: null,
  drawMessyLips: null,
  level: '1',
  levelConfig: {
    level1_config: {
      canUseNumber: 6, //口红数
      notUseNumber: 0,
      rate: 2, //转速
      rateBand: 2, //转速浮动区间
      revertTimes: [50, 100, 160, 300],
      time: 10,
      text: '闯过三关 赢取口红',
      bottom: 95,
    },
    level2_config: {
      canUseNumber: 8, //口红数
      notUseNumber: 0,
      rate: 2, //转速
      rateBand: 2, //转速浮动区间
      revertTimes: [100, 200, 260, 360], //倒回去转的圈数
      time: 10,
      text: '表现不错 再接再厉',
      bottom: 95,
    },
    level3_config: {
      canUseNumber: 12, //口红数
      notUseNumber: 0,
      rate: 3, //转速
      rateBand: 2, //转速浮动区间
      revertTimes: [100, 200, 50, 260, 300, 360], //倒回去转的圈数
      time: 40,
      text: '决战在即 稳住',
      bottom: 95,
    },
  },
  rotate_angle: 0, //转动角度
  move_lip_bottom: '66',
  move_lip_rate: '80', //口红每次运动的距离
  coincide_height: '60', //口红和西瓜的重合高度
  lip_rotate_arr: [],
  xigua_shake_dis: 20,
  shouldShake: false,
  xigua_shake_max_dis: 80,
  drawTimes: 0,
  divisionDis: 40,
  textToBottom: 95,
  moved: true, //防止双击两个口红跌在一起
  isLastLip: false, //是否是最后一个口红，最后一个口红发射，中间底部应该是没有口红的
}


function createAudio(id, url, loop) {
  let audio = document.createElement("audio");
  audio.id = id;
  audio.src = url;
  audio.preload = "auto";
  audio.loop = loop;
  document.body.append(audio);
  audio.play();
  audio.pause();
}


function playAudio(id, opts) {
  id.play();
  if (opts && opts.onEnded) {
    id.onended = opts.onEnded;
  }
}

function draw() {
  levelConfig = game.levelConfig[`level${game.level}_config`];
  let random = Math.floor(Math.random() * levelConfig.revertTimes.length);
  // revertTimes 除这些===0
  if (game.drawTimes % levelConfig.revertTimes[random] == 0) {
    levelConfig.rate = -levelConfig.rate;
  }
  //重置旋转角度
  if (game.rotate_angle > 360) {
    game.rotate_angle = game.rotate_angle - 360;
  } else if (game.rotate_angle < -360) {
    game.rotate_angle = game.rotate_angle + 360;
  }
  //保持角度都是正值
  if (game.rotate_angle < 0) {
    game.rotate_angle = game.rotate_angle + 360;
  }
  //让西瓜的转速在一定范围内变速
  game.rotate_angle = game.rotate_angle + levelConfig.rate;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  game.drawTimes++;
  game.drawBg();
  game.drawCountDown(false);
  game.drawCurLevel();
  game.drawSlideLips();
  //最后一个口红就不绘制
  if (!game.isLastLip) {
    game.drawCenterLip();
  }
  game.drawRotateLip();
  game.drawXigua();
  frameTimer = window.requestAnimationFrame(draw);
}

game.init = function () {
  let canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  canvas.width = document.documentElement.clientWidth;
  canvas.height = document.documentElement.clientHeight;
  createAudio('pageAudio', pageAudioUrl, true);
  createAudio('insertAudio', insertAudioUrl, false);
  pageAudio = document.getElementById("pageAudio");
  insertAudio = document.getElementById("insertAudio");

  game.level = 1;
  //loading 页面不允许点击
  canvas.removeEventListener("click", handle);
  game.drawTransitionPage();
  //过渡页展示1s 后自动消失
  setTimeout(function () {
    canvas.addEventListener("click", handle);
    countDownTimer = setInterval(function () {
      game.drawCountDown();
    }, 1000);
    draw();
  }, 1000);

}
//绘制背景
game.drawBg = function () {
  ctx.drawImage(resList.bg.target, 0, 0, canvas.width, canvas.height);
}
//绘制侧边的所有口红
game.drawSlideLips = function () {
  //绘制已用口红
  let lip_slide_null_obj = resList[`lip_slide_null_${game.level}`];
  let left = toStandard(lip_slide_null_obj.left);
  let bottom = toStandard(lip_slide_null_obj.bottom);
  let height = toStandard(lip_slide_null_obj.height);
  let width = toStandard(lip_slide_null_obj.width);
  let margin = toStandard(lip_slide_null_obj.margin);
  for (let i = 0; i < levelConfig.notUseNumber; i++) {
    ctx.drawImage(lip_slide_null_obj.target, left, canvas.height - bottom - (height + margin) * i, width, height);
  }
  //绘制剩余口红
  let lip_slide_obj = resList[`lip_slide_${game.level}`];
  for (let i = 0; i < levelConfig.canUseNumber; i++) {
    ctx.drawImage(lip_slide_obj.target, left, canvas.height - bottom - (height + margin) * levelConfig.notUseNumber - (height + margin) * i, width, height)
  }

}
//绘制中间的口红
game.drawCenterLip = function () {
  let center_lip_obj = resList.lip_center;
  let width = toStandard(center_lip_obj.width);
  let height = toStandard(center_lip_obj.height);
  let top = canvas.height - toStandard(center_lip_obj.bottom) - height;
  let left = canvas.width / 2 - width / 2;
  ctx.drawImage(center_lip_obj.target, left, top, width, height);
}

//绘制围着圆转动的口红
game.drawRotateLip = function () {
  let xiguaObj = resList[`circle_${game.level}`];
  let xigua_height = toStandard(xiguaObj.height);
  let xigua_top = toStandard(xiguaObj.top);
  let originX = canvas.width / 2;
  let originY = xigua_top + xigua_height / 2;
  let center_lip_obj = resList.lip_center;
  let width = toStandard(center_lip_obj.width);
  let height = toStandard(center_lip_obj.height);
  let coincide_height = toStandard(game.coincide_height);
  ctx.save();
  ctx.translate(originX, originY);
  ctx.rotate(Math.PI / 180 * game.rotate_angle);
  ctx.translate(-originX, -originY);
  for (let i = 0; i < game.lip_rotate_arr.length; i++) {
    ctx.save();
    ctx.translate(originX, originY);
    //跟着自己插入时候的角度绘制
    ctx.rotate(-Math.PI / 180 * game.lip_rotate_arr[i]);
    ctx.translate(-originX, -originY);
    ctx.drawImage(center_lip_obj.target, originX, xigua_top + xigua_height - coincide_height, width, height);
    ctx.restore();
  }
  ctx.restore();
}
//绘制中间的圆
game.drawXigua = function () {
  let xiguaObj = resList[`circle_${game.level}`];
  let width = toStandard(xiguaObj.width);
  let height = toStandard(xiguaObj.height);
  let top = toStandard(xiguaObj.top);
  let left = canvas.width / 2 - width / 2;
  let originX = canvas.width / 2;
  let originY = top + height / 2;
  ctx.save();
  ctx.translate(originX, originY);
  ctx.rotate(Math.PI / 180 * game.rotate_angle);
  ctx.translate(-originX, -originY);
  if (game.shouldShake) {
    if (game.xigua_shake_dis < game.xigua_shake_max_dis) {
      ctx.drawImage(xiguaObj.target, left, top - toStandard(game.xigua_shake_dis), width, height);
      game.xigua_shake_dis = game.xigua_shake_dis + game.xigua_shake_dis;
    } else {
      game.shouldShake = false;
    }

  } else {
    ctx.drawImage(xiguaObj.target, left, top, width, height);
  }
  ctx.restore();
}
//绘制当前关卡
game.drawCurLevel = function () {
  let levelObj = resList[`active_level_${game.level}`];
  let width = toStandard(levelObj.width);
  let height = toStandard(levelObj.height);
  let left = toStandard(levelObj.left);
  let top = toStandard(levelObj.top);
  ctx.drawImage(resList.level_1.target, left + 12, top, width, height);
  ctx.drawImage(resList.level_2.target, left + width + 12, top, width, height);
  ctx.drawImage(resList.level_3.target, left + width * 2 + 12, top, width, height);
  ctx.drawImage(levelObj.target, left + (game.level - 1) * width + 12, top, width, height);
}

//转为根据屏幕高度自适应的大小
function toStandard(val) {
  return val * scaleCoe;
}
game.drawMoveLip = function () {
  game.moved = false;
  let center_lip_obj = resList.lip_center;
  let width = toStandard(center_lip_obj.width);
  let height = toStandard(center_lip_obj.height);
  let bottom = toStandard(game.move_lip_bottom);
  let top = canvas.height - bottom - height;
  let left = canvas.width / 2 - width / 2;
  let rate = toStandard(game.move_lip_rate); //每次移动的距离
  let center_obj = resList[`circle_${game.level}`];
  let center_top = toStandard(center_obj.top);
  let center_height = toStandard(center_obj.height);
  let coincide_height = toStandard(game.coincide_height);
  //最大能移动到的距离
  let maxMoveDis = canvas.height - center_top - center_height + height - coincide_height;
  //最后一关，直接运动一点点 
  if (game.isLastLip && game.level == 3) {
    maxMoveDis = canvas.height - center_top - center_height + height * 1.5 - coincide_height;
  }

  //口红
  if (top < maxMoveDis) {
    if (game.isLastLip && game.level == 3 && window.lottobj && window.lottobj.level) {
      game.over();
      return;
    }
    game.moved = true;
    if (game.canCollision(game.rotate_angle)) {
      game.over();
      ctx.drawImage(center_lip_obj.target, left, top, width, height);
      return;
    }
    currentTime = pageAudio.currentTime;

    playAudio(insertAudio, {
      onEnded: function () {
        if (insertAudio.ended) {
          pageAudio.currentTime = currentTime;
        }
      },
    });
    // 记录每个口红插入的角度
    game.lip_rotate_arr.push(game.rotate_angle);
    window.cancelAnimationFrame(moveFrame);
    //口红插入到西瓜上，要抖动
    game.shouldShake = true;

    if (game.isLastLip) {
      game.next();
    }
    return;
  }
  ctx.drawImage(center_lip_obj.target, left, top, width, height);
  game.drawXigua();
  game.move_lip_bottom = parseInt(game.move_lip_bottom) + parseInt(rate);
  moveFrame = window.requestAnimationFrame(game.drawMoveLip);
}
game.drawDivisionXigua = function () {
  let circle_left_obj = resList[`circle_left_${game.level}`];
  let circle_right_obj = resList[`circle_right_${game.level}`];
  let left_width = toStandard(circle_left_obj.width);
  let right_width = toStandard(circle_right_obj.width);
  let circle_obj_left = canvas.width / 2 - (left_width + right_width) / 2;
  let left_height = toStandard(circle_left_obj.height);
  let right_height = toStandard(circle_right_obj.height);
  let circle_left_top = toStandard(circle_left_obj.top);
  let circle_right_top = toStandard(circle_right_obj.top);
  let distance = 0;
  let circle_left_left = circle_obj_left - toStandard(distance) * 2;
  //右边的半圆绘制开始的x 坐标
  let circle_right_left = circle_left_left + left_width - toStandard(distance); //与坐标逐渐拉出距离
  drawDivision();
  ctx.drawImage(circle_left_obj.target, circle_left_left, circle_left_top, left_width, left_height);
  ctx.drawImage(circle_right_obj.target, circle_right_left, circle_right_top, right_width, right_height);
  game.drawMessyLips();
  // distance = distance + 10;
  divisionTimer = requestAnimationFrame(game.drawDivisionXigua);
}

function drawDivision() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  game.drawBg();
  game.drawSlideLips();
  game.drawCurLevel();
  game.drawCountDown(false);
  clearInterval(countDownTimer);
  window.cancelAnimationFrame(frameTimer);
}
//绘制散落的口红
game.drawMessyLips = function () {
  let lipArr = game.lip_rotate_arr;
  let circle_left_obj = resList[`circle_left_${game.level}`];
  let circle_right_obj = resList[`circle_right_${game.level}`];
  let center_lip_obj = resList.lip_center;
  let left_width = toStandard(circle_left_obj.width);
  let right_width = toStandard(circle_right_obj.width);
  let circle_obj_left = canvas.width / 2 - (left_width + right_width) / 2;
  let left_height = toStandard(circle_left_obj.height);
  let circle_left_top = toStandard(circle_left_obj.top);
  let circle_right_top = toStandard(circle_right_obj.top);
  let circle_left_left = circle_obj_left;
  //右边的半圆绘制开始的x 坐标
  let circle_right_left = circle_left_left + left_width; //与坐标逐渐拉出距离

  let lipWidth = toStandard(center_lip_obj.width);
  let lipHeight = toStandard(center_lip_obj.height);
  let r = Math.sqrt(((left_width + right_width) / 2) * ((left_width + right_width) / 2) + left_height * left_height);
  let left = circle_left_left - left_width;
  let right = circle_right_left + right_width * 2;
  let originX_right = circle_right_left + right_width;
  let originY = circle_left_top + left_height / 2;
  for (let i = 0; i < lipArr.length; i++) {
    let posX = Math.sin(lipArr[i] * Math.PI / 180) * r;
    //每个口红的x坐标，《0 画到坐标，反之，画到右边
    if (posX <= 0) {
      ctx.save();
      ctx.translate(circle_obj_left, originY);
      //跟着自己插入时候的角度绘制
      ctx.rotate(-Math.PI / 180 * lipArr[i]);
      ctx.translate(-circle_obj_left, -originY);
      ctx.drawImage(center_lip_obj.target, left, circle_left_top, lipWidth, lipHeight);
      ctx.restore();

    } else {
      ctx.save();
      ctx.translate(originX_right, originY);
      //跟着自己插入时候的角度绘制
      ctx.rotate(-Math.PI / 180 * lipArr[i]);
      ctx.translate(-originX_right, -originY);
      ctx.drawImage(center_lip_obj.target, right, circle_right_top, lipWidth, lipHeight);
      ctx.restore();

    }
  }
}
game.reset = function () {
  game.drawTimes = 0;
  game.xigua_shake_dis = 20;
  game.lip_rotate_arr = [];
  game.isLastLip = false;
}
//needTime  需不需要计时
game.drawCountDown = function (needTime = true) {
  let timebg_obj = resList[`time_bg_${game.level}`];
  let left = toStandard(timebg_obj.left);
  let top = toStandard(timebg_obj.top);
  let width = toStandard(timebg_obj.width);
  let height = toStandard(timebg_obj.height);
  let font_left = left + width / 2;
  let font_top = top + height / 2;

  if (needTime) {
    levelConfig.time--;
    if (levelConfig.time < 0) {
      game.over();
      return;
    }
  }
  ctx.drawImage(timebg_obj.target, left, top, width, height);
  ctx.save();
  // 设置字体
  ctx.font = "24px bold 黑体";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  // 设置颜色
  ctx.fillStyle = "#38237F";
  ctx.fillText(levelConfig.time, font_left, font_top);
  ctx.restore();
}
game.over = function () {
  canvas.removeEventListener("click", handle);
  clearInterval(countDownTimer);
  window.cancelAnimationFrame(moveFrame);
  window.cancelAnimationFrame(frameTimer)
  alert("游戏结束");
}
game.next = function () {
  canvas.removeEventListener("click", handle);
  //绘制分裂的西瓜
  game.drawDivisionXigua();
  //延迟1s 展示分裂的西瓜
  setTimeout(function () {
    window.cancelAnimationFrame(divisionTimer);
    game.level++;
    game.reset(); //解决bug islastlip = true 
    game.drawTransitionPage();
    //延迟1s 展示关卡的加载动画
    setTimeout(function () {
      countDownTimer = setInterval(function () {
        game.drawCountDown();
      }, 1000);
      game.reset();
      canvas.addEventListener("click", handle);
      draw();

    }, 1000);
  }, 600);

}
game.drawTransitionPage = function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let page_obj = resList[`level_${game.level}_page`];
  let height = toStandard(page_obj.height);
  let width = toStandard(page_obj.width);
  let left = (canvas.width - width) / 2;
  //第三关多一个准备好了按钮，如果点过取消，则再多一个返回首页按钮
  if (game.level == "3") {
    ctx.save();
    ctx.fillStyle = "#fff"; //设置fillStyle为当前的渐变对象
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    ctx.drawImage(resList[`level_${game.level}_page`].target, left, 0, width, height);
  } else {
    ctx.save();

    let gradient = ctx.createLinearGradient(0, canvas.height, canvas.width, 0);
    gradient.addColorStop(0, "#1C2E5D");
    gradient.addColorStop(0.25, "#213567");
    gradient.addColorStop(0.5, "#272966");
    gradient.addColorStop(0.75, "#592F8E");
    gradient.addColorStop(1, "#475FC2");
    ctx.fillStyle = gradient; //设置fillStyle为当前的渐变对象
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.restore();
    ctx.drawImage(resList[`level_${game.level}_page`].target, left, 0, width, height);
    ctx.restore();
  }

}

game.canCollision = function (angle) {

  let lip_width = toStandard(resList.lip_center.width);
  let lip_height = toStandard(resList.lip_center.width);
  let height = toStandard(resList[`circle_${game.level}`].height);
  //一个口红对应的角度
  let lipAngle = Math.sin(Math.sin(lip_width / (height + lip_height))) * 180 / Math.PI;

  //遍历所有口红的角度，如果有和当前口红重合的则判定为撞到
  for (tempAngle of game.lip_rotate_arr) {
    if (angle < tempAngle + lipAngle && angle > tempAngle - lipAngle) {
      return true;
    }
  }
  return false;
}

function handle() {
  if (!game.moved) {
    return;
  }
  game.move_lip_bottom = '66';
  game.xigua_shake_dis = 20;
  levelConfig.canUseNumber--;
  levelConfig.notUseNumber++;
  if (levelConfig.canUseNumber <= 0) {
    game.isLastLip = true;
  }
  game.drawMoveLip();
}