// @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'artifacts'. Did you mean 'Artifa... Remove this comment to see the full error message
var EncoderV2 = artifacts.require("./EncoderV2.sol");

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'contract'.
contract("EncoderV2", function(accounts: any) {
  let instance: any;

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(async function() {
    instance = await EncoderV2.new();
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("should get & set an Asset with a struct", async function() {
    const asset = {
      a: "5",
      b: "7",
      c: "wowshuxkluh"
    };

    await instance.setAsset44("44", asset);
    const _asset = await instance.getAsset();

    // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'assert'. Did you mean 'asset'?
    assert.equal(_asset.a, asset.a);
    // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'assert'. Did you mean 'asset'?
    assert.equal(_asset.b, asset.b);
    // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'assert'. Did you mean 'asset'?
    assert.equal(_asset.c, asset.c);
  });
});
