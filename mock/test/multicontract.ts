// @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'artifacts'. Did you mean 'Artifa... Remove this comment to see the full error message
const MultiContractFileA = artifacts.require("MultiContractFileA");
// @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'artifacts'. Did you mean 'Artifa... Remove this comment to see the full error message
const MultiContractFileB = artifacts.require("MultiContractFileB");

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'contract'.
contract("MultiContractFiles", (accounts: any) => {
  let a: any;
  let b: any;

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(async function() {
    a = await MultiContractFileA.new();
    b = await MultiContractFileB.new();
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("a and b", async function() {
    await a.hello();
    await b.goodbye();
  });
});
