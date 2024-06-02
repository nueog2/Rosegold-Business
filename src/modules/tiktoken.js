// const tiktoken = require("tiktoken");

// const cl100kBase = tiktoken.getEncoding("cl100k_base");

const { Tiktoken } = require("@dqbd/tiktoken/lite");
const cl100kBase = require("@dqbd/tiktoken/encoders/cl100k_base.json");

function encode(text) {
  const encoding = new Tiktoken(cl100kBase);
  const tokens = encoding.encode(text);
  encoding.free();
  return tokens;

  //return cl100kBase.encode(text);
}

function decode(tokens) {
  return cl100kBase.decode(tokens);
}

module.exports = {
  encode,
  decode,
};
