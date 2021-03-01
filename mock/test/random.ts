const randomstring = require("randomstring");

function getRandomInt(max: any) {
  return Math.floor(Math.random() * Math.floor(max));
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'random'.
function random() {
  return randomstring.generate(getRandomInt(50));
}

module.exports = random;
