// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require("lodash");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ethers'.
const ethers = require("ethers");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'fs'.
const fs = require("fs");
const table = require("markdown-table");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'utils'.
const utils = require("./utils");
const util = require("util");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CodeChecks... Remove this comment to see the full error message
class CodeChecksReport {
  config: any;
  decreases: any;
  increases: any;
  newData: any;
  previousData: any;
  reportIsNew: any;
  success: any;
  constructor(config: any) {
    this.config = config;
    this.increases = 0;
    this.decreases = 0;
    this.reportIsNew = true;
    this.success = true;
    this.previousData = config.previousData || { methods: {}, deployments: {} };
    this.newData = { methods: {}, deployments: {} };
  }
  /**
   * Generates a gas usage difference report for CodeCheck
   * @param  {Object} info   GasData instance with `methods` and `deployments` data
   */
  generate(info: any) {
    let highlightedDiff;
    let passFail;
    let alignment;
    const addedContracts: any = [];
    // ---------------------------------------------------------------------------------------------
    // Assemble section: Build Configuration
    // ---------------------------------------------------------------------------------------------
    let gwei = "-";
    let currency = "-";
    let rate = "-";
    const solc = utils.getSolcInfo(this.config.metadata);
    if (this.config.ethPrice && this.config.gasPrice) {
      gwei = `${parseInt(this.config.gasPrice)} gwei/gas`;
      currency = `${this.config.currency.toLowerCase()}`;
      rate = `${parseFloat(this.config.ethPrice).toFixed(2)} ${currency}/eth`;
    }
    const configRows = [
      ["Option", "Settings"],
      ["solc: version", solc.version],
      ["solc: optimized", solc.optimizer],
      ["solc: runs", solc.runs],
      ["gas: block limit", ethers.utils.commify(info.blockLimit)],
      ["gas: price", gwei],
      ["gas: currency/eth rate", rate]
    ];
    const configTable = table(configRows);
    // ---------------------------------------------------------------------------------------------
    // Assemble section: methods
    // ---------------------------------------------------------------------------------------------
    const methodRows: any = [];
    const methodHeader = [
      " ",
      "Gas",
      " ",
      "Diff",
      "Diff %",
      "Calls",
      `${currency} avg`
    ];
    _.forEach(info.methods, (data: any, methodId: any) => {
      if (!data) return;
      let stats = {};
      if (data.gasData.length) {
        const total = data.gasData.reduce(
          (acc: any, datum: any) => acc + datum,
          0
        );
        (stats as any).average = Math.round(total / data.gasData.length);
        (stats as any).cost =
          this.config.ethPrice && this.config.gasPrice
            ? utils.gasToCost(
                (stats as any).average,
                this.config.ethPrice,
                this.config.gasPrice
              )
            : "-";
      }
      (stats as any).diff = this.getMethodDiff(
        methodId,
        (stats as any).average
      );
      (stats as any).percentDiff = this.getMethodPercentageDiff(
        methodId,
        (stats as any).average
      );
      highlightedDiff = this.getHighlighting((stats as any).diff);
      passFail = this.getPassFail((stats as any).diff);
      if (data.numberOfCalls > 0) {
        // Contracts name row
        if (!addedContracts.includes(data.contract)) {
          addedContracts.push(data.contract);
          const titleSection = [
            this.entitle(data.contract),
            " ",
            " ",
            " ",
            " ",
            " ",
            " "
          ];
          (titleSection as any).contractName = data.contract;
          (titleSection as any).methodName = "0";
          methodRows.push(titleSection);
        }
        // Method row
        const methodSection = [
          this.indent(data.method),
          ethers.utils.commify((stats as any).average),
          passFail,
          highlightedDiff,
          (stats as any).percentDiff,
          data.numberOfCalls.toString(),
          (stats as any).cost.toString()
        ];
        (methodSection as any).contractName = data.contract;
        (methodSection as any).methodName = data.method;
        methodRows.push(methodSection);
        this.newData.methods[methodId] = (stats as any).average;
      }
    });
    // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'a' implicitly has an 'any' type.
    methodRows.sort((a, b) => {
      const contractName = a.contractName.localeCompare(b.contractName);
      const methodName = a.methodName.localeCompare(b.methodName);
      return contractName || methodName;
    });
    alignment = { align: ["l", "r", "c", "r", "r", "r", "r", "r"] };
    methodRows.unshift(methodHeader);
    const methodTable = table(methodRows, alignment);
    // ---------------------------------------------------------------------------------------------
    // Assemble section: deployments
    // ---------------------------------------------------------------------------------------------
    const deployRows = [];
    const deployHeader = [
      " ",
      "Gas",
      " ",
      "Diff",
      "Diff %",
      "Block %",
      `${currency} avg`
    ];
    // Alphabetize contract names
    info.deployments.sort((a: any, b: any) => a.name.localeCompare(b.name));
    info.deployments.forEach((contract: any) => {
      let stats = {};
      if (!contract.gasData.length) return;
      const total = contract.gasData.reduce(
        (acc: any, datum: any) => acc + datum,
        0
      );
      (stats as any).average = Math.round(total / contract.gasData.length);
      (stats as any).percent = utils.gasToPercentOfLimit(
        (stats as any).average,
        info.blockLimit
      );
      (stats as any).cost =
        this.config.ethPrice && this.config.gasPrice
          ? utils.gasToCost(
              (stats as any).average,
              this.config.ethPrice,
              this.config.gasPrice
            )
          : "-";
      (stats as any).diff = this.getDeploymentDiff(
        contract.name,
        (stats as any).average
      );
      (stats as any).percentDiff = this.getDeploymentPercentageDiff(
        contract.name,
        (stats as any).average
      );
      highlightedDiff = this.getHighlighting((stats as any).diff);
      passFail = this.getPassFail((stats as any).diff);
      const section = [
        this.entitle(contract.name),
        ethers.utils.commify((stats as any).average),
        passFail,
        highlightedDiff,
        (stats as any).percentDiff,
        `${(stats as any).percent} %`,
        (stats as any).cost.toString()
      ];
      deployRows.push(section);
      this.newData.deployments[contract.name] = (stats as any).average;
    });
    alignment = { align: ["l", "r", "c", "r", "r", "r", "r"] };
    deployRows.unshift(deployHeader);
    const deployTable = table(deployRows, alignment);
    // ---------------------------------------------------------------------------------------------
    // Final assembly
    // ---------------------------------------------------------------------------------------------
    const configTitle = "## Build Configuration\n";
    const methodTitle = "## Methods\n";
    const deployTitle = "## Deployments\n";
    const md =
      deployTitle +
      deployTable +
      `\n\n` +
      methodTitle +
      methodTable +
      `\n\n` +
      configTitle +
      configTable +
      `\n\n`;
    // ---------------------------------------------------------------------------------------------
    // Finish
    // ---------------------------------------------------------------------------------------------
    return md;
  }
  getDiff(previousVal: any, currentVal: any) {
    if (typeof previousVal === "number") {
      const diff = currentVal - previousVal;
      if (diff > 0) this.increases++;
      if (diff < 0) this.decreases++;
      this.reportIsNew = false;
      return diff;
    }
    return "-";
  }
  getPercentageDiff(previousVal: any, currentVal: any, maxThreshold: any) {
    let sign = "";
    if (typeof previousVal === "number") {
      const diff = Math.round(((currentVal - previousVal) / previousVal) * 100);
      if (diff > 0) {
        sign = "+";
        if (typeof maxThreshold === "number" && diff > maxThreshold) {
          this.success = false;
        }
      }
      return `${sign}${diff}%`;
    }
    return "-";
  }
  getMethodDiff(id: any, currentVal: any) {
    return this.getDiff(this.previousData.methods[id], currentVal);
  }
  getMethodPercentageDiff(id: any, currentVal: any) {
    return this.getPercentageDiff(
      this.previousData.methods[id],
      currentVal,
      this.config.maxMethodDiff
    );
  }
  getDeploymentDiff(id: any, currentVal: any) {
    return this.getDiff(this.previousData.deployments[id], currentVal);
  }
  getDeploymentPercentageDiff(id: any, currentVal: any) {
    return this.getPercentageDiff(
      this.previousData.deployments[id],
      currentVal,
      this.config.maxDeploymentDiff
    );
  }
  getPassFail(val: any) {
    const passed = `![passed](https://travis-ci.com/images/stroke-icons/icon-passed.png)`;
    const failed = `![failed](https://travis-ci.com/images/stroke-icons/icon-failed.png)`;
    if (val > 0) return failed;
    if (val < 0) return passed;
    return "";
  }
  getHighlighting(val: any) {
    if (val > 0) return `[**+${ethers.utils.commify(val)}**]()`;
    if (val < 0) return `[**${ethers.utils.commify(val)}**]()`;
    return val;
  }
  getShortDescription() {
    const increasesItem = this.increases === 1 ? "item" : "items";
    const decreasesItem = this.decreases === 1 ? "item" : "items";
    if (this.increases > 0 && this.decreases > 0) {
      return (
        `Gas usage increased for ${this.increases} ${increasesItem} and ` +
        `decreased for ${this.decreases} ${decreasesItem}`
      );
    } else if (this.increases > 0) {
      return `Gas usage increased for ${this.increases} ${increasesItem}`;
    } else if (this.decreases > 0) {
      return `Gas usage decreased for ${this.decreases} ${decreasesItem}`;
    } else if (this.reportIsNew) {
      return `New gas usage report!`;
    } else {
      return `Gas usage remained the same`;
    }
  }
  indent(val: any) {
    return `       *${val}*`;
  }
  entitle(val: any) {
    return `**${val}**`;
  }
}
module.exports = CodeChecksReport;
