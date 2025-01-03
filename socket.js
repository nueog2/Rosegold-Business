const WebSocket = require("ws");
const url = require("url");
const models = require("./models"); // 데이터베이스 모듈
// const EventQueue = require("./models/schema/event_queue").event_queue;
const { Op } = require("sequelize");

const clients = new Map(); // hotelId: [ws1, ws2, ...]
const hotelNames = new Map();

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

    // 클라이언트에 연결된 호텔 목록 정보 보내기
    sendConnectedHotels(ws);

    // 메시지 수신 이벤트 처리
    ws.on("message", async function incoming(message) {
      console.log("received from client : %s", message);
      //받은 메세지에 대한 처리
      try {
        const data = JSON.parse(message);
        if (data.action === "getHotelName") {
          // 호텔 이름 요청 처리
          try {
            const hotel = await models.hotel.findOne({
              where: { id: data.hotelId },
            });
            if (hotel) {
              // 호텔 이름을 클라이언트에 전송
              ws.send(
                JSON.stringify({
                  action: "hotelName",
                  hotelName: hotel.name,
                })
              );

              // 호텔 이름 맵 업데이트
              hotelNames.set(data.hotelId, hotel.name);

              // 모든 클라이언트에게 연결된 호텔 목록 업데이트 브로드캐스트
              broadcastConnectedHotels();
            } else {
              ws.send(
                JSON.stringify({
                  action: "error",
                  message: "Hotel not found",
                })
              );
            }
          } catch (error) {
            console.error("Error fetching hotel name:", error);
            ws.send(
              JSON.stringify({
                action: "error",
                message: "Error fetching hotel name",
              })
            );
          }
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

  let lastProcessedAt = new Date(0);

  // 이벤트 큐 폴링
  setInterval(() => {
    console.log("Polling event_queue table..."); // 폴링 시작 확인
    models.event_queue
      .findAll({
        where: {
          processed: 0,
          createdAt: {
            [models.Sequelize.Op.gt]: lastProcessedAt,
          },
        },
        order: [["createdAt", "DESC"]],
      })
      .then((events) => {
        console.log("Found events:", events.length); // 가져온 이벤트 개수 확인
        events.forEach((event) => {
          console.log(
            "Processing event:",
            event.id,
            event.event_type,
            event.hotel_id
          ); // 이벤트 정보 확인
          const hotelId = event.hotel_id;
          if (clients.has(hotelId)) {
            broadcastToHotel(hotelId, {
              // 수정: broadcastToHotel 함수 사용
              event: event.event_type,
              hotelId: hotelId,
              hotelName: hotelNames.get(hotelId),
            });
          }

          // 이벤트 처리 후 processed = 1, processed_at 업데이트
          const now = new Date();
          event.update({ processed: 1, processed_at: now });
          lastProcessedAt = now; // 마지막 처리 시간 업데이트
        });
      })
      .catch((error) => {
        // 'ER_NO_SUCH_TABLE' 에러는 무시
        if (error.code !== "ER_NO_SUCH_TABLE") {
          console.error("Error polling event queue:", error);
        }
      });
  }, 1000); // 1초마다 폴링

  // 특정 호텔의 모든 클라이언트에게 메시지를 보내는 함수
  function broadcastToHotel(hotelId, message) {
    console.log(`Broadcasting to hotel ${hotelId}:`, message); // 메시지 내용 확인
    if (clients.has(hotelId)) {
      clients.get(hotelId).forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send("HumanDetected");
          console.log(`Message sent to client ${client.hotelId}`); // 메시지 전송 확인
        }
      });
    }
  }

  // 연결된 모든 클라이언트에게 호텔 목록을 보내는 함수
  function broadcastConnectedHotels() {
    const connectedHotels = {};
    for (const [hotelId, clientList] of clients) {
      if (hotelNames.has(hotelId)) {
        connectedHotels[hotelId] = hotelNames.get(hotelId);
      }
    }

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({ action: "connectedHotels", hotels: connectedHotels })
        );
      }
    });
  }

  // 특정 클라이언트에게 연결된 호텔 목록을 보내는 함수
  function sendConnectedHotels(ws) {
    const connectedHotels = {};
    for (const [hotelId, clientList] of clients) {
      if (hotelNames.has(hotelId)) {
        connectedHotels[hotelId] = hotelNames.get(hotelId);
      }
    }

    ws.send(
      JSON.stringify({ action: "connectedHotels", hotels: connectedHotels })
    );
  }

  // 서버 시작 시 event_queue 테이블 확인
  models.sequelize
    .getQueryInterface()
    .showAllTables()
    .then((tableNames) => {
      if (!tableNames.includes("event_queue")) {
        console.warn("WARNING: event_queue table does not exist.");
        // 필요한 경우, 여기서 event_queue 테이블 생성 로직 추가
      }
    })
    .catch((error) => {
      console.error("Error checking for event_queue table:", error);
    });
}

module.exports = startWebSocketServer;
