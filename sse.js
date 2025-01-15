const db = require("./models"); // 데이터베이스 모듈

function setupSSERoutes(app) {
  app.get("/events", async (req, res) => {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    // sendEvent 함수를 setupSSERoutes 내부로 이동
    function sendEvent(event, data) {
      res.write(`event: ${event}\n`);
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    }

    sendEvent("connected", { msg: "SSE connection established" });

    const clientId = req.clientId;
    const hotelIds = req.query.hotelId
      ? req.query.hotelId.split(",").map(Number)
      : [];

    console.log(`Client connected: Client ID ${clientId}`);

    // 연결된 호텔 정보 전송
    try {
      const hotels = await db.hotel.findAll({
        where: {
          id: hotelIds,
        },
        attributes: ["id", "name"],
      });

      sendEvent("connectedHotels", { hotels: hotels });
    } catch (error) {
      console.error("Error fetching hotel data:", error);
      return;
    }

    // 클라이언트 연결 시, res 객체를 배열에 추가
    hotelIds.forEach((hotelId) => {
      console.log(`  - Hotel ID: ${hotelId}`);

      if (!app.locals.clients) {
        app.locals.clients = {};
      }
      if (!app.locals.clients[hotelId]) {
        app.locals.clients[hotelId] = []; // 배열로 변경
      }
      app.locals.clients[hotelId].push(res); // res 객체 추가
    });

    const interval = setInterval(() => {
      db.sequelize
        .query(
          "SELECT 1 FROM information_schema.tables WHERE table_schema = 'rosegold_db_dev' AND table_name = 'event_queues' LIMIT 1",
          { type: db.sequelize.QueryTypes.SELECT }
        )
        .then((tableExists) => {
          if (!tableExists.length) {
            console.log(
              "Table 'event_queues' does not exist. Skipping event queue polling."
            );
            return;
          }

          db.sequelize
            .query("SELECT * FROM event_queues WHERE processed = 0", {
              type: db.sequelize.QueryTypes.SELECT,
            })
            .then((events) => {
              events.forEach((event) => {
                const eventHotelId = event.hotel_id;

                // 해당 hotelId에 연결된 모든 클라이언트에게 이벤트 전송
                if (app.locals.clients[eventHotelId]) {
                  app.locals.clients[eventHotelId].forEach((clientRes) => {
                    try {
                      // sendEvent 함수에서 hotelId를 사용하지 않으므로, hotelId 인자 제거
                      sendEvent(event.event_type, {
                        hotelId: eventHotelId,
                        message: `Event ${event.event_type} from hotel ${eventHotelId}`,
                      });
                      console.log(
                        `Event ${event.event_type} sent to Hotel ID ${eventHotelId}`
                      );
                    } catch (error) {
                      console.error(`Error sending event to client:`, error);
                      // 에러 발생 시 연결 종료 및 클라이언트 제거
                      clearInterval(interval);
                      console.log(
                        `Client disconnected: Hotel ID ${eventHotelId}`
                      );

                      if (app.locals.clients[eventHotelId]) {
                        const index =
                          app.locals.clients[eventHotelId].indexOf(clientRes);
                        if (index > -1) {
                          app.locals.clients[eventHotelId].splice(index, 1);
                        }
                        if (app.locals.clients[eventHotelId].length === 0) {
                          delete app.locals.clients[eventHotelId];
                        }
                      }
                    }
                  });
                }

                db.sequelize
                  .query(
                    "UPDATE event_queues SET processed = 1, processed_at = NOW() WHERE id = ?",
                    {
                      replacements: [event.id],
                      type: db.sequelize.QueryTypes.UPDATE,
                    }
                  )
                  .catch((error) => {
                    console.error("Error updating event_queues:", error);
                  });
              });
            })
            .catch((error) => {
              console.error("Error polling event_queues:", error);
            });
        })
        .catch((error) => {
          console.error(
            "Error checking for event_queues table existence:",
            error
          );
        });
    }, 1000);

    req.on("close", () => {
      clearInterval(interval);
      console.log(`Client disconnected: Client ID ${clientId}`);

      hotelIds.forEach((hotelId) => {
        if (app.locals.clients[hotelId]) {
          const index = app.locals.clients[hotelId].indexOf(res);
          if (index > -1) {
            app.locals.clients[hotelId].splice(index, 1);
          }
          if (app.locals.clients[hotelId].length === 0) {
            delete app.locals.clients[hotelId];
          }
        }
      });
    });
  });
}

module.exports = setupSSERoutes;
