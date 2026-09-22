Object.defineProperties(exports, {
  __esModule: {
    value: true
  },
  [Symbol.toStringTag]: {
    value: "Module"
  }
});
const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
//#region src/button-group/src/styles/index.cssr.ts
const zero = "0!important";
const n1 = "-1px!important";
function createLeftBorderStyle(type) {
  return require__utils_cssr_index.cM(`${type}-type`, [require__utils_cssr_index.c("& +", [require__utils_cssr_index.cB("button", {}, [require__utils_cssr_index.cM(`${type}-type`, [require__utils_cssr_index.cE("border", {
    borderLeftWidth: zero
  }), require__utils_cssr_index.cE("state-border", {
    left: n1
  })])])])]);
}
function createTopBorderStyle(type) {
  return require__utils_cssr_index.cM(`${type}-type`, [require__utils_cssr_index.c("& +", [require__utils_cssr_index.cB("button", [require__utils_cssr_index.cM(`${type}-type`, [require__utils_cssr_index.cE("border", {
    borderTopWidth: zero
  }), require__utils_cssr_index.cE("state-border", {
    top: n1
  })])])])]);
}
var index_cssr_default = require__utils_cssr_index.cB("button-group", `
 flex-wrap: nowrap;
 display: inline-flex;
 position: relative;
`, [require__utils_cssr_index.cNotM("vertical", {
  flexDirection: "row"
}, [require__utils_cssr_index.cNotM("rtl", [require__utils_cssr_index.cB("button", [require__utils_cssr_index.c("&:first-child:not(:last-child)", `
 margin-right: ${zero};
 border-top-right-radius: ${zero};
 border-bottom-right-radius: ${zero};
 `), require__utils_cssr_index.c("&:last-child:not(:first-child)", `
 margin-left: ${zero};
 border-top-left-radius: ${zero};
 border-bottom-left-radius: ${zero};
 `), require__utils_cssr_index.c("&:not(:first-child):not(:last-child)", `
 margin-left: ${zero};
 margin-right: ${zero};
 border-radius: ${zero};
 `), createLeftBorderStyle("default"), require__utils_cssr_index.cM("ghost", [createLeftBorderStyle("primary"), createLeftBorderStyle("info"), createLeftBorderStyle("success"), createLeftBorderStyle("warning"), createLeftBorderStyle("error")])])])]), require__utils_cssr_index.cM("vertical", {
  flexDirection: "column"
}, [require__utils_cssr_index.cB("button", [require__utils_cssr_index.c("&:first-child:not(:last-child)", `
 margin-bottom: ${zero};
 margin-left: ${zero};
 margin-right: ${zero};
 border-bottom-left-radius: ${zero};
 border-bottom-right-radius: ${zero};
 `), require__utils_cssr_index.c("&:last-child:not(:first-child)", `
 margin-top: ${zero};
 margin-left: ${zero};
 margin-right: ${zero};
 border-top-left-radius: ${zero};
 border-top-right-radius: ${zero};
 `), require__utils_cssr_index.c("&:not(:first-child):not(:last-child)", `
 margin: ${zero};
 border-radius: ${zero};
 `), createTopBorderStyle("default"), require__utils_cssr_index.cM("ghost", [createTopBorderStyle("primary"), createTopBorderStyle("info"), createTopBorderStyle("success"), createTopBorderStyle("warning"), createTopBorderStyle("error")])])])]);
//#endregion
exports.default = index_cssr_default;
exports.n1 = n1;
exports.zero = zero;