// @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'artifacts'. Did you mean 'Artifa... Remove this comment to see the full error message
const EtherRouter = artifacts.require("EtherRouter");
// @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'artifacts'. Did you mean 'Artifa... Remove this comment to see the full error message
const Resolver = artifacts.require("Resolver");
// @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'artifacts'. Did you mean 'Artifa... Remove this comment to see the full error message
const Factory = artifacts.require("Factory");
// @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'artifacts'. Did you mean 'Artifa... Remove this comment to see the full error message
const VersionA = artifacts.require("VersionA");
// @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'artifacts'. Did you mean 'Artifa... Remove this comment to see the full error message
const VersionB = artifacts.require("VersionB");
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'contract'.
contract("EtherRouter Proxy", (accounts: any) => {
  let router: any;
  let resolver: any;
  let factory;
  let versionA: any;
  let versionB: any;
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(async function() {
    router = await EtherRouter.new();
    resolver = await Resolver.new();
    factory = await Factory.new();
    versionA = await VersionA.new();
    // Emulate internal deployment
    await factory.deployVersionB();
    const versionBAddress = await factory.versionB();
    versionB = await VersionB.at(versionBAddress);
  });
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("Resolves methods routed through an EtherRouter proxy", async function() {
    let options = {
      from: accounts[0],
      gas: 4000000,
      to: router.address,
      gasPrice: 20000000000
    };
    await router.setResolver(resolver.address);
    await resolver.register("setValue()", versionA.address);
    (options as any).data = versionA.contract.methods.setValue().encodeABI();
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'web3'.
    await web3.eth.sendTransaction(options);
    await resolver.register("setValue()", versionB.address);
    (options as any).data = versionB.contract.methods.setValue().encodeABI();
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'web3'.
    await web3.eth.sendTransaction(options);
  });
});
