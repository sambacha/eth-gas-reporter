// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'random'.
const random = require("./random");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'VariableCo... Remove this comment to see the full error message
const VariableCosts = artifacts.require("./VariableCosts.sol");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Wallet'.
const Wallet = artifacts.require("./Wallet.sol");

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'contract'.
contract("VariableCosts", (accounts: any) => {
  const one = [1];
  const three = [2, 3, 4];
  const five = [5, 6, 7, 8, 9];
  let instance: any;
  let walletB: any;

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(async () => {
    instance = await VariableCosts.new();
    walletB = await Wallet.new();
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("should add one", async () => {
    await instance.addToMap(one);
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("should add three", async () => {
    await instance.addToMap(three);
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("should add even 5!", async () => {
    await instance.addToMap(five);
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("should delete one", async () => {
    await instance.removeFromMap(one);
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("should delete three", async () => {
    await instance.removeFromMap(three);
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("should delete five", async () => {
    await instance.removeFromMap(five);
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("should add five and delete one", async () => {
    await instance.addToMap(five);
    await instance.removeFromMap(one);
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("should set a random length string", async () => {
    await instance.setString(random());
    await instance.setString(random());
    await instance.setString(random());
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("methods that do not throw", async () => {
    await instance.methodThatThrows(false);
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("methods that throw", async () => {
    try {
      await instance.methodThatThrows(true);
    } catch (e) {}
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("methods that call methods in other contracts", async () => {
    await instance.otherContractMethod();
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("prints a table at end of test suites with failures", async () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'assert'.
    assert(false);
  });

  // VariableCosts is Wallet. We also have Wallet tests. So we should see
  // separate entries for `sendPayment` / `transferPayment` under VariableCosts
  // and Wallet in the report
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("should allow contracts to have identically named methods", async () => {
    await instance.sendTransaction({
      value: 100,
      from: accounts[0]
    });
    await instance.sendPayment(50, walletB.address, {
      from: accounts[0]
    });
    await instance.transferPayment(50, walletB.address, {
      from: accounts[0]
    });
    const balance = await walletB.getBalance();
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'assert'.
    assert.equal(parseInt(balance.toString()), 100);
  });
});
