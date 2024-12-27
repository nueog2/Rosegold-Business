const WebSocket = require("ws");
const url = require("url");
const Hotel = require("./src/models/hotel").Hotel;

module.exports = (server) => {
  //? express 서버와 웹소켓 서버를 연결 시킨다.
  // 변수이름은 wss(web socket server)
  const wss = new WebSocket.Server({ server });

  //* 프론트에서 new WebSocket("ws://localhost:6060") 보냈을때, 웹소켓 연결 실행
  wss.on("connection", function connection(ws, req) {
    const parsedUrl = url.parse(req.url, true);
    const hotelId = parsedUrl.query.hotelId;
    // const hotel = new Hotel();
    // hotel
    // .readOne({ id: parsedUrl.query.hotelId }).then((response) => {
    //     const hotelName = response.datavalues.name;
    //   })

    // console.log("Hotel ID :", hotelId ,"Hotel NAME :", hotelName);
    console.log("Hotel ID :", hotelId);

    //* ip 파악
    // req.headers['x-forwarded-for'] : 프록시 서버를 경유할때 ip가 변조될수 있다. 이를 감지하고 본ip파악해줄 수 있다.
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    console.log("새로운 클라이언트 접속 ip : ", ip);

    //* 클라이언트로부터 온 메시지
    ws.on("message", (message) => {
      console.log(message.toString());
    });

    //* 에러 시
    ws.on("error", (error) => {
      console.error(error);
    });

    //* 연결 종료 시 (유저가 채팅방을 나간다거나)
    ws.on("close", () => {
      console.log("클라이언트 접속 해제", ip);
      clearInterval(ws.interval); // 연결 끊기면 setInterval 중지
    });

    // 3초마다 클라이언트로 메시지 전송
    ws.interval = setInterval(() => {
      //! 웹소켓은 비동기이기 때문에 삑 날 수 있어, 웹소켓이 클라이언트랑 연결이 되었는지 검사하는 안전 장치
      if (ws.readyState !== ws.OPEN) {
        return;
      }

      ws.send("서버에서 클라이언트로 메시지를 보냅니다.");
    }, 3000);
  });
};
