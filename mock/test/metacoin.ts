// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'MetaCoin'.
var MetaCoin = artifacts.require("./MetaCoin.sol");

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'contract'.
contract("MetaCoin", function(accounts: any) {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(async function() {
    await MetaCoin.new();
    await MetaCoin.new();
  });
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
  afterEach(async function() {
    await MetaCoin.new();
    await MetaCoin.new();
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("should put 10000 MetaCoin in the first account", function() {
    return MetaCoin.deployed()
      .then(function(instance: any) {
        return instance.getBalance.call(accounts[0]);
      })
      .then(function(balance: any) {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'assert'.
        assert.equal(
          balance.valueOf(),
          10000,
          "10000 wasn't in the first account"
        );
      });
  });
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("should call a function that depends on a linked library", function() {
    var meta: any;
    var metaCoinBalance: any;
    var metaCoinEthBalance: any;

    return MetaCoin.deployed()
      .then(function(instance: any) {
        meta = instance;
        return meta.getBalance.call(accounts[0]);
      })
      .then(function(outCoinBalance: any) {
        metaCoinBalance = parseInt(outCoinBalance.toString());
        return meta.getBalanceInEth.call(accounts[0]);
      })
      .then(function(outCoinBalanceEth: any) {
        metaCoinEthBalance = parseInt(outCoinBalanceEth.toString());
      })
      .then(function() {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'assert'.
        assert.equal(
          metaCoinEthBalance,
          2 * metaCoinBalance,
          "Library function returned unexpected function, linkage may be broken"
        );
      });
  });
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("should send coin correctly", function() {
    var meta: any;

    // Get initial balances of first and second account.
    var account_one = accounts[0];
    var account_two = accounts[1];

    var account_one_starting_balance: any;
    var account_two_starting_balance: any;
    var account_one_ending_balance: any;
    var account_two_ending_balance;

    var amount = 10;

    return MetaCoin.deployed()
      .then(function(instance: any) {
        meta = instance;
        return meta.getBalance.call(account_one);
      })
      .then(function(balance: any) {
        account_one_starting_balance = parseInt(balance.toString());
        return meta.getBalance.call(account_two);
      })
      .then(function(balance: any) {
        account_two_starting_balance = parseInt(balance.toString());
        return meta.sendCoin(account_two, amount, { from: account_one });
      })
      .then(function() {
        return meta.getBalance.call(account_one);
      })
      .then(function(balance: any) {
        account_one_ending_balance = parseInt(balance.toString());
        return meta.getBalance.call(account_two);
      })
      .then(function(balance: any) {
        account_two_ending_balance = parseInt(balance.toString());

        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'assert'.
        assert.equal(
          account_one_ending_balance,
          account_one_starting_balance - amount,
          "Amount wasn't correctly taken from the sender"
        );
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'assert'.
        assert.equal(
          account_two_ending_balance,
          account_two_starting_balance + amount,
          "Amount wasn't correctly sent to the receiver"
        );
      });
  });
});
