(function () {
  //请修改为你自己的cesium-ion token
  Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkYWNmOTc1NC02N2U0LTQzZGMtOGRhNC1lOTJjNjFiMWIzZjgiLCJpZCI6MTMzMzE0LCJpYXQiOjE3MTM4NDk4NzJ9.uIiDvn99Slv79KZrGoMizfV3hGvuWNZq3c_50IRXE-c'
  //----------------------------------------------------------------------------------------------------
  resizeWindow();
  let viewer = mbs.utils.initMap("map");

  //定位
  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(116, 33, 100000),
    orientation: {
      heading: 5.426926684703881,
      pitch: -0.2791305753706699,
      roll: 6.282719687781836,
    },
  });

  document.addEventListener('DOMContentLoaded', function() {
    var start = document.getElementById('start');
    start.addEventListener('click', function() {
      startRoam(viewer);
    });

    var pause = document.getElementById('pause');
    pause.addEventListener('click', function() {
      pauseFligt();
    });

    var exit = document.getElementById('exit');
    exit.addEventListener('click', function() {
      exitFlight();
    });
  });

})();

function startRoam(viewer) {
  // 生成直线上的20个点
  let points = [];
  const startLon = 120.895;  // 起点经度（西）
  const startLat = 31.975560167086224;   // 起点纬度
  const endLon = 120.91641704673527;    // 终点经度（东）
  const endLat = 31.977220527083508;     // 终点纬度
  
  // 生成来回的40个点（20个去，20个回）
  for (let i = 0; i < 40; i++) {
    let ratio;
    if (i < 20) {
      // 前20个点：从西到东
      ratio = i / 19;
      const lon = startLon + (endLon - startLon) * ratio;
      const lat = startLat + (endLat - startLat) * ratio;
      points.push(lon, lat, 200);
    } else {
      // 后20个点：从东到西
      ratio = (39 - i) / 19;
      const lon = startLon + (endLon - startLon) * ratio;
      const lat = startLat + (endLat - startLat) * ratio;
      points.push(lon, lat, 200);
    }
  }
  
  let pos = points;
  let params = {
    rx: -100,
    ry: 0,
    rz: 50,
    scale: 1,
    lineShow: true,
    speed: 1,
  };
  window.roamObject = new roam({
    Cesium: Cesium,
    viewer: viewer,
    pos: pos,
    model: {
      url: "../libs/model/gltf/Cesium_Air.glb",
      scale: params.scale,
      width: 10
    },
    posAngel: {
      rx: params.rx,
      ry: params.ry,
      rz: params.rz,
    },
    speed: 6,
    isPaused: false
  });

  // 添加时钟事件监听器
  viewer.clock.onTick.addEventListener(function(clock) {
    if (clock.currentTime.equals(clock.stopTime)) {
      // 到达终点时自动退出
      exitFlight();
    }
  });
}
//暂停/继续 漫游
function pauseFligt() {
  window.roamObject.pauseFligt();
}
//退出漫游
function exitFlight(){
  window.roamObject.exitFlight();
}
function resizeWindow() {
  function setDivHeight() {
    var div = document.getElementById('map');
    div.style.height = window.innerHeight + 'px';
  }

  window.onload = setDivHeight;

  window.addEventListener('resize', setDivHeight);
}
// 添加一个调整速度的函数
function changeSpeed(newSpeed) {
  if (window.roamObject) {
    window.roamObject.setSpeed(newSpeed);  // newSpeed可以是1, 2, 3等数值
  }
}