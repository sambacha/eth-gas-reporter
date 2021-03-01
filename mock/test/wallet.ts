// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Wallet'.
const Wallet = artifacts.require("./Wallet.sol");

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'contract'.
contract("Wallet", (accounts: any) => {
  let walletA: any;
  let walletB: any;

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(async function() {
    walletA = await Wallet.new();
    walletB = await Wallet.new();
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("should be very expensive to deploy", async () => {
    await Wallet.new();
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("should should allow transfers and sends", async () => {
    await walletA.sendTransaction({
      value: 100,
      from: accounts[0]
    });
    await walletA.sendPayment(50, walletB.address, {
      from: accounts[0]
    });
    await walletA.transferPayment(50, walletB.address, {
      from: accounts[0]
    });
    const balance = await walletB.getBalance();
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'assert'.
    assert.equal(parseInt(balance.toString()), 100);
  });
});
