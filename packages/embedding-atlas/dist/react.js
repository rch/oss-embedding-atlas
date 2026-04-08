import { useRef as n, useEffect as a, createElement as d } from "react";
import { r as m, o as u } from "./chunk-CKnSiPhC.js";
import { J as b, a as v } from "./chunk-CKnSiPhC.js";
import { x as l } from "./chunk-CsnmngGB.js";
import { g as R, v as A } from "./chunk-CsnmngGB.js";
import { f as V } from "./chunk-QTU8Uj2V.js";
import { createKNN as D, createUMAP as J } from "./umap.js";
function t(s, i = "div", f = { display: "flex" }) {
  return (e) => {
    const o = n(null), r = n(null);
    return a(() => {
      let c = new s(o.current, e);
      return r.current = c, () => {
        r.current?.destroy();
      };
    }, []), a(() => {
      r.current?.update(e);
    }, [e]), d(i, { ref: o, style: f });
  };
}
const y = t(l, "div", {
  display: "flex",
  width: "100%",
  height: "100%"
}), C = t(m), E = t(u);
export {
  y as EmbeddingAtlas,
  C as EmbeddingView,
  E as EmbeddingViewMosaic,
  D as createKNN,
  J as createUMAP,
  b as defaultCategoryColors,
  R as defaultCharts,
  V as findClusters,
  v as maxDensityModeCategories,
  A as registerRenderer
};
