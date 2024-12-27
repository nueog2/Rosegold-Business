const WebSocket = require("ws");
const url = require("url");
const db = require("./models"); // 데이터베이스 모듈

const clients = new Map(); // hotelId: [ws1, ws2, ...]

function heartbeat() {
  this.isAlive = true;
}

function startWebSocketServer(server) {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", function connection(ws, req) {
    const parsedUrl = url.parse(req.url, true);
    const hotelId = parsedUrl.query.hotelId;

    // 클라이언트 식별 및 관리
    ws.hotelId = hotelId; // WebSocket 객체에 hotelId 속성 추가
    if (!clients.has(hotelId)) {
      clients.set(hotelId, []);
    }
    clients.get(hotelId).push(ws);

    console.log(`Client connected: Hotel ID ${hotelId}`);

    ws.isAlive = true;
    ws.on("pong", heartbeat);

    // 메시지 수신 이벤트 처리
    ws.on("message", function incoming(message) {
      console.log("received from client : %s", message); // 클라이언트에서 보낸 메세지 로깅
      //받은 메세지에 대한 처리
      try {
        const data = JSON.parse(message);
        if (data.action === "sendMessage") {
          // sendMessage 액션이면 data.message를 해당 호텔의 모든 클라이언트에게 전송
          broadcastToHotel(hotelId, data.message);
        }
      } catch (error) {
        console.error("Error processing message:", error);
      }
    });

    // 연결 종료 이벤트 처리
    ws.on("close", function close() {
      console.log(`Client disconnected: Hotel ID ${ws.hotelId}`);
      // 연결 종료된 클라이언트를 목록에서 제거
      if (clients.has(ws.hotelId)) {
        const clientList = clients.get(ws.hotelId);
        const index = clientList.indexOf(ws);
        if (index > -1) {
          clientList.splice(index, 1);
        }
        // 클라이언트 목록이 비어 있으면 Map에서 해당 hotelId 항목 제거
        if (clientList.length === 0) {
          clients.delete(ws.hotelId);
        }
      }
    });

    // 클라이언트에 메시지 전송 (연결 확인용)
    ws.send("Successfully connected to server!");
  });

  // 연결 유지 확인을 위한 핑퐁 메커니즘
  const interval = setInterval(function ping() {
    wss.clients.forEach(function each(ws) {
      if (ws.isAlive === false) {
        console.log(
          `Terminating connection due to inactivity: Hotel ID ${ws.hotelId}`
        );
        return ws.terminate();
      }

      ws.isAlive = false;
      ws.ping();
    });
  }, 30000); // 30초마다 핑 전송

  wss.on("close", function close() {
    clearInterval(interval);
    console.log("WebSocket server closed");
  });

  console.log("WebSocket server started");

  // 이벤트 큐 폴링
  setInterval(() => {
    db.sequelize
      .query("SELECT * FROM event_queue WHERE processed = 0", {
        type: db.sequelize.QueryTypes.SELECT,
      })
      .then((events) => {
        events.forEach((event) => {
          const hotelId = event.hotel_id;
          if (clients.has(hotelId)) {
            clients.get(hotelId).forEach((ws) => {
              if (ws.readyState === WebSocket.OPEN) {
                ws.send(
                  JSON.stringify({
                    event: event.event_type,
                    hotelId: hotelId,
                  })
                );
              }
            });
          }

          // 이벤트 처리 후 processed = 1로 업데이트
          db.sequelize.query(
            "UPDATE event_queue SET processed = 1 WHERE id = ?",
            [event.id]
          );
        });
      })
      .catch((error) => {
        console.error("Error polling event queue:", error);
      });
  }, 1000); // 1초마다 폴링
}

module.exports = startWebSocketServer;
