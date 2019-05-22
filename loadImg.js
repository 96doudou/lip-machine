//resArr 存放图片数组，必须有属性名url
let resArr = [{
    'name': 'bg',
    'url': './img/bg.png',
    'width': '750',
    'height': '1217',
  },
  {
    'name': 'level_1',
    'url': './img/level_1.png',
    'width': '82',
    'height': '98',
    'left': '400',
    'top': '80'
  },
  {
    'name': 'level_2',
    'url': './img/level_2.png',
    'width': '82',
    'height': '98',
    'left': '400',
    'top': '80'
  },
  {
    'name': 'level_3',
    'url': './img/level_3.png',
    'width': '82',
    'height': '98',
    'left': '400',
    'top': '80'
  },
  {
    'name': 'active_level_1',
    'url': './img/active_level_1.png',
    'width': '82',
    'height': '98',
    'left': '400',
    'top': '80'
  },
  {
    'name': 'active_level_2',
    'url': './img/active_level_2.png',
    'width': '82',
    'height': '98',
    'left': '400',
    'top': '80'
  },
  {
    'name': 'active_level_3',
    'url': './img/active_level_3.png',
    'width': '82',
    'height': '98',
    'left': '400',
    'top': '80'
  },
  {
    'name': 'time_bg_1',
    'url': './img/time_bg_1.png',
    'width': '142',
    'height': '144',
    'left': '77',
    'top': '80'
  },
  {
    'name': 'time_bg_2',
    'url': './img/time_bg_2.png',
    'width': '142',
    'height': '144',
    'left': '77',
    'top': '80'
  },
  {
    'name': 'time_bg_3',
    'url': './img/time_bg_3.png',
    'width': '142',
    'height': '144',
    'left': '77',
    'top': '80'
  },
  {
    'name': 'circle_1',
    'url': './img/circle_1.png',
    'width': '376',
    'height': '380',
    'top': '340'
  },
  {
    'name': 'circle_2',
    'url': './img/circle_2.png',
    'width': '376',
    'height': '380',
    'top': '340'
  },
  {
    'name': 'circle_3',
    'url': './img/circle_3.png',
    'width': '376',
    'height': '380',
    'top': '340'
  },
  {
    'name': 'circle_left_1',
    'url': './img/circle_left_1.png',
    'width': '220',
    'height': '380',
    'top': '340'
  },
  {
    'name': 'circle_left_2',
    'url': './img/circle_left_2.png',
    'width': '220',
    'height': '380',
    'top': '340'
  },
  {
    'name': 'circle_left_3',
    'url': './img/circle_left_3.png',
    'width': '220',
    'height': '380',
    'top': '340'
  },
  {
    'name': 'circle_right_1',
    'url': './img/circle_right_1.png',
    'width': '244',
    'height': '377',
    'top': '340'
  },
  {
    'name': 'circle_right_2',
    'url': './img/circle_right_2.png',
    'width': '244',
    'height': '377',
    'top': '340'
  },
  {
    'name': 'circle_right_3',
    'url': './img/circle_right_3.png',
    'width': '244',
    'height': '377',
    'top': '340'
  },
  {
    'name': 'lip_slide_1',
    'url': './img/lip_slide_1.png',
    'width': '112',
    'height': '39',
    'left': '80',
    'bottom': '96',
    'margin': '8'
  },
  {
    'name': 'lip_slide_2',
    'url': './img/lip_slide_2.png',
    'width': '112',
    'height': '39',
    'left': '80',
    'bottom': '96',
    'margin': '8'
  },
  {
    'name': 'lip_slide_3',
    'url': './img/lip_slide_3.png',
    'width': '92',
    'height': '31',
    'left': '40',
    'bottom': '96',
    'margin': '8'
  },
  {
    'name': 'lip_slide_null_1',
    'url': './img/lip_slide_null_1.png',
    'width': '112',
    'height': '39',
    'left': '80',
    'bottom': '96',
    'margin': '8'
  },
  {
    'name': 'lip_slide_null_2',
    'url': './img/lip_slide_null_2.png',
    'width': '112',
    'height': '39',
    'left': '80',
    'bottom': '96',
    'margin': '8'
  },
  {
    'name': 'lip_slide_null_3',
    'url': './img/lip_slide_null_3.png',
    'width': '92',
    'height': '31',
    'left': '40',
    'bottom': '96',
    'margin': '8'
  },
  {
    'name': 'lip_center',
    'url': './img/lip_center.png',
    'width': '81',
    'height': '205',
    'left': '358',
    'bottom': '66'
  },
  {
    'name': 'level_1_page',
    'url': './img/level_1_page.png',
    'width': 692,
    'height': 687
  },
  {
    'name': 'level_2_page',
    'url': './img/level_2_page.png',
    'width': 692,
    'height': 688
  },
  {
    'name': 'level_3_page',
    'url': './img/level_3_page.png',
    'width': 750,
    'height': 1215
  }
];

let progress;
let resIndex = 0;
let resLength = resArr.length;
let resList = [];
let loadFinish = false;
let progressObj = document.getElementById("progress");

function next() {
  resIndex++;
  //处理进度条
  progress = `${(resIndex/resLength *100).toFixed(0)}%`;
  progressObj.innerText = progress;
  //这要不要加个超时时间
  if (resIndex >= resLength) {
    //加载完成{
    loadFinish = true;
    callback();
  }
  //长时间加载不回来。也会直接进入活动页
  setTimeout(function () {
    if (!loadFinish) {
      callback();
    }
  }, 10000);
}

function callback() {
  document.getElementById("load").style.display = 'none';
  document.getElementById("game").style.display = 'block';
  game.init();
  return;
}

(function loadRes() {
  if (resArr.length <= 0) {
    return;
  }
  resArr.forEach(function (item) {
    var img = new Image();
    img.src = item.url;
    //图片加载完成
    img.onload = function () {
      var content = {};
      // 遍历属性
      for (key in item) {
        content[key] = item[key];
      }
      content.target = img;
      resList[item.name] = content;
      next();
    }
    img.onerror = function () {
      next();
    }

  })

})();