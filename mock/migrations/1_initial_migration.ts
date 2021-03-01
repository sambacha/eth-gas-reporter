// @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'artifacts'. Did you mean 'Artifa... Remove this comment to see the full error message
var Migrations = artifacts.require("./Migrations.sol");

module.exports = function(deployer: any) {
  deployer.deploy(Migrations);
};
