// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'random'.
const random = require("./random");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'VariableCo... Remove this comment to see the full error message
const VariableConstructor = artifacts.require("./VariableConstructor.sol");

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'contract'.
contract("VariableConstructor", (accounts: any) => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("should should initialize with a short string", async () => {
    await VariableConstructor.new("Exit Visa");
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("should should initialize with a medium length string", async () => {
    await VariableConstructor.new("Enclosed is my application for residency");
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("should should initialize with a long string", async () => {
    let msg =
      "Enclosed is my application for permanent residency in NewZealand.";
    msg += "I am a computer programmer.";
    await VariableConstructor.new(msg);
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("should should initialize with a random length string", async () => {
    await VariableConstructor.new(random());
  });
});
