// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'etherRoute... Remove this comment to see the full error message
const etherRouter = require("./etherRouter");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SyncReques... Remove this comment to see the full error message
const SyncRequest = require("./syncRequest");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ProxyResol... Remove this comment to see the full error message
class ProxyResolver {
  data: any;
  provider: any;
  resolve: any;
  sync: any;
  unresolvedCalls: any;
  constructor(data: any, config: any) {
    this.unresolvedCalls = 0;
    this.data = data;
    this.sync = new SyncRequest(config.url);
    this.provider = config.provider;

    if (typeof config.proxyResolver === "function") {
      this.resolve = config.proxyResolver.bind(this);
    } else if (config.proxyResolver === "EtherRouter") {
      this.resolve = etherRouter.bind(this);
    } else {
      this.resolve = this.resolveByMethodSignature;
    }
  }

  /**
   * Searches all known contracts for the method signature and returns the first
   * found (if any). Undefined if none
   * @param  {Object} transaction result of web3.eth.getTransaction
   * @return {String}             contract name
   */
  resolveByMethodSignature(transaction: any) {
    const signature = transaction.input.slice(2, 10);
    const matches = this.data.getAllContractsWithMethod(signature);

    if (matches.length >= 1) return matches[0].contract;
  }

  /**
   * Tries to match bytecode deployed at address to deployedBytecode listed
   * in artifacts. If found, adds this to the code-hash name mapping and
   * returns name.
   * @param  {String} address contract address
   * @return {String}         contract name
   */
  resolveByDeployedBytecode(address: any) {
    const code = this.sync.getCode(address);
    const match = this.data.getContractByDeployedBytecode(code);

    if (match) {
      this.data.trackNameByAddress(match.name, address);
      return match.name;
    }
  }

  /**
   * Tries to match bytecode deployed at address to deployedBytecode listed
   * in artifacts. If found, adds this to the code-hash name mapping and
   * returns name.
   * @param  {String} address contract address
   * @return {String}         contract name
   */
  async asyncResolveByDeployedBytecode(address: any) {
    const code = await this.provider.getCode(address);
    const match = this.data.getContractByDeployedBytecode(code);

    if (match) {
      await this.data.asyncTrackNameByAddress(match.name, address);
      return match.name;
    }
  }
}

module.exports = ProxyResolver;
