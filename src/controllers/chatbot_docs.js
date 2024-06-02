const jwt = require("../modules/jwt");
const message = require("../../config/message");
const Chatbot_Docs = require("../models/chatbot_docs").Chatbot_Docs;
const Hotel = require("../models/hotel").Hotel;
const upload = require("../modules/multer2");
const tiktoken = require("../modules/tiktoken");
const fs = require("fs");

function createChatbot_Docs(req, res) {
  if (
    req.file == null ||
    req.body.file_name == null ||
    req.body.hotel_id == null
  ) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }

  const filePath = req.file.path;

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res
        .status(message["500_SERVER_INTERNAL_ERROR"].status)
        .send(
          message.issueMessage(
            message["500_SERVER_INTERNAL_ERROR"],
            "UNDEFINED_ERROR"
          )
        );
    }

    // 텍스트 토큰화
    let tokens = tiktoken.encode(data);

    // 토큰 수가 1500 이상이면 분할
    let segments = [];
    const segmentSize = 800;
    for (let i = 0; i < tokens.length; i += segmentSize) {
      segments.push(tokens.slice(i, i + segmentSize));
    }

    // 각 세그먼트를 텍스트로 변환
    segments = segments.map((segment) => tiktoken.decode(segment));

    // # 문자 위로 3줄 추가
    segments = segments.map((segment) => segment.replace(/(#)/g, "\n\n\n$1"));

    // 변환된 텍스트를 파일로 저장
    const transformedText = segments.join("\n\n");
    const transformedFilePath = filePath.replace(".txt", "_transformed.txt");

    fs.writeFile(transformedFilePath, transformedText, (err) => {
      if (err) {
        return res
          .status(message["500_SERVER_INTERNAL_ERROR"].status)
          .send(
            message.issueMessage(
              message["500_SERVER_INTERNAL_ERROR"],
              "UNDEFINED_ERROR"
            )
          );
      }

      const chatbot_docs = new Chatbot_Docs();
      const domain = "http://223.130.137.39:6060";
      const docs_dir = `${domain}/${transformedFilePath.replace(/\\/g, "/")}`;
      //const filePath = req.file.path.replace(/\\/g, "/"); // 경로에서 백슬래시를 슬래시로 변경
      //const docs_dir = `${domain}/${filePath}`;

      chatbot_docs
        .create(docs_dir, req.body.file_name, req.body.hotel_id)
        .then((response) => {
          return res.status(response.status).send(response);
        })
        .catch((error) => {
          console.log("Error in createChatbot_Docs:", error);
          if (!error.status)
            return res
              .status(message["500_SERVER_INTERNAL_ERROR"].status)
              .send(
                message.issueMessage(
                  message["500_SERVER_INTERNAL_ERROR"],
                  "UNDEFINED_ERROR"
                )
              );
          else return res.status(error.status).send(error);
        });
    });
  });
}

// function createChatbot_Docs(req, res) {
//   if (
//     req.file == null ||
//     req.body.file_name == null ||
//     req.body.hotel_id == null
//   ) {
//     return res
//       .status(message["400_BAD_REQUEST"].status)
//       .send(
//         message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
//       );
//   }

//   const chatbot_docs = new Chatbot_Docs();
//   const domain = "http://223.130.137.39:6060"; // 도메인 주소 추가
//   const filePath = req.file.path.replace(/\\/g, "/"); // 경로에서 백슬래시를 슬래시로 변경
//   const docs_dir = `${domain}/${filePath}`;

//   chatbot_docs
//     .create(docs_dir, req.body.file_name, req.body.hotel_id)
//     .then((response) => {
//       return res.status(response.status).send(response);
//     })
//     .catch((error) => {
//       console.log("Error in createChatbot_Docs:", error);
//       if (!error.status)
//         return res
//           .status(message["500_SERVER_INTERNAL_ERROR"].status)
//           .send(
//             message.issueMessage(
//               message["500_SERVER_INTERNAL_ERROR"],
//               "UNDEFINED_ERROR"
//             )
//           );
//       else return res.status(error.status).send(error);
//     });
// }

