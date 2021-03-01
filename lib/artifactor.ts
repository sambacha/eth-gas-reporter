// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SyncReques... Remove this comment to see the full error message
const SyncRequest = require("./syncRequest");
const { parseSoliditySources } = require("./utils");
/**
 * Supplies contract artifact data to the reporter in a format it can use.
 */
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Artifactor... Remove this comment to see the full error message
class Artifactor {
  config: any;
  sync: any;
  constructor(config: any) {
    this.config = config;
    this.sync = new SyncRequest(config.url);
  }
  /**
   * Returns an array of contract info objects in the format consumed by ./gasData.js.
   * @return {Object[]}
   * @example
   * ```
   * const artifactor = new Artifactor(config);
   * const contracts = artifactor.getContracts();
   * > [
   * >   {
   * >     name: "Example",
   * >     artifact: {
   * >       abi: [etc...],
   * >       bytecode: "0x" + contract.evm.bytecode.object,                // (solc key name)
   * >       deployedBytecode: "0x" + contract.evm.deployedBytecode.object // (solc key name)
   * >   },
   * >   ...
   * > ]
   */
  getContracts() {
    if (typeof this.config.getContracts === "function") {
      return this.config.getContracts();
    }
    const contracts = [];
    for (const name of parseSoliditySources(this.config)) {
      let artifact;
      try {
        artifact = this._require(name);
      } catch (e) {
        return;
      }
      contracts.push({ name: name, artifact: artifact });
    }
    return contracts;
  }
  /**
   * Selects artifact translation strategy
   * @param  {String} contractName
   * @return {Object}              egr artifact
   */
  _require(contractName: any) {
    // User defined
    if (typeof this.config.artifactType === "function")
      return this.config.artifactType(contractName);
    // Built-in
    switch (this.config.artifactType) {
      case "truffle-v5":
        return this._truffleArtifactor(contractName);
      case "0xProject-v2":
        return this._0xArtifactor(contractName);
      case "buidler-v1":
        return this._buidlerArtifactor(contractName);
      case "ethpm":
      default:
        return this._truffleArtifactor(contractName);
    }
  }
  /**
   * Truffle artifact translator
   * @param  {String} contractName
   * @return {Object}              egr artifact
   */
  _truffleArtifactor(contractName: any) {
    let deployed;
    let metadata;
    // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'artifacts'. Did you mean 'artifa... Remove this comment to see the full error message
    const artifact = artifacts.require(contractName);
    const contract = {
      abi: artifact.abi,
      bytecode: artifact.bytecode,
      deployedBytecode: artifact.deployedBytecode
    };
    // These fields are not defined for all conditions
    // or truffle versions. Catching because truffle
    // is sometimes weird re: artifact access.
    try {
      const networkId = !this.config.provider ? this.sync.getNetworkId() : null;
      deployed = artifact.networks[networkId];
      metadata = artifact.metadata;
    } catch (err) {}
    // Migrations deployed data
    if (deployed) {
      (contract as any).deployed = {
        address: deployed.address,
        transactionHash: deployed.transactionHash
      };
    }
    if (metadata) {
      this.config.metadata = JSON.parse(metadata);
    }
    return contract;
  }
  /**
   * [DEPRECATED]
   * Buidler artifact translator. Solc info (metadata) is attached to config
   * at the buidler plugin
   * @param  {String} contractName
   * @return {Object}              egr artifact
   */
  _buidlerArtifactor(contractName: any) {
    // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'artifacts'. Did you mean 'artifa... Remove this comment to see the full error message
    const artifact = artifacts.require(contractName);
    const contract = {
      abi: artifact.abi,
      bytecode: this._normalizeBytecode(artifact.bytecode)
    };
    return contract;
  }
  /**
   * [EXPERIMENTAL]
   * 0x artifact translator. Untested stub.
   * @param  {String} contractName
   * @return {Object}              egr artifact
   */
  _0xArtifactor(contractName: any) {
    const contract = {};
    const artifact = require(`./artifacts/${contractName}.json`);
    (contract as any).abi = artifact.compilerOutput.abi;
    (contract as any).bytecode = artifact.compilerOutput.evm.bytecode.object;
    (contract as any).deployedBytecode =
      artifact.compilerOutput.evm.deployedBytecode;
    this.config.metadata = {
      compiler: {
        version: artifact.compiler.version
      },
      settings: {
        optimizer: {
          enabled: artifact.compiler.settings.optimizer.enabled,
          runs: artifact.compiler.settings.optimizer.runs
        }
      }
    };
    return contract;
  }
  _normalizeBytecode(code: any) {
    if (typeof code === "string" && code.length && !this._isHexPrefixed(code)) {
      return `0x${code}`;
    } else if (!code) {
      return `0x`;
    } else {
      return code;
    }
  }
  _isHexPrefixed(str: any) {
    return str.slice(0, 2) === "0x";
  }
}
module.exports = Artifactor;
