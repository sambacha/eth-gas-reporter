/**
 * Configuration defaults
 */
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Config'.
class Config {
  artifactType: any;
  blockLimit: any;
  coinmarketcap: any;
  currency: any;
  defaultGasPrice: any;
  ethPrice: any;
  excludeContracts: any;
  gasPrice: any;
  getContracts: any;
  maxDeploymentDiff: any;
  maxMethodDiff: any;
  metadata: any;
  noColors: any;
  onlyCalledMethods: any;
  outputFile: any;
  provider: any;
  proxyResolver: any;
  rst: any;
  rstTitle: any;
  showMethodSig: any;
  showTimeSpent: any;
  srcPath: any;
  url: any;
  constructor(options = {}) {
    this.blockLimit = (options as any).blockLimit || 6718946;
    this.defaultGasPrice = 5;
    this.currency = (options as any).currency || "eur";
    this.coinmarketcap =
      (options as any).coinmarketcap || "d25b5576-a4ee-41be-bb2b-aca2ba3ae5d8";
    this.ethPrice = (options as any).ethPrice || null;
    this.gasPrice = (options as any).gasPrice || null;
    this.outputFile = (options as any).outputFile || null;
    this.rst = (options as any).rst || false;
    this.rstTitle = (options as any).rstTitle || "";
    this.showTimeSpent = (options as any).showTimeSpent || false;
    this.srcPath = (options as any).src || "contracts";
    this.artifactType = (options as any).artifactType || "truffle-v5";
    this.getContracts = (options as any).getContracts || null;
    this.noColors = (options as any).noColors;
    this.proxyResolver = (options as any).proxyResolver || null;
    this.metadata = (options as any).metadata || null;
    this.showMethodSig = (options as any).showMethodSig || false;
    this.provider = (options as any).provider || null;
    this.maxMethodDiff = (options as any).maxMethodDiff;
    this.maxDeploymentDiff = (options as any).maxDeploymentDiff;
    this.excludeContracts = Array.isArray((options as any).excludeContracts)
      ? (options as any).excludeContracts
      : [];
    this.onlyCalledMethods =
      (options as any).onlyCalledMethods === false ? false : true;
    this.url = (options as any).url
      ? this._normalizeUrl((options as any).url)
      : this.resolveClientUrl();
  }
  /**
   * Tries to obtain the client url reporter's sync-requests will target.
   * @return {String}         url e.g http://localhost:8545
   */
  resolveClientUrl() {
    // Case: web3 globally available in mocha test context
    try {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'web3'.
      if (web3 && web3.currentProvider) {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'web3'.
        const cp = web3.currentProvider;
        // Truffle/Web3 http
        if (cp.host) return cp.host;
        // Truffle/Web3 websockets
        if (cp.connection) return this._normalizeUrl(cp.connection.url);
      }
    } catch (err) {
      // Web3 undefined
    }
    // Case: Failure
    const message =
      `ERROR: eth-gas-reporter was unable to resolve a client url ` +
      `from the provider available in your test context. Try setting the ` +
      `url as a mocha reporter option (ex: url='http://localhost:8545')`;
    console.log(message);
    process.exit(1);
  }
  /**
   * Forces websockets to http
   * @param  {String} url e.g web3.provider.connection.url
   * @return {String}     http:// prefixed url
   */
  _normalizeUrl(url: any) {
    return url.replace("ws://", "http://");
  }
}
module.exports = Config;
