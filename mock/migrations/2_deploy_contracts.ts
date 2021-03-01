// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ConvertLib... Remove this comment to see the full error message
var ConvertLib = artifacts.require("./ConvertLib.sol");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'MetaCoin'.
var MetaCoin = artifacts.require("./MetaCoin.sol");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Wallet'.
var Wallet = artifacts.require("./Wallets/Wallet.sol");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'VariableCo... Remove this comment to see the full error message
var VariableCosts = artifacts.require("./VariableCosts.sol");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'VariableCo... Remove this comment to see the full error message
var VariableConstructor = artifacts.require("./VariableConstructor");
// @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'artifacts'. Did you mean 'Artifa... Remove this comment to see the full error message
var Undeployed = artifacts.require("./Undeployed");

module.exports = function(deployer: any) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, MetaCoin);
  deployer.link(ConvertLib, Undeployed);
  deployer.deploy(MetaCoin);
  deployer.deploy(Wallet);
  deployer.deploy(VariableCosts);
  deployer.deploy(VariableConstructor, "Exit Visa");
};
