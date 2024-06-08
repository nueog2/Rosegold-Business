// const tiktoken = require("tiktoken");

// const cl100kBase = tiktoken.getEncoding("cl100k_base");

const { Tiktoken } = require("@dqbd/tiktoken/lite");
const cl100k_base = require("@dqbd/tiktoken/encoders/cl100k_base.json");

const encoding = new Tiktoken(
  cl100k_base.bpe_ranks,
  cl100k_base.special_tokens,
  cl100k_base.pat_str
);

function encode(text) {
  const tokens = encoding.encode(text);
  encoding.free();
  console.log(tokens);
  console.log("token length : " + tokens.length);

  return tokens;
}

function decode(tokens) {
  return cl100kBase.decode(tokens);
}

function encode_example() {
  const tokens = encoding.encode("안녕하세요. 반갑습니다.");
  encoding.free();
  console.log(tokens);
  console.log("토큰 길이 : " + tokens.length);
  return tokens;
}

module.exports = {
  encode,
  decode,
  encode_example,
};