function getChatbot_DocsMany(req, res) {
  if (req.query.hotel_id == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }

  const chatbot_docs = new Chatbot_Docs();
  const hotel = new Hotel();

  hotel.readOne({ id: req.query.hotel_id }).then((response) => {
    chatbot_docs
      .readMany({ hotel_id: req.query.hotel_id })
      .then((response) => {
        return res.status(response.status).send(response);
      })
      .catch((error) => {
        console.log(error);
        if (!error.status)
          return res
            .status(message["500_SERVER_INTERNAL_ERROR"].status)
            .send(
              message.issueMessage(
                message["500_SERVER_INTERNAL_ERROR"],
                "UNDEFINED_ERROR"
              )
            );
        else return res.status(error.status).send(error);
      });
  });
}

function getChatbot_DocsOne(req, res) {
  if (req.query.chatbot_docs_id == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }
  const chatbot_docs = new Chatbot_Docs();
  chatbot_docs
    .readOne({ id: req.query.chatbot_docs_id })
    .then((response) => {
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      console.log(error);
      if (!error.status)
        return res
          .status(message["500_SERVER_INTERNAL_ERROR"].status)
          .send(
            message.issueMessage(
              message["500_SERVER_INTERNAL_ERROR"],
              "UNDEFINED_ERROR"
            )
          );
      else return res.status(error.status).send(error);
    });
}

function updateChatbot_Docs(req, res) {
  if (
    req.body.chatbot_docs_id == null ||
    req.file == null ||
    req.body.file_name == null
  ) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }

  const filePath = req.file.path;

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res
        .status(message["500_SERVER_INTERNAL_ERROR"].status)
        .send(
          message.issueMessage(
            message["500_SERVER_INTERNAL_ERROR"],
            "UNDEFINED_ERROR"
          )
        );
    }

    // 텍스트 토큰화
    let tokens = tiktoken.encode(data);

    // 토큰 수가 1500 이상이면 분할
    let segments = [];
    const segmentSize = 800;
    for (let i = 0; i < tokens.length; i += segmentSize) {
      segments.push(tokens.slice(i, i + segmentSize));
    }

    // 각 세그먼트를 텍스트로 변환
    segments = segments.map((segment) => tiktoken.decode(segment));

    // # 문자 위로 3줄 추가
    segments = segments.map((segment) => segment.replace(/(#)/g, "\n\n\n$1"));

    // 변환된 텍스트를 파일로 저장
    const transformedText = segments.join("\n\n");
    const transformedFilePath = filePath.replace(".txt", "_transformed.txt");

    fs.writeFile(transformedFilePath, transformedText, (err) => {
      if (err) {
        return res
          .status(message["500_SERVER_INTERNAL_ERROR"].status)
          .send(
            message.issueMessage(
              message["500_SERVER_INTERNAL_ERROR"],
              "UNDEFINED_ERROR"
            )
          );
      }

      const chatbot_docs = new Chatbot_Docs();
      const domain = "http://223.130.137.39:6060";
      const docs_dir = `${domain}/${transformedFilePath.replace(/\\/g, "/")}`;

      // const chatbot_docs = new Chatbot_Docs();
      // const domain = "http://223.130.137.39:6060"; // 도메인 주소 추가
      // const filePath = req.file.path.replace(/\\/g, "/"); // 경로에서 백슬래시를 슬래시로 변경
      // const docs_dir = `${domain}/${filePath}`;

      chatbot_docs
        .update(req.body.chatbot_docs_id, docs_dir, req.body.file_name)
        .then((response) => {
          return res.status(response.status).send(response);
        })
        .catch((error) => {
          console.log(error);
          if (!error.status)
            return res
              .status(message["500_SERVER_INTERNAL_ERROR"].status)
              .send(
                message.issueMessage(
                  message["500_SERVER_INTERNAL_ERROR"],
                  "UNDEFINED_ERROR"
                )
              );
          else return res.status(error.status).send(error);
        });
    });
  });
}

function deleteChatbot_Docs(req, res) {
  if (req.body.chatbot_docs_id == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }

  const chatbot_docs = new Chatbot_Docs();
  chatbot_docs
    .delete(req.body.chatbot_docs_id)
    .then((response) => {
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      console.log(error);
      if (!error.status)
        return res
          .status(message["500_SERVER_INTERNAL_ERROR"].status)
          .send(
            message.issueMessage(
              message["500_SERVER_INTERNAL_ERROR"],
              "UNDEFINED_ERROR"
            )
          );
      else return res.status(error.status).send(error);
    });
}

module.exports = {
  createChatbot_Docs,
  getChatbot_DocsMany,
  getChatbot_DocsOne,
  updateChatbot_Docs,
  deleteChatbot_Docs,
};
