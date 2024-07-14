const Hotel = require("../models/hotel").Hotel;
//아직 작성중임다...

function getCurrentWeather(lat, lng) {
  var rs = dfs_xy_conv("toXY", lat, lng);
  var _nx = rs.nx;
  var _ny = rs.ny;

  var today = new Date();
  today.setHours(today.getHours() + 9); //UTC환경일 경우 한국시간 기준으로 변경~

  var dd = today.getDate();
  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();
  var hours = today.getHours();
  var minutes = today.getMinutes();

  if (minutes < 30) {
    // 30분보다 작으면 한시간 전 값
    hours = hours - 1;
    if (hours < 0) {
      // 자정 이전은 전날로 계산
      today.setDate(today.getDate() - 1);
      dd = today.getDate();
      mm = today.getMonth() + 1;
      yyyy = today.getFullYear();
      hours = 23;
    }
  }
  if (hours < 10) {
    hours = "0" + hours;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  if (dd < 10) {
    dd = "0" + dd;
  }

  var apikey =
      "HCLxkm8xc4wf4U16CiXzPEEhNvcbwUr7mkTGXm3xP0Ix1aRweSby59Aw%2FXkhu4sq2%2BM%2BJDw83edEitA3Ev8N2g%3D%3D",
    ttoday = yyyy + "" + mm + "" + dd,
    basetime = hours + "00",
    fileName = "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0";
  fileName += "?ServiceKey=" + apikey;
  fileName += "&base_date=" + ttoday;
  fileName += "&base_time=" + basetime;
  fileName += "&nx=" + _nx + "&ny=" + _ny;
  fileName += "&pageNo=1&numOfRows=10";
  fileName += "&dataType=JSON";

  var path = fileName;
  http
    .get(path, (resp) => {
      let data = "";
      // A chunk of data has been recieved.
      resp.on("data", (chunk) => {
        data += chunk;
      });

      // The whole response has been received. Print out the result.
      resp.on("end", () => {
        var ret = JSON.parse(data);
        makeResponse(ret, callback);
      });
    })
    .on("error", (err) => {
      console.log("Error is : " + err.message);
    });
}

function makeResponse(ret, callback) {
  var pty, reh, rn1, t1h, uuu, vec, vvv, wsd;
  ret.response.body.items.item.forEach(function (it) {
    if (it.category == "PTY") pty = it.obsrValue;
    else if (it.category == "REH") reh = it.obsrValue;
    else if (it.category == "RN1") rn1 = it.obsrValue;
    else if (it.category == "T1H") t1h = it.obsrValue;
    else if (it.category == "UUU") uuu = it.obsrValue;
    else if (it.category == "VEC") vec = it.obsrValue;
    else if (it.category == "VVV") vvv = it.obsrValue;
    else if (it.category == "WSD") wsd = it.obsrValue;
  });

  //우천 여부와 온도, 풍속만 표시
  //없음(0), 비(1), 비/눈(2), 눈(3), 소나기(4)
  if (pty == 0) {
    pty = "sun";
  } else if (pty == 1) {
    pty = "rain";
  } else if (pty == 2) {
    pty = "rain/snow";
  } else if (pty == 3) {
    pty = "snow";
  } else if (pty == 4) {
    pty = "rain";
  }

  return { temp: t1h, wind: wsd, pty: pty };
}

// https://gist.github.com/fronteer-kr/14d7f779d52a21ac2f16
// LCC DFS 좌표변환
//
var RE = 6371.00877; // 지구 반경(km)
var GRID = 5.0; // 격자 간격(km)
var SLAT1 = 30.0; // 투영 위도1(degree)
var SLAT2 = 60.0; // 투영 위도2(degree)
var OLON = 126.0; // 기준점 경도(degree)
var OLAT = 38.0; // 기준점 위도(degree)
var XO = 43; // 기준점 X좌표(GRID)
var YO = 136; // 기1준점 Y좌표(GRID)

//
// LCC DFS 좌표변환 ( code : "toXY"(위경도->좌표, v1:위도, v2:경도), "toLL"(좌표->위경도,v1:x, v2:y) )
//

function dfs_xy_conv(code, v1, v2) {
  var DEGRAD = Math.PI / 180.0;
  var RADDEG = 180.0 / Math.PI;

  var re = RE / GRID;
  var slat1 = SLAT1 * DEGRAD;
  var slat2 = SLAT2 * DEGRAD;
  var olon = OLON * DEGRAD;
  var olat = OLAT * DEGRAD;

  var sn =
    Math.tan(Math.PI * 0.25 + slat2 * 0.5) /
    Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
  var sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn;
  var ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
  ro = (re * sf) / Math.pow(ro, sn);
  var rs = {};
  if (code == "toXY") {
    rs["lat"] = v1;
    rs["lng"] = v2;
    var ra = Math.tan(Math.PI * 0.25 + v1 * DEGRAD * 0.5);
    ra = (re * sf) / Math.pow(ra, sn);
    var theta = v2 * DEGRAD - olon;
    if (theta > Math.PI) theta -= 2.0 * Math.PI;
    if (theta < -Math.PI) theta += 2.0 * Math.PI;
    theta *= sn;
    rs["nx"] = Math.floor(ra * Math.sin(theta) + XO + 0.5);
    rs["ny"] = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);
  } else {
    rs["nx"] = v1;
    rs["ny"] = v2;
    var xn = v1 - XO;
    var yn = ro - v2 + YO;
    ra = Math.sqrt(xn * xn + yn * yn);
    if (sn < 0.0) -ra;
    var alat = Math.pow((re * sf) / ra, 1.0 / sn);
    alat = 2.0 * Math.atan(alat) - Math.PI * 0.5;

    if (Math.abs(xn) <= 0.0) {
      theta = 0.0;
    } else {
      if (Math.abs(yn) <= 0.0) {
        theta = Math.PI * 0.5;
        if (xn < 0.0) -theta;
      } else theta = Math.atan2(xn, yn);
    }
    var alon = theta / sn + olon;
    rs["lat"] = alat * RADDEG;
    rs["lng"] = alon * RADDEG;
  }
  return rs;
}

module.exports = { getCurrentWeather };
// dfs_xy_conv
