import { i as We } from "./chunk-DgFtVqg1.js";
import { coordinator as Ta, makeClient as Ea, isSelection as Jn } from "@uwdata/mosaic-core";
import * as m from "@uwdata/mosaic-sql";
function Ui() {
  return !(navigator.gpu == null || navigator.gpu.requestAdapter == null || navigator.gpu.wgslLanguageFeatures == null || !navigator.gpu.wgslLanguageFeatures.has("unrestricted_pointer_parameters"));
}
async function Ma() {
  if (!Ui())
    return null;
  let e = await navigator.gpu.requestAdapter();
  if (!e)
    return console.error("Could not request WebGPU adapter"), null;
  let t = [
    // First attempt to request the maximum limit
    {
      requiredLimits: {
        maxBufferSize: e.limits.maxBufferSize,
        maxStorageBufferBindingSize: e.limits.maxStorageBufferBindingSize
      },
      requiredFeatures: ["shader-f16"]
    },
    // If we cannot get the maximum limit, try lower limits
    ...[512, 256, 128, 64, 32].map(
      (r) => ({
        requiredLimits: {
          maxBufferSize: Math.min(r * 1048576, e.limits.maxBufferSize),
          maxStorageBufferBindingSize: Math.min(r * 1048576, e.limits.maxStorageBufferBindingSize)
        },
        requiredFeatures: ["shader-f16"]
      })
    )
  ];
  for (let r of t)
    try {
      return await e.requestDevice(r);
    } catch (n) {
      console.error(n);
      continue;
    }
  return null;
}
function Sa(e) {
  return e == 0 && (e = 4), e % 4 != 0 && (e += 4 - e % 4), e;
}
function ct(e, t, r, n) {
  return (e.buffer == null || e.byteSize != r || e.usage != n) && (e.buffer != null && e.buffer.destroy(), e.buffer = t.createBuffer({ size: Sa(r), usage: n }), e.byteSize = r, e.destroy = () => {
    e.buffer?.destroy();
  }), e.buffer;
}
function tn(e, t, r, n) {
  if (e.buffer !== r || e.data !== n) {
    if (n != null)
      if (n.byteLength % 4 != 0) {
        let i = n.byteLength - n.byteLength % 4;
        if (t.queue.writeBuffer(r, 0, n, 0, i), n instanceof Uint8Array) {
          let a = new Uint8Array(4);
          for (let o = 0; o < 4; o++)
            i + o < n.length && (a[o] = n[i + o]);
          t.queue.writeBuffer(r, i, a);
        }
      } else
        t.queue.writeBuffer(r, 0, n, 0);
    else
      t.queue.writeBuffer(r, 0, new ArrayBuffer(r.size));
    e.buffer = r, e.data = n;
  }
  return r;
}
function ei(e, t, r, n, i, a) {
  return (e.texture == null || e.width != r || e.height != n || e.format != i || e.usage != a) && (e.texture != null && e.texture.destroy(), e.texture = t.createTexture({ size: [r, n], format: i, usage: a }), e.destroy = () => {
    e.texture?.destroy();
  }), e.texture;
}
const be = 2, Ir = 4, Or = 8, vt = 16, gt = 32, qt = 64, $r = 128, xe = 1024, Be = 2048, yt = 4096, Le = 8192, dt = 16384, Rn = 32768, tr = 65536, ti = 1 << 17, ki = 1 << 18, ar = 1 << 19, Ni = 1 << 20, Ie = 256, Br = 512, Cr = 32768, dn = 1 << 21, Tn = 1 << 22, Et = 1 << 23, Gt = Symbol("$state"), Li = Symbol("legacy props"), Fa = Symbol(""), Qt = new class extends Error {
  name = "StaleReactionError";
  message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), En = 3, lr = 8, Da = !1;
var Gi = Array.isArray, Pa = Array.prototype.indexOf, Mn = Array.from, zi = Object.defineProperty, Zt = Object.getOwnPropertyDescriptor, Ii = Object.getOwnPropertyDescriptors, Ba = Object.prototype, Ca = Array.prototype, Sn = Object.getPrototypeOf, ri = Object.isExtensible;
function Ua(e) {
  for (var t = 0; t < e.length; t++)
    e[t]();
}
function Oi() {
  var e, t, r = new Promise((n, i) => {
    e = n, t = i;
  });
  return { promise: r, resolve: e, reject: t };
}
function $i(e) {
  return e === this.v;
}
function qi(e, t) {
  return e != e ? t == t : e !== t || e !== null && typeof e == "object" || typeof e == "function";
}
function Vi(e) {
  return !qi(e, this.v);
}
function Xi(e) {
  throw new Error("https://svelte.dev/e/lifecycle_outside_component");
}
function ka() {
  throw new Error("https://svelte.dev/e/async_derived_orphan");
}
function Na(e) {
  throw new Error("https://svelte.dev/e/effect_in_teardown");
}
function La() {
  throw new Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function Ga(e) {
  throw new Error("https://svelte.dev/e/effect_orphan");
}
function za() {
  throw new Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function Ia() {
  throw new Error("https://svelte.dev/e/hydration_failed");
}
function Oa(e) {
  throw new Error("https://svelte.dev/e/props_invalid_value");
}
function $a() {
  throw new Error("https://svelte.dev/e/state_descriptors_fixed");
}
function qa() {
  throw new Error("https://svelte.dev/e/state_prototype_fixed");
}
function Va() {
  throw new Error("https://svelte.dev/e/state_unsafe_mutation");
}
function Xa() {
  throw new Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
let Ya = !1;
const Fn = 1, Dn = 2, Yi = 4, Wa = 8, ja = 16, Ha = 1, Qa = 4, Za = 8, Ka = 16, Ja = 1, el = 2, Wi = "[", qr = "[!", Pn = "]", rr = {}, me = Symbol(), tl = "http://www.w3.org/1999/xhtml";
let Ce = null;
function nr(e) {
  Ce = e;
}
function Ft(e, t = !1, r) {
  Ce = {
    p: Ce,
    i: !1,
    c: null,
    e: null,
    s: e,
    x: null,
    l: null
  };
}
function Dt(e) {
  var t = (
    /** @type {ComponentContext} */
    Ce
  ), r = t.e;
  if (r !== null) {
    t.e = null;
    for (var n of r)
      bo(n);
  }
  return t.i = !0, Ce = t.p, /** @type {T} */
  {};
}
function ji() {
  return !0;
}
let kt = [];
function Hi() {
  var e = kt;
  kt = [], Ua(e);
}
function sr(e) {
  if (kt.length === 0 && !pr) {
    var t = kt;
    queueMicrotask(() => {
      t === kt && Hi();
    });
  }
  kt.push(e);
}
function rl() {
  for (; kt.length > 0; )
    Hi();
}
function Vr(e) {
  console.warn("https://svelte.dev/e/hydration_mismatch");
}
function nl() {
  console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
let H = !1;
function ft(e) {
  H = e;
}
let W;
function Pe(e) {
  if (e === null)
    throw Vr(), rr;
  return W = e;
}
function wr() {
  return Pe(
    /** @type {TemplateNode} */
    /* @__PURE__ */ rt(W)
  );
}
function ce(e) {
  if (H) {
    if (/* @__PURE__ */ rt(W) !== null)
      throw Vr(), rr;
    W = e;
  }
}
function Qi(e = 1) {
  if (H) {
    for (var t = e, r = W; t--; )
      r = /** @type {TemplateNode} */
      /* @__PURE__ */ rt(r);
    W = r;
  }
}
function Ur(e = !0) {
  for (var t = 0, r = W; ; ) {
    if (r.nodeType === lr) {
      var n = (
        /** @type {Comment} */
        r.data
      );
      if (n === Pn) {
        if (t === 0) return r;
        t -= 1;
      } else (n === Wi || n === qr) && (t += 1);
    }
    var i = (
      /** @type {TemplateNode} */
      /* @__PURE__ */ rt(r)
    );
    e && r.remove(), r = i;
  }
}
function Zi(e) {
  if (!e || e.nodeType !== lr)
    throw Vr(), rr;
  return (
    /** @type {Comment} */
    e.data
  );
}
function Nt(e) {
  if (typeof e != "object" || e === null || Gt in e)
    return e;
  const t = Sn(e);
  if (t !== Ba && t !== Ca)
    return e;
  var r = /* @__PURE__ */ new Map(), n = Gi(e), i = /* @__PURE__ */ te(0), a = zt, o = (l) => {
    if (zt === a)
      return l();
    var s = V, u = zt;
    Fe(null), li(a);
    var f = l();
    return Fe(s), li(u), f;
  };
  return n && r.set("length", /* @__PURE__ */ te(
    /** @type {any[]} */
    e.length
  )), new Proxy(
    /** @type {any} */
    e,
    {
      defineProperty(l, s, u) {
        (!("value" in u) || u.configurable === !1 || u.enumerable === !1 || u.writable === !1) && $a();
        var f = r.get(s);
        return f === void 0 ? f = o(() => {
          var h = /* @__PURE__ */ te(u.value);
          return r.set(s, h), h;
        }) : z(f, u.value, !0), !0;
      },
      deleteProperty(l, s) {
        var u = r.get(s);
        if (u === void 0) {
          if (s in l) {
            const f = o(() => /* @__PURE__ */ te(me));
            r.set(s, f), vr(i);
          }
        } else
          z(u, me), vr(i);
        return !0;
      },
      get(l, s, u) {
        if (s === Gt)
          return e;
        var f = r.get(s), h = s in l;
        if (f === void 0 && (!h || Zt(l, s)?.writable) && (f = o(() => {
          var d = Nt(h ? l[s] : me), v = /* @__PURE__ */ te(d);
          return v;
        }), r.set(s, f)), f !== void 0) {
          var p = c(f);
          return p === me ? void 0 : p;
        }
        return Reflect.get(l, s, u);
      },
      getOwnPropertyDescriptor(l, s) {
        var u = Reflect.getOwnPropertyDescriptor(l, s);
        if (u && "value" in u) {
          var f = r.get(s);
          f && (u.value = c(f));
        } else if (u === void 0) {
          var h = r.get(s), p = h?.v;
          if (h !== void 0 && p !== me)
            return {
              enumerable: !0,
              configurable: !0,
              value: p,
              writable: !0
            };
        }
        return u;
      },
      has(l, s) {
        if (s === Gt)
          return !0;
        var u = r.get(s), f = u !== void 0 && u.v !== me || Reflect.has(l, s);
        if (u !== void 0 || $ !== null && (!f || Zt(l, s)?.writable)) {
          u === void 0 && (u = o(() => {
            var p = f ? Nt(l[s]) : me, d = /* @__PURE__ */ te(p);
            return d;
          }), r.set(s, u));
          var h = c(u);
          if (h === me)
            return !1;
        }
        return f;
      },
      set(l, s, u, f) {
        var h = r.get(s), p = s in l;
        if (n && s === "length")
          for (var d = u; d < /** @type {Source<number>} */
          h.v; d += 1) {
            var v = r.get(d + "");
            v !== void 0 ? z(v, me) : d in l && (v = o(() => /* @__PURE__ */ te(me)), r.set(d + "", v));
          }
        if (h === void 0)
          (!p || Zt(l, s)?.writable) && (h = o(() => /* @__PURE__ */ te(void 0)), z(h, Nt(u)), r.set(s, h));
        else {
          p = h.v !== me;
          var g = o(() => Nt(u));
          z(h, g);
        }
        var y = Reflect.getOwnPropertyDescriptor(l, s);
        if (y?.set && y.set.call(f, u), !p) {
          if (n && typeof s == "string") {
            var _ = (
              /** @type {Source<number>} */
              r.get("length")
            ), w = Number(s);
            Number.isInteger(w) && w >= _.v && z(_, w + 1);
          }
          vr(i);
        }
        return !0;
      },
      ownKeys(l) {
        c(i);
        var s = Reflect.ownKeys(l).filter((h) => {
          var p = r.get(h);
          return p === void 0 || p.v !== me;
        });
        for (var [u, f] of r)
          f.v !== me && !(u in l) && s.push(u);
        return s;
      },
      setPrototypeOf() {
        qa();
      }
    }
  );
}
var ni, Ki, Ji, eo;
function hn() {
  if (ni === void 0) {
    ni = window, Ki = /Firefox/.test(navigator.userAgent);
    var e = Element.prototype, t = Node.prototype, r = Text.prototype;
    Ji = Zt(t, "firstChild").get, eo = Zt(t, "nextSibling").get, ri(e) && (e.__click = void 0, e.__className = void 0, e.__attributes = null, e.__style = void 0, e.__e = void 0), ri(r) && (r.__t = void 0);
  }
}
function Je(e = "") {
  return document.createTextNode(e);
}
// @__NO_SIDE_EFFECTS__
function pt(e) {
  return Ji.call(e);
}
// @__NO_SIDE_EFFECTS__
function rt(e) {
  return eo.call(e);
}
function ve(e, t) {
  if (!H)
    return /* @__PURE__ */ pt(e);
  var r = (
    /** @type {TemplateNode} */
    /* @__PURE__ */ pt(W)
  );
  if (r === null)
    r = W.appendChild(Je());
  else if (t && r.nodeType !== En) {
    var n = Je();
    return r?.before(n), Pe(n), n;
  }
  return Pe(r), r;
}
function Ht(e, t = !1) {
  if (!H) {
    var r = (
      /** @type {DocumentFragment} */
      /* @__PURE__ */ pt(
        /** @type {Node} */
        e
      )
    );
    return r instanceof Comment && r.data === "" ? /* @__PURE__ */ rt(r) : r;
  }
  if (t && W?.nodeType !== En) {
    var n = Je();
    return W?.before(n), Pe(n), n;
  }
  return W;
}
function ie(e, t = 1, r = !1) {
  let n = H ? W : e;
  for (var i; t--; )
    i = n, n = /** @type {TemplateNode} */
    /* @__PURE__ */ rt(n);
  if (!H)
    return n;
  if (r && n?.nodeType !== En) {
    var a = Je();
    return n === null ? i?.after(a) : n.before(a), Pe(a), a;
  }
  return Pe(n), /** @type {TemplateNode} */
  n;
}
function to(e) {
  e.textContent = "";
}
function il() {
  return !1;
}
function ro(e) {
  var t = $;
  if (t === null)
    return V.f |= Et, e;
  if ((t.f & Rn) === 0) {
    if ((t.f & $r) === 0)
      throw e;
    t.b.error(e);
  } else
    ir(e, t);
}
function ir(e, t) {
  for (; t !== null; ) {
    if ((t.f & $r) !== 0)
      try {
        t.b.error(e);
        return;
      } catch (r) {
        e = r;
      }
    t = t.parent;
  }
  throw e;
}
const Mr = /* @__PURE__ */ new Set();
let he = null, qe = null, He = [], Xr = null, pn = !1, pr = !1;
class Qe {
  committed = !1;
  /**
   * The current values of any sources that are updated in this batch
   * They keys of this map are identical to `this.#previous`
   * @type {Map<Source, any>}
   */
  current = /* @__PURE__ */ new Map();
  /**
   * The values of any sources that are updated in this batch _before_ those updates took place.
   * They keys of this map are identical to `this.#current`
   * @type {Map<Source, any>}
   */
  previous = /* @__PURE__ */ new Map();
  /**
   * When the batch is committed (and the DOM is updated), we need to remove old branches
   * and append new ones by calling the functions added inside (if/each/key/etc) blocks
   * @type {Set<() => void>}
   */
  #t = /* @__PURE__ */ new Set();
  /**
   * If a fork is discarded, we need to destroy any effects that are no longer needed
   * @type {Set<(batch: Batch) => void>}
   */
  #e = /* @__PURE__ */ new Set();
  /**
   * The number of async effects that are currently in flight
   */
  #r = 0;
  /**
   * The number of async effects that are currently in flight, _not_ inside a pending boundary
   */
  #n = 0;
  /**
   * A deferred that resolves when the batch is committed, used with `settled()`
   * TODO replace with Promise.withResolvers once supported widely enough
   * @type {{ promise: Promise<void>, resolve: (value?: any) => void, reject: (reason: unknown) => void } | null}
   */
  #s = null;
  /**
   * Deferred effects (which run after async work has completed) that are DIRTY
   * @type {Effect[]}
   */
  #l = [];
  /**
   * Deferred effects that are MAYBE_DIRTY
   * @type {Effect[]}
   */
  #a = [];
  /**
   * A set of branches that still exist, but will be destroyed when this batch
   * is committed — we skip over these during `process`
   * @type {Set<Effect>}
   */
  skipped_effects = /* @__PURE__ */ new Set();
  is_fork = !1;
  /**
   *
   * @param {Effect[]} root_effects
   */
  process(t) {
    He = [], this.apply();
    var r = {
      parent: null,
      effect: null,
      effects: [],
      render_effects: [],
      block_effects: []
    };
    for (const n of t)
      this.#i(n, r);
    this.is_fork || this.#u(), this.#n > 0 || this.is_fork ? (this.#o(r.effects), this.#o(r.render_effects), this.#o(r.block_effects)) : (he = null, ii(r.render_effects), ii(r.effects), this.#s?.resolve()), qe = null;
  }
  /**
   * Traverse the effect tree, executing effects or stashing
   * them for later execution as appropriate
   * @param {Effect} root
   * @param {EffectTarget} target
   */
  #i(t, r) {
    t.f ^= xe;
    for (var n = t.first; n !== null; ) {
      var i = n.f, a = (i & (gt | qt)) !== 0, o = a && (i & xe) !== 0, l = o || (i & Le) !== 0 || this.skipped_effects.has(n);
      if ((n.f & $r) !== 0 && n.b?.is_pending() && (r = {
        parent: r,
        effect: n,
        effects: [],
        render_effects: [],
        block_effects: []
      }), !l && n.fn !== null) {
        a ? n.f ^= xe : (i & Ir) !== 0 ? r.effects.push(n) : Ar(n) && ((n.f & vt) !== 0 && r.block_effects.push(n), xr(n));
        var s = n.first;
        if (s !== null) {
          n = s;
          continue;
        }
      }
      var u = n.parent;
      for (n = n.next; n === null && u !== null; )
        u === r.effect && (this.#o(r.effects), this.#o(r.render_effects), this.#o(r.block_effects), r = /** @type {EffectTarget} */
        r.parent), n = u.next, u = u.parent;
    }
  }
  /**
   * @param {Effect[]} effects
   */
  #o(t) {
    for (const r of t)
      ((r.f & Be) !== 0 ? this.#l : this.#a).push(r), _e(r, xe);
  }
  /**
   * Associate a change to a given source with the current
   * batch, noting its previous and current values
   * @param {Source} source
   * @param {any} value
   */
  capture(t, r) {
    this.previous.has(t) || this.previous.set(t, r), (t.f & Et) === 0 && (this.current.set(t, t.v), qe?.set(t, t.v));
  }
  activate() {
    he = this, this.apply();
  }
  deactivate() {
    he = null, qe = null;
  }
  flush() {
    if (this.activate(), He.length > 0) {
      if (no(), he !== null && he !== this)
        return;
    } else this.#r === 0 && this.process([]);
    this.deactivate();
  }
  discard() {
    for (const t of this.#e) t(this);
    this.#e.clear();
  }
  #u() {
    if (this.#n === 0) {
      for (const t of this.#t) t();
      this.#t.clear();
    }
    this.#r === 0 && this.#f();
  }
  #f() {
    if (Mr.size > 1) {
      this.previous.clear();
      var t = qe, r = !0, n = {
        parent: null,
        effect: null,
        effects: [],
        render_effects: [],
        block_effects: []
      };
      for (const i of Mr) {
        if (i === this) {
          r = !1;
          continue;
        }
        const a = [];
        for (const [l, s] of this.current) {
          if (i.current.has(l))
            if (r && s !== i.current.get(l))
              i.current.set(l, s);
            else
              continue;
          a.push(l);
        }
        if (a.length === 0)
          continue;
        const o = [...i.current.keys()].filter((l) => !this.current.has(l));
        if (o.length > 0) {
          const l = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map();
          for (const u of a)
            io(u, o, l, s);
          if (He.length > 0) {
            he = i, i.apply();
            for (const u of He)
              i.#i(u, n);
            He = [], i.deactivate();
          }
        }
      }
      he = null, qe = t;
    }
    this.committed = !0, Mr.delete(this);
  }
  /**
   *
   * @param {boolean} blocking
   */
  increment(t) {
    this.#r += 1, t && (this.#n += 1);
  }
  /**
   *
   * @param {boolean} blocking
   */
  decrement(t) {
    this.#r -= 1, t && (this.#n -= 1), this.revive();
  }
  revive() {
    for (const t of this.#l)
      _e(t, Be), Ot(t);
    for (const t of this.#a)
      _e(t, yt), Ot(t);
    this.#l = [], this.#a = [], this.flush();
  }
  /** @param {() => void} fn */
  oncommit(t) {
    this.#t.add(t);
  }
  /** @param {(batch: Batch) => void} fn */
  ondiscard(t) {
    this.#e.add(t);
  }
  settled() {
    return (this.#s ??= Oi()).promise;
  }
  static ensure() {
    if (he === null) {
      const t = he = new Qe();
      Mr.add(he), pr || Qe.enqueue(() => {
        he === t && t.flush();
      });
    }
    return he;
  }
  /** @param {() => void} task */
  static enqueue(t) {
    sr(t);
  }
  apply() {
  }
}
function ol(e) {
  var t = pr;
  pr = !0;
  try {
    for (var r; ; ) {
      if (rl(), He.length === 0 && (he?.flush(), He.length === 0))
        return Xr = null, /** @type {T} */
        r;
      no();
    }
  } finally {
    pr = t;
  }
}
function no() {
  var e = Kt;
  pn = !0;
  try {
    var t = 0;
    for (oi(!0); He.length > 0; ) {
      var r = Qe.ensure();
      if (t++ > 1e3) {
        var n, i;
        al();
      }
      r.process(He), Mt.clear();
    }
  } finally {
    pn = !1, oi(e), Xr = null;
  }
}
function al() {
  try {
    za();
  } catch (e) {
    ir(e, Xr);
  }
}
let ut = null;
function ii(e) {
  var t = e.length;
  if (t !== 0) {
    for (var r = 0; r < t; ) {
      var n = e[r++];
      if ((n.f & (dt | Le)) === 0 && Ar(n) && (ut = /* @__PURE__ */ new Set(), xr(n), n.deps === null && n.first === null && n.nodes_start === null && (n.teardown === null && n.ac === null ? To(n) : n.fn = null), ut?.size > 0)) {
        Mt.clear();
        for (const i of ut) {
          if ((i.f & (dt | Le)) !== 0) continue;
          const a = [i];
          let o = i.parent;
          for (; o !== null; )
            ut.has(o) && (ut.delete(o), a.push(o)), o = o.parent;
          for (let l = a.length - 1; l >= 0; l--) {
            const s = a[l];
            (s.f & (dt | Le)) === 0 && xr(s);
          }
        }
        ut.clear();
      }
    }
    ut = null;
  }
}
function io(e, t, r, n) {
  if (!r.has(e) && (r.add(e), e.reactions !== null))
    for (const i of e.reactions) {
      const a = i.f;
      (a & be) !== 0 ? io(
        /** @type {Derived} */
        i,
        t,
        r,
        n
      ) : (a & (Tn | vt)) !== 0 && (a & Be) === 0 && // we may have scheduled this one already
      oo(i, t, n) && (_e(i, Be), Ot(
        /** @type {Effect} */
        i
      ));
    }
}
function oo(e, t, r) {
  const n = r.get(e);
  if (n !== void 0) return n;
  if (e.deps !== null)
    for (const i of e.deps) {
      if (t.includes(i))
        return !0;
      if ((i.f & be) !== 0 && oo(
        /** @type {Derived} */
        i,
        t,
        r
      ))
        return r.set(
          /** @type {Derived} */
          i,
          !0
        ), !0;
    }
  return r.set(e, !1), !1;
}
function Ot(e) {
  for (var t = Xr = e; t.parent !== null; ) {
    t = t.parent;
    var r = t.f;
    if (pn && t === $ && (r & vt) !== 0 && (r & ki) === 0)
      return;
    if ((r & (qt | gt)) !== 0) {
      if ((r & xe) === 0) return;
      t.f ^= xe;
    }
  }
  He.push(t);
}
function ll(e) {
  let t = 0, r = $t(0), n;
  return () => {
    bl() && (c(r), Un(() => (t === 0 && (n = Xt(() => e(() => vr(r)))), t += 1, () => {
      sr(() => {
        t -= 1, t === 0 && (n?.(), n = void 0, vr(r));
      });
    })));
  };
}
var sl = tr | ar | $r;
function ul(e, t, r) {
  new fl(e, t, r);
}
class fl {
  /** @type {Boundary | null} */
  parent;
  #t = !1;
  /** @type {TemplateNode} */
  #e;
  /** @type {TemplateNode | null} */
  #r = H ? W : null;
  /** @type {BoundaryProps} */
  #n;
  /** @type {((anchor: Node) => void)} */
  #s;
  /** @type {Effect} */
  #l;
  /** @type {Effect | null} */
  #a = null;
  /** @type {Effect | null} */
  #i = null;
  /** @type {Effect | null} */
  #o = null;
  /** @type {DocumentFragment | null} */
  #u = null;
  /** @type {TemplateNode | null} */
  #f = null;
  #h = 0;
  #c = 0;
  #p = !1;
  /**
   * A source containing the number of pending async deriveds/expressions.
   * Only created if `$effect.pending()` is used inside the boundary,
   * otherwise updating the source results in needless `Batch.ensure()`
   * calls followed by no-op flushes
   * @type {Source<number> | null}
   */
  #d = null;
  #x = ll(() => (this.#d = $t(this.#h), () => {
    this.#d = null;
  }));
  /**
   * @param {TemplateNode} node
   * @param {BoundaryProps} props
   * @param {((anchor: Node) => void)} children
   */
  constructor(t, r, n) {
    this.#e = t, this.#n = r, this.#s = n, this.parent = /** @type {Effect} */
    $.b, this.#t = !!this.#n.pending, this.#l = Wr(() => {
      if ($.b = this, H) {
        const a = this.#r;
        wr(), /** @type {Comment} */
        a.nodeType === lr && /** @type {Comment} */
        a.data === qr ? this.#b() : this.#_();
      } else {
        var i = this.#y();
        try {
          this.#a = $e(() => n(i));
        } catch (a) {
          this.error(a);
        }
        this.#c > 0 ? this.#g() : this.#t = !1;
      }
      return () => {
        this.#f?.remove();
      };
    }, sl), H && (this.#e = W);
  }
  #_() {
    try {
      this.#a = $e(() => this.#s(this.#e));
    } catch (t) {
      this.error(t);
    }
    this.#t = !1;
  }
  #b() {
    const t = this.#n.pending;
    t && (this.#i = $e(() => t(this.#e)), Qe.enqueue(() => {
      var r = this.#y();
      this.#a = this.#v(() => (Qe.ensure(), $e(() => this.#s(r)))), this.#c > 0 ? this.#g() : (Jt(
        /** @type {Effect} */
        this.#i,
        () => {
          this.#i = null;
        }
      ), this.#t = !1);
    }));
  }
  #y() {
    var t = this.#e;
    return this.#t && (this.#f = Je(), this.#e.before(this.#f), t = this.#f), t;
  }
  /**
   * Returns `true` if the effect exists inside a boundary whose pending snippet is shown
   * @returns {boolean}
   */
  is_pending() {
    return this.#t || !!this.parent && this.parent.is_pending();
  }
  has_pending_snippet() {
    return !!this.#n.pending;
  }
  /**
   * @param {() => Effect | null} fn
   */
  #v(t) {
    var r = $, n = V, i = Ce;
    et(this.#l), Fe(this.#l), nr(this.#l.ctx);
    try {
      return t();
    } catch (a) {
      return ro(a), null;
    } finally {
      et(r), Fe(n), nr(i);
    }
  }
  #g() {
    const t = (
      /** @type {(anchor: Node) => void} */
      this.#n.pending
    );
    this.#a !== null && (this.#u = document.createDocumentFragment(), this.#u.append(
      /** @type {TemplateNode} */
      this.#f
    ), So(this.#a, this.#u)), this.#i === null && (this.#i = $e(() => t(this.#e)));
  }
  /**
   * Updates the pending count associated with the currently visible pending snippet,
   * if any, such that we can replace the snippet with content once work is done
   * @param {1 | -1} d
   */
  #m(t) {
    if (!this.has_pending_snippet()) {
      this.parent && this.parent.#m(t);
      return;
    }
    this.#c += t, this.#c === 0 && (this.#t = !1, this.#i && Jt(this.#i, () => {
      this.#i = null;
    }), this.#u && (this.#e.before(this.#u), this.#u = null));
  }
  /**
   * Update the source that powers `$effect.pending()` inside this boundary,
   * and controls when the current `pending` snippet (if any) is removed.
   * Do not call from inside the class
   * @param {1 | -1} d
   */
  update_pending_count(t) {
    this.#m(t), this.#h += t, this.#d && or(this.#d, this.#h);
  }
  get_effect_pending() {
    return this.#x(), c(
      /** @type {Source<number>} */
      this.#d
    );
  }
  /** @param {unknown} error */
  error(t) {
    var r = this.#n.onerror;
    let n = this.#n.failed;
    if (this.#p || !r && !n)
      throw t;
    this.#a && (Te(this.#a), this.#a = null), this.#i && (Te(this.#i), this.#i = null), this.#o && (Te(this.#o), this.#o = null), H && (Pe(
      /** @type {TemplateNode} */
      this.#r
    ), Qi(), Pe(Ur()));
    var i = !1, a = !1;
    const o = () => {
      if (i) {
        nl();
        return;
      }
      i = !0, a && Xa(), Qe.ensure(), this.#h = 0, this.#o !== null && Jt(this.#o, () => {
        this.#o = null;
      }), this.#t = this.has_pending_snippet(), this.#a = this.#v(() => (this.#p = !1, $e(() => this.#s(this.#e)))), this.#c > 0 ? this.#g() : this.#t = !1;
    };
    var l = V;
    try {
      Fe(null), a = !0, r?.(t, o), a = !1;
    } catch (s) {
      ir(s, this.#l && this.#l.parent);
    } finally {
      Fe(l);
    }
    n && sr(() => {
      this.#o = this.#v(() => {
        Qe.ensure(), this.#p = !0;
        try {
          return $e(() => {
            n(
              this.#e,
              () => t,
              () => o
            );
          });
        } catch (s) {
          return ir(
            s,
            /** @type {Effect} */
            this.#l.parent
          ), null;
        } finally {
          this.#p = !1;
        }
      });
    });
  }
}
function cl(e, t, r, n) {
  const i = Yr;
  if (r.length === 0 && e.length === 0) {
    n(t.map(i));
    return;
  }
  var a = he, o = (
    /** @type {Effect} */
    $
  ), l = dl();
  function s() {
    Promise.all(r.map((u) => /* @__PURE__ */ hl(u))).then((u) => {
      l();
      try {
        n([...t.map(i), ...u]);
      } catch (f) {
        (o.f & dt) === 0 && ir(f, o);
      }
      a?.deactivate(), kr();
    }).catch((u) => {
      ir(u, o);
    });
  }
  e.length > 0 ? Promise.all(e).then(() => {
    l();
    try {
      return s();
    } finally {
      a?.deactivate(), kr();
    }
  }) : s();
}
function dl() {
  var e = $, t = V, r = Ce, n = he;
  return function(i = !0) {
    et(e), Fe(t), nr(r), i && n?.activate();
  };
}
function kr() {
  et(null), Fe(null), nr(null);
}
// @__NO_SIDE_EFFECTS__
function Yr(e) {
  var t = be | Be, r = V !== null && (V.f & be) !== 0 ? (
    /** @type {Derived} */
    V
  ) : null;
  return $ === null || r !== null && (r.f & Ie) !== 0 ? t |= Ie : $.f |= ar, {
    ctx: Ce,
    deps: null,
    effects: null,
    equals: $i,
    f: t,
    fn: e,
    reactions: null,
    rv: 0,
    v: (
      /** @type {V} */
      me
    ),
    wv: 0,
    parent: r ?? $,
    ac: null
  };
}
// @__NO_SIDE_EFFECTS__
function hl(e, t) {
  let r = (
    /** @type {Effect | null} */
    $
  );
  r === null && ka();
  var n = (
    /** @type {Boundary} */
    r.b
  ), i = (
    /** @type {Promise<V>} */
    /** @type {unknown} */
    void 0
  ), a = $t(
    /** @type {V} */
    me
  ), o = !V, l = /* @__PURE__ */ new Map();
  return Al(() => {
    var s = Oi();
    i = s.promise;
    try {
      Promise.resolve(e()).then(s.resolve, s.reject).then(() => {
        u === he && u.committed && u.deactivate(), kr();
      });
    } catch (p) {
      s.reject(p), kr();
    }
    var u = (
      /** @type {Batch} */
      he
    );
    if (o) {
      var f = !n.is_pending();
      n.update_pending_count(1), u.increment(f), l.get(u)?.reject(Qt), l.delete(u), l.set(u, s);
    }
    const h = (p, d = void 0) => {
      if (u.activate(), d)
        d !== Qt && (a.f |= Et, or(a, d));
      else {
        (a.f & Et) !== 0 && (a.f ^= Et), or(a, p);
        for (const [v, g] of l) {
          if (l.delete(v), v === u) break;
          g.reject(Qt);
        }
      }
      o && (n.update_pending_count(-1), u.decrement(f));
    };
    s.promise.then(h, (p) => h(null, p || "unknown"));
  }), _o(() => {
    for (const s of l.values())
      s.reject(Qt);
  }), new Promise((s) => {
    function u(f) {
      function h() {
        f === i ? s(a) : u(i);
      }
      f.then(h, h);
    }
    u(i);
  });
}
// @__NO_SIDE_EFFECTS__
function k(e) {
  const t = /* @__PURE__ */ Yr(e);
  return ho(t), t;
}
// @__NO_SIDE_EFFECTS__
function ao(e) {
  const t = /* @__PURE__ */ Yr(e);
  return t.equals = Vi, t;
}
function lo(e) {
  var t = e.effects;
  if (t !== null) {
    e.effects = null;
    for (var r = 0; r < t.length; r += 1)
      Te(
        /** @type {Effect} */
        t[r]
      );
  }
}
function pl(e) {
  for (var t = e.parent; t !== null; ) {
    if ((t.f & be) === 0)
      return (
        /** @type {Effect} */
        t
      );
    t = t.parent;
  }
  return null;
}
function Bn(e) {
  var t, r = $;
  et(pl(e));
  try {
    e.f &= ~Cr, lo(e), t = yo(e);
  } finally {
    et(r);
  }
  return t;
}
function so(e) {
  var t = Bn(e);
  if (e.equals(t) || (e.v = t, e.wv = vo()), !Vt)
    if (qe !== null)
      qe.set(e, e.v);
    else {
      var r = (At || (e.f & Ie) !== 0) && e.deps !== null ? yt : xe;
      _e(e, r);
    }
}
let vn = /* @__PURE__ */ new Set();
const Mt = /* @__PURE__ */ new Map();
let uo = !1;
function $t(e, t) {
  var r = {
    f: 0,
    // TODO ideally we could skip this altogether, but it causes type errors
    v: e,
    reactions: null,
    equals: $i,
    rv: 0,
    wv: 0
  };
  return r;
}
// @__NO_SIDE_EFFECTS__
function te(e, t) {
  const r = $t(e);
  return ho(r), r;
}
// @__NO_SIDE_EFFECTS__
function fo(e, t = !1, r = !0) {
  const n = $t(e);
  return t || (n.equals = Vi), n;
}
function z(e, t, r = !1) {
  V !== null && // since we are untracking the function inside `$inspect.with` we need to add this check
  // to ensure we error if state is set inside an inspect effect
  (!Ve || (V.f & ti) !== 0) && ji() && (V.f & (be | vt | Tn | ti)) !== 0 && !ht?.includes(e) && Va();
  let n = r ? Nt(t) : t;
  return or(e, n);
}
function or(e, t) {
  if (!e.equals(t)) {
    var r = e.v;
    Vt ? Mt.set(e, t) : Mt.set(e, r), e.v = t;
    var n = Qe.ensure();
    n.capture(e, r), (e.f & be) !== 0 && ((e.f & Be) !== 0 && Bn(
      /** @type {Derived} */
      e
    ), _e(e, (e.f & Ie) === 0 ? xe : yt)), e.wv = vo(), co(e, Be), $ !== null && ($.f & xe) !== 0 && ($.f & (gt | qt)) === 0 && (ze === null ? gl([e]) : ze.push(e)), !n.is_fork && vn.size > 0 && !uo && vl();
  }
  return t;
}
function vl() {
  uo = !1;
  const e = Array.from(vn);
  for (const t of e)
    (t.f & xe) !== 0 && _e(t, yt), Ar(t) && xr(t);
  vn.clear();
}
function vr(e) {
  z(e, e.v + 1);
}
function co(e, t) {
  var r = e.reactions;
  if (r !== null)
    for (var n = r.length, i = 0; i < n; i++) {
      var a = r[i], o = a.f, l = (o & Be) === 0;
      l && _e(a, t), (o & be) !== 0 ? (o & Cr) === 0 && (a.f |= Cr, co(
        /** @type {Derived} */
        a,
        yt
      )) : l && ((o & vt) !== 0 && ut !== null && ut.add(
        /** @type {Effect} */
        a
      ), Ot(
        /** @type {Effect} */
        a
      ));
    }
}
function Cn(e) {
  var t = V, r = $;
  Fe(null), et(null);
  try {
    return e();
  } finally {
    Fe(t), et(r);
  }
}
let Kt = !1;
function oi(e) {
  Kt = e;
}
let Vt = !1;
function ai(e) {
  Vt = e;
}
let V = null, Ve = !1;
function Fe(e) {
  V = e;
}
let $ = null;
function et(e) {
  $ = e;
}
let ht = null;
function ho(e) {
  V !== null && (ht === null ? ht = [e] : ht.push(e));
}
let Re = null, ke = 0, ze = null;
function gl(e) {
  ze = e;
}
let po = 1, mr = 0, zt = mr;
function li(e) {
  zt = e;
}
let At = !1;
function vo() {
  return ++po;
}
function Ar(e) {
  var t = e.f;
  if ((t & Be) !== 0)
    return !0;
  if ((t & yt) !== 0) {
    var r = e.deps, n = (t & Ie) !== 0;
    if (t & be && (e.f &= ~Cr), r !== null) {
      var i, a, o = (t & Br) !== 0, l = n && $ !== null && !At, s = r.length;
      if ((o || l) && ($ === null || ($.f & dt) === 0)) {
        var u = (
          /** @type {Derived} */
          e
        ), f = u.parent;
        for (i = 0; i < s; i++)
          a = r[i], (o || !a?.reactions?.includes(u)) && (a.reactions ??= []).push(u);
        o && (u.f ^= Br), l && f !== null && (f.f & Ie) === 0 && (u.f ^= Ie);
      }
      for (i = 0; i < s; i++)
        if (a = r[i], Ar(
          /** @type {Derived} */
          a
        ) && so(
          /** @type {Derived} */
          a
        ), a.wv > e.wv)
          return !0;
    }
    (!n || $ !== null && !At) && _e(e, xe);
  }
  return !1;
}
function go(e, t, r = !0) {
  var n = e.reactions;
  if (n !== null && !ht?.includes(e))
    for (var i = 0; i < n.length; i++) {
      var a = n[i];
      (a.f & be) !== 0 ? go(
        /** @type {Derived} */
        a,
        t,
        !1
      ) : t === a && (r ? _e(a, Be) : (a.f & xe) !== 0 && _e(a, yt), Ot(
        /** @type {Effect} */
        a
      ));
    }
}
function yo(e) {
  var t = Re, r = ke, n = ze, i = V, a = At, o = ht, l = Ce, s = Ve, u = zt, f = e.f;
  Re = /** @type {null | Value[]} */
  null, ke = 0, ze = null, At = (f & Ie) !== 0 && (Ve || !Kt || V === null), V = (f & (gt | qt)) === 0 ? e : null, ht = null, nr(e.ctx), Ve = !1, zt = ++mr, e.ac !== null && (Cn(() => {
    e.ac.abort(Qt);
  }), e.ac = null);
  try {
    e.f |= dn;
    var h = (
      /** @type {Function} */
      e.fn
    ), p = h(), d = e.deps;
    if (Re !== null) {
      var v;
      if (Nr(e, ke), d !== null && ke > 0)
        for (d.length = ke + Re.length, v = 0; v < Re.length; v++)
          d[ke + v] = Re[v];
      else
        e.deps = d = Re;
      if (!At || // Deriveds that already have reactions can cleanup, so we still add them as reactions
      (f & be) !== 0 && /** @type {import('#client').Derived} */
      e.reactions !== null)
        for (v = ke; v < d.length; v++)
          (d[v].reactions ??= []).push(e);
    } else d !== null && ke < d.length && (Nr(e, ke), d.length = ke);
    if (ji() && ze !== null && !Ve && d !== null && (e.f & (be | yt | Be)) === 0)
      for (v = 0; v < /** @type {Source[]} */
      ze.length; v++)
        go(
          ze[v],
          /** @type {Effect} */
          e
        );
    return i !== null && i !== e && (mr++, ze !== null && (n === null ? n = ze : n.push(.../** @type {Source[]} */
    ze))), (e.f & Et) !== 0 && (e.f ^= Et), p;
  } catch (g) {
    return ro(g);
  } finally {
    e.f ^= dn, Re = t, ke = r, ze = n, V = i, At = a, ht = o, nr(l), Ve = s, zt = u;
  }
}
function yl(e, t) {
  let r = t.reactions;
  if (r !== null) {
    var n = Pa.call(r, e);
    if (n !== -1) {
      var i = r.length - 1;
      i === 0 ? r = t.reactions = null : (r[n] = r[i], r.pop());
    }
  }
  r === null && (t.f & be) !== 0 && // Destroying a child effect while updating a parent effect can cause a dependency to appear
  // to be unused, when in fact it is used by the currently-updating parent. Checking `new_deps`
  // allows us to skip the expensive work of disconnecting and immediately reconnecting it
  (Re === null || !Re.includes(t)) && (_e(t, yt), (t.f & (Ie | Br)) === 0 && (t.f ^= Br), lo(
    /** @type {Derived} **/
    t
  ), Nr(
    /** @type {Derived} **/
    t,
    0
  ));
}
function Nr(e, t) {
  var r = e.deps;
  if (r !== null)
    for (var n = t; n < r.length; n++)
      yl(e, r[n]);
}
function xr(e) {
  var t = e.f;
  if ((t & dt) === 0) {
    _e(e, xe);
    var r = $, n = Kt;
    $ = e, Kt = !0;
    try {
      (t & vt) !== 0 ? Rl(e) : Ro(e), Ao(e);
      var i = yo(e);
      e.teardown = typeof i == "function" ? i : null, e.wv = po;
      var a;
      Da && Ya && (e.f & Be) !== 0 && e.deps;
    } finally {
      Kt = n, $ = r;
    }
  }
}
function c(e) {
  var t = e.f, r = (t & be) !== 0;
  if (V !== null && !Ve) {
    var n = $ !== null && ($.f & dt) !== 0;
    if (!n && !ht?.includes(e)) {
      var i = V.deps;
      if ((V.f & dn) !== 0)
        e.rv < mr && (e.rv = mr, Re === null && i !== null && i[ke] === e ? ke++ : Re === null ? Re = [e] : (!At || !Re.includes(e)) && Re.push(e));
      else {
        (V.deps ??= []).push(e);
        var a = e.reactions;
        a === null ? e.reactions = [V] : a.includes(V) || a.push(V);
      }
    }
  } else if (r && /** @type {Derived} */
  e.deps === null && /** @type {Derived} */
  e.effects === null) {
    var o = (
      /** @type {Derived} */
      e
    ), l = o.parent;
    l !== null && (l.f & Ie) === 0 && (o.f ^= Ie);
  }
  if (Vt) {
    if (Mt.has(e))
      return Mt.get(e);
    if (r) {
      o = /** @type {Derived} */
      e;
      var s = o.v;
      return ((o.f & xe) === 0 && o.reactions !== null || mo(o)) && (s = Bn(o)), Mt.set(o, s), s;
    }
  } else if (r) {
    if (o = /** @type {Derived} */
    e, qe?.has(o))
      return qe.get(o);
    Ar(o) && so(o);
  }
  if (qe?.has(e))
    return qe.get(e);
  if ((e.f & Et) !== 0)
    throw e.v;
  return e.v;
}
function mo(e) {
  if (e.v === me) return !0;
  if (e.deps === null) return !1;
  for (const t of e.deps)
    if (Mt.has(t) || (t.f & be) !== 0 && mo(
      /** @type {Derived} */
      t
    ))
      return !0;
  return !1;
}
function Xt(e) {
  var t = Ve;
  try {
    return Ve = !0, e();
  } finally {
    Ve = t;
  }
}
const ml = -7169;
function _e(e, t) {
  e.f = e.f & ml | t;
}
function xl(e) {
  if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
    if (Gt in e)
      gn(e);
    else if (!Array.isArray(e))
      for (let t in e) {
        const r = e[t];
        typeof r == "object" && r && Gt in r && gn(r);
      }
  }
}
function gn(e, t = /* @__PURE__ */ new Set()) {
  if (typeof e == "object" && e !== null && // We don't want to traverse DOM elements
  !(e instanceof EventTarget) && !t.has(e)) {
    t.add(e), e instanceof Date && e.getTime();
    for (let n in e)
      try {
        gn(e[n], t);
      } catch {
      }
    const r = Sn(e);
    if (r !== Object.prototype && r !== Array.prototype && r !== Map.prototype && r !== Set.prototype && r !== Date.prototype) {
      const n = Ii(r);
      for (let i in n) {
        const a = n[i].get;
        if (a)
          try {
            a.call(e);
          } catch {
          }
      }
    }
  }
}
function xo(e) {
  $ === null && V === null && Ga(), V !== null && (V.f & Ie) !== 0 && $ === null && La(), Vt && Na();
}
function _l(e, t) {
  var r = t.last;
  r === null ? t.last = t.first = e : (r.next = e, e.prev = r, t.last = e);
}
function nt(e, t, r, n = !0) {
  var i = $;
  i !== null && (i.f & Le) !== 0 && (e |= Le);
  var a = {
    ctx: Ce,
    deps: null,
    nodes_start: null,
    nodes_end: null,
    f: e | Be,
    first: null,
    fn: t,
    last: null,
    next: null,
    parent: i,
    b: i && i.b,
    prev: null,
    teardown: null,
    transitions: null,
    wv: 0,
    ac: null
  };
  if (r)
    try {
      xr(a), a.f |= Rn;
    } catch (s) {
      throw Te(a), s;
    }
  else t !== null && Ot(a);
  if (n) {
    var o = a;
    if (r && o.deps === null && o.teardown === null && o.nodes_start === null && o.first === o.last && // either `null`, or a singular child
    (o.f & ar) === 0 && (o = o.first, (e & vt) !== 0 && (e & tr) !== 0 && o !== null && (o.f |= tr)), o !== null && (o.parent = i, i !== null && _l(o, i), V !== null && (V.f & be) !== 0 && (e & qt) === 0)) {
      var l = (
        /** @type {Derived} */
        V
      );
      (l.effects ??= []).push(o);
    }
  }
  return a;
}
function bl() {
  return V !== null && !Ve;
}
function _o(e) {
  const t = nt(Or, null, !1);
  return _e(t, xe), t.teardown = e, t;
}
function st(e) {
  xo();
  var t = (
    /** @type {Effect} */
    $.f
  ), r = !V && (t & gt) !== 0 && (t & Rn) === 0;
  if (r) {
    var n = (
      /** @type {ComponentContext} */
      Ce
    );
    (n.e ??= []).push(e);
  } else
    return bo(e);
}
function bo(e) {
  return nt(Ir | Ni, e, !1);
}
function gr(e) {
  return xo(), nt(Or | Ni, e, !0);
}
function wl(e) {
  Qe.ensure();
  const t = nt(qt | ar, e, !0);
  return (r = {}) => new Promise((n) => {
    r.outro ? Jt(t, () => {
      Te(t), n(void 0);
    }) : (Te(t), n(void 0));
  });
}
function wo(e) {
  return nt(Ir, e, !1);
}
function Al(e) {
  return nt(Tn | ar, e, !0);
}
function Un(e, t = 0) {
  return nt(Or | t, e, !0);
}
function Ne(e, t = [], r = [], n = [], i = !1) {
  cl(n, t, r, (a) => {
    nt(i ? Ir : Or, () => e(...a.map(c)), !0);
  });
}
function Wr(e, t = 0) {
  var r = nt(vt | t, e, !0);
  return r;
}
function $e(e, t = !0) {
  return nt(gt | ar, e, !0, t);
}
function Ao(e) {
  var t = e.teardown;
  if (t !== null) {
    const r = Vt, n = V;
    ai(!0), Fe(null);
    try {
      t.call(null);
    } finally {
      ai(r), Fe(n);
    }
  }
}
function Ro(e, t = !1) {
  var r = e.first;
  for (e.first = e.last = null; r !== null; ) {
    const i = r.ac;
    i !== null && Cn(() => {
      i.abort(Qt);
    });
    var n = r.next;
    (r.f & qt) !== 0 ? r.parent = null : Te(r, t), r = n;
  }
}
function Rl(e) {
  for (var t = e.first; t !== null; ) {
    var r = t.next;
    (t.f & gt) === 0 && Te(t), t = r;
  }
}
function Te(e, t = !0) {
  var r = !1;
  (t || (e.f & ki) !== 0) && e.nodes_start !== null && e.nodes_end !== null && (Tl(
    e.nodes_start,
    /** @type {TemplateNode} */
    e.nodes_end
  ), r = !0), Ro(e, t && !r), Nr(e, 0), _e(e, dt);
  var n = e.transitions;
  if (n !== null)
    for (const a of n)
      a.stop();
  Ao(e);
  var i = e.parent;
  i !== null && i.first !== null && To(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes_start = e.nodes_end = e.ac = null;
}
function Tl(e, t) {
  for (; e !== null; ) {
    var r = e === t ? null : (
      /** @type {TemplateNode} */
      /* @__PURE__ */ rt(e)
    );
    e.remove(), e = r;
  }
}
function To(e) {
  var t = e.parent, r = e.prev, n = e.next;
  r !== null && (r.next = n), n !== null && (n.prev = r), t !== null && (t.first === e && (t.first = n), t.last === e && (t.last = r));
}
function Jt(e, t, r = !0) {
  var n = [];
  kn(e, n, !0), Eo(n, () => {
    r && Te(e), t && t();
  });
}
function Eo(e, t) {
  var r = e.length;
  if (r > 0) {
    var n = () => --r || t();
    for (var i of e)
      i.out(n);
  } else
    t();
}
function kn(e, t, r) {
  if ((e.f & Le) === 0) {
    if (e.f ^= Le, e.transitions !== null)
      for (const o of e.transitions)
        (o.is_global || r) && t.push(o);
    for (var n = e.first; n !== null; ) {
      var i = n.next, a = (n.f & tr) !== 0 || // If this is a branch effect without a block effect parent,
      // it means the parent block effect was pruned. In that case,
      // transparency information was transferred to the branch effect.
      (n.f & gt) !== 0 && (e.f & vt) !== 0;
      kn(n, t, a ? r : !1), n = i;
    }
  }
}
function Nn(e) {
  Mo(e, !0);
}
function Mo(e, t) {
  if ((e.f & Le) !== 0) {
    e.f ^= Le, (e.f & xe) === 0 && (_e(e, Be), Ot(e));
    for (var r = e.first; r !== null; ) {
      var n = r.next, i = (r.f & tr) !== 0 || (r.f & gt) !== 0;
      Mo(r, i ? t : !1), r = n;
    }
    if (e.transitions !== null)
      for (const a of e.transitions)
        (a.is_global || t) && a.in();
  }
}
function So(e, t) {
  for (var r = e.nodes_start, n = e.nodes_end; r !== null; ) {
    var i = r === n ? null : (
      /** @type {TemplateNode} */
      /* @__PURE__ */ rt(r)
    );
    t.append(r), r = i;
  }
}
const Fo = /* @__PURE__ */ new Set(), yn = /* @__PURE__ */ new Set();
function El(e, t, r, n = {}) {
  function i(a) {
    if (n.capture || hr.call(t, a), !a.cancelBubble)
      return Cn(() => r?.call(this, a));
  }
  return sr(() => {
    t.addEventListener(e, i, n);
  }), i;
}
function Ml(e, t, r, n, i) {
  var a = { capture: n, passive: i }, o = El(e, t, r, a);
  (t === document.body || // @ts-ignore
  t === window || // @ts-ignore
  t === document || // Firefox has quirky behavior, it can happen that we still get "canplay" events when the element is already removed
  t instanceof HTMLMediaElement) && _o(() => {
    t.removeEventListener(e, o, a);
  });
}
function Sl(e) {
  for (var t = 0; t < e.length; t++)
    Fo.add(e[t]);
  for (var r of yn)
    r(e);
}
let si = null;
function hr(e) {
  var t = this, r = (
    /** @type {Node} */
    t.ownerDocument
  ), n = e.type, i = e.composedPath?.() || [], a = (
    /** @type {null | Element} */
    i[0] || e.target
  );
  si = e;
  var o = 0, l = si === e && e.__root;
  if (l) {
    var s = i.indexOf(l);
    if (s !== -1 && (t === document || t === /** @type {any} */
    window)) {
      e.__root = t;
      return;
    }
    var u = i.indexOf(t);
    if (u === -1)
      return;
    s <= u && (o = s);
  }
  if (a = /** @type {Element} */
  i[o] || e.target, a !== t) {
    zi(e, "currentTarget", {
      configurable: !0,
      get() {
        return a || r;
      }
    });
    var f = V, h = $;
    Fe(null), et(null);
    try {
      for (var p, d = []; a !== null; ) {
        var v = a.assignedSlot || a.parentNode || /** @type {any} */
        a.host || null;
        try {
          var g = a["__" + n];
          g != null && (!/** @type {any} */
          a.disabled || // DOM could've been updated already by the time this is reached, so we check this as well
          // -> the target could not have been disabled because it emits the event in the first place
          e.target === a) && g.call(a, e);
        } catch (y) {
          p ? d.push(y) : p = y;
        }
        if (e.cancelBubble || v === t || v === null)
          break;
        a = v;
      }
      if (p) {
        for (let y of d)
          queueMicrotask(() => {
            throw y;
          });
        throw p;
      }
    } finally {
      e.__root = t, delete e.currentTarget, Fe(f), et(h);
    }
  }
}
function Do(e) {
  var t = document.createElement("template");
  return t.innerHTML = e.replaceAll("<!>", "<!---->"), t.content;
}
function St(e, t) {
  var r = (
    /** @type {Effect} */
    $
  );
  r.nodes_start === null && (r.nodes_start = e, r.nodes_end = t);
}
// @__NO_SIDE_EFFECTS__
function Pt(e, t) {
  var r = (t & Ja) !== 0, n = (t & el) !== 0, i, a = !e.startsWith("<!>");
  return () => {
    if (H)
      return St(W, null), W;
    i === void 0 && (i = Do(a ? e : "<!>" + e), r || (i = /** @type {Node} */
    /* @__PURE__ */ pt(i)));
    var o = (
      /** @type {TemplateNode} */
      n || Ki ? document.importNode(i, !0) : i.cloneNode(!0)
    );
    if (r) {
      var l = (
        /** @type {TemplateNode} */
        /* @__PURE__ */ pt(o)
      ), s = (
        /** @type {TemplateNode} */
        o.lastChild
      );
      St(l, s);
    } else
      St(o, o);
    return o;
  };
}
// @__NO_SIDE_EFFECTS__
function Fl(e, t, r = "svg") {
  var n = !e.startsWith("<!>"), i = `<${r}>${n ? e : "<!>" + e}</${r}>`, a;
  return () => {
    if (H)
      return St(W, null), W;
    if (!a) {
      var o = (
        /** @type {DocumentFragment} */
        Do(i)
      ), l = (
        /** @type {Element} */
        /* @__PURE__ */ pt(o)
      );
      a = /** @type {Element} */
      /* @__PURE__ */ pt(l);
    }
    var s = (
      /** @type {TemplateNode} */
      a.cloneNode(!0)
    );
    return St(s, s), s;
  };
}
// @__NO_SIDE_EFFECTS__
function mt(e, t) {
  return /* @__PURE__ */ Fl(e, t, "svg");
}
function fr() {
  if (H)
    return St(W, null), W;
  var e = document.createDocumentFragment(), t = document.createComment(""), r = Je();
  return e.append(t, r), St(t, r), e;
}
function ue(e, t) {
  if (H) {
    $.nodes_end = W, wr();
    return;
  }
  e !== null && e.before(
    /** @type {Node} */
    t
  );
}
const Dl = ["touchstart", "touchmove"];
function Pl(e) {
  return Dl.includes(e);
}
function yr(e, t) {
  var r = t == null ? "" : typeof t == "object" ? t + "" : t;
  r !== (e.__t ??= e.nodeValue) && (e.__t = r, e.nodeValue = r + "");
}
function Po(e, t) {
  return Bo(e, t);
}
function Bl(e, t) {
  hn(), t.intro = t.intro ?? !1;
  const r = t.target, n = H, i = W;
  try {
    for (var a = (
      /** @type {TemplateNode} */
      /* @__PURE__ */ pt(r)
    ); a && (a.nodeType !== lr || /** @type {Comment} */
    a.data !== Wi); )
      a = /** @type {TemplateNode} */
      /* @__PURE__ */ rt(a);
    if (!a)
      throw rr;
    ft(!0), Pe(
      /** @type {Comment} */
      a
    );
    const o = Bo(e, { ...t, anchor: a });
    return ft(!1), /**  @type {Exports} */
    o;
  } catch (o) {
    if (o instanceof Error && o.message.split(`
`).some((l) => l.startsWith("https://svelte.dev/e/")))
      throw o;
    return o !== rr && console.warn("Failed to hydrate: ", o), t.recover === !1 && Ia(), hn(), to(r), ft(!1), Po(e, t);
  } finally {
    ft(n), Pe(i);
  }
}
const jt = /* @__PURE__ */ new Map();
function Bo(e, { target: t, anchor: r, props: n = {}, events: i, context: a, intro: o = !0 }) {
  hn();
  var l = /* @__PURE__ */ new Set(), s = (h) => {
    for (var p = 0; p < h.length; p++) {
      var d = h[p];
      if (!l.has(d)) {
        l.add(d);
        var v = Pl(d);
        t.addEventListener(d, hr, { passive: v });
        var g = jt.get(d);
        g === void 0 ? (document.addEventListener(d, hr, { passive: v }), jt.set(d, 1)) : jt.set(d, g + 1);
      }
    }
  };
  s(Mn(Fo)), yn.add(s);
  var u = void 0, f = wl(() => {
    var h = r ?? t.appendChild(Je());
    return ul(
      /** @type {TemplateNode} */
      h,
      {
        pending: () => {
        }
      },
      (p) => {
        if (a) {
          Ft({});
          var d = (
            /** @type {ComponentContext} */
            Ce
          );
          d.c = a;
        }
        if (i && (n.$$events = i), H && St(
          /** @type {TemplateNode} */
          p,
          null
        ), u = e(p, n) || {}, H && ($.nodes_end = W, W === null || W.nodeType !== lr || /** @type {Comment} */
        W.data !== Pn))
          throw Vr(), rr;
        a && Dt();
      }
    ), () => {
      for (var p of l) {
        t.removeEventListener(p, hr);
        var d = (
          /** @type {number} */
          jt.get(p)
        );
        --d === 0 ? (document.removeEventListener(p, hr), jt.delete(p)) : jt.set(p, d);
      }
      yn.delete(s), h !== r && h.parentNode?.removeChild(h);
    };
  });
  return mn.set(u, f), u;
}
let mn = /* @__PURE__ */ new WeakMap();
function Cl(e, t) {
  const r = mn.get(e);
  return r ? (mn.delete(e), r(t)) : Promise.resolve();
}
function Co(e) {
  return new Ul(e);
}
class Ul {
  /** @type {any} */
  #t;
  /** @type {Record<string, any>} */
  #e;
  /**
   * @param {ComponentConstructorOptions & {
   *  component: any;
   * }} options
   */
  constructor(t) {
    var r = /* @__PURE__ */ new Map(), n = (a, o) => {
      var l = /* @__PURE__ */ fo(o, !1, !1);
      return r.set(a, l), l;
    };
    const i = new Proxy(
      { ...t.props || {}, $$events: {} },
      {
        get(a, o) {
          return c(r.get(o) ?? n(o, Reflect.get(a, o)));
        },
        has(a, o) {
          return o === Li ? !0 : (c(r.get(o) ?? n(o, Reflect.get(a, o))), Reflect.has(a, o));
        },
        set(a, o, l) {
          return z(r.get(o) ?? n(o, l), l), Reflect.set(a, o, l);
        }
      }
    );
    this.#e = (t.hydrate ? Bl : Po)(t.component, {
      target: t.target,
      anchor: t.anchor,
      props: i,
      context: t.context,
      intro: t.intro ?? !1,
      recover: t.recover
    }), (!t?.props?.$$host || t.sync === !1) && ol(), this.#t = i.$$events;
    for (const a of Object.keys(this.#e))
      a === "$set" || a === "$destroy" || a === "$on" || zi(this, a, {
        get() {
          return this.#e[a];
        },
        /** @param {any} value */
        set(o) {
          this.#e[a] = o;
        },
        enumerable: !0
      });
    this.#e.$set = /** @param {Record<string, any>} next */
    (a) => {
      Object.assign(i, a);
    }, this.#e.$destroy = () => {
      Cl(this.#e);
    };
  }
  /** @param {Record<string, any>} props */
  $set(t) {
    this.#e.$set(t);
  }
  /**
   * @param {string} event
   * @param {(...args: any[]) => any} callback
   * @returns {any}
   */
  $on(t, r) {
    this.#t[t] = this.#t[t] || [];
    const n = (...i) => r.call(this, ...i);
    return this.#t[t].push(n), () => {
      this.#t[t] = this.#t[t].filter(
        /** @param {any} fn */
        (i) => i !== n
      );
    };
  }
  $destroy() {
    this.#e.$destroy();
  }
}
const kl = "5";
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add(kl);
class Uo {
  /** @type {TemplateNode} */
  anchor;
  /** @type {Map<Batch, Key>} */
  #t = /* @__PURE__ */ new Map();
  /** @type {Map<Key, Effect>} */
  #e = /* @__PURE__ */ new Map();
  /** @type {Map<Key, Branch>} */
  #r = /* @__PURE__ */ new Map();
  /**
   * Whether to pause (i.e. outro) on change, or destroy immediately.
   * This is necessary for `<svelte:element>`
   */
  #n = !0;
  /**
   * @param {TemplateNode} anchor
   * @param {boolean} transition
   */
  constructor(t, r = !0) {
    this.anchor = t, this.#n = r;
  }
  #s = () => {
    var t = (
      /** @type {Batch} */
      he
    );
    if (this.#t.has(t)) {
      var r = (
        /** @type {Key} */
        this.#t.get(t)
      ), n = this.#e.get(r);
      if (n)
        Nn(n);
      else {
        var i = this.#r.get(r);
        i && (this.#e.set(r, i.effect), this.#r.delete(r), i.fragment.lastChild.remove(), this.anchor.before(i.fragment), n = i.effect);
      }
      for (const [a, o] of this.#t) {
        if (this.#t.delete(a), a === t)
          break;
        const l = this.#r.get(o);
        l && (Te(l.effect), this.#r.delete(o));
      }
      for (const [a, o] of this.#e) {
        if (a === r) continue;
        const l = () => {
          if (Array.from(this.#t.values()).includes(a)) {
            var s = document.createDocumentFragment();
            So(o, s), s.append(Je()), this.#r.set(a, { effect: o, fragment: s });
          } else
            Te(o);
          this.#e.delete(a);
        };
        this.#n || !n ? Jt(o, l, !1) : l();
      }
    }
  };
  /**
   * @param {Batch} batch
   */
  #l = (t) => {
    this.#t.delete(t);
    const r = Array.from(this.#t.values());
    for (const [n, i] of this.#r)
      r.includes(n) || (Te(i.effect), this.#r.delete(n));
  };
  /**
   *
   * @param {any} key
   * @param {null | ((target: TemplateNode) => void)} fn
   */
  ensure(t, r) {
    var n = (
      /** @type {Batch} */
      he
    ), i = il();
    r && !this.#e.has(t) && !this.#r.has(t) && this.#e.set(
      t,
      $e(() => r(this.anchor))
    ), this.#t.set(n, t), i || (H && (this.anchor = W), this.#s());
  }
}
function Ln(e) {
  Ce === null && Xi(), st(() => {
    const t = Xt(e);
    if (typeof t == "function") return (
      /** @type {() => void} */
      t
    );
  });
}
function Nl(e) {
  Ce === null && Xi(), Ln(() => () => Xt(e));
}
function Se(e, t, r = !1) {
  H && wr();
  var n = new Uo(e), i = r ? tr : 0;
  function a(o, l) {
    if (H) {
      const u = Zi(e) === qr;
      if (o === u) {
        var s = Ur();
        Pe(s), n.anchor = s, ft(!1), n.ensure(o, l), ft(!0);
        return;
      }
    }
    n.ensure(o, l);
  }
  Wr(() => {
    var o = !1;
    t((l, s = !0) => {
      o = !0, a(s, l);
    }), o || a(!1, null);
  }, i);
}
function Ll(e, t, r) {
  H && wr();
  var n = new Uo(e);
  Wr(() => {
    var i = t();
    n.ensure(i, r);
  });
}
function rn(e, t) {
  return t;
}
function Gl(e, t, r) {
  for (var n = e.items, i = [], a = t.length, o = 0; o < a; o++)
    kn(t[o].e, i, !0);
  var l = a > 0 && i.length === 0 && r !== null;
  if (l) {
    var s = (
      /** @type {Element} */
      /** @type {Element} */
      r.parentNode
    );
    to(s), s.append(
      /** @type {Element} */
      r
    ), n.clear(), je(e, t[0].prev, t[a - 1].next);
  }
  Eo(i, () => {
    for (var u = 0; u < a; u++) {
      var f = t[u];
      l || (n.delete(f.k), je(e, f.prev, f.next)), Te(f.e, !l);
    }
  });
}
function nn(e, t, r, n, i, a = null) {
  var o = e, l = { flags: t, items: /* @__PURE__ */ new Map(), first: null }, s = (t & Yi) !== 0;
  if (s) {
    var u = (
      /** @type {Element} */
      e
    );
    o = H ? Pe(
      /** @type {Comment | Text} */
      /* @__PURE__ */ pt(u)
    ) : u.appendChild(Je());
  }
  H && wr();
  var f = null, h = !1, p = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ ao(() => {
    var _ = r();
    return Gi(_) ? _ : _ == null ? [] : Mn(_);
  }), v, g;
  function y() {
    zl(
      g,
      v,
      l,
      p,
      o,
      i,
      t,
      n,
      r
    ), a !== null && (v.length === 0 ? f ? Nn(f) : f = $e(() => a(o)) : f !== null && Jt(f, () => {
      f = null;
    }));
  }
  Wr(() => {
    g ??= /** @type {Effect} */
    $, v = /** @type {V[]} */
    c(d);
    var _ = v.length;
    if (h && _ === 0)
      return;
    h = _ === 0;
    let w = !1;
    if (H) {
      var x = Zi(o) === qr;
      x !== (_ === 0) && (o = Ur(), Pe(o), ft(!1), w = !0);
    }
    if (H) {
      for (var T = null, F, S = 0; S < _; S++) {
        if (W.nodeType === lr && /** @type {Comment} */
        W.data === Pn) {
          o = /** @type {Comment} */
          W, w = !0, ft(!1);
          break;
        }
        var C = v[S], G = n(C, S);
        F = ko(
          W,
          l,
          T,
          null,
          C,
          G,
          S,
          i,
          t,
          r
        ), l.items.set(G, F), T = F;
      }
      _ > 0 && Pe(Ur());
    }
    H ? _ === 0 && a && (f = $e(() => a(o))) : y(), w && ft(!0), c(d);
  }), H && (o = W);
}
function zl(e, t, r, n, i, a, o, l, s) {
  var u = (o & Wa) !== 0, f = (o & (Fn | Dn)) !== 0, h = t.length, p = r.items, d = r.first, v = d, g, y = null, _, w = [], x = [], T, F, S, C;
  if (u)
    for (C = 0; C < h; C += 1)
      T = t[C], F = l(T, C), S = p.get(F), S !== void 0 && (S.a?.measure(), (_ ??= /* @__PURE__ */ new Set()).add(S));
  for (C = 0; C < h; C += 1) {
    if (T = t[C], F = l(T, C), S = p.get(F), S === void 0) {
      var G = n.get(F);
      if (G !== void 0) {
        n.delete(F), p.set(F, G);
        var N = y ? y.next : v;
        je(r, y, G), je(r, G, N), on(G, N, i), y = G;
      } else {
        var q = v ? (
          /** @type {TemplateNode} */
          v.e.nodes_start
        ) : i;
        y = ko(
          q,
          r,
          y,
          y === null ? r.first : y.next,
          T,
          F,
          C,
          a,
          o,
          s
        );
      }
      p.set(F, y), w = [], x = [], v = y.next;
      continue;
    }
    if (f && Il(S, T, C, o), (S.e.f & Le) !== 0 && (Nn(S.e), u && (S.a?.unfix(), (_ ??= /* @__PURE__ */ new Set()).delete(S))), S !== v) {
      if (g !== void 0 && g.has(S)) {
        if (w.length < x.length) {
          var O = x[0], j;
          y = O.prev;
          var pe = w[0], K = w[w.length - 1];
          for (j = 0; j < w.length; j += 1)
            on(w[j], O, i);
          for (j = 0; j < x.length; j += 1)
            g.delete(x[j]);
          je(r, pe.prev, K.next), je(r, y, pe), je(r, K, O), v = O, y = K, C -= 1, w = [], x = [];
        } else
          g.delete(S), on(S, v, i), je(r, S.prev, S.next), je(r, S, y === null ? r.first : y.next), je(r, y, S), y = S;
        continue;
      }
      for (w = [], x = []; v !== null && v.k !== F; )
        (v.e.f & Le) === 0 && (g ??= /* @__PURE__ */ new Set()).add(v), x.push(v), v = v.next;
      if (v === null)
        continue;
      S = v;
    }
    w.push(S), y = S, v = S.next;
  }
  if (v !== null || g !== void 0) {
    for (var oe = g === void 0 ? [] : Mn(g); v !== null; )
      (v.e.f & Le) === 0 && oe.push(v), v = v.next;
    var ee = oe.length;
    if (ee > 0) {
      var B = (o & Yi) !== 0 && h === 0 ? i : null;
      if (u) {
        for (C = 0; C < ee; C += 1)
          oe[C].a?.measure();
        for (C = 0; C < ee; C += 1)
          oe[C].a?.fix();
      }
      Gl(r, oe, B);
    }
  }
  u && sr(() => {
    if (_ !== void 0)
      for (S of _)
        S.a?.apply();
  }), e.first = r.first && r.first.e, e.last = y && y.e;
  for (var ae of n.values())
    Te(ae.e);
  n.clear();
}
function Il(e, t, r, n) {
  (n & Fn) !== 0 && or(e.v, t), (n & Dn) !== 0 ? or(
    /** @type {Value<number>} */
    e.i,
    r
  ) : e.i = r;
}
function ko(e, t, r, n, i, a, o, l, s, u, f) {
  var h = (s & Fn) !== 0, p = (s & ja) === 0, d = h ? p ? /* @__PURE__ */ fo(i, !1, !1) : $t(i) : i, v = (s & Dn) === 0 ? o : $t(o), g = {
    i: v,
    v: d,
    k: a,
    a: null,
    // @ts-expect-error
    e: null,
    prev: r,
    next: n
  };
  try {
    if (e === null) {
      var y = document.createDocumentFragment();
      y.append(e = Je());
    }
    return g.e = $e(() => l(
      /** @type {Node} */
      e,
      d,
      v,
      u
    ), H), g.e.prev = r && r.e, g.e.next = n && n.e, r === null ? f || (t.first = g) : (r.next = g, r.e.next = g.e), n !== null && (n.prev = g, n.e.prev = g.e), g;
  } finally {
  }
}
function on(e, t, r) {
  for (var n = e.next ? (
    /** @type {TemplateNode} */
    e.next.e.nodes_start
  ) : r, i = t ? (
    /** @type {TemplateNode} */
    t.e.nodes_start
  ) : r, a = (
    /** @type {TemplateNode} */
    e.e.nodes_start
  ); a !== null && a !== n; ) {
    var o = (
      /** @type {TemplateNode} */
      /* @__PURE__ */ rt(a)
    );
    i.before(a), a = o;
  }
}
function je(e, t, r) {
  t === null ? e.first = r : (t.next = r, t.e.next = r && r.e), r !== null && (r.prev = t, r.e.prev = t && t.e);
}
function Oe(e, t, r) {
  wo(() => {
    var n = Xt(() => t(e, r?.()) || {});
    if (r && n?.update) {
      var i = !1, a = (
        /** @type {any} */
        {}
      );
      Un(() => {
        var o = r();
        xl(o), i && qi(a, o) && (a = o, n.update(o));
      }), i = !0;
    }
    if (n?.destroy)
      return () => (
        /** @type {Function} */
        n.destroy()
      );
  });
}
function ui(e, t = !1) {
  var r = t ? " !important;" : ";", n = "";
  for (var i in e) {
    var a = e[i];
    a != null && a !== "" && (n += " " + i + ": " + a + r);
  }
  return n;
}
function Ol(e, t) {
  if (t) {
    var r = "", n, i;
    return Array.isArray(t) ? (n = t[0], i = t[1]) : n = t, n && (r += ui(n)), i && (r += ui(i, !0)), r = r.trim(), r === "" ? null : r;
  }
  return String(e);
}
function an(e, t = {}, r, n) {
  for (var i in r) {
    var a = r[i];
    t[i] !== a && (r[i] == null ? e.style.removeProperty(i) : e.style.setProperty(i, a, n));
  }
}
function Y(e, t, r, n) {
  var i = e.__style;
  if (H || i !== t) {
    var a = Ol(t, n);
    (!H || a !== e.getAttribute("style")) && (a == null ? e.removeAttribute("style") : e.style.cssText = a), e.__style = t;
  } else n && (Array.isArray(n) ? (an(e, r?.[0], n[0]), an(e, r?.[1], n[1], "important")) : an(e, r, n));
  return n;
}
const $l = Symbol("is custom element"), ql = Symbol("is html");
function D(e, t, r, n) {
  var i = Vl(e);
  H && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === "LINK") || i[t] !== (i[t] = r) && (t === "loading" && (e[Fa] = r), r == null ? e.removeAttribute(t) : typeof r != "string" && Xl(e).includes(t) ? e[t] = r : e.setAttribute(t, r));
}
function Vl(e) {
  return (
    /** @type {Record<string | symbol, unknown>} **/
    // @ts-expect-error
    e.__attributes ??= {
      [$l]: e.nodeName.includes("-"),
      [ql]: e.namespaceURI === tl
    }
  );
}
var fi = /* @__PURE__ */ new Map();
function Xl(e) {
  var t = e.getAttribute("is") || e.nodeName, r = fi.get(t);
  if (r) return r;
  fi.set(t, r = []);
  for (var n, i = e, a = Element.prototype; a !== i; ) {
    n = Ii(i);
    for (var o in n)
      n[o].set && r.push(o);
    i = Sn(i);
  }
  return r;
}
function ci(e, t) {
  return e === t || e?.[Gt] === t;
}
function xn(e = {}, t, r, n) {
  return wo(() => {
    var i, a;
    return Un(() => {
      i = a, a = [], Xt(() => {
        e !== r(...a) && (t(e, ...a), i && ci(r(...i), e) && t(null, ...i));
      });
    }), () => {
      sr(() => {
        a && ci(r(...a), e) && t(null, ...a);
      });
    };
  }), e;
}
let Sr = !1;
function Yl(e) {
  var t = Sr;
  try {
    return Sr = !1, [e(), Sr];
  } finally {
    Sr = t;
  }
}
function R(e, t, r, n) {
  var i = (r & Za) !== 0, a = (r & Ka) !== 0, o = (
    /** @type {V} */
    n
  ), l = !0, s = () => (l && (l = !1, o = a ? Xt(
    /** @type {() => V} */
    n
  ) : (
    /** @type {V} */
    n
  )), o), u;
  if (i) {
    var f = Gt in e || Li in e;
    u = Zt(e, t)?.set ?? (f && t in e ? (w) => e[t] = w : void 0);
  }
  var h, p = !1;
  i ? [h, p] = Yl(() => (
    /** @type {V} */
    e[t]
  )) : h = /** @type {V} */
  e[t], h === void 0 && n !== void 0 && (h = s(), u && (Oa(), u(h)));
  var d;
  if (d = () => {
    var w = (
      /** @type {V} */
      e[t]
    );
    return w === void 0 ? s() : (l = !0, w);
  }, (r & Qa) === 0)
    return d;
  if (u) {
    var v = e.$$legacy;
    return (
      /** @type {() => V} */
      (function(w, x) {
        return arguments.length > 0 ? ((!x || v || p) && u(x ? d() : w), w) : d();
      })
    );
  }
  var g = !1, y = ((r & Ha) !== 0 ? Yr : ao)(() => (g = !1, d()));
  i && c(y);
  var _ = (
    /** @type {Effect} */
    $
  );
  return (
    /** @type {() => V} */
    (function(w, x) {
      if (arguments.length > 0) {
        const T = x ? c(y) : i ? Nt(w) : w;
        return z(y, T), g = !0, o !== void 0 && (o = T), w;
      }
      return Vt && g || (_.f & dt) !== 0 ? y.v : c(y);
    })
  );
}
var Wl = /* @__PURE__ */ mt('<g><rect role="none"></rect><rect role="none"></rect><rect role="none"></rect><rect role="none"></rect><rect role="none"></rect><rect role="none"></rect><rect role="none"></rect><rect role="none"></rect><rect role="none"></rect></g>');
function jl(e, t) {
  Ft(t, !0);
  let r = /* @__PURE__ */ k(() => t.pointLocation(t.value.xMin, t.value.yMin)), n = /* @__PURE__ */ k(() => t.pointLocation(t.value.xMax, t.value.yMax));
  const i = 8;
  function a(y) {
    return (_) => {
      t.preventHover(!0);
      let w = [c(r).x, c(r).y, c(n).x, c(n).y];
      return {
        move: (x) => {
          let T = x.pageX - _.pageX, F = x.pageY - _.pageY, S = [T, F, T, F].map((N, q) => w[q] + N * y[q]), C = t.coordinateAtPoint(S[0], S[1]), G = t.coordinateAtPoint(S[2], S[3]);
          t.onChange({
            xMin: Math.min(C.x, G.x),
            xMax: Math.max(C.x, G.x),
            yMin: Math.min(C.y, G.y),
            yMax: Math.max(C.y, G.y)
          });
        },
        up: () => {
          t.preventHover(!1);
        },
        cancel: () => {
          t.preventHover(!1);
        }
      };
    };
  }
  var o = Wl(), l = ve(o);
  Y(l, "", {}, {
    stroke: "#fff",
    fill: "rgba(128,128,128,0.25)",
    cursor: "move"
  }), Oe(l, (y, _) => We?.(y, _), () => ({ drag: a([1, 1, 1, 1]) }));
  var s = ie(l);
  D(s, "width", i), Y(s, "", {}, {
    cursor: "ew-resize",
    stroke: "none",
    fill: "none",
    "pointer-events": "all"
  }), Oe(s, (y, _) => We?.(y, _), () => ({ drag: a([1, 0, 0, 0]) }));
  var u = ie(s);
  D(u, "width", i), Y(u, "", {}, {
    cursor: "ew-resize",
    stroke: "none",
    fill: "none",
    "pointer-events": "all"
  }), Oe(u, (y, _) => We?.(y, _), () => ({ drag: a([0, 0, 1, 0]) }));
  var f = ie(u);
  D(f, "height", i), Y(f, "", {}, {
    cursor: "ns-resize",
    stroke: "none",
    fill: "none",
    "pointer-events": "all"
  }), Oe(f, (y, _) => We?.(y, _), () => ({ drag: a([0, 1, 0, 0]) }));
  var h = ie(f);
  D(h, "height", i), Y(h, "", {}, {
    cursor: "ns-resize",
    stroke: "none",
    fill: "none",
    "pointer-events": "all"
  }), Oe(h, (y, _) => We?.(y, _), () => ({ drag: a([0, 0, 0, 1]) }));
  var p = ie(h);
  D(p, "width", i), D(p, "height", i), Y(p, "", {}, {
    cursor: "nesw-resize",
    stroke: "none",
    fill: "none",
    "pointer-events": "all"
  }), Oe(p, (y, _) => We?.(y, _), () => ({ drag: a([1, 1, 0, 0]) }));
  var d = ie(p);
  D(d, "width", i), D(d, "height", i), Y(d, "", {}, {
    cursor: "nwse-resize",
    stroke: "none",
    fill: "none",
    "pointer-events": "all"
  }), Oe(d, (y, _) => We?.(y, _), () => ({ drag: a([1, 0, 0, 1]) }));
  var v = ie(d);
  D(v, "width", i), D(v, "height", i), Y(v, "", {}, {
    cursor: "nwse-resize",
    stroke: "none",
    fill: "none",
    "pointer-events": "all"
  }), Oe(v, (y, _) => We?.(y, _), () => ({ drag: a([0, 1, 1, 0]) }));
  var g = ie(v);
  D(g, "width", i), D(g, "height", i), Y(g, "", {}, {
    cursor: "nesw-resize",
    stroke: "none",
    fill: "none",
    "pointer-events": "all"
  }), Oe(g, (y, _) => We?.(y, _), () => ({ drag: a([0, 0, 1, 1]) })), ce(o), Ne(
    (y, _, w, x, T, F, S, C, G, N, q, O) => {
      D(l, "x", y), D(l, "width", _), D(l, "y", w), D(l, "height", x), D(s, "x", c(r).x - i / 2), D(s, "y", T), D(s, "height", F), D(u, "x", c(n).x - i / 2), D(u, "y", S), D(u, "height", C), D(f, "x", G), D(f, "width", N), D(f, "y", c(r).y - i / 2), D(h, "x", q), D(h, "width", O), D(h, "y", c(n).y - i / 2), D(p, "x", c(r).x - i / 2), D(p, "y", c(r).y - i / 2), D(d, "x", c(r).x - i / 2), D(d, "y", c(n).y - i / 2), D(v, "x", c(n).x - i / 2), D(v, "y", c(r).y - i / 2), D(g, "x", c(n).x - i / 2), D(g, "y", c(n).y - i / 2);
    },
    [
      () => Math.min(c(r).x, c(n).x),
      () => Math.abs(c(r).x - c(n).x),
      () => Math.min(c(r).y, c(n).y),
      () => Math.abs(c(r).y - c(n).y),
      () => Math.min(c(r).y, c(n).y),
      () => Math.abs(c(r).y - c(n).y),
      () => Math.min(c(r).y, c(n).y),
      () => Math.abs(c(r).y - c(n).y),
      () => Math.min(c(r).x, c(n).x),
      () => Math.abs(c(r).x - c(n).x),
      () => Math.min(c(r).x, c(n).x),
      () => Math.abs(c(r).x - c(n).x)
    ]
  ), ue(e, o), Dt();
}
function Hl(e, t) {
  let r = !1, n, i, a, o = 300, l = 300, s = async (f) => {
    r = !0;
    try {
      await e(f);
    } catch (h) {
      console.error(h);
    }
    if (r = !1, n !== void 0) {
      let h = n;
      n = void 0, u(h);
    }
  }, u = async (f) => {
    if (r) {
      n = f;
      return;
    }
    let h = (/* @__PURE__ */ new Date()).getTime();
    t() && (i = h);
    let p = !0;
    (i == null || h - i < l) && (p = !1), p ? (a && clearTimeout(a), a = setTimeout(() => s(f), o)) : s(f);
  };
  return u;
}
function Ql(e, t) {
  let r = e.x - t.x, n = e.y - t.y;
  return Math.sqrt(r * r + n * n);
}
function Zl(e) {
  return "M " + e.map(({ x: t, y: r }) => `${t},${r}`).join(" L ") + " Z";
}
function No(e) {
  let t = 1 / 0, r = -1 / 0, n = 1 / 0, i = -1 / 0;
  for (let { x: a, y: o } of e)
    t = Math.min(t, a), n = Math.min(n, o), r = Math.max(r, a), i = Math.max(i, o);
  return { xMin: t, yMin: n, xMax: r, yMax: i };
}
async function Kl(e) {
  let t = JSON.stringify(e);
  return es(t);
}
function Rt(e, t) {
  if (e === t)
    return !0;
  if (e === null || t === null || typeof e != "object" || typeof t != "object" || Object.keys(e).length !== Object.keys(t).length)
    return !1;
  for (let r in e)
    if (t.hasOwnProperty(r)) {
      if (!Rt(e[r], t[r]))
        return !1;
    } else
      return !1;
  return !0;
}
function Jl(e, t = 0) {
  let r = 3735928559 ^ t, n = 1103547991 ^ t;
  for (let i = 0; i < e.length; i++) {
    let a = e[i];
    r = Math.imul(r ^ a, 2654435761), n = Math.imul(n ^ a, 1597334677);
  }
  return r = Math.imul(r ^ r >>> 16, 2246822507), r ^= Math.imul(n ^ n >>> 13, 3266489909), n = Math.imul(n ^ n >>> 16, 2246822507), n ^= Math.imul(r ^ r >>> 13, 3266489909), [n >>> 0, r >>> 0];
}
function es(e) {
  let t = new TextEncoder().encode(e), r = Jl(t);
  return r[0].toString(16).padStart(8, "0") + r[1].toString(16).padStart(8, "0");
}
var ts = /* @__PURE__ */ mt("<path></path>");
function rs(e, t) {
  Ft(t, !0);
  let r = /* @__PURE__ */ k(() => t.value.map(({ x: i, y: a }) => t.pointLocation(i, a)));
  var n = ts();
  Y(n, "", {}, { stroke: "#fff", fill: "rgba(128,128,128,0.25)" }), Ne((i) => D(n, "d", i), [() => Zl(c(r))]), ue(e, n), Dt();
}
const ns = {
  marquee: "M7 5a2 2 0 1 1-4 0a2 2 0 0 1 4 0m1-.25c0 .414.336.75.75.75h6.5a.75.75 0 0 0 0-1.5h-6.5a.75.75 0 0 0-.75.75M4.75 8a.75.75 0 0 0-.75.75v6.5a.75.75 0 0 0 1.5 0v-6.5A.75.75 0 0 0 4.75 8m14.5 0a.75.75 0 0 0-.75.75v6.5a.75.75 0 0 0 1.5 0v-6.5a.75.75 0 0 0-.75-.75M8.75 20a.75.75 0 0 1 0-1.5h6.5a.75.75 0 0 1 0 1.5zM5 21a2 2 0 1 0 0-4a2 2 0 0 0 0 4M21 5a2 2 0 1 1-4 0a2 2 0 0 1 4 0m-2 16a2 2 0 1 0 0-4a2 2 0 0 0 0 4",
  lasso: "M9.703 2.265A10 10 0 0 1 12 2c.79 0 1.559.092 2.297.265a.75.75 0 1 1-.343 1.46A8.5 8.5 0 0 0 12 3.5a8.6 8.6 0 0 0-1.954.225a.75.75 0 1 1-.343-1.46m-1.93 1.47a.75.75 0 0 1-.242 1.033a8.55 8.55 0 0 0-2.763 2.763a.75.75 0 1 1-1.275-.79a10.05 10.05 0 0 1 3.248-3.248a.75.75 0 0 1 1.032.243m8.454 0a.75.75 0 0 1 1.032-.242a10.05 10.05 0 0 1 3.248 3.248a.75.75 0 1 1-1.275.79a8.55 8.55 0 0 0-2.763-2.763a.75.75 0 0 1-.242-1.032m-13.06 5.41a.75.75 0 0 1 .558.901A8.5 8.5 0 0 0 3.5 12c0 .673.078 1.327.225 1.954a.75.75 0 1 1-1.46.343A10 10 0 0 1 2 12c0-.79.092-1.559.265-2.297a.75.75 0 0 1 .902-.559m17.666 0a.75.75 0 0 1 .902.558a10.1 10.1 0 0 1 0 4.595a.75.75 0 1 1-1.46-.343a8.54 8.54 0 0 0-.001-3.908a.75.75 0 0 1 .559-.902M3.736 16.226a.75.75 0 0 1 1.032.242a8.55 8.55 0 0 0 2.763 2.763a.75.75 0 0 1-.79 1.275a10.05 10.05 0 0 1-3.248-3.248a.75.75 0 0 1 .243-1.032m16.685.858a.75.75 0 1 0-1.342-.67l-.002.004l-.015.029l-.069.123a8 8 0 0 1-.289.466a9.6 9.6 0 0 1-.965 1.219c-1.17-1.073-2.756-2.006-4.74-2.006c-2.347 0-3.99 1.203-3.99 2.875S10.653 22 13 22c1.942 0 3.495-.75 4.658-1.645a11.7 11.7 0 0 1 1.315 2.01q.05.099.073.149l.017.035l.004.009a.75.75 0 0 0 1.368-.615c-.087-.183 0-.001 0-.001v-.002l-.003-.004l-.007-.015l-.024-.052l-.091-.184a13.2 13.2 0 0 0-1.538-2.337a11 11 0 0 0 1.525-2.032l.09-.162l.024-.047l.007-.014l.002-.005zM13 17.75c1.433 0 2.644.652 3.616 1.512c-.95.7-2.155 1.238-3.616 1.238c-1.973 0-2.49-.922-2.49-1.375s.517-1.375 2.49-1.375"
};
var is = /* @__PURE__ */ mt('<svg width="24" height="24" viewBox="0 0 24 24"><path></path></svg>'), os = /* @__PURE__ */ Pt("<button><!></button>");
function di(e, t) {
  let r = R(t, "active", 3, !1);
  var n = os();
  n.__click = function(...l) {
    t.onClick?.apply(this, l);
  };
  let i;
  var a = ve(n);
  {
    var o = (l) => {
      var s = is();
      Y(s, "", {}, { width: "14px", height: "14px" });
      var u = ve(s);
      Y(u, "", {}, { fill: "currentColor" }), ce(s), Ne(() => D(u, "d", ns[t.icon])), ue(l, s);
    };
    Se(a, (l) => {
      t.icon != null && l(o);
    });
  }
  ce(n), Ne(() => {
    D(n, "title", t.title), i = Y(n, "", i, {
      border: "none",
      appearance: "none",
      background: r() ? "color-mix(in srgb, currentColor 20%, transparent)" : "none",
      "border-radius": "2px",
      height: "16px",
      width: "16px",
      padding: "0",
      margin: "0",
      "font-family": "inherit",
      "font-size": "1em",
      color: "currentColor",
      display: "flex",
      "flex-direction": "row",
      "align-items": "center",
      "justify-content": "center"
    });
  }), ue(e, n);
}
Sl(["click"]);
var as = /* @__PURE__ */ Pt('<div><div> </div> <svg height="6px"><line shape-rendering="crispEdges"></line><line shape-rendering="crispEdges"></line><line shape-rendering="crispEdges"></line></svg></div>');
function ls(e, t) {
  function r(p, d) {
    let v = Math.log10(d * p), g = Math.round(v), y = [0.1, 0.2, 0.5, 1, 2, 5, 10], _ = 0, w = 1e10;
    for (let x of y) {
      let T = Math.abs(Math.log10(x) + g - v);
      T < w && (_ = x, w = T);
    }
    return _ * Math.pow(10, g);
  }
  let n = /* @__PURE__ */ k(() => r(t.distancePerPoint, 30)), i = /* @__PURE__ */ k(() => c(n) / t.distancePerPoint);
  var a = as();
  Y(a, "", {}, { display: "flex", "align-items": "center" });
  var o = ve(a);
  Y(o, "", {}, { "padding-right": "4px" });
  var l = ve(o, !0);
  ce(o);
  var s = ie(o, 2), u = ve(s);
  D(u, "x1", 1), D(u, "y1", 3), D(u, "y2", 3), Y(u, "", {}, {
    stroke: "currentColor",
    "stroke-width": "2",
    "stroke-cap": "butt"
  });
  var f = ie(u);
  D(f, "x1", 1), D(f, "x2", 1), D(f, "y1", 0), D(f, "y2", 6), Y(f, "", {}, { stroke: "currentColor" });
  var h = ie(f);
  D(h, "y1", 0), D(h, "y2", 6), Y(h, "", {}, { stroke: "currentColor" }), ce(s), ce(a), Ne(
    (p) => {
      yr(l, p), D(s, "width", `${c(i) + 2}px`), D(u, "x2", c(i) + 1), D(h, "x1", c(i) + 1), D(h, "x2", c(i) + 1);
    },
    [() => c(n).toLocaleString()]
  ), ue(e, a);
}
var ss = /* @__PURE__ */ Pt("<div> </div>"), us = /* @__PURE__ */ Pt('<a target="_blank" rel="noopener noreferrer"> </a> <div style="border-right: 1px solid currentColor; margin: 4px 2px; opacity: 0.3; width: 0; height: 10px"></div>', 1), fs = /* @__PURE__ */ Pt('<div><div><!></div> <div></div> <div><!> <!> <!> <div style="border-right: 1px solid currentColor; margin: 4px 2px; opacity: 0.3; width: 0; height: 10px"></div> <!> <div style="border-right: 1px solid currentColor; margin: 4px 2px; opacity: 0.3; width: 0; height: 10px"></div> <span> </span></div></div>');
function cs(e, t) {
  Ft(t, !0);
  let r = R(t, "statusMessage", 3, null);
  var n = fs();
  let i;
  var a = ve(n);
  let o;
  var l = ve(a);
  {
    var s = (x) => {
      var T = ss();
      Y(T, "", {}, { display: "inline-block" });
      var F = ve(T, !0);
      ce(T), Ne(() => yr(F, r())), ue(x, T);
    };
    Se(l, (x) => {
      r() != null && x(s);
    });
  }
  ce(a);
  var u = ie(a, 2);
  Y(u, "", {}, { flex: "1 1 0%" });
  var f = ie(u, 2);
  let h;
  var p = ve(f);
  {
    var d = (x) => {
      var T = us(), F = Ht(T);
      Y(F, "", {}, { color: "currentColor", "text-decoration": "underline" });
      var S = ve(F, !0);
      ce(F), Qi(2), Ne(() => {
        D(F, "href", t.resolvedTheme.brandingLink.href), yr(S, t.resolvedTheme.brandingLink.text);
      }), ue(x, T);
    };
    Se(p, (x) => {
      t.resolvedTheme.brandingLink != null && x(d);
    });
  }
  var v = ie(p, 2);
  {
    let x = /* @__PURE__ */ k(() => t.selectionMode == "marquee");
    di(v, {
      icon: "marquee",
      get active() {
        return c(x);
      },
      title: "Toggle rectangle selection mode. In normal mode, use shift + drag for rectangle selection.",
      onClick: () => t.onSelectionMode(t.selectionMode == "marquee" ? "none" : "marquee")
    });
  }
  var g = ie(v, 2);
  {
    let x = /* @__PURE__ */ k(() => t.selectionMode == "lasso");
    di(g, {
      icon: "lasso",
      get active() {
        return c(x);
      },
      title: "Toggle lasso selection mode. In normal mode, use shift + meta + drag for lasso selection.",
      onClick: () => t.onSelectionMode(t.selectionMode == "lasso" ? "none" : "lasso")
    });
  }
  var y = ie(g, 4);
  ls(y, {
    get distancePerPoint() {
      return t.distancePerPoint;
    }
  });
  var _ = ie(y, 4), w = ve(_);
  ce(_), ce(f), ce(n), Ne(
    (x) => {
      i = Y(n, "", i, {
        "font-size": "12px",
        "line-height": "20px",
        height: "20px",
        color: t.resolvedTheme.statusBarTextColor,
        position: "absolute",
        bottom: "0px",
        left: "0px",
        right: "0px",
        "user-select": "none",
        "font-family": t.resolvedTheme.fontFamily,
        display: "flex",
        "flex-direction": "row"
      }), o = Y(a, "", o, {
        flex: "none",
        display: "flex",
        "flex-direction": "row",
        gap: "4px",
        padding: "0px 4px",
        "border-radius": "2px",
        background: t.resolvedTheme.statusBarBackgroundColor
      }), h = Y(f, "", h, {
        flex: "none",
        display: "flex",
        "flex-direction": "row",
        "align-items": "center",
        gap: "4px",
        padding: "0px 4px",
        "border-radius": "2px",
        background: t.resolvedTheme.statusBarBackgroundColor
      }), yr(w, `${x ?? ""} points`);
    },
    [() => t.pointCount.toLocaleString()]
  ), ue(e, n), Dt();
}
function ds(e) {
  return (t, r) => {
    let n = new e(t, r);
    return {
      ...n.update ? { update: n.update.bind(n) } : {},
      ...n.destroy ? { destroy: n.destroy.bind(n) } : {}
    };
  };
}
let ln = /* @__PURE__ */ new WeakMap();
function Lo(e) {
  let t = typeof e == "function" ? e : e.class;
  if (ln.has(t))
    return ln.get(t);
  {
    let r = ds(t);
    return ln.set(t, r), r;
  }
}
function Go(e, t) {
  return typeof e == "function" ? t : { ...e.props ?? {}, ...t };
}
var hs = /* @__PURE__ */ Pt("<div><div></div></div>");
function ps(e, t) {
  Ft(t, !0);
  let r = R(t, "margin", 3, 4), n, i, a = /* @__PURE__ */ k(() => Lo(t.customTooltip)), o = /* @__PURE__ */ k(() => Go(t.customTooltip, { tooltip: t.tooltip }));
  Ln(() => {
    gr(() => {
      let u = c(a), f = null;
      return gr(() => {
        i.style.left = "0px", i.style.top = "0px", i.style.pointerEvents = t.allowInteraction ? "all" : "none", f == null ? f = u(i, c(o)) : f.update?.(c(o));
        function h(y, _, w, x) {
          let T = t.location.x, F = t.location.y, S = 2, C = y / 2, G = _ + (t.targetHeight + r());
          T - C < w && (C = T - w), T - C > x - y && (C = T - x + y), F - G < S && (G = -(t.targetHeight + r())), i.style.left = T - C + "px", i.style.top = F - G + "px";
        }
        let p = n.getBoundingClientRect(), { width: d, height: v } = i.getBoundingClientRect();
        h(d, v, 2, p.width - 2);
        let g = requestAnimationFrame(() => {
          g = null;
          let y = i.getBoundingClientRect();
          (y.width != d || y.height != v) && h(y.width, y.height, 2, p.width - 2);
        });
        return () => {
          g != null && cancelAnimationFrame(g);
        };
      }), () => {
        f?.destroy?.(), i.replaceChildren();
      };
    });
  });
  var l = hs();
  Y(l, "", {}, { position: "absolute", width: "100%" });
  var s = ve(l);
  Y(s, "", {}, {
    display: "flex",
    position: "absolute",
    width: "fit-content",
    height: "fit-content",
    "z-index": "100"
  }), xn(s, (u) => i = u, () => i), ce(l), xn(l, (u) => n = u, () => n), ue(e, l), Dt();
}
function Gn(e, t, r) {
  e.prototype = t.prototype = r, r.constructor = e;
}
function zo(e, t) {
  var r = Object.create(e.prototype);
  for (var n in t) r[n] = t[n];
  return r;
}
function Rr() {
}
var _r = 0.7, Lr = 1 / _r, er = "\\s*([+-]?\\d+)\\s*", br = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", Ze = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", vs = /^#([0-9a-f]{3,8})$/, gs = new RegExp(`^rgb\\(${er},${er},${er}\\)$`), ys = new RegExp(`^rgb\\(${Ze},${Ze},${Ze}\\)$`), ms = new RegExp(`^rgba\\(${er},${er},${er},${br}\\)$`), xs = new RegExp(`^rgba\\(${Ze},${Ze},${Ze},${br}\\)$`), _s = new RegExp(`^hsl\\(${br},${Ze},${Ze}\\)$`), bs = new RegExp(`^hsla\\(${br},${Ze},${Ze},${br}\\)$`), hi = {
  aliceblue: 15792383,
  antiquewhite: 16444375,
  aqua: 65535,
  aquamarine: 8388564,
  azure: 15794175,
  beige: 16119260,
  bisque: 16770244,
  black: 0,
  blanchedalmond: 16772045,
  blue: 255,
  blueviolet: 9055202,
  brown: 10824234,
  burlywood: 14596231,
  cadetblue: 6266528,
  chartreuse: 8388352,
  chocolate: 13789470,
  coral: 16744272,
  cornflowerblue: 6591981,
  cornsilk: 16775388,
  crimson: 14423100,
  cyan: 65535,
  darkblue: 139,
  darkcyan: 35723,
  darkgoldenrod: 12092939,
  darkgray: 11119017,
  darkgreen: 25600,
  darkgrey: 11119017,
  darkkhaki: 12433259,
  darkmagenta: 9109643,
  darkolivegreen: 5597999,
  darkorange: 16747520,
  darkorchid: 10040012,
  darkred: 9109504,
  darksalmon: 15308410,
  darkseagreen: 9419919,
  darkslateblue: 4734347,
  darkslategray: 3100495,
  darkslategrey: 3100495,
  darkturquoise: 52945,
  darkviolet: 9699539,
  deeppink: 16716947,
  deepskyblue: 49151,
  dimgray: 6908265,
  dimgrey: 6908265,
  dodgerblue: 2003199,
  firebrick: 11674146,
  floralwhite: 16775920,
  forestgreen: 2263842,
  fuchsia: 16711935,
  gainsboro: 14474460,
  ghostwhite: 16316671,
  gold: 16766720,
  goldenrod: 14329120,
  gray: 8421504,
  green: 32768,
  greenyellow: 11403055,
  grey: 8421504,
  honeydew: 15794160,
  hotpink: 16738740,
  indianred: 13458524,
  indigo: 4915330,
  ivory: 16777200,
  khaki: 15787660,
  lavender: 15132410,
  lavenderblush: 16773365,
  lawngreen: 8190976,
  lemonchiffon: 16775885,
  lightblue: 11393254,
  lightcoral: 15761536,
  lightcyan: 14745599,
  lightgoldenrodyellow: 16448210,
  lightgray: 13882323,
  lightgreen: 9498256,
  lightgrey: 13882323,
  lightpink: 16758465,
  lightsalmon: 16752762,
  lightseagreen: 2142890,
  lightskyblue: 8900346,
  lightslategray: 7833753,
  lightslategrey: 7833753,
  lightsteelblue: 11584734,
  lightyellow: 16777184,
  lime: 65280,
  limegreen: 3329330,
  linen: 16445670,
  magenta: 16711935,
  maroon: 8388608,
  mediumaquamarine: 6737322,
  mediumblue: 205,
  mediumorchid: 12211667,
  mediumpurple: 9662683,
  mediumseagreen: 3978097,
  mediumslateblue: 8087790,
  mediumspringgreen: 64154,
  mediumturquoise: 4772300,
  mediumvioletred: 13047173,
  midnightblue: 1644912,
  mintcream: 16121850,
  mistyrose: 16770273,
  moccasin: 16770229,
  navajowhite: 16768685,
  navy: 128,
  oldlace: 16643558,
  olive: 8421376,
  olivedrab: 7048739,
  orange: 16753920,
  orangered: 16729344,
  orchid: 14315734,
  palegoldenrod: 15657130,
  palegreen: 10025880,
  paleturquoise: 11529966,
  palevioletred: 14381203,
  papayawhip: 16773077,
  peachpuff: 16767673,
  peru: 13468991,
  pink: 16761035,
  plum: 14524637,
  powderblue: 11591910,
  purple: 8388736,
  rebeccapurple: 6697881,
  red: 16711680,
  rosybrown: 12357519,
  royalblue: 4286945,
  saddlebrown: 9127187,
  salmon: 16416882,
  sandybrown: 16032864,
  seagreen: 3050327,
  seashell: 16774638,
  sienna: 10506797,
  silver: 12632256,
  skyblue: 8900331,
  slateblue: 6970061,
  slategray: 7372944,
  slategrey: 7372944,
  snow: 16775930,
  springgreen: 65407,
  steelblue: 4620980,
  tan: 13808780,
  teal: 32896,
  thistle: 14204888,
  tomato: 16737095,
  turquoise: 4251856,
  violet: 15631086,
  wheat: 16113331,
  white: 16777215,
  whitesmoke: 16119285,
  yellow: 16776960,
  yellowgreen: 10145074
};
Gn(Rr, zn, {
  copy(e) {
    return Object.assign(new this.constructor(), this, e);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: pi,
  // Deprecated! Use color.formatHex.
  formatHex: pi,
  formatHex8: ws,
  formatHsl: As,
  formatRgb: vi,
  toString: vi
});
function pi() {
  return this.rgb().formatHex();
}
function ws() {
  return this.rgb().formatHex8();
}
function As() {
  return Oo(this).formatHsl();
}
function vi() {
  return this.rgb().formatRgb();
}
function zn(e) {
  var t, r;
  return e = (e + "").trim().toLowerCase(), (t = vs.exec(e)) ? (r = t[1].length, t = parseInt(t[1], 16), r === 6 ? gi(t) : r === 3 ? new De(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : r === 8 ? Fr(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : r === 4 ? Fr(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = gs.exec(e)) ? new De(t[1], t[2], t[3], 1) : (t = ys.exec(e)) ? new De(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = ms.exec(e)) ? Fr(t[1], t[2], t[3], t[4]) : (t = xs.exec(e)) ? Fr(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = _s.exec(e)) ? xi(t[1], t[2] / 100, t[3] / 100, 1) : (t = bs.exec(e)) ? xi(t[1], t[2] / 100, t[3] / 100, t[4]) : hi.hasOwnProperty(e) ? gi(hi[e]) : e === "transparent" ? new De(NaN, NaN, NaN, 0) : null;
}
function gi(e) {
  return new De(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function Fr(e, t, r, n) {
  return n <= 0 && (e = t = r = NaN), new De(e, t, r, n);
}
function Rs(e) {
  return e instanceof Rr || (e = zn(e)), e ? (e = e.rgb(), new De(e.r, e.g, e.b, e.opacity)) : new De();
}
function Io(e, t, r, n) {
  return arguments.length === 1 ? Rs(e) : new De(e, t, r, n ?? 1);
}
function De(e, t, r, n) {
  this.r = +e, this.g = +t, this.b = +r, this.opacity = +n;
}
Gn(De, Io, zo(Rr, {
  brighter(e) {
    return e = e == null ? Lr : Math.pow(Lr, e), new De(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? _r : Math.pow(_r, e), new De(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new De(It(this.r), It(this.g), It(this.b), Gr(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: yi,
  // Deprecated! Use color.formatHex.
  formatHex: yi,
  formatHex8: Ts,
  formatRgb: mi,
  toString: mi
}));
function yi() {
  return `#${Lt(this.r)}${Lt(this.g)}${Lt(this.b)}`;
}
function Ts() {
  return `#${Lt(this.r)}${Lt(this.g)}${Lt(this.b)}${Lt((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function mi() {
  const e = Gr(this.opacity);
  return `${e === 1 ? "rgb(" : "rgba("}${It(this.r)}, ${It(this.g)}, ${It(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function Gr(e) {
  return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function It(e) {
  return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function Lt(e) {
  return e = It(e), (e < 16 ? "0" : "") + e.toString(16);
}
function xi(e, t, r, n) {
  return n <= 0 ? e = t = r = NaN : r <= 0 || r >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new Xe(e, t, r, n);
}
function Oo(e) {
  if (e instanceof Xe) return new Xe(e.h, e.s, e.l, e.opacity);
  if (e instanceof Rr || (e = zn(e)), !e) return new Xe();
  if (e instanceof Xe) return e;
  e = e.rgb();
  var t = e.r / 255, r = e.g / 255, n = e.b / 255, i = Math.min(t, r, n), a = Math.max(t, r, n), o = NaN, l = a - i, s = (a + i) / 2;
  return l ? (t === a ? o = (r - n) / l + (r < n) * 6 : r === a ? o = (n - t) / l + 2 : o = (t - r) / l + 4, l /= s < 0.5 ? a + i : 2 - a - i, o *= 60) : l = s > 0 && s < 1 ? 0 : o, new Xe(o, l, s, e.opacity);
}
function Es(e, t, r, n) {
  return arguments.length === 1 ? Oo(e) : new Xe(e, t, r, n ?? 1);
}
function Xe(e, t, r, n) {
  this.h = +e, this.s = +t, this.l = +r, this.opacity = +n;
}
Gn(Xe, Es, zo(Rr, {
  brighter(e) {
    return e = e == null ? Lr : Math.pow(Lr, e), new Xe(this.h, this.s, this.l * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? _r : Math.pow(_r, e), new Xe(this.h, this.s, this.l * e, this.opacity);
  },
  rgb() {
    var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, r = this.l, n = r + (r < 0.5 ? r : 1 - r) * t, i = 2 * r - n;
    return new De(
      sn(e >= 240 ? e - 240 : e + 120, i, n),
      sn(e, i, n),
      sn(e < 120 ? e + 240 : e - 120, i, n),
      this.opacity
    );
  },
  clamp() {
    return new Xe(_i(this.h), Dr(this.s), Dr(this.l), Gr(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const e = Gr(this.opacity);
    return `${e === 1 ? "hsl(" : "hsla("}${_i(this.h)}, ${Dr(this.s) * 100}%, ${Dr(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
  }
}));
function _i(e) {
  return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function Dr(e) {
  return Math.max(0, Math.min(1, e || 0));
}
function sn(e, t, r) {
  return (e < 60 ? t + (r - t) * e / 60 : e < 180 ? r : e < 240 ? t + (r - t) * (240 - e) / 60 : t) * 255;
}
const bi = [
  "#1f77b4",
  "#ff7f0e",
  "#2ca02c",
  "#d62728",
  "#9467bd",
  "#8c564b",
  "#e377c2",
  "#7f7f7f",
  "#bcbd22",
  "#17becf"
], Pr = [
  "#1f77b4",
  "#aec7e8",
  "#ff7f0e",
  "#ffbb78",
  "#2ca02c",
  "#98df8a",
  "#d62728",
  "#ff9896",
  "#9467bd",
  "#c5b0d5",
  "#8c564b",
  "#c49c94",
  "#e377c2",
  "#f7b6d2",
  "#7f7f7f",
  "#c7c7c7",
  "#bcbd22",
  "#dbdb8d",
  "#17becf",
  "#9edae5"
];
function jr(e) {
  if (e < 1 && (e = 1), e <= bi.length)
    return bi.slice(0, e);
  if (e <= Pr.length)
    return Pr.slice(0, e);
  {
    let t = [];
    for (let r = 0; r < e; r++)
      t[r] = Pr[r % Pr.length];
    return t;
  }
}
function In(e) {
  let { r: t, g: r, b: n, opacity: i } = Io(e);
  return { r: t / 255, g: r / 255, b: n / 255, a: i };
}
function $o() {
  return [1, 0, 0, 0, 1, 0, 0, 0, 1];
}
function On(e, t) {
  return [
    e[0] * t[0] + e[3] * t[1] + e[6] * t[2],
    e[1] * t[0] + e[4] * t[1] + e[7] * t[2],
    e[2] * t[0] + e[5] * t[1] + e[8] * t[2],
    e[0] * t[3] + e[3] * t[4] + e[6] * t[5],
    e[1] * t[3] + e[4] * t[4] + e[7] * t[5],
    e[2] * t[3] + e[5] * t[4] + e[8] * t[5],
    e[0] * t[6] + e[3] * t[7] + e[6] * t[8],
    e[1] * t[6] + e[4] * t[7] + e[7] * t[8],
    e[2] * t[6] + e[5] * t[7] + e[8] * t[8]
  ];
}
function qo(e, t) {
  return [
    t[0] * e[0] + t[3] * e[1] + t[6] * e[2],
    t[1] * e[0] + t[4] * e[1] + t[7] * e[2],
    t[2] * e[0] + t[5] * e[1] + t[8] * e[2]
  ];
}
function Ms(e) {
  return e[0] * e[4] * e[8] - e[0] * e[5] * e[7] - e[1] * e[3] * e[8] + e[1] * e[5] * e[6] + e[2] * e[3] * e[7] - e[2] * e[4] * e[6];
}
function Vo(e) {
  let t = Ms(e);
  return [
    (e[4] * e[8] - e[5] * e[7]) / t,
    (e[2] * e[7] - e[1] * e[8]) / t,
    (e[1] * e[5] - e[2] * e[4]) / t,
    (e[5] * e[6] - e[3] * e[8]) / t,
    (e[0] * e[8] - e[2] * e[6]) / t,
    (e[2] * e[3] - e[0] * e[5]) / t,
    (e[3] * e[7] - e[4] * e[6]) / t,
    (e[1] * e[6] - e[0] * e[7]) / t,
    (e[0] * e[4] - e[1] * e[3]) / t
  ];
}
class zr {
  viewport;
  width;
  height;
  _matrix = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  _pixel_kx = 0;
  _pixel_bx = 0;
  _pixel_ky = 0;
  _pixel_by = 0;
  constructor(t, r, n) {
    this.viewport = t, this.width = r, this.height = n, this.updateCoefficients();
  }
  update(t, r, n) {
    this.viewport = t, this.width = r, this.height = n, this.updateCoefficients();
  }
  updateCoefficients() {
    let { x: t, y: r, scale: n } = this.viewport, i = n, a = n;
    this.width < this.height ? i *= this.height / this.width : a *= this.width / this.height, this._matrix = [i, 0, 0, 0, a, 0, -t * i, -r * a, 1], this._pixel_kx = this._matrix[0] * this.width / 2, this._pixel_bx = (this._matrix[6] + 1) * this.width / 2, this._pixel_ky = -this._matrix[4] * this.height / 2, this._pixel_by = (-this._matrix[7] + 1) * this.height / 2;
  }
  matrix() {
    return this._matrix;
  }
  scale() {
    return Math.abs(this._pixel_kx);
  }
  pixelLocation(t, r) {
    return { x: t * this._pixel_kx + this._pixel_bx, y: r * this._pixel_ky + this._pixel_by };
  }
  coordinateAtPixel(t, r) {
    return { x: (t - this._pixel_bx) / this._pixel_kx, y: (r - this._pixel_by) / this._pixel_ky };
  }
  pixelLocationFunction() {
    let t = this._pixel_kx, r = this._pixel_ky, n = this._pixel_bx, i = this._pixel_by;
    return (a, o) => ({ x: a * t + n, y: o * r + i });
  }
  coordinateAtPixelFunction() {
    let t = this._pixel_kx, r = this._pixel_ky, n = this._pixel_bx, i = this._pixel_by;
    return (a, o) => ({ x: (a - n) / t, y: (o - i) / r });
  }
}
class _n {
  _needsRun = !0;
  _inputs = /* @__PURE__ */ new Set();
  _targets = /* @__PURE__ */ new Set();
  constructor(t = []) {
    this._inputs = new Set(t);
    for (let r of this._inputs)
      r._targets.add(this);
  }
  addInput(t) {
    this._inputs.add(t), t._targets.add(this);
  }
  removeInput(t) {
    t._targets.delete(this), this._inputs.delete(t);
  }
  run() {
    if (this._needsRun) {
      for (let t of this._inputs)
        t.run();
      this.update(), this._needsRun = !1;
    }
  }
  setNeedsRunDownstream() {
    for (let t of this._targets)
      t._needsRun || (t._needsRun = !0, t.setNeedsRunDownstream());
  }
  update() {
  }
  destroy() {
    for (let t of this._inputs)
      t._targets.delete(this);
  }
}
let ur = class extends _n {
  _value = null;
  setValue(e) {
    this._value !== e && (this._value = e, this.setNeedsRunDownstream());
  }
  get value() {
    return this.run(), this._value;
  }
};
class Xo extends ur {
  constructor(t) {
    super([]), this.setValue(t);
  }
  get value() {
    return super.value;
  }
  set value(t) {
    this.setValue(t);
  }
}
class Ss extends ur {
  fn;
  constructor(t, r) {
    super(r), this.fn = t;
  }
  update() {
    this.setValue(this.fn());
  }
}
class Fs extends ur {
  fn;
  state;
  constructor(t, r) {
    super(r), this.fn = t, this.state = {};
  }
  update() {
    this.setValue(this.fn(this.state));
  }
  destroy() {
    super.destroy(), this.state.destroy && this.state.destroy(), this.state = {};
  }
}
class Ds extends ur {
  parent;
  condition;
  buildTrue;
  buildFalse;
  context = null;
  currentCondition = null;
  currentNode = null;
  constructor(t, r, n, i) {
    super([r]), this.parent = t, this.condition = r, this.buildTrue = n, this.buildFalse = i;
  }
  update() {
    (this.currentNode == null || this.currentCondition !== this.condition.value) && (this.currentNode && this.removeInput(this.currentNode), this.context?.destroy(), this.context = new Yt(this.parent), this.currentCondition = this.condition.value, this.currentCondition ? this.currentNode = this.buildTrue(this.context) : this.currentNode = this.buildFalse(this.context), this.addInput(this.currentNode)), this.setValue(this.currentNode.value);
  }
  destroy() {
    super.destroy(), this.context?.destroy();
  }
}
class Ps extends ur {
  parent;
  input;
  build;
  cache;
  constructor(t, r, n) {
    super([r]), this.parent = t, this.input = r, this.build = n, this.cache = /* @__PURE__ */ new Map();
  }
  update() {
    let t = /* @__PURE__ */ new Set(), r = this.input.value.map((n) => {
      if (t.add(n), this.cache.has(n)) {
        let i = this.cache.get(n);
        return i.input.value = n, i.output.value;
      } else {
        let i = new Yt(this.parent), a = new Xo(n), o = this.build(i, a);
        return this.cache.set(n, { context: i, input: a, output: o }), this.addInput(o), o.value;
      }
    });
    for (let [n, i] of this.cache)
      t.has(n) || (this.cache.delete(n), this.removeInput(i.output), i.context.destroy());
    this.setValue(r);
  }
  destroy() {
    super.destroy();
    for (let t of this.cache.values())
      t.context.destroy();
  }
}
class Bs extends ur {
  parent;
  input;
  cases;
  currentCase = null;
  currentNode = null;
  currentContext = null;
  constructor(t, r, n) {
    super([r]), this.parent = t, this.input = r, this.cases = n;
  }
  update() {
    (this.currentNode == null || this.input.value !== this.currentCase) && (this.currentNode && this.removeInput(this.currentNode), this.currentContext?.destroy(), this.currentContext = new Yt(this.parent), this.currentCase = this.input.value, this.currentNode = this.cases[this.currentCase](this.currentContext), this.addInput(this.currentNode)), this.setValue(this.currentNode.value);
  }
  destroy() {
    super.destroy(), this.currentContext?.destroy();
  }
}
class Yt {
  _children;
  _nodes;
  /** Creates a new dataflow context. */
  constructor(t = null) {
    this._children = /* @__PURE__ */ new Set(), this._nodes = /* @__PURE__ */ new Set(), t?._children.add(this);
  }
  /** Destroy the dataflow and all associated states. */
  destroy() {
    for (let t of this._children)
      t.destroy();
    for (let t of this._nodes)
      t.destroy();
    this._children.clear(), this._nodes.clear();
  }
  /** Creates a value node. */
  value(t) {
    let r = new Xo(t);
    return this._nodes.add(r), r;
  }
  /** Creates a derived value. */
  derive(t, r) {
    let n = t.map((a) => a instanceof _n ? a : this.value(a)), i = new Ss(() => r(...n.map((a) => a.value)), n);
    return this._nodes.add(i), i;
  }
  /** Creates a stateful derived value. */
  statefulDerive(t, r) {
    let n = t.map((a) => a instanceof _n ? a : this.value(a)), i = new Fs((a) => r(a, ...n.map((o) => o.value)), n);
    return this._nodes.add(i), i;
  }
  /** Creates a true or false dataflow depending on the value of the condition. */
  if(t, r, n) {
    let i = new Ds(this, t, r, n);
    return this._nodes.add(i), i;
  }
  switch(t, r) {
    let n = new Bs(this, t, r);
    return this._nodes.add(n), n;
  }
  map(t, r) {
    let n = new Ps(this, t, r);
    return this._nodes.add(n), n;
  }
  assertNotNull(t) {
    return t;
  }
  subgraph() {
    return new Yt(this);
  }
}
function tt(e, t, r, n) {
  if (e.program == null || e.vsSource != r || e.fsSource != n) {
    e.destroy && e.destroy();
    let a = wi(t, t.VERTEX_SHADER, r), o = wi(t, t.FRAGMENT_SHADER, n), l = t.createProgram();
    if (t.attachShader(l, a), t.attachShader(l, o), t.linkProgram(l), !t.getProgramParameter(l, t.LINK_STATUS)) {
      var i = t.getProgramInfoLog(l);
      throw new Error(`failed to link program: ${i}, vertex source: ${r}, fragment source: ${n}`);
    }
    e.program = l, e.vsSource = r, e.fsSource = n, e.destroy = () => {
      t.deleteProgram(l), t.deleteShader(a), t.deleteShader(o);
    }, e.uniforms = {};
    for (let s of (r + n).matchAll(/uniform +[0-9a-zA-Z_]+ +([0-9a-zA-Z_]+) *(;|\[)/g)) {
      let u = s[1];
      e.uniforms[u] = t.getUniformLocation(l, u);
    }
  }
  return { program: e.program, uniforms: e.uniforms ?? {} };
}
function wi(e, t, r) {
  let n = e.createShader(t);
  if (e.shaderSource(n, r), e.compileShader(n), !e.getShaderParameter(n, e.COMPILE_STATUS)) {
    var i = e.getShaderInfoLog(n);
    throw new Error(`failed to compile shader: ${i}, source: ${r}`);
  }
  return n;
}
function Ke(e, t, r, n) {
  if (e.buffer == null) {
    let i = t.createBuffer();
    e.buffer = i, e.destroy = () => {
      t.deleteBuffer(i);
    };
  }
  if (e.data !== r) {
    if (e.data = r, t.bindBuffer(t.ARRAY_BUFFER, e.buffer), r instanceof Array)
      switch (n ?? "f32") {
        case "f32":
          t.bufferData(t.ARRAY_BUFFER, new Float32Array(r), t.STATIC_DRAW);
          break;
        case "i32":
          t.bufferData(t.ARRAY_BUFFER, new Int32Array(r), t.STATIC_DRAW);
          break;
        case "u32":
          t.bufferData(t.ARRAY_BUFFER, new Uint32Array(r), t.STATIC_DRAW);
          break;
        case "i16":
          t.bufferData(t.ARRAY_BUFFER, new Int16Array(r), t.STATIC_DRAW);
          break;
        case "u16":
          t.bufferData(t.ARRAY_BUFFER, new Uint16Array(r), t.STATIC_DRAW);
          break;
        case "i8":
          t.bufferData(t.ARRAY_BUFFER, new Int8Array(r), t.STATIC_DRAW);
          break;
        case "u8":
          t.bufferData(t.ARRAY_BUFFER, new Uint8Array(r), t.STATIC_DRAW);
          break;
        default:
          throw new Error("invalid type");
      }
    else
      t.bufferData(t.ARRAY_BUFFER, r, t.STATIC_DRAW);
    t.bindBuffer(t.ARRAY_BUFFER, null);
  }
  return e.buffer;
}
function Cs(e, t, r, n, i) {
  const a = {
    u8: {
      1: [e.R8, e.RED, e.UNSIGNED_BYTE],
      2: [e.RG8, e.RG, e.UNSIGNED_BYTE],
      3: [e.RGB8, e.RGB, e.UNSIGNED_BYTE],
      4: [e.RGBA8, e.RGBA, e.UNSIGNED_BYTE]
    },
    u16: {
      1: [e.R8, e.RED, e.UNSIGNED_SHORT],
      2: [e.RG8, e.RG, e.UNSIGNED_SHORT],
      3: [e.RGB8, e.RGB, e.UNSIGNED_SHORT],
      4: [e.RGBA8, e.RGBA, e.UNSIGNED_SHORT]
    },
    u32: {
      1: [e.R8, e.RED, e.UNSIGNED_INT],
      2: [e.RG8, e.RG, e.UNSIGNED_INT],
      3: [e.RGB8, e.RGB, e.UNSIGNED_INT],
      4: [e.RGBA8, e.RGBA, e.UNSIGNED_INT]
    },
    f32: {
      1: [e.R32F, e.RED, e.FLOAT],
      2: [e.RG32F, e.RG, e.FLOAT],
      3: [e.RGB32F, e.RGB, e.FLOAT],
      4: [e.RGBA32F, e.RGBA, e.FLOAT]
    }
  };
  let [o, l, s] = a[i][n];
  e.texImage2D(e.TEXTURE_2D, 0, o, t, r, 0, l, s, null), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.CLAMP_TO_EDGE), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.CLAMP_TO_EDGE);
}
function Tt(e, t, r, n, i, a) {
  if (e.framebuffer == null || e.texture == null) {
    let l = t.createFramebuffer(), s = t.createTexture();
    t.bindFramebuffer(t.FRAMEBUFFER, l), t.bindTexture(t.TEXTURE_2D, s), t.framebufferTexture2D(t.FRAMEBUFFER, t.COLOR_ATTACHMENT0, t.TEXTURE_2D, s, 0), t.bindTexture(t.TEXTURE_2D, null), t.bindFramebuffer(t.FRAMEBUFFER, null), e.framebuffer = l, e.texture = s, e.destroy = () => {
      t.deleteFramebuffer(l), t.deleteTexture(s);
    };
  }
  let o = `${r},${n},${i},${a}`;
  return e.cacheKey != o && (e.cacheKey = o, t.bindTexture(t.TEXTURE_2D, e.texture), Cs(t, r, n, i, a), t.bindTexture(t.TEXTURE_2D, null)), {
    framebuffer: e.framebuffer,
    texture: e.texture,
    width: r,
    height: n
  };
}
function Us(e) {
  let t = e.squareMaxSize, r = e.samples, n = `#version 300 es
    precision highp float;
    layout(location=0) in vec2 xy;
    out vec2 uv;
    void main() {
      gl_Position = vec4(xy, 0, 1);
      uv = (xy + 1.0) / 2.0;
    }
  `, i = `#version 300 es
    precision highp float;
    uniform sampler2D image;
    uniform vec2 resolution;
    uniform vec2 direction;
    in vec2 uv;
    out vec4 outColor;
    void main() {
      vec4 color = vec4(0.0);
      const int count = ${t};
      int i = -count;
      while(i + 1 <= count) {
        color += texture(image, uv + direction * (float(i) + 0.5) / resolution) * 2.0;
        i += 2;
      }
      if (i <= count) {
        color += texture(image, uv + direction * float(count) / resolution);
      }
      outColor = color;
    }
  `, a = `#version 300 es
    precision highp float;
    uniform sampler2D image;
    uniform sampler2D imageBox;
    uniform vec2 resolution;
    uniform float scaler;
    in vec2 uv;
    out vec4 outColor;

    void main() {
      vec4 color = texture(imageBox, uv);
      if (color != vec4(0.0)) {
        ${r.map(({ x: o, y: l, w: s }) => `color -= texture(image, uv + vec2(${o.toFixed(8)}, ${l.toFixed(8)}) / resolution) * (${s.toFixed(8)})`).join(";")};
      }
      outColor = color * scaler;
    }
  `;
  return { vertex: n, fragment1: i, fragment2: a };
}
function ks(e, t, r) {
  let n = e.derive([r], Ns), i = e.derive([n], Us), a = e.statefulDerive(
    [t, e.derive([i], (s) => s.vertex), e.derive([i], (s) => s.fragment1)],
    tt
  ), o = e.statefulDerive(
    [t, e.derive([i], (s) => s.vertex), e.derive([i], (s) => s.fragment2)],
    tt
  ), l = e.statefulDerive([t, [-1, -1, -1, 1, 1, -1, 1, 1], "f32"], Ke);
  return e.derive(
    [t, l, a, o, r, n],
    (s, u, f, h, p, d) => (v, g, y) => {
      let { width: _, height: w } = g;
      s.disable(s.BLEND), s.enableVertexAttribArray(0), s.bindBuffer(s.ARRAY_BUFFER, u), s.vertexAttribPointer(0, 2, s.FLOAT, !1, 0, 0), s.bindBuffer(s.ARRAY_BUFFER, null), s.useProgram(f.program), s.uniform2f(f.uniforms.resolution, _, w), s.uniform1i(f.uniforms.image, 0), s.bindFramebuffer(s.FRAMEBUFFER, g.framebuffer), s.bindTexture(s.TEXTURE_2D, v), s.uniform2f(f.uniforms.direction, 0, 1), s.drawArrays(s.TRIANGLE_STRIP, 0, 4), s.bindFramebuffer(s.FRAMEBUFFER, y.framebuffer), s.bindTexture(s.TEXTURE_2D, g.texture), s.uniform2f(f.uniforms.direction, 1, 0), s.drawArrays(s.TRIANGLE_STRIP, 0, 4), s.bindFramebuffer(s.FRAMEBUFFER, g.framebuffer), s.activeTexture(s.TEXTURE1), s.bindTexture(s.TEXTURE_2D, y.texture), s.activeTexture(s.TEXTURE0), s.bindTexture(s.TEXTURE_2D, v), s.useProgram(h.program), s.uniform2f(h.uniforms.resolution, _, w), s.uniform1i(h.uniforms.image, 0), s.uniform1i(h.uniforms.imageBox, 1);
      let x = 1 / d.totalWeight * p * p * Math.PI;
      s.uniform1f(h.uniforms.scaler, x), s.drawArrays(s.TRIANGLE_STRIP, 0, 4), s.bindFramebuffer(s.FRAMEBUFFER, null), s.useProgram(null), s.activeTexture(s.TEXTURE1), s.bindTexture(s.TEXTURE_2D, null), s.activeTexture(s.TEXTURE0), s.bindTexture(s.TEXTURE_2D, null), s.disableVertexAttribArray(0);
    }
  );
}
function Ai(e, t, r) {
  let n = Math.sqrt(t * t + r * r);
  if (n < e - Math.sqrt(2) / 2)
    return 1;
  if (n > e + Math.sqrt(2) / 2)
    return 0;
  let i = 2, a = 0;
  for (let o = 0; o < i; o++)
    for (let l = 0; l < i; l++) {
      let s = t + (o + 0.5) / i - 0.5, u = r + (l + 0.5) / i - 0.5;
      Math.sqrt(s * s + u * u) < e && (a += 1);
    }
  return a / i / i;
}
function Ns(e) {
  let t = Math.floor(e + 0.5), r = t, n = Ai(e, 0, 0), i = [];
  for (let l = -t; l <= t; l++)
    for (let s = -t; s <= t; s++) {
      let u = n - Ai(e, l, s);
      if (!(u <= 0))
        if (i.length > 0 && l == i[i.length - 1].x && s == i[i.length - 1].y + 1) {
          let f = i[i.length - 1].w, h = u;
          i[i.length - 1].y += 1 - f / (f + h), i[i.length - 1].w = f + h;
        } else
          i.push({ x: l, y: s, w: u });
    }
  i = i.sort((l, s) => l.y != s.y ? l.y - s.y : l.x - s.x);
  let a = [];
  for (let { x: l, y: s, w: u } of i)
    if (a.length > 0 && s == a[a.length - 1].y && l == a[a.length - 1].x + 1) {
      let f = a[a.length - 1].w, h = u;
      a[a.length - 1].x += 1 - f / (f + h), a[a.length - 1].w = f + h;
    } else
      a.push({ x: l, y: s, w: u });
  let o = -a.reduce((l, s) => l + s.w, 0);
  return o += n * (1 + r * 2) * (1 + r * 2), { squareMaxSize: r, squareWeight: n, samples: a, totalWeight: o };
}
function Ls(e) {
  let t;
  return e ? t = `#version 300 es
      precision highp float;
      uniform mat3 matrix;
      layout(location=0) in float x;
      layout(location=1) in float y;
      layout(location=2) in int category;
      out vec4 color;
      void main() {
        gl_Position = vec4(matrix * vec3(x, y, 1), 1);
        if (category == 0) {
          color = vec4(1, 0, 0, 0);
        } else if (category == 1) {
          color = vec4(0, 1, 0, 0);
        } else if (category == 2) {
          color = vec4(0, 0, 1, 0);
        } else if (category == 3) {
          color = vec4(0, 0, 0, 1);
        }
        gl_PointSize = 1.0;
      }
    ` : t = `#version 300 es
      precision highp float;
      uniform mat3 matrix;
      layout(location=0) in float x;
      layout(location=1) in float y;
      out vec4 color;
      void main() {
        gl_Position = vec4(matrix * vec3(x, y, 1), 1);
        color = vec4(1, 0, 0, 0);
        gl_PointSize = 1.0;
      }
    `, { vertex: t, fragment: `#version 300 es
    precision highp float;
    in vec4 color;
    out vec4 outColor;
    void main() {
      outColor = color;
    }
  ` };
}
function bn(e, t, r, n, i, a) {
  let o = i != null, l = Ls(o), s = e.statefulDerive([t, l.vertex, l.fragment], tt);
  return e.derive([t, s, r, n, i, a], (u, f, h, p, d, v) => (g) => {
    u.enable(u.BLEND), u.blendFunc(u.ONE, u.ONE), u.useProgram(f.program), u.enableVertexAttribArray(0), u.bindBuffer(u.ARRAY_BUFFER, h), u.vertexAttribPointer(0, 1, u.FLOAT, !1, 0, 0), u.enableVertexAttribArray(1), u.bindBuffer(u.ARRAY_BUFFER, p), u.vertexAttribPointer(1, 1, u.FLOAT, !1, 0, 0), d != null && (u.enableVertexAttribArray(2), u.bindBuffer(u.ARRAY_BUFFER, d), u.vertexAttribIPointer(2, 1, u.BYTE, 0, 0)), u.bindBuffer(u.ARRAY_BUFFER, null), u.uniformMatrix3fv(f.uniforms.matrix, !1, g), u.drawArrays(u.POINTS, 0, v), u.disableVertexAttribArray(0), u.disableVertexAttribArray(1), d != null && u.disableVertexAttribArray(2), u.useProgram(null);
  });
}
function Gs() {
  return { vertex: `#version 300 es
    precision highp float;
    uniform vec2 xyScaler;
    layout(location=0) in vec2 xy;
    out vec2 uv;
    void main() {
      gl_Position = vec4(xy * xyScaler, 0, 1);
      uv = (xy + 1.0) / 2.0;
    }
  `, fragment: `#version 300 es
    precision highp float;
    uniform sampler2D source;
    uniform float gamma;
    in vec2 uv;
    out vec4 outColor;
    void main() {
      vec4 color = texture(source, uv);
      color.rgb = pow(color.rgb, vec3(1.0 / gamma));
      outColor = color;
    }
  ` };
}
function Yo(e, t) {
  let { vertex: r, fragment: n } = Gs(), i = e.statefulDerive([t, r, n], tt), a = e.statefulDerive([t, [-1, -1, -1, 1, 1, -1, 1, 1], "f32"], Ke);
  return e.derive([t, i, a], (o, l, s) => (u, f, h, p) => {
    o.disable(o.BLEND), o.enableVertexAttribArray(0), o.bindBuffer(o.ARRAY_BUFFER, s), o.vertexAttribPointer(0, 2, o.FLOAT, !1, 0, 0), o.bindBuffer(o.ARRAY_BUFFER, null), o.bindTexture(o.TEXTURE_2D, u), o.useProgram(l.program), o.uniform1i(l.uniforms.source, 0), o.uniform2f(l.uniforms.xyScaler, h ?? 1, p ?? 1), o.uniform1f(l.uniforms.gamma, f ?? 2.2), o.drawArrays(o.TRIANGLE_STRIP, 0, 4), o.useProgram(null), o.bindTexture(o.TEXTURE_2D, null), o.disableVertexAttribArray(0);
  });
}
function Wo(e) {
  return Math.ceil(e * 3);
}
function zs(e) {
  let t = Wo(e), r = [];
  for (let l = -t; l <= t; l++)
    r.push(Math.exp(-l * l / e / e / 2));
  let n = r.reduce((l, s) => l + s, 0);
  r = r.map((l) => l / n);
  let i = Os(r).map(([l, s]) => [l - t, s]), a = `#version 300 es
    precision highp float;
    layout(location=0) in vec2 xy;
    out vec2 uv;
    void main() {
      gl_Position = vec4(xy, 0, 1);
      uv = (xy + 1.0) / 2.0;
    }
  `, o = `#version 300 es
    precision highp float;
    uniform sampler2D image;
    uniform vec2 resolution;
    uniform vec2 direction;
    in vec2 uv;
    out vec4 outColor;

    void main() {
      vec4 color = vec4(0.0);
      ${i.map(([l, s]) => `color += texture(image, uv + direction * vec2(${l.toFixed(10)}) / resolution) * ${s.toFixed(10)};`).join(`
`)}
      outColor = color;
    }
  `;
  return { vertex: a, fragment: o };
}
function Is(e, t, r) {
  let n = e.derive([r], zs), i = e.statefulDerive(
    [t, e.derive([n], (o) => o.vertex), e.derive([n], (o) => o.fragment)],
    tt
  ), a = e.statefulDerive([t, [-1, -1, -1, 1, 1, -1, 1, 1], "f32"], Ke);
  return e.derive([t, a, i, r], (o, l, s, u) => (f, h, p) => {
    let { width: d, height: v } = h;
    o.disable(o.BLEND), o.enableVertexAttribArray(0), o.bindBuffer(o.ARRAY_BUFFER, l), o.vertexAttribPointer(0, 2, o.FLOAT, !1, 0, 0), o.bindBuffer(o.ARRAY_BUFFER, null), o.useProgram(s.program), o.uniform2f(s.uniforms.resolution, d, v), o.uniform1i(s.uniforms.image, 0), o.bindFramebuffer(o.FRAMEBUFFER, p.framebuffer), o.bindTexture(o.TEXTURE_2D, f), o.uniform2f(s.uniforms.direction, 0, 1), o.drawArrays(o.TRIANGLE_STRIP, 0, 4), o.bindFramebuffer(o.FRAMEBUFFER, h.framebuffer), o.bindTexture(o.TEXTURE_2D, p.texture), o.uniform2f(s.uniforms.direction, 1, 0), o.drawArrays(o.TRIANGLE_STRIP, 0, 4), o.bindFramebuffer(o.FRAMEBUFFER, null), o.useProgram(null), o.bindTexture(o.TEXTURE_2D, null), o.disableVertexAttribArray(0);
  });
}
function Os(e) {
  let t = [];
  for (let r = 0; r < e.length; r += 2)
    if (r + 1 < e.length) {
      let n = e[r], i = e[r + 1], a = 1 - n / (n + i);
      if (a >= 0 && a <= 1) {
        let o = n + i;
        o != 0 && t.push([r + a, o]);
      } else
        t.push([r, e[r]]), t.push([r + 1, e[r + 1]]);
    } else
      t.push([r, e[r]]);
  return t;
}
function $s(e) {
  return Math.ceil(e * 3);
}
function qs() {
  return { vertex: `#version 300 es
    precision highp float;
    layout(location=0) in vec2 xy;
    out vec2 uv;
    void main() {
      gl_Position = vec4(xy, 0, 1);
      uv = (xy + 1.0) / 2.0;
    }
  `, fragment: `#version 300 es
    precision highp float;
    uniform sampler2D image;
    uniform vec2 resolution;
    uniform vec2 direction;
    in vec2 uv;
    out vec4 outColor;

    uniform float weight0;
    uniform vec3 distances;
    uniform vec3 weights;

    void main() {
      vec4 color = texture(image, uv) * weight0;
      if (weights.x != 0.0) {
        color += texture(image, uv + direction * vec2(distances.x) / resolution) * weights.x;
        color += texture(image, uv - direction * vec2(distances.x) / resolution) * weights.x;
      }
      if (weights.y != 0.0) {
        color += texture(image, uv + direction * vec2(distances.y) / resolution) * weights.y;
        color += texture(image, uv - direction * vec2(distances.y) / resolution) * weights.y;
      }
      if (weights.z != 0.0) {
        color += texture(image, uv + direction * vec2(distances.z) / resolution) * weights.z;
        color += texture(image, uv - direction * vec2(distances.z) / resolution) * weights.z;
      }
      outColor = color;
    }
  ` };
}
function Vs(e, t, r) {
  let { vertex: n, fragment: i } = qs(), a = e.statefulDerive([t, n, i], tt), o = e.statefulDerive([t, [-1, -1, -1, 1, 1, -1, 1, 1], "f32"], Ke);
  return e.derive([t, o, a], (l, s, u) => (f, h, p) => {
    let { width: d, height: v } = h;
    l.disable(l.BLEND), l.enableVertexAttribArray(0), l.bindBuffer(l.ARRAY_BUFFER, s), l.vertexAttribPointer(0, 2, l.FLOAT, !1, 0, 0), l.bindBuffer(l.ARRAY_BUFFER, null), l.useProgram(u.program), l.uniform2f(u.uniforms.resolution, d, v), l.uniform1i(u.uniforms.image, 0);
    let g = f, y = p, _ = h;
    for (let w = 0; w < 2; w++) {
      l.uniform2f(u.uniforms.direction, w, 1 - w);
      for (let [x, T, F] of Xs) {
        l.bindFramebuffer(l.FRAMEBUFFER, y.framebuffer), l.bindTexture(l.TEXTURE_2D, g), l.uniform1fv(u.uniforms.weight0, T), l.uniform3fv(u.uniforms.distances, x), l.uniform3fv(u.uniforms.weights, F), l.drawArrays(l.TRIANGLE_STRIP, 0, 4), g = y.texture;
        let S = y;
        y = _, _ = S;
      }
    }
    l.bindFramebuffer(l.FRAMEBUFFER, null), l.useProgram(null), l.bindTexture(l.TEXTURE_2D, null), l.disableVertexAttribArray(0);
  });
}
const Xs = [
  [[1, 2, 3], [0.2288468365182578], [0.18230006506971572, 0.1356122230111784, 0.06766429365997693]],
  [[2, 6, 10], [0.09116254014100238], [0.23317759354726447, 0.18385867277788717, 0.03738246360434722]],
  [[3, 10, 20], [0.2950645715317288], [0.010918865853671198, 0.23773695670296047, 0.10381189167750389]],
  [[4, 16, 30], [0.20085957073474772], [0.14463019087130788, 0.17934533765938643, 0.07559468610193185]]
];
function Ys() {
  return { vertex: `#version 300 es
    precision highp float;
    layout(location=0) in vec2 xy;
    out vec2 uv;
    void main() {
      gl_Position = vec4(xy, 0, 1);
      uv = (xy + 1.0) / 2.0;
    }
  `, fragment: `#version 300 es
    precision highp float;
    uniform sampler2D source;
    uniform vec2 resolution;
    uniform float densityScaler;
    uniform float quantizationStep;
    uniform vec4 channelMask;
    uniform vec4 color;
    uniform float globalAlpha;

    in vec2 uv;
    out vec4 outColor;

    float sample_density(vec2 uv) {
      float d = dot(texture(source, uv), channelMask) * densityScaler;
      d = min(1.0, max(0.0, d));
      d = floor(d / quantizationStep);
      return d;
    }

    void main() {
      // Run the Sobel operator.
      float v = sample_density(uv);
      float v11 = sample_density(uv + vec2(-1, -1) / resolution);
      float v12 = sample_density(uv + vec2(-1,  0) / resolution);
      float v13 = sample_density(uv + vec2(-1, +1) / resolution);
      float v21 = sample_density(uv + vec2( 0, -1) / resolution);
      float v23 = sample_density(uv + vec2( 0, +1) / resolution);
      float v31 = sample_density(uv + vec2(+1, -1) / resolution);
      float v32 = sample_density(uv + vec2(+1,  0) / resolution);
      float v33 = sample_density(uv + vec2(+1, +1) / resolution);
      float gx = v11 + v12 * 2.0 + v13 - v31 - v32 * 2.0 - v33;
      float gy = v11 + v21 * 2.0 + v31 - v13 - v23 * 2.0 - v33;
      // Derive alpha value from the result.
      float alpha = length(vec2(gx, gy)) * 0.2;
      alpha = min(1.0, max(0.0, alpha));
      outColor = color * alpha * globalAlpha;
    }
  ` };
}
function Ws(e, t) {
  let { vertex: r, fragment: n } = Ys(), i = e.statefulDerive([t, r, n], tt), a = e.statefulDerive([t, [-1, -1, -1, 1, 1, -1, 1, 1], "f32"], Ke);
  return e.derive(
    [t, i, a],
    (o, l, s) => (u, f, h, p, d, v) => {
      o.enable(o.BLEND), o.blendFunc(o.ONE, o.ONE_MINUS_SRC_ALPHA), o.enableVertexAttribArray(0), o.bindBuffer(o.ARRAY_BUFFER, s), o.vertexAttribPointer(0, 2, o.FLOAT, !1, 0, 0), o.bindBuffer(o.ARRAY_BUFFER, null), o.bindTexture(o.TEXTURE_2D, u.texture), o.useProgram(l.program), o.uniform1i(l.uniforms.source, 0), o.uniform2f(l.uniforms.resolution, u.width, u.height), o.uniform1f(l.uniforms.densityScaler, f), o.uniform1f(l.uniforms.quantizationStep, h), o.uniform1f(l.uniforms.globalAlpha, p), o.uniform4fv(l.uniforms.channelMask, d), o.uniform4fv(l.uniforms.color, v), o.drawArrays(o.TRIANGLE_STRIP, 0, 4), o.useProgram(null), o.bindTexture(o.TEXTURE_2D, null), o.disableVertexAttribArray(0);
    }
  );
}
function js() {
  return { vertex: `#version 300 es
    precision highp float;
    layout(location=0) in vec2 xy;
    out vec2 uv;
    void main() {
      gl_Position = vec4(xy, 0, 1);
      uv = (xy + 1.0) / 2.0;
    }
    `, fragment: `#version 300 es
    precision highp float;
    uniform sampler2D source;
    uniform vec2 resolution;
    uniform float densityScaler;
    uniform float quantizationStep;

    uniform mat4 colorMatrix;
    uniform int isDarkMode;
    uniform float globalAlpha;

    in vec2 uv;
    out vec4 outColor;

    /* Combine alphas with symmetric blending equation f(a, b) = a + b - ab. */
    float combine_alphas(vec4 alphas) {
      float r = alphas.x + alphas.y - alphas.x * alphas.y;
      r = r + alphas.z - r * alphas.z;
      r = r + alphas.w - r * alphas.w;
      return r;
    }

    void main() {
      vec4 density = texture(source, uv) * densityScaler;

      if (density.x > 1.0 || density.y > 1.0 || density.z > 1.0 || density.w > 1.0) {
        density = density / max(max(max(density.x, density.y), density.z), density.w);
      } else {
        density = floor(density / quantizationStep) * quantizationStep;
      }

      if (density.x + density.y + density.z + density.w == 0.0) {
        discard;
      }

      float alpha = combine_alphas(density);

      density *= alpha / (density.x + density.y + density.z + density.w);

      vec3 c1 = colorMatrix[0].rgb * density.x;
      vec3 c2 = colorMatrix[1].rgb * density.y;
      vec3 c3 = colorMatrix[2].rgb * density.z;
      vec3 c4 = colorMatrix[3].rgb * density.w;
      vec3 c;

      if (isDarkMode == 0) {
        c = vec3(1.0) - alpha + c1 + c2 + c3 + c4;
      } else {
        c = c1 + c2 + c3 + c4;
      }

      outColor = vec4(c, 1.0) * alpha * globalAlpha;
    }
  ` };
}
function Hs(e, t) {
  let { vertex: r, fragment: n } = js(), i = e.statefulDerive([t, r, n], tt), a = e.statefulDerive([t, [-1, -1, -1, 1, 1, -1, 1, 1], "f32"], Ke);
  return e.derive(
    [t, i, a],
    (o, l, s) => (u, f, h, p, d, v) => {
      o.enable(o.BLEND), o.blendFunc(o.ONE, o.ONE_MINUS_SRC_ALPHA), o.enableVertexAttribArray(0), o.bindBuffer(o.ARRAY_BUFFER, s), o.vertexAttribPointer(0, 2, o.FLOAT, !1, 0, 0), o.bindBuffer(o.ARRAY_BUFFER, null), o.bindTexture(o.TEXTURE_2D, u.texture), o.useProgram(l.program), o.uniform1i(l.uniforms.source, 0), o.uniform2f(l.uniforms.resolution, u.width, u.height), o.uniform1f(l.uniforms.densityScaler, f), o.uniform1f(l.uniforms.quantizationStep, h), o.uniform1f(l.uniforms.globalAlpha, p), o.uniform1i(l.uniforms.isDarkMode, v == "dark" ? 1 : 0), o.uniformMatrix4fv(l.uniforms.colorMatrix, !1, d), o.drawArrays(o.TRIANGLE_STRIP, 0, 4), o.useProgram(null), o.bindTexture(o.TEXTURE_2D, null), o.disableVertexAttribArray(0);
    }
  );
}
function Qs(e) {
  let t;
  return e ? t = `#version 300 es
      precision highp float;
      uniform mat3 matrix;
      uniform float point_size;
      uniform float alpha;
      uniform vec4 colorScheme[64];

      layout(location=0) in float x;
      layout(location=1) in float y;
      layout(location=2) in int category;

      out vec4 color;

      void main() {
        gl_Position = vec4(matrix * vec3(x, y, 1), 1);
        if (category < 64) {
          color = colorScheme[category];
        } else {
          color = vec4(0.5, 0.5, 0.5, 1);
        }
        color *= alpha;
        gl_PointSize = point_size;
      }
    ` : t = `#version 300 es
      precision highp float;
      uniform mat3 matrix;
      uniform float point_size;
      uniform vec4 colorScheme;
      uniform float alpha;

      layout(location=0) in float x;
      layout(location=1) in float y;

      out vec4 color;

      void main() {
        gl_Position = vec4(matrix * vec3(x, y, 1), 1);
        color = colorScheme;
        color *= alpha;
        gl_PointSize = point_size;
      }
    `, { vertex: t, fragment: `#version 300 es
    precision highp float;
    uniform float point_size;
    in vec4 color;
    out vec4 outColor;
    void main() {
      float r = length(gl_PointCoord.xy - vec2(0.5, 0.5)) * point_size;
      float a = max(0.0, min(1.0, point_size / 2.0 - r));
      outColor = color * a;
    }
  ` };
}
function Ri(e, t, r, n, i, a) {
  let o = i != null, l = Qs(o), s = e.statefulDerive([t, l.vertex, l.fragment], tt);
  return e.derive(
    [t, s, r, n, i, a],
    (u, f, h, p, d, v) => (g, y, _, w) => {
      u.enable(u.BLEND), u.blendFunc(u.ONE, u.ONE_MINUS_SRC_ALPHA), u.useProgram(f.program), u.enableVertexAttribArray(0), u.bindBuffer(u.ARRAY_BUFFER, h), u.vertexAttribPointer(0, 1, u.FLOAT, !1, 0, 0), u.enableVertexAttribArray(1), u.bindBuffer(u.ARRAY_BUFFER, p), u.vertexAttribPointer(1, 1, u.FLOAT, !1, 0, 0), d != null && (u.enableVertexAttribArray(2), u.bindBuffer(u.ARRAY_BUFFER, d), u.vertexAttribIPointer(2, 1, u.BYTE, 0, 0)), u.bindBuffer(u.ARRAY_BUFFER, null), u.uniformMatrix3fv(f.uniforms.matrix, !1, g), u.uniform1f(f.uniforms.point_size, y * 2), u.uniform1f(f.uniforms.alpha, _), o ? u.uniform4fv(f.uniforms.colorScheme, w) : u.uniform4fv(f.uniforms.colorScheme, w.slice(0, 4)), u.drawArrays(u.POINTS, 0, v), u.disableVertexAttribArray(0), u.disableVertexAttribArray(1), d != null && u.disableVertexAttribArray(2), u.useProgram(null);
    }
  );
}
function Zs() {
  return { vertex: `#version 300 es
    precision highp float;
    layout(location=0) in vec2 xy;
    out vec2 uv;
    void main() {
      gl_Position = vec4(xy, 0, 1);
      uv = (xy + 1.0) / 2.0;
    }
  `, fragment: `#version 300 es
    precision highp float;
    uniform sampler2D source;
    uniform vec2 resolution;
    uniform mat4 colorMatrix;
    uniform float pointAlpha;
    uniform float globalAlpha;
    uniform int isDarkMode;
    in vec2 uv;
    out vec4 outColor;

    /* Combine alphas with symmetric blending equation f(a, b) = a + b - ab. */
    float combine_alphas(vec4 alphas) {
      float r = alphas.x + alphas.y - alphas.x * alphas.y;
      r = r + alphas.z - r * alphas.z;
      r = r + alphas.w - r * alphas.w;
      return r;
    }

    void main() {
      vec4 count = texture(source, uv);
      vec4 alphas = pointAlpha >= 0.999
        ? vec4(count.x > 0.0 ? 1.0 : 0.0, count.y > 0.0 ? 1.0 : 0.0, count.z > 0.0 ? 1.0 : 0.0, count.w > 0.0 ? 1.0 : 0.0)
        : vec4(1.0) - pow(vec4(1.0 - pointAlpha), count);
      float a = combine_alphas(alphas);
      if (a <= 0.0) { discard; }
      alphas *= a / (alphas.x + alphas.y + alphas.z + alphas.w);

      vec3 c1 = colorMatrix[0].rgb * alphas.x;
      vec3 c2 = colorMatrix[1].rgb * alphas.y;
      vec3 c3 = colorMatrix[2].rgb * alphas.z;
      vec3 c4 = colorMatrix[3].rgb * alphas.w;
      vec3 c;
      if (isDarkMode == 0) {
        c = vec3(1.0) - a + c1 + c2 + c3 + c4;
      } else {
        c = c1 + c2 + c3 + c4;
      }
      outColor = vec4(c, 1.0) * a * globalAlpha;
    }
  ` };
}
function Ks(e, t) {
  let { vertex: r, fragment: n } = Zs(), i = e.statefulDerive([t, r, n], tt), a = e.statefulDerive([t, [-1, -1, -1, 1, 1, -1, 1, 1], "f32"], Ke);
  return e.derive(
    [t, i, a],
    (o, l, s) => (u, f, h, p, d) => {
      o.enable(o.BLEND), o.blendFunc(o.ONE, o.ONE_MINUS_SRC_ALPHA), o.enableVertexAttribArray(0), o.bindBuffer(o.ARRAY_BUFFER, s), o.vertexAttribPointer(0, 2, o.FLOAT, !1, 0, 0), o.bindBuffer(o.ARRAY_BUFFER, null), o.bindTexture(o.TEXTURE_2D, u.texture), o.useProgram(l.program), o.uniform1i(l.uniforms.source, 0), o.uniform2f(l.uniforms.resolution, u.width, u.height), o.uniform1f(l.uniforms.pointAlpha, f), o.uniform1f(l.uniforms.globalAlpha, h), o.uniform1i(l.uniforms.isDarkMode, d == "dark" ? 1 : 0), o.uniformMatrix4fv(l.uniforms.colorMatrix, !1, p), o.drawArrays(o.TRIANGLE_STRIP, 0, 4), o.useProgram(null), o.bindTexture(o.TEXTURE_2D, null), o.disableVertexAttribArray(0);
    }
  );
}
class Js {
  props;
  viewport;
  df;
  gl;
  renderInputs;
  dataBuffers;
  renderer;
  constructor(t, r, n) {
    this.props = {
      mode: "points",
      colorScheme: "light",
      x: new Float32Array(),
      y: new Float32Array(),
      category: null,
      categoryCount: 1,
      categoryColors: null,
      viewportX: 0,
      viewportY: 0,
      viewportScale: 1,
      pointSize: 1,
      pointAlpha: 1,
      pointsAlpha: 1,
      densityScaler: 1,
      densityBandwidth: 1,
      densityQuantizationStep: 0.1,
      contoursAlpha: 1,
      densityAlpha: 1,
      gamma: 2.2,
      width: r,
      height: n,
      downsampleMaxPoints: 4e6,
      downsampleDensityWeight: 5
    }, this.viewport = new zr({ x: 0, y: 0, scale: 1 }, r, n);
    let i = new Yt(), a = i.value(t);
    this.df = i, this.gl = a, this.renderInputs = {
      mode: i.value(this.props.mode),
      colorScheme: i.value(this.props.colorScheme),
      xData: i.value(this.props.x),
      yData: i.value(this.props.y),
      categoryData: i.value(this.props.category),
      categoryCount: i.value(this.props.categoryCount),
      matrix: i.value($o()),
      width: i.value(r),
      height: i.value(n),
      pointSize: i.value(this.props.pointSize),
      densityBandwidth: i.value(this.props.densityBandwidth),
      downsampleMaxPoints: i.value(this.props.downsampleMaxPoints),
      downsampleDensityWeight: i.value(this.props.downsampleDensityWeight)
    }, this.dataBuffers = eu(i, a, this.renderInputs), this.renderer = tu(i, a, this.renderInputs, this.dataBuffers);
  }
  setProps(t) {
    let r = !1, n;
    for (n in t)
      t[n] !== this.props[n] && (this.props[n] = t[n], r = !0);
    return this.viewport.update(
      { x: this.props.viewportX, y: this.props.viewportY, scale: this.props.viewportScale },
      this.props.width,
      this.props.height
    ), this.renderInputs.mode.value = this.props.mode, this.renderInputs.colorScheme.value = this.props.colorScheme, this.renderInputs.xData.value = this.props.x, this.renderInputs.yData.value = this.props.y, this.renderInputs.categoryData.value = this.props.category, this.props.category != null ? this.renderInputs.categoryCount.value = this.props.categoryCount : this.renderInputs.categoryCount.value = 1, this.renderInputs.matrix.value = this.viewport.matrix(), this.renderInputs.width.value = this.props.width, this.renderInputs.height.value = this.props.height, this.renderInputs.pointSize.value = this.props.pointSize, this.renderInputs.densityBandwidth.value = this.props.densityBandwidth, this.renderInputs.downsampleMaxPoints.value = this.props.downsampleMaxPoints, this.renderInputs.downsampleDensityWeight.value = this.props.downsampleDensityWeight, r;
  }
  render() {
    this.renderer.value(this.props);
  }
  destroy() {
    this.df.destroy();
  }
  async densityMap(t, r, n, i) {
    let a = this.df.subgraph(), o = iu(a, this.gl, this.dataBuffers, a.value(t), a.value(r), a.value(n)), { x: l, y: s, scale: u } = i, f = [u, 0, 0, 0, u, 0, -l * u, -s * u, 1], h = o.value(f), p = Vo(f);
    return a.destroy(), {
      data: h,
      width: t,
      height: r,
      coordinateAtPixel: (d, v) => {
        let g = d / t * 2 - 1, y = v / r * 2 - 1, _ = qo([g, y, 1], p);
        return { x: _[0], y: _[1] };
      }
    };
  }
}
function eu(e, t, r) {
  const n = e.statefulDerive([t, r.xData, "f32"], Ke), i = e.statefulDerive([t, r.yData, "f32"], Ke), a = e.if(
    e.derive([r.categoryData], (l) => l != null),
    (l) => l.statefulDerive([t, l.assertNotNull(r.categoryData), "u8"], Ke),
    (l) => l.value(null)
  ), o = e.derive([r.xData], (l) => l.length);
  return { x: n, y: i, category: a, count: o };
}
function tu(e, t, r, n) {
  return e.switch(r.mode, {
    points: (i) => ru(i, t, r, n),
    density: (i) => nu(i, t, r, n)
  });
}
function ru(e, t, r, n) {
  const i = e.derive([r.categoryCount], (s) => s > 1), a = e.statefulDerive([t, r.width, r.height, 4, "f32"], Tt);
  let o = e.if(
    i,
    (s) => Ri(s, t, n.x, n.y, s.assertNotNull(n.category), n.count),
    (s) => Ri(s, t, n.x, n.y, null, n.count)
  ), l = Yo(e, t);
  return e.derive(
    [t, a, o, l, r.colorScheme, r.matrix, r.categoryCount],
    (s, u, f, h, p, d, v) => (g) => {
      let y = [], _ = g.categoryColors ?? jr(g.categoryCount);
      for (let w = 0; w < v; w++)
        if (w < _.length) {
          let { r: x, g: T, b: F } = In(_[w]);
          x = Math.pow(x, g.gamma), T = Math.pow(T, g.gamma), F = Math.pow(F, g.gamma), y = y.concat([x, T, F, 1]);
        } else
          y = y.concat([0.5, 0.5, 0.5, 1]);
      s.bindFramebuffer(s.FRAMEBUFFER, u.framebuffer), s.viewport(0, 0, u.width, u.height), p == "light" ? s.clearColor(1, 1, 1, 1) : s.clearColor(0, 0, 0, 1), s.clear(s.COLOR_BUFFER_BIT), f(d, Math.max(3, g.pointSize), g.pointAlpha * g.pointsAlpha, y), s.bindFramebuffer(s.FRAMEBUFFER, null), s.viewport(0, 0, g.width, g.height), h(u.texture, g.gamma);
    }
  );
}
function nu(e, t, r, n) {
  let i = e.derive([r.densityBandwidth], (x) => $s(x) + 1), a = e.derive([r.width, i], (x, T) => x + T * 2), o = e.derive([r.height, i], (x, T) => x + T * 2);
  const l = e.derive([r.categoryCount], (x) => x > 1), s = e.statefulDerive([t, a, o, 4, "f32"], Tt), u = e.statefulDerive([t, a, o, 4, "f32"], Tt), f = e.statefulDerive([t, a, o, 4, "f32"], Tt), h = e.statefulDerive([t, a, o, 4, "f32"], Tt);
  let p = e.if(
    l,
    (x) => bn(x, t, n.x, n.y, x.assertNotNull(n.category), n.count),
    (x) => bn(x, t, n.x, n.y, null, n.count)
  ), d = ks(e, t, r.pointSize), v = Vs(e, t, r.densityBandwidth), g = Ks(e, t), y = Hs(e, t), _ = Ws(e, t), w = Yo(e, t);
  return e.derive(
    [
      t,
      s,
      u,
      f,
      h,
      r.colorScheme,
      r.matrix,
      p,
      d,
      v,
      g,
      y,
      _,
      w
    ],
    (x, T, F, S, C, G, N, q, O, j, pe, K, oe, ee) => (B) => {
      let ae = B.categoryColors ?? jr(B.categoryCount), fe = [];
      for (let le = 0; le < 4; le++)
        if (le < ae.length) {
          let { r: we, g: Ee, b: Q } = In(ae[le]);
          we = Math.pow(we, B.gamma), Ee = Math.pow(Ee, B.gamma), Q = Math.pow(Q, B.gamma), fe = fe.concat([we, Ee, Q, 1]);
        } else
          fe = fe.concat([0.5, 0.5, 0.5, 1]);
      let Ue = B.width / F.width, ge = B.height / F.height, de = On([Ue, 0, 0, 0, ge, 0, 0, 0, 1], N);
      if (x.bindFramebuffer(x.FRAMEBUFFER, T.framebuffer), x.viewport(0, 0, T.width, T.height), x.clearColor(0, 0, 0, 0), x.clear(x.COLOR_BUFFER_BIT), q(de), x.bindFramebuffer(x.FRAMEBUFFER, F.framebuffer), x.viewport(0, 0, F.width, F.height), G == "light" ? x.clearColor(1, 1, 1, 1) : x.clearColor(0, 0, 0, 1), x.clear(x.COLOR_BUFFER_BIT), B.pointAlpha > 0 && B.pointsAlpha > 0 && (O(T.texture, S, C), x.bindFramebuffer(x.FRAMEBUFFER, F.framebuffer), pe(S, B.pointAlpha, B.pointsAlpha, fe, G)), B.densityScaler > 0 && (B.densityAlpha > 0 || B.contoursAlpha > 0) && (j(T.texture, S, C), x.bindFramebuffer(x.FRAMEBUFFER, F.framebuffer), B.densityAlpha > 0 && K(
        S,
        B.densityScaler,
        B.densityQuantizationStep,
        B.densityAlpha,
        fe,
        G
      ), B.contoursAlpha > 0))
        for (let le = 0; le < ae.length; le++) {
          let we = [0, 0, 0, 0];
          we[le] = 1, oe(
            S,
            B.densityScaler,
            B.densityQuantizationStep,
            B.contoursAlpha,
            we,
            fe.slice(le * 4, le * 4 + 4)
          );
        }
      x.bindFramebuffer(x.FRAMEBUFFER, null), x.viewport(0, 0, B.width, B.height), ee(F.texture, B.gamma, 1 / Ue, 1 / ge);
    }
  );
}
function iu(e, t, r, n, i, a) {
  let o = e.derive([a], (v) => Wo(v) + 1), l = e.derive([n, o], (v, g) => v + g * 2), s = e.derive([i, o], (v, g) => v + g * 2);
  const u = e.statefulDerive([t, l, s, 1, "f32"], Tt), f = e.statefulDerive([t, l, s, 1, "f32"], Tt), h = e.statefulDerive([t, l, s, 1, "f32"], Tt);
  let p = bn(e, t, r.x, r.y, null, r.count), d = Is(e, t, a);
  return e.derive(
    [t, o, n, i, u, f, h, p, d],
    (v, g, y, _, w, x, T, F, S) => (C) => {
      let G = y / w.width, N = _ / w.height, q = On([G, 0, 0, 0, N, 0, 0, 0, 1], C);
      v.bindFramebuffer(v.FRAMEBUFFER, w.framebuffer), v.viewport(0, 0, w.width, w.height), v.clearColor(0, 0, 0, 0), v.clear(v.COLOR_BUFFER_BIT), F(q), S(w.texture, x, T), v.bindFramebuffer(v.FRAMEBUFFER, x.framebuffer);
      let O = new Float32Array(y * _);
      return v.readPixels(g, g, y, _, v.RED, v.FLOAT, O), v.bindFramebuffer(v.FRAMEBUFFER, null), O;
    }
  );
}
class ou {
  i32View;
  u32View;
  f32View;
  offset;
  constructor(t) {
    this.i32View = new Int32Array(t), this.u32View = new Uint32Array(t), this.f32View = new Float32Array(t), this.offset = 0;
  }
  align2() {
    this.offset % 2 != 0 && (this.offset += 2 - this.offset % 2);
  }
  align4() {
    this.offset % 4 != 0 && (this.offset += 4 - this.offset % 4);
  }
  f32(t) {
    this.f32View[this.offset++] = t;
  }
  u32(t) {
    this.u32View[this.offset++] = t;
  }
  i32(t) {
    this.i32View[this.offset++] = t;
  }
  vec2f(t, r) {
    this.align2(), this.f32View[this.offset++] = t, this.f32View[this.offset++] = r;
  }
  vec3f(t, r, n) {
    this.align4(), this.f32View[this.offset++] = t, this.f32View[this.offset++] = r, this.f32View[this.offset++] = n;
  }
  vec4f(t, r, n, i) {
    this.align4(), this.f32View[this.offset++] = t, this.f32View[this.offset++] = r, this.f32View[this.offset++] = n, this.f32View[this.offset++] = i;
  }
  mat3x3f(t) {
    this.vec3f(t[0], t[1], t[2]), this.vec3f(t[3], t[4], t[5]), this.vec3f(t[6], t[7], t[8]);
  }
  byteOffset() {
    return this.offset * 4;
  }
}
function au(e, t) {
  let r = new ArrayBuffer(4288), n = e.statefulDerive(
    [t, 4288, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST | GPUBufferUsage.VERTEX],
    ct
  );
  return {
    buffer: n,
    update: e.derive([t, n], (i, a) => (o) => {
      let l = new ou(r);
      l.u32(o.count), l.u32(o.category_count), l.i32(o.framebuffer_width), l.i32(o.framebuffer_height), l.i32(o.density_width), l.i32(o.density_height), l.f32(o.gamma), l.f32(o.point_size), l.f32(o.point_alpha), l.f32(o.points_alpha), l.f32(o.density_scaler), l.f32(o.quantization_step), l.f32(o.density_alpha), l.f32(o.contours_alpha), l.mat3x3f(o.matrix), l.vec2f(...o.view_xy_scaler), l.vec4f(...o.kde_causal), l.vec4f(...o.kde_anticausal), l.vec4f(...o.kde_a), l.vec4f(...o.background_color);
      let s = o.gamma;
      for (let u = 0; u < Math.min(o.category_colors.length, 256); u++) {
        let { r: f, g: h, b: p, a: d } = o.category_colors[u];
        f = Math.pow(f, s), h = Math.pow(h, s), p = Math.pow(p, s), l.vec4f(f, h, p, d);
      }
      i.queue.writeBuffer(a, 0, r, 0, l.byteOffset());
    })
  };
}
const un = 64, fn = 64;
function jo(e, t, r, n, i, a) {
  let o = e.derive(
    [t, r, n.layouts],
    (l, s, u) => l.createComputePipeline({
      layout: l.createPipelineLayout({ bindGroupLayouts: [u.group0, u.group1, u.group2A] }),
      compute: { module: s, entryPoint: "accumulate" }
    })
  );
  return e.derive(
    [
      o,
      n.group0,
      n.group1,
      n.group2A,
      a.countBuffer,
      i.count
    ],
    (l, s, u, f, h, p) => (d) => {
      if (d.clearBuffer(h), p == 0)
        return;
      let v = d.beginComputePass();
      v.setPipeline(l), v.setBindGroup(0, s), v.setBindGroup(1, u), v.setBindGroup(2, f), p <= un * fn ? v.dispatchWorkgroups(Math.ceil(p / un)) : v.dispatchWorkgroups(fn, Math.ceil(p / (un * fn))), v.end();
    }
  );
}
function lu(e) {
  const { COMPUTE: t, VERTEX: r, FRAGMENT: n } = GPUShaderStage;
  return {
    // Group 0
    group0: e.createBindGroupLayout({
      entries: [{ binding: 0, visibility: t | r | n, buffer: { type: "uniform" } }]
    }),
    // Group 1
    group1: e.createBindGroupLayout({
      entries: [
        { binding: 0, visibility: t | r, buffer: { type: "read-only-storage" } },
        { binding: 1, visibility: t | r, buffer: { type: "read-only-storage" } },
        { binding: 2, visibility: t | r, buffer: { type: "read-only-storage" } }
      ]
    }),
    // Group 2
    group2A: e.createBindGroupLayout({
      entries: [{ binding: 0, visibility: t | n, buffer: { type: "storage" } }]
    }),
    group2B: e.createBindGroupLayout({
      entries: [
        { binding: 1, visibility: t | n, buffer: { type: "storage" } },
        { binding: 2, visibility: t | n, buffer: { type: "storage" } }
      ]
    }),
    // Group 3
    group3: e.createBindGroupLayout({
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, sampler: { type: "non-filtering" } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: "float" } },
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: "float" } }
      ]
    })
  };
}
function Ho(e, t, r, n, i) {
  let a = e.derive([t], (h) => lu(h)), o = e.derive(
    [t, a, r],
    (h, p, d) => h.createBindGroup({
      layout: p.group0,
      entries: [{ binding: 0, resource: { buffer: d } }]
    })
  ), l = e.derive(
    [t, a, n.x, n.y, n.category],
    (h, p, d, v, g) => h.createBindGroup({
      layout: p.group1,
      entries: [
        { binding: 0, resource: { buffer: d } },
        { binding: 1, resource: { buffer: v } },
        { binding: 2, resource: { buffer: g ?? d } }
      ]
    })
  ), s = e.derive(
    [t, a, i.countBuffer, i.blurBuffer],
    (h, p, d, v) => h.createBindGroup({
      layout: p.group2A,
      entries: [{ binding: 0, resource: { buffer: d } }]
    })
  ), u = e.derive(
    [t, a, i.countBuffer, i.blurBuffer],
    (h, p, d, v) => h.createBindGroup({
      layout: p.group2B,
      entries: [
        { binding: 1, resource: { buffer: d } },
        { binding: 2, resource: { buffer: v } }
      ]
    })
  ), f = e.derive(
    [t, a, i.colorTexture, i.alphaTexture],
    (h, p, d, v) => h.createBindGroup({
      layout: p.group3,
      entries: [
        { binding: 0, resource: h.createSampler({}) },
        { binding: 1, resource: d.createView() },
        { binding: 2, resource: v.createView() }
      ]
    })
  );
  return {
    layouts: a,
    group0: o,
    group1: l,
    group2A: s,
    group2B: u,
    group3: f
  };
}
const Qo = 256, wn = 256, su = wn * Qo;
function uu(e) {
  const t = Math.ceil(e / Qo);
  if (t <= wn)
    return [t, 1];
  const r = Math.ceil(e / su);
  return [wn, r];
}
function fu(e, t, r, n) {
  const i = e.statefulDerive(
    [t, e.value(16), GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST],
    ct
  ), a = e.statefulDerive(
    [t, e.value(16), GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST],
    ct
  ), o = e.derive([r], (p) => Math.max(4, p * 4)), l = e.statefulDerive([t, o, GPUBufferUsage.STORAGE], ct), s = e.derive(
    [t],
    (p) => p.createBindGroupLayout({
      entries: [
        { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: "uniform" } },
        { binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: "storage" } },
        // counters
        { binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: "storage" } }
        // point_data
      ]
    })
  ), u = e.derive(
    [t, s, i, a, l],
    (p, d, v, g, y) => p.createBindGroup({
      layout: d,
      entries: [
        { binding: 0, resource: { buffer: v } },
        { binding: 1, resource: { buffer: g } },
        { binding: 2, resource: { buffer: y } }
      ]
    })
  ), f = e.derive(
    [t],
    (p) => p.createBindGroupLayout({
      entries: [{ binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: "read-only-storage" } }]
    })
  ), h = e.derive(
    [t, f, l],
    (p, d, v) => p.createBindGroup({
      layout: d,
      entries: [{ binding: 0, resource: { buffer: v } }]
    })
  );
  return {
    uniformBuffer: i,
    countersBuffer: a,
    pointDataBuffer: l,
    bindGroupLayout: s,
    bindGroup: u,
    vertexBindGroupLayout: f,
    vertexBindGroup: h
  };
}
function cu(e, t, r, n, i, a, o, l, s, u) {
  const f = e.derive(
    [t],
    (y) => y.createBindGroupLayout({
      entries: [{ binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: "storage" } }]
    })
  ), h = e.derive(
    [t, f, a],
    (y, _, w) => y.createBindGroup({
      layout: _,
      entries: [{ binding: 1, resource: { buffer: w } }]
    })
  ), p = e.derive([t], (y) => y.createBindGroupLayout({ entries: [] })), d = e.derive(
    [t, p],
    (y, _) => y.createBindGroup({ layout: _, entries: [] })
  ), v = e.derive(
    [t, r, n, i, f, s.bindGroupLayout],
    (y, _, w, x, T, F) => y.createComputePipeline({
      layout: y.createPipelineLayout({ bindGroupLayouts: [w, x, T, F] }),
      compute: { module: _, entryPoint: "downsample_viewport_cull" }
    })
  ), g = e.derive(
    [t, r, n, i, p, s.bindGroupLayout],
    (y, _, w, x, T, F) => y.createComputePipeline({
      layout: y.createPipelineLayout({ bindGroupLayouts: [w, x, T, F] }),
      compute: { module: _, entryPoint: "downsample_density_sample" }
    })
  );
  return e.derive(
    [
      t,
      v,
      g,
      o,
      l,
      h,
      d,
      s.bindGroup,
      s.uniformBuffer,
      s.countersBuffer,
      u.count
    ],
    (y, _, w, x, T, F, S, C, G, N, q) => (O, j) => {
      if (q === 0 || j.maxPoints <= 0)
        return 0;
      const pe = new ArrayBuffer(16), K = new DataView(pe);
      K.setUint32(0, j.maxPoints, !0), K.setUint32(4, j.frameSeed, !0), K.setFloat32(8, j.densityWeight, !0), K.setFloat32(12, 0, !0), y.queue.writeBuffer(G, 0, pe), O.clearBuffer(N);
      const [oe, ee] = uu(q);
      {
        const B = O.beginComputePass();
        B.setPipeline(_), B.setBindGroup(0, x), B.setBindGroup(1, T), B.setBindGroup(2, F), B.setBindGroup(3, C), B.dispatchWorkgroups(oe, ee), B.end();
      }
      {
        const B = O.beginComputePass();
        B.setPipeline(w), B.setBindGroup(0, x), B.setBindGroup(1, T), B.setBindGroup(2, S), B.setBindGroup(3, C), B.dispatchWorkgroups(oe, ee), B.end();
      }
    }
  );
}
function du(e, t, r, n, i) {
  const a = e.derive(
    [t, r, n.layouts],
    (o, l, s) => o.createRenderPipeline({
      layout: o.createPipelineLayout({
        bindGroupLayouts: [s.group0, s.group1, s.group2B]
      }),
      vertex: { entryPoint: "draw_density_map_vs", module: l },
      fragment: {
        entryPoint: "draw_density_map_fs",
        module: l,
        targets: [
          {
            format: i.colorTextureFormat,
            blend: { color: { srcFactor: "one", dstFactor: "one" }, alpha: { srcFactor: "one", dstFactor: "one" } }
          },
          {
            format: i.alphaTextureFormat,
            blend: { color: { srcFactor: "one", dstFactor: "one" }, alpha: { srcFactor: "one", dstFactor: "one" } }
          }
        ]
      },
      primitive: { topology: "triangle-strip" }
    })
  );
  return e.derive(
    [
      a,
      n.group0,
      n.group1,
      n.group2B,
      i.colorTexture,
      i.alphaTexture
    ],
    (o, l, s, u, f, h) => (p) => {
      let d = p.beginRenderPass({
        colorAttachments: [
          { loadOp: "load", storeOp: "store", view: f.createView() },
          { loadOp: "load", storeOp: "store", view: h.createView() }
        ]
      });
      d.setPipeline(o), d.setBindGroup(0, l), d.setBindGroup(1, s), d.setBindGroup(2, u), d.draw(4), d.end();
    }
  );
}
function hu(e, t, r, n, i, a) {
  const o = e.derive(
    [t, r, n.layouts],
    (l, s, u) => l.createRenderPipeline({
      layout: l.createPipelineLayout({ bindGroupLayouts: [u.group0, u.group1] }),
      vertex: { entryPoint: "points_vs", module: s },
      fragment: {
        entryPoint: "points_fs",
        module: s,
        targets: [
          {
            format: a.colorTextureFormat,
            blend: { color: { srcFactor: "one", dstFactor: "one" }, alpha: { srcFactor: "one", dstFactor: "one" } }
          },
          {
            format: a.alphaTextureFormat,
            blend: { color: { srcFactor: "one", dstFactor: "one" }, alpha: { srcFactor: "one", dstFactor: "one" } }
          }
        ]
      },
      primitive: { topology: "triangle-strip" }
    })
  );
  return e.derive(
    [
      o,
      n.group0,
      n.group1,
      i.count,
      a.colorTexture,
      a.alphaTexture
    ],
    (l, s, u, f, h, p) => (d) => {
      let v = d.beginRenderPass({
        colorAttachments: [
          { clearValue: [0, 0, 0, 0], loadOp: "clear", storeOp: "store", view: h.createView() },
          { clearValue: [0, 0, 0, 0], loadOp: "clear", storeOp: "store", view: p.createView() }
        ]
      });
      v.setPipeline(l), v.setBindGroup(0, s), v.setBindGroup(1, u), f > 0 && v.draw(4, f), v.end();
    }
  );
}
function pu(e, t, r, n, i, a) {
  const o = e.derive(
    [t, r, n.layouts, i.vertexBindGroupLayout],
    (l, s, u, f) => l.createRenderPipeline({
      layout: l.createPipelineLayout({
        bindGroupLayouts: [u.group0, u.group1, f]
      }),
      vertex: { entryPoint: "points_downsampled_vs", module: s },
      fragment: {
        entryPoint: "points_fs",
        module: s,
        targets: [
          {
            format: a.colorTextureFormat,
            blend: { color: { srcFactor: "one", dstFactor: "one" }, alpha: { srcFactor: "one", dstFactor: "one" } }
          },
          {
            format: a.alphaTextureFormat,
            blend: { color: { srcFactor: "one", dstFactor: "one" }, alpha: { srcFactor: "one", dstFactor: "one" } }
          }
        ]
      },
      primitive: { topology: "triangle-strip" }
    })
  );
  return e.derive(
    [
      o,
      n.group0,
      n.group1,
      i.vertexBindGroup,
      a.colorTexture,
      a.alphaTexture
    ],
    (l, s, u, f, h, p) => (d, v) => {
      let g = d.beginRenderPass({
        colorAttachments: [
          { clearValue: [0, 0, 0, 0], loadOp: "clear", storeOp: "store", view: h.createView() },
          { clearValue: [0, 0, 0, 0], loadOp: "clear", storeOp: "store", view: p.createView() }
        ]
      });
      g.setPipeline(l), g.setBindGroup(0, s), g.setBindGroup(1, u), g.setBindGroup(2, f), v > 0 && g.draw(4, v), g.end();
    }
  );
}
function vu(e, t, r, n, i) {
  const a = e.derive(
    [t, r, i.layouts],
    (o, l, s) => o.createRenderPipeline({
      layout: o.createPipelineLayout({
        bindGroupLayouts: [s.group0, s.group1, s.group2B, s.group3]
      }),
      vertex: { entryPoint: "gamma_correction_vs", module: l },
      fragment: { entryPoint: "gamma_correction_fs", module: l, targets: [{ format: n }] },
      primitive: { topology: "triangle-strip" }
    })
  );
  return e.derive(
    [a, i.group0, i.group1, i.group2B, i.group3],
    (o, l, s, u, f) => (h, p) => {
      let d = h.beginRenderPass({
        colorAttachments: [{ clearValue: [1, 1, 1, 1], loadOp: "clear", storeOp: "store", view: p }]
      });
      d.setPipeline(o), d.setBindGroup(0, l), d.setBindGroup(1, s), d.setBindGroup(2, u), d.setBindGroup(3, f), d.draw(4), d.end();
    }
  );
}
const Ti = 64;
function Zo(e, t, r, n, i, a, o) {
  let l = e.derive(
    [t, r, n.layouts],
    (u, f, h) => u.createComputePipeline({
      layout: u.createPipelineLayout({
        bindGroupLayouts: [h.group0, h.group1, h.group2B, h.group3]
      }),
      compute: { module: f, entryPoint: "gaussian_blur_stage_1" }
    })
  ), s = e.derive(
    [t, r, n.layouts],
    (u, f, h) => u.createComputePipeline({
      layout: u.createPipelineLayout({
        bindGroupLayouts: [h.group0, h.group1, h.group2B, h.group3]
      }),
      compute: { module: f, entryPoint: "gaussian_blur_stage_2" }
    })
  );
  return e.derive(
    [
      l,
      s,
      n.group0,
      n.group1,
      n.group2B,
      n.group3,
      i,
      a,
      o
    ],
    (u, f, h, p, d, v, g, y, _) => (w) => {
      let x = w.beginComputePass();
      x.setBindGroup(0, h), x.setBindGroup(1, p), x.setBindGroup(2, d), x.setBindGroup(3, v), x.setPipeline(u), x.dispatchWorkgroups(Math.ceil(g / Ti), _), x.setPipeline(f), x.dispatchWorkgroups(Math.ceil(y / Ti), _), x.end();
    }
  );
}
function gu(e, t = !1) {
  const r = new Float64Array(5), n = new Float64Array(4);
  yu(r, n, e);
  const i = Float64Array.of(
    0,
    n[1] - r[1] * n[0],
    n[2] - r[2] * n[0],
    n[3] - r[3] * n[0],
    -r[4] * n[0]
  ), a = 1 + r[1] + r[2] + r[3] + r[4], o = (n[0] + n[1] + n[2] + n[3]) / a, l = (i[1] + i[2] + i[3] + i[4]) / a;
  return {
    sigma: e,
    negative: t,
    a: r,
    b_causal: n,
    b_anticausal: i,
    sum_causal: o,
    sum_anticausal: l
  };
}
function yu(e, t, r) {
  const n = Float64Array.of(
    0.84,
    1.8675,
    0.84,
    -1.8675,
    -0.34015,
    -0.1299,
    -0.34015,
    0.1299
  ), i = Math.exp(-1.783 / r), a = Math.exp(-1.723 / r), o = 0.6318 / r, l = 1.997 / r, s = Float64Array.of(
    -i * Math.cos(o),
    i * Math.sin(o),
    -i * Math.cos(-o),
    i * Math.sin(-o),
    -a * Math.cos(l),
    a * Math.sin(l),
    -a * Math.cos(-l),
    a * Math.sin(-l)
  ), u = r * 2.5066282746310007, f = Float64Array.of(n[0], n[1], 0, 0, 0, 0, 0, 0), h = Float64Array.of(1, 0, s[0], s[1], 0, 0, 0, 0, 0, 0);
  let p, d;
  for (d = 2; d < 8; d += 2) {
    for (f[d] = s[d] * f[d - 2] - s[d + 1] * f[d - 1], f[d + 1] = s[d] * f[d - 1] + s[d + 1] * f[d - 2], p = d - 2; p > 0; p -= 2)
      f[p] += s[d] * f[p - 2] - s[d + 1] * f[p - 1], f[p + 1] += s[d] * f[p - 1] + s[d + 1] * f[p - 2];
    for (p = 0; p <= d; p += 2)
      f[p] += n[d] * h[p] - n[d + 1] * h[p + 1], f[p + 1] += n[d] * h[p + 1] + n[d + 1] * h[p];
    for (h[d + 2] = s[d] * h[d] - s[d + 1] * h[d + 1], h[d + 3] = s[d] * h[d + 1] + s[d + 1] * h[d], p = d; p > 0; p -= 2)
      h[p] += s[d] * h[p - 2] - s[d + 1] * h[p - 1], h[p + 1] += s[d] * h[p - 1] + s[d + 1] * h[p - 2];
  }
  for (d = 0; d < 4; ++d)
    p = d << 1, t[d] = f[p] / u, e[d + 1] = h[p + 2];
}
function Ko(e) {
  let t = gu(e);
  return {
    kde_causal: [t.b_causal[0], t.b_causal[1], t.b_causal[2], t.b_causal[3]],
    kde_anticausal: [t.b_anticausal[1], t.b_anticausal[2], t.b_anticausal[3], t.b_anticausal[4]],
    kde_a: [t.a[1], t.a[2], t.a[3], t.a[4]]
  };
}
const mu = `// Copyright (c) 2025 Apple Inc. Licensed under MIT License.

enable f16;

struct Uniforms {
  count: u32,
  category_count: u32,
  framebuffer_width: i32,
  framebuffer_height: i32,
  density_width: i32,
  density_height: i32,
  gamma: f32,
  point_size: f32,
  point_alpha: f32,
  points_alpha: f32,
  density_scaler: f32,
  quantization_step: f32,
  density_alpha: f32,
  contours_alpha: f32,
  matrix: mat3x3<f32>,
  view_xy_scaler: vec2<f32>,
  kde_causal: vec4<f32>,
  kde_anticausal: vec4<f32>,
  kde_a: vec4<f32>,
  background_color: vec4<f32>,
  category_colors: array<vec4<f32>, 256>,
}

struct DownsampleUniforms {
  render_limit: u32,
  frame_seed: u32,
  density_weight: f32,
  _padding: f32,
}

struct PointData {
  position: vec3<f32>,
  category: u32,
}

struct FragmentOutput {
  @location(0) color: vec4<f32>,
  @location(1) log1malpha: f32, // log(1 - alpha)
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

@group(1) @binding(0) var<storage, read> x_buffer: array<f32>;
@group(1) @binding(1) var<storage, read> y_buffer: array<f32>;
@group(1) @binding(2) var<storage, read> category_buffer: array<u32>;

@group(2) @binding(0) var<storage, read_write> count_buffer: array<atomic<u32>>;
@group(2) @binding(1) var<storage, read_write> blur_buffer: array<f16>;
@group(2) @binding(2) var<storage, read_write> blur_swap_buffer: array<f16>;

@group(3) @binding(0) var framebuffer_sampler: sampler;
@group(3) @binding(1) var color_texture: texture_2d<f32>;
@group(3) @binding(2) var log1malpha_texture: texture_2d<f32>;

// Downsampling bind groups (group 3 for compute shaders)
// WebGPU has a default limit of 4 bind groups, so we use group 3 (not 4)
// 3 storage buffers to stay within 8-buffer limit (3 from group1 + 1 from group2 + 3 from group3 = 7)
@group(3) @binding(0) var<uniform> downsample_uniforms: DownsampleUniforms;
@group(3) @binding(1) var<storage, read_write> downsample_counters: array<atomic<u32>>; // [visible_count, max_density_fixed]
@group(3) @binding(2) var<storage, read_write> point_data: array<f32>; // density (>= 0 means visible with density, < 0 means not visible or not accepted)

// Separate binding for vertex shader in downsampled draw pipeline
// Uses group 2 since the pipeline only needs groups 0, 1, 2
// (read-only access required by WebGPU for vertex shaders)
@group(2) @binding(0) var<storage, read> point_data_read: array<f32>; // same as point_data above

fn get_point(index: u32) -> PointData {
  var result: PointData;
  result.position = vec3(x_buffer[index], y_buffer[index], 1.0);
  if (uniforms.category_count > 1) {
    result.category = (category_buffer[index >> 2] >> ((index & 3) << 3)) & 0xff;
  } else {
    result.category = 0;
  }
  return result;
}

const ACCUMULATE_UNIT: u32 = 4096;

fn increment_count(x: i32, y: i32, category: u32, value: u32) {
  let width = uniforms.density_width;
  let height = uniforms.density_height;
  if (x < 0 || x >= width || y < 0 || y >= height || category >= uniforms.category_count || value == 0) {
    return;
  }
  let offset = (y * width + x) + i32(category) * (width * height);
  atomicAdd(&count_buffer[offset], value);
}

@compute @workgroup_size(64, 1)
fn accumulate(@builtin(global_invocation_id) id: vec3<u32>) {
  let width = uniforms.density_width;
  let height = uniforms.density_height;
  let index = id.y * 4096 + id.x; // 4096 = 64 * 64
  if (index >= uniforms.count) { return; }
  let point = get_point(index);
  let pos = uniforms.matrix * point.position;
  let x = (pos.x + 1.0) / 2.0 * f32(width) - 0.5;
  let y = (pos.y + 1.0) / 2.0 * f32(height) - 0.5;
  let ix = i32(x);
  let iy = i32(y);
  let tx = x - f32(ix);
  let ty = y - f32(iy);
  let w1: u32 = u32((1 - tx) * (1 - ty) * f32(ACCUMULATE_UNIT));
  let w2: u32 = u32(tx * (1 - ty) * f32(ACCUMULATE_UNIT));
  let w3: u32 = u32((1 - tx) * ty * f32(ACCUMULATE_UNIT));
  let w123 = w1 + w2 + w3;
  var w4: u32 = select(0, ACCUMULATE_UNIT - w123, w123 < ACCUMULATE_UNIT);
  increment_count(ix, iy, point.category, w1);
  increment_count(ix + 1, iy, point.category, w2);
  increment_count(ix, iy + 1, point.category, w3);
  increment_count(ix + 1, iy + 1, point.category, w4);
}

// =====================================================
// Draw Discrete Points
// =====================================================

struct PointsVertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) dp: vec3<f32>,
  @location(1) color: vec4<f32>,
}

@vertex
fn points_vs(
  @builtin(instance_index) index: u32,
  @builtin(vertex_index) part: u32,
) -> PointsVertexOutput {
  let framebuffer_size = vec2(f32(uniforms.framebuffer_width), f32(uniforms.framebuffer_height));
  let alpha = uniforms.point_alpha * uniforms.points_alpha;
  let dp = vec2<f32>(f32(part % 2), f32(part / 2)) * 2.0 - 1.0;
  let point = get_point(index);
  let pos = uniforms.matrix * point.position;

  var out: PointsVertexOutput;
  out.position = vec4<f32>(pos.xy + dp * uniforms.point_size / framebuffer_size * 2.0, 0.0, 1.0);
  out.dp = vec3(dp, uniforms.point_size);
  out.color = uniforms.category_colors[point.category] * alpha;
  return out;
}

@fragment
fn points_fs(in: PointsVertexOutput) -> FragmentOutput {
  let r = length(in.dp.xy) * in.dp.z;
  let a = max(0.0, min(1.0, in.dp.z - r));
  var out: FragmentOutput;
  out.color = in.color * a;
  out.log1malpha = log(1 - out.color.a);
  return out;
}

// =====================================================
// Draw Density Map
// =====================================================

struct DrawDensityMapVertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) texture_coord: vec2<f32>,
}

@vertex
fn draw_density_map_vs(
  @builtin(vertex_index) part: u32,
) -> DrawDensityMapVertexOutput {
  let framebuffer_size = vec2(f32(uniforms.framebuffer_width), f32(uniforms.framebuffer_height));
  let dp = vec2<f32>(f32(part % 2), f32(part / 2)) * 2.0 - 1.0;
  var out: DrawDensityMapVertexOutput;
  out.position = vec4(dp, 0.0, 1.0);
  out.texture_coord = (vec2(dp.x, dp.y) + 1.0) / 2.0 * framebuffer_size;
  return out;
}

fn get_density_raw(x: i32, y: i32, category: u32) -> f32 {
  let width = uniforms.density_width;
  let height = uniforms.density_height;
  let density_scaler = uniforms.density_scaler;
  if (x < 0 || x >= width || y < 0 || y >= height) {
    return 0.0;
  }
  let offset = (y * width + x) + i32(category) * (width * height);
  return max(0.0, f32(blur_buffer[offset]) * density_scaler);
}

fn get_density(x: f32, y: f32, category: u32) -> f32 {
  let px = x / f32(uniforms.framebuffer_width) * f32(uniforms.density_width) - 0.5;
  let py = y / f32(uniforms.framebuffer_height) * f32(uniforms.density_height) - 0.5;
  let ix = i32(px);
  let iy = i32(py);
  let tx = px - f32(ix);
  let ty = py - f32(iy);
  let v00 = get_density_raw(ix, iy, category);
  let v10 = get_density_raw(ix + 1, iy, category);
  let v01 = get_density_raw(ix, iy + 1, category);
  let v11 = get_density_raw(ix + 1, iy + 1, category);
  return mix(mix(v00, v10, tx), mix(v01, v11, tx), ty);
}

fn get_density_quantized(x: f32, y: f32, category: u32) -> f32 {
  let v = get_density(x, y, category);
  return floor(clamp(v, 0, 1) / uniforms.quantization_step);
}

fn get_density_quantized_sobel(x: f32, y: f32, category: u32) -> vec2<f32> {
  let v11 = get_density_quantized(x - 1, y - 1, category);
  let v21 = get_density_quantized(x, y - 1, category);
  let v31 = get_density_quantized(x + 1, y - 1, category);
  let v12 = get_density_quantized(x - 1, y, category);
  let v22 = get_density_quantized(x, y, category);
  let v32 = get_density_quantized(x + 1, y, category);
  let v13 = get_density_quantized(x - 1, y + 1, category);
  let v23 = get_density_quantized(x, y + 1, category);
  let v33 = get_density_quantized(x + 1, y + 1, category);
  let gx = v11 + v12 * 2.0 + v13 - v31 - v32 * 2.0 - v33;
  let gy = v11 + v21 * 2.0 + v31 - v13 - v23 * 2.0 - v33;
  return vec2(gx, gy);
}

@fragment
fn draw_density_map_fs(in: DrawDensityMapVertexOutput) -> FragmentOutput {
  let px = in.texture_coord.x;
  let py = in.texture_coord.y;
  let quantization_step: f32 = uniforms.quantization_step;

  var sum_color: vec4<f32> = vec4(0);
  var sum_log1malpha: f32 = 0.0;

  for (var i: u32 = 0; i < uniforms.category_count; i++) {
    let density = get_density(px, py, i);
    var alpha = min(1.0, floor(density / quantization_step) * quantization_step);
    alpha *= uniforms.density_alpha;
    let color = uniforms.category_colors[i] * alpha;
    sum_color += color;
    sum_log1malpha += log(1 - color.a);
  }

  if (uniforms.contours_alpha > 0.0) {
    for (var i: u32 = 0; i < uniforms.category_count; i++) {
      let sobel = get_density_quantized_sobel(px, py, i);
      let alpha = clamp(length(sobel) * 0.2, 0.0, 1.0) * uniforms.contours_alpha;
      let color = uniforms.category_colors[i] * alpha;
      sum_color += color;
      sum_log1malpha += log(1 - color.a);
    }
  }

  var out: FragmentOutput;
  out.color = sum_color;
  out.log1malpha = sum_log1malpha;
  return out;
}

// =====================================================
// Gamma Correction
// =====================================================

struct GammaCorrectionVertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) texture_coord: vec2<f32>,
}

@vertex
fn gamma_correction_vs(
  @builtin(vertex_index) part: u32,
) -> GammaCorrectionVertexOutput {
  let dp = vec2<f32>(f32(part % 2), f32(part / 2)) * 2.0 - 1.0;
  var out: GammaCorrectionVertexOutput;
  out.position = vec4(dp * uniforms.view_xy_scaler, 0.0, 1.0);
  out.texture_coord = (vec2(dp.x, -dp.y) + 1.0) / 2.0;
  return out;
}

@fragment
fn gamma_correction_fs(in: GammaCorrectionVertexOutput) -> @location(0) vec4<f32> {
  let sum_color = textureSample(color_texture, framebuffer_sampler, in.texture_coord);
  let sum_log_one_minus_alpha = textureSample(log1malpha_texture, framebuffer_sampler, in.texture_coord).r;
  var color: vec4<f32>;
  if (sum_color.a > 0.0) {
    color = sum_color / sum_color.a * (1.0 - exp(sum_log_one_minus_alpha));
    color = color + uniforms.background_color * (1 - color.a);
  } else {
    color = uniforms.background_color;
  }
  let rgb = pow(color.rgb, vec3(1.0 / uniforms.gamma));
  return vec4(rgb, 1.0);
}

// =====================================================
// Gaussian Blur
// =====================================================

@compute @workgroup_size(64, 1)
fn gaussian_blur_stage_1(@builtin(global_invocation_id) id: vec3<u32>) {
  let width = uniforms.density_width;
  let height = uniforms.density_height;
  let x = id.x;
  if (x >= u32(width)) { return; }
  let start = x + id.y * u32(width * height);
  let count = u32(height);
  let stride = u32(width);

  deriche_conv_1d(
    &blur_buffer, &blur_swap_buffer, start, stride, count,
    uniforms.kde_causal, uniforms.kde_anticausal, uniforms.kde_a,
    true
  );
}

@compute @workgroup_size(64, 1)
fn gaussian_blur_stage_2(@builtin(global_invocation_id) id: vec3<u32>) {
  let width = uniforms.density_width;
  let height = uniforms.density_height;
  let y = id.x;
  if (y >= u32(height)) { return; }
  let start = y * u32(width) + id.y * u32(width * height);
  let count = u32(width);
  let stride = u32(1);

  deriche_conv_1d(
    &blur_swap_buffer, &blur_buffer, start, stride, count,
    uniforms.kde_causal, uniforms.kde_anticausal, uniforms.kde_a,
    false
  );
}

fn deriche_conv_1d(
    src: ptr<storage, array<f16>, read_write>,
    dst: ptr<storage, array<f16>, read_write>,
    start: u32, stride: u32, count: u32,
    kde_causal: vec4<f32>, kde_anticausal: vec4<f32>, kde_a: vec4<f32>,
    src_is_u32: bool
) {
  var s: vec4<f32> = vec4(0.0);
  var y0: f32 = 0.0;
  var y1234: vec4<f32> = vec4(0.0);

  var first_nonzero: u32 = count;
  var last_nonzero: u32 = 0;

  for (var i: u32 = 0; i < count; i++) {
    let offset = start + i * stride;
    var input: f32;
    if (src_is_u32) {
      input = f32(bitcast<u32>(vec2((*src)[offset * 2], (*src)[offset * 2 + 1]))) / f32(ACCUMULATE_UNIT);
    } else {
      input = f32((*src)[offset]);
    }
    if (input != 0.0) {
      first_nonzero = min(i, first_nonzero);
      last_nonzero = max(i, last_nonzero);
    }
    s = vec4(input, s.xyz);
    y1234 = vec4(y0, y1234.xyz);
    y0 = dot(kde_causal, s) - dot(kde_a, y1234);
    (*dst)[offset] = f16(y0);
  }

  if (first_nonzero > last_nonzero) {
    return;
  }

  s = vec4(0.0);
  y0 = 0.0;
  y1234 = vec4(0.0);

  for (var i: u32 = count - 1 - last_nonzero; i < count; i++) {
    let p = count - 1 - i;
    let offset = start + p * stride;
    var input: f32 = 0.0;
    if (p >= first_nonzero) {
      if (src_is_u32) {
        input = f32(bitcast<u32>(vec2((*src)[offset * 2], (*src)[offset * 2 + 1]))) / f32(ACCUMULATE_UNIT);
      } else {
        input = f32((*src)[offset]);
      }
    }
    y1234 = vec4(y0, y1234.xyz);
    y0 = dot(kde_anticausal, s) - dot(kde_a, y1234);
    s = vec4(input, s.xyz);
    if (y0 != 0.0) {
      (*dst)[offset] = f16(f32((*dst)[offset]) + y0);
    }
  }
}

// =====================================================
// Downsampling: PCG hash for deterministic randomness
// =====================================================

fn pcg_hash(input: u32) -> u32 {
  var state = input * 747796405u + 2891336453u;
  let word = ((state >> ((state >> 28u) + 4u)) ^ state) * 277803737u;
  return (word >> 22u) ^ word;
}

fn random_float(seed: u32) -> f32 {
  return f32(pcg_hash(seed)) / 4294967295.0;
}

// =====================================================
// Downsampling Pass 1: Viewport culling + density lookup
// =====================================================
// Uses 2D dispatch for large point counts (>65K workgroups)
// Stride: 256 workgroups * 256 threads = 65536 threads per row

const DOWNSAMPLE_STRIDE: u32 = 65536u;

@compute @workgroup_size(256)
fn downsample_viewport_cull(@builtin(global_invocation_id) id: vec3<u32>) {
  let index = id.y * DOWNSAMPLE_STRIDE + id.x;
  if (index >= uniforms.count) { return; }

  let point = get_point(index);
  let pos = uniforms.matrix * point.position;

  // Check if point is in viewport [-1, 1]
  let in_viewport = pos.x >= -1.0 && pos.x <= 1.0 && pos.y >= -1.0 && pos.y <= 1.0;

  if (in_viewport) {
    // Increment visible count
    atomicAdd(&downsample_counters[0], 1u);

    // Lookup density at this point's location from blur_buffer
    let width = uniforms.density_width;
    let height = uniforms.density_height;
    let dx = (pos.x + 1.0) / 2.0 * f32(width) - 0.5;
    let dy = (pos.y + 1.0) / 2.0 * f32(height) - 0.5;
    let ix = clamp(i32(dx), 0, width - 1);
    let iy = clamp(i32(dy), 0, height - 1);

    // Sum density across all categories at this grid cell
    var density: f32 = 0.0;
    for (var c: u32 = 0; c < uniforms.category_count; c++) {
      let offset = iy * width + ix + i32(c) * (width * height);
      density += f32(blur_buffer[offset]);
    }
    // Store density (positive = visible). Add small epsilon to ensure > 0.
    density = min(max(density, 0.0001), 65535.0);
    point_data[index] = density;

    // Track max density using fixed-point atomics
    let density_fixed = u32(density * 65536.0);
    atomicMax(&downsample_counters[1], density_fixed);
  } else {
    // Not visible: store -1.0
    point_data[index] = -1.0;
  }
}

// =====================================================
// Downsampling Pass 2: Probabilistic acceptance
// =====================================================

@compute @workgroup_size(256)
fn downsample_density_sample(@builtin(global_invocation_id) id: vec3<u32>) {
  let index = id.y * DOWNSAMPLE_STRIDE + id.x;
  if (index >= uniforms.count) { return; }

  let density = point_data[index];

  // Not visible (density < 0)
  if (density < 0.0) {
    return;
  }

  let visible_count = atomicLoad(&downsample_counters[0]);
  let render_limit = downsample_uniforms.render_limit;

  // If visible count is within limit, accept all visible points (keep positive density)
  if (visible_count <= render_limit) {
    return; // Keep positive value = accepted
  }

  // Compute acceptance probability based on density
  let max_density_fixed = atomicLoad(&downsample_counters[1]);
  let max_density = f32(max_density_fixed) / 65536.0;

  // Base acceptance rate
  let base_rate = f32(render_limit) / f32(visible_count);

  // Density-based modulation: lower density = higher acceptance
  let normalized_density = select(0.0, density / max_density, max_density > 0.0001);
  let density_weight = downsample_uniforms.density_weight;

  // Inverse density weighting: sparse areas get higher probability
  let inverse_weight = 1.0 / (1.0 + normalized_density * density_weight);

  // Compute final probability (scale by ~2 to compensate for average inverse_weight)
  let final_prob = min(1.0, base_rate * inverse_weight * 2.0);

  // Deterministic random for frame stability (based on point index + frame seed)
  let seed = index ^ downsample_uniforms.frame_seed;
  let rand = random_float(seed);

  // If not accepted, set to negative (marks as rejected)
  if (rand >= final_prob) {
    point_data[index] = -1.0;
  }
}

// =====================================================
// Draw points with downsampling
// =====================================================

@vertex
fn points_downsampled_vs(
  @builtin(instance_index) instance: u32,
  @builtin(vertex_index) part: u32,
) -> PointsVertexOutput {
  var out: PointsVertexOutput;

  let point_data = point_data_read[instance];
  if (point_data < 0.0) {
    // To discard a point, we set a out-of-viewport position. This avoids fragment costs.
    out.position = vec4<f32>(-1000, -1000, 0.0, 1.0);
    return out;
  }

  let framebuffer_size = vec2(f32(uniforms.framebuffer_width), f32(uniforms.framebuffer_height));
  let alpha = uniforms.point_alpha * uniforms.points_alpha;
  let dp = vec2<f32>(f32(part % 2), f32(part / 2)) * 2.0 - 1.0;
  let point = get_point(instance);
  let pos = uniforms.matrix * point.position;
  out.position = vec4<f32>(pos.xy + dp * uniforms.point_size / framebuffer_size * 2.0, 0.0, 1.0);
  out.dp = vec3(dp, uniforms.point_size);
  out.color = uniforms.category_colors[point.category] * alpha;
  return out;
}
`;
class xu {
  props;
  viewport;
  df;
  device;
  module;
  uniforms;
  context;
  renderInputs;
  dataBuffers;
  renderer;
  constructor(t, r, n, i, a) {
    this.context = t, this.props = {
      mode: "points",
      colorScheme: "light",
      x: new Float32Array(),
      y: new Float32Array(),
      category: null,
      categoryCount: 1,
      categoryColors: null,
      viewportX: 0,
      viewportY: 0,
      viewportScale: 1,
      pointSize: 1,
      pointAlpha: 1,
      pointsAlpha: 1,
      densityScaler: 1,
      densityBandwidth: 1,
      densityQuantizationStep: 0.1,
      contoursAlpha: 1,
      densityAlpha: 1,
      gamma: 2.2,
      width: i,
      height: a,
      downsampleMaxPoints: 4e6,
      downsampleDensityWeight: 5
    }, this.viewport = new zr({ x: 0, y: 0, scale: 1 }, i, a), this.df = new Yt();
    let o = this.df;
    this.renderInputs = {
      mode: o.value(this.props.mode),
      colorScheme: o.value(this.props.colorScheme),
      xData: o.value(this.props.x),
      yData: o.value(this.props.y),
      categoryData: o.value(this.props.category),
      categoryCount: o.value(this.props.categoryCount),
      categoryColors: o.value(this.props.categoryColors),
      matrix: o.value($o()),
      width: o.value(i),
      height: o.value(a),
      pointSize: o.value(this.props.pointSize),
      densityBandwidth: o.value(this.props.densityBandwidth),
      downsampleMaxPoints: o.value(this.props.downsampleMaxPoints),
      downsampleDensityWeight: o.value(this.props.downsampleDensityWeight)
    }, this.device = o.value(r), this.dataBuffers = _u(o, this.device, this.renderInputs), this.module = o.derive([this.device], (l) => l.createShaderModule({ code: mu })), this.uniforms = au(o, this.device), this.renderer = bu(
      o,
      this.device,
      this.module,
      this.uniforms,
      n,
      this.renderInputs,
      this.dataBuffers
    );
  }
  setProps(t) {
    let r = !1, n;
    for (n in t)
      t[n] !== this.props[n] && (this.props[n] = t[n], r = !0);
    return this.viewport.update(
      { x: this.props.viewportX, y: this.props.viewportY, scale: this.props.viewportScale },
      this.props.width,
      this.props.height
    ), this.renderInputs.mode.value = this.props.mode, this.renderInputs.colorScheme.value = this.props.colorScheme, this.renderInputs.xData.value = this.props.x, this.renderInputs.yData.value = this.props.y, this.renderInputs.categoryData.value = this.props.category, this.renderInputs.categoryColors.value = this.props.categoryColors, this.props.category != null ? this.renderInputs.categoryCount.value = this.props.categoryCount : this.renderInputs.categoryCount.value = 1, this.renderInputs.matrix.value = this.viewport.matrix(), this.renderInputs.width.value = this.props.width, this.renderInputs.height.value = this.props.height, this.renderInputs.pointSize.value = this.props.pointSize, this.renderInputs.densityBandwidth.value = this.props.densityBandwidth, this.renderInputs.downsampleMaxPoints.value = this.props.downsampleMaxPoints, this.renderInputs.downsampleDensityWeight.value = this.props.downsampleDensityWeight, r;
  }
  render() {
    this.renderer.value(this.props, this.context.getCurrentTexture().createView());
  }
  destroy() {
    this.df.destroy();
  }
  async densityMap(t, r, n, i) {
    let a = this.df.subgraph(), { x: o, y: l, scale: s } = i, u = [s, 0, 0, 0, s, 0, -o * s, -l * s, 1], f = Vo(u), h = await wu(
      a,
      this.device,
      this.module,
      this.uniforms,
      a.value(t),
      a.value(r),
      a.value(n),
      a.value(u),
      this.dataBuffers
    ).value();
    return a.destroy(), {
      data: h,
      width: t,
      height: r,
      coordinateAtPixel: (p, d) => {
        let v = p / t * 2 - 1, g = d / r * 2 - 1, y = qo([v, g, 1], f);
        return { x: y[0], y: y[1] };
      }
    };
  }
}
function _u(e, t, r) {
  let n = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST;
  const i = e.derive([r.xData], (f) => f.length), a = e.derive([i], (f) => f * 4), o = i, l = e.statefulDerive(
    [t, e.statefulDerive([t, a, n], ct), r.xData],
    tn
  ), s = e.statefulDerive(
    [t, e.statefulDerive([t, a, n], ct), r.yData],
    tn
  ), u = e.statefulDerive(
    [t, e.statefulDerive([t, o, n], ct), r.categoryData],
    tn
  );
  return { x: l, y: s, category: u, count: i };
}
function Jo(e, t, r, n, i, a, o) {
  let l = "rgba16float", s = "r16float", u = GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING, f = e.statefulDerive(
    [t, r, n, l, u],
    ei
  ), h = e.statefulDerive(
    [t, r, n, s, u],
    ei
  ), p = e.derive(
    [i, a, o],
    (y, _, w) => y * _ * w * 4
    // w * h * categoryCount * sizeof(uint32)
  ), d = e.derive(
    [i, a, o],
    (y, _, w) => y * _ * w * 2
    // w * h * categoryCount * sizeof(f16)
  ), v = e.statefulDerive(
    [t, p, GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC],
    ct
  ), g = e.statefulDerive([t, d, GPUBufferUsage.STORAGE], ct);
  return {
    colorTexture: f,
    alphaTexture: h,
    colorTextureFormat: l,
    alphaTextureFormat: s,
    countBuffer: v,
    blurBuffer: g
  };
}
function bu(e, t, r, n, i, a, o) {
  let l = e.derive([a.densityBandwidth], (N) => Math.ceil(N * 3) + 1), s = e.derive([a.width, l], (N, q) => N + q * 2), u = e.derive([a.height, l], (N, q) => N + q * 2), f = e.derive([s], (N) => Math.ceil(N / 4)), h = e.derive([u], (N) => Math.ceil(N / 4)), p = Jo(
    e,
    t,
    s,
    u,
    f,
    h,
    a.categoryCount
  ), d = Ho(e, t, n.buffer, o, p), v = fu(e, t, o.count, a.downsampleMaxPoints), g = jo(e, t, r, d, o, p), y = hu(e, t, r, d, o, p), _ = pu(
    e,
    t,
    r,
    d,
    v,
    p
  ), w = du(e, t, r, d, p), x = vu(e, t, r, i, d), T = Zo(e, t, r, d, s, u, a.categoryCount), F = e.derive([d.layouts], (N) => N), S = cu(
    e,
    t,
    r,
    e.derive([F], (N) => N.group0),
    e.derive([F], (N) => N.group1),
    p.blurBuffer,
    // Pass blur buffer directly for density lookup
    d.group0,
    d.group1,
    v,
    o
  ), C = e.derive(
    [a.densityBandwidth, s, f],
    (N, q, O) => Ko(N / q * O)
  ), G = e.derive(
    [a.categoryColors, a.categoryCount],
    (N, q) => (N == null && (N = jr(q)), N.map((O) => In(O)))
  );
  return e.derive(
    [
      t,
      s,
      u,
      f,
      h,
      n.update,
      o.count,
      a.matrix,
      G,
      y,
      _,
      x,
      g,
      T,
      w,
      S,
      C
    ],
    (N, q, O, j, pe, K, oe, ee, B, ae, fe, Ue, ge, de, le, we, Ee) => (Q, it) => {
      let xt = Q.colorScheme == "light" ? [1, 1, 1, 1] : [0, 0, 0, 1], ot = Q.width / q, E = Q.height / O, M = On([ot, 0, 0, 0, E, 0, 0, 0, 1], ee);
      K({
        count: oe,
        category_count: Q.categoryCount,
        framebuffer_width: q,
        framebuffer_height: O,
        density_width: j,
        density_height: pe,
        gamma: Q.gamma,
        point_size: Math.max(Q.mode == "points" ? 3 : 1, Q.pointSize),
        point_alpha: Q.pointAlpha,
        points_alpha: Q.pointsAlpha,
        density_scaler: Q.densityScaler / 16,
        quantization_step: Q.densityQuantizationStep,
        density_alpha: Q.densityAlpha,
        contours_alpha: Q.contoursAlpha,
        matrix: M,
        view_xy_scaler: [1 / ot, 1 / E],
        kde_causal: Ee.kde_causal,
        kde_anticausal: Ee.kde_anticausal,
        kde_a: Ee.kde_a,
        background_color: xt,
        category_colors: B
      });
      let X = N.createCommandEncoder();
      const ne = Q.downsampleMaxPoints, re = ne === null || ne === 1 / 0 || !Number.isFinite(ne) || ne <= 0 ? null : ne;
      if (re !== null && oe > re) {
        ge(X), de(X);
        const Ye = {
          maxPoints: re,
          densityWeight: Q.downsampleDensityWeight,
          frameSeed: 42
        };
        we(X, Ye), fe(X, oe), Q.mode == "density" && (Q.densityAlpha > 0 || Q.contoursAlpha > 0) && le(X);
      } else
        ae(X), Q.mode == "density" && (Q.densityAlpha > 0 || Q.contoursAlpha > 0) && (ge(X), de(X), le(X));
      Ue(X, it), N.queue.submit([X.finish()]);
    }
  );
}
function wu(e, t, r, n, i, a, o, l, s) {
  let u = Jo(e, t, i, a, i, a, e.value(1)), f = Ho(e, t, n.buffer, s, u), h = jo(e, t, r, f, s, u), p = Zo(e, t, r, f, i, a, e.value(1));
  return e.derive(
    [
      t,
      i,
      a,
      s.count,
      n.update,
      o,
      l,
      h,
      p,
      u.countBuffer
    ],
    (d, v, g, y, _, w, x, T, F, S) => () => {
      let C = d.createCommandEncoder(), G = Ko(w);
      _({
        count: y,
        category_count: 1,
        framebuffer_width: v,
        framebuffer_height: g,
        density_width: v,
        density_height: g,
        gamma: 1,
        point_size: 0,
        point_alpha: 0,
        points_alpha: 0,
        density_scaler: 0,
        quantization_step: 0,
        density_alpha: 0,
        contours_alpha: 0,
        matrix: x,
        view_xy_scaler: [1, 1],
        kde_causal: G.kde_causal,
        kde_anticausal: G.kde_anticausal,
        kde_a: G.kde_a,
        background_color: [0, 0, 0, 0],
        category_colors: []
      }), T(C), F(C);
      let N = d.createBuffer({
        size: v * g * 2,
        usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
      });
      return C.copyBufferToBuffer(S, 0, N, 0, v * g * 2), d.queue.submit([C.finish()]), N.mapAsync(GPUMapMode.READ, 0, v * g * 2).then(() => Au(N.getMappedRange()));
    }
  );
}
function Au(e) {
  let t = new Uint16Array(e), r = new Uint32Array(t.length);
  for (let n = 0; n < t.length; n++) {
    let i = t[n] & 32767, a = t[n] & 32768, o = t[n] & 31744;
    i <<= 13, a <<= 16, i += 939524096, i = o == 0 ? 0 : i, i |= a, r[n] = i;
  }
  return new Float32Array(r.buffer);
}
let cr;
function Ru() {
  return cr == null && (cr = document.createElement("canvas"), cr.width = 1, cr.height = 1), cr.getContext("2d");
}
function Tu(e) {
  let t = Ru();
  t.font = `${e.fontSize ?? 10}px ${e.fontFamily ?? "system-ui"}`;
  let r = e.text.split(`
`).map((i) => t.measureText(i).width), n = (e.fontSize ?? 10) * (e.lineSpacing ?? 1) * r.length;
  return {
    width: r.reduce((i, a) => Math.max(i, a)),
    height: n
  };
}
let cn = null, An = /* @__PURE__ */ new Map();
function Eu() {
  return cn == null && (cn = new Promise((e, t) => {
    let r = new Worker(new URL("./clustering.worker.js", import.meta.url), { type: "module" });
    r.onmessage = (n) => {
      if (n.data.ready) {
        e(r);
        return;
      }
      if (n.data.id != null) {
        let i = An.get(n.data.id);
        i != null && (An.delete(n.data.id), i(n.data));
      }
    };
  })), cn;
}
function ea(e, t, r = []) {
  return new Promise((n, i) => {
    Eu().then((a) => {
      let o = (/* @__PURE__ */ new Date()).getTime().toString() + "-" + Math.random().toString();
      An.set(o, (l) => {
        n(l.payload);
      }), a.postMessage({ id: o, name: e, payload: t }, r);
    });
  });
}
let Mu = (e, t, r, n) => ea("findClusters", [e, t, r, n], [e.buffer]), Su = (...e) => ea("dynamicLabelPlacement", e);
async function Ei(e, t, r) {
  let n = t.reduce((u, f) => Math.min(u, f.level ?? 0), 0), i = t.reduce((u, f) => Math.max(u, f.level ?? 0), 0), a = e * 0.5, o = e * 2, l = t.map((u) => {
    let f = { x: u.x, y: u.y }, h = u.level ?? 0, p = h == 0 ? 14 : 12, d = Tu({
      text: u.text,
      fontSize: p,
      fontFamily: r
    });
    return d.width += 4, d.height += 4, {
      text: u.text,
      fontSize: p,
      bounds: {
        xMin: f.x - d.width / 2,
        xMax: f.x + d.width / 2,
        yMin: f.y - d.height / 2,
        yMax: f.y + d.height / 2
      },
      locationAtZero: f,
      priority: u.priority,
      minScale: u.level == i ? null : 1 / (o * Math.pow(2, h) * 1.2),
      maxScale: u.level == n ? null : 1 / (o * Math.pow(2, h - 1)),
      coordinate: { x: u.x, y: u.y },
      placement: null
    };
  }), s = await Su(l, { globalMaxScale: 1 / a });
  for (let u = 0; u < s.length; u++) {
    let f = s[u];
    if (f != null) {
      let h = 1 / f.minScale, p = 1 / f.maxScale;
      l[u].placement = { minScale: p, maxScale: h };
    }
  }
  return l;
}
function Fu(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Mi = { exports: {} }, Si;
function Du() {
  return Si || (Si = 1, (function(e) {
    (function() {
      function t(l, s) {
        var u = l.x - s.x, f = l.y - s.y;
        return u * u + f * f;
      }
      function r(l, s, u) {
        var f = s.x, h = s.y, p = u.x - f, d = u.y - h;
        if (p !== 0 || d !== 0) {
          var v = ((l.x - f) * p + (l.y - h) * d) / (p * p + d * d);
          v > 1 ? (f = u.x, h = u.y) : v > 0 && (f += p * v, h += d * v);
        }
        return p = l.x - f, d = l.y - h, p * p + d * d;
      }
      function n(l, s) {
        for (var u = l[0], f = [u], h, p = 1, d = l.length; p < d; p++)
          h = l[p], t(h, u) > s && (f.push(h), u = h);
        return u !== h && f.push(h), f;
      }
      function i(l, s, u, f, h) {
        for (var p = f, d, v = s + 1; v < u; v++) {
          var g = r(l[v], l[s], l[u]);
          g > p && (d = v, p = g);
        }
        p > f && (d - s > 1 && i(l, s, d, f, h), h.push(l[d]), u - d > 1 && i(l, d, u, f, h));
      }
      function a(l, s) {
        var u = l.length - 1, f = [l[0]];
        return i(l, 0, u, s, f), f.push(l[u]), f;
      }
      function o(l, s, u) {
        if (l.length <= 2) return l;
        var f = s !== void 0 ? s * s : 1;
        return l = u ? l : n(l, f), l = a(l, f), l;
      }
      e.exports = o, e.exports.default = o;
    })();
  })(Mi)), Mi.exports;
}
var Pu = Du();
const Fi = /* @__PURE__ */ Fu(Pu);
function Bu(e, t) {
  let r = e.slice();
  for (let n = 0; n < t; n++) {
    const i = [], a = r.length;
    for (let o = 0; o < a; o++) {
      const l = r[o], s = r[(o + 1) % a], u = {
        x: 0.75 * l.x + 0.25 * s.x,
        y: 0.75 * l.y + 0.25 * s.y
      }, f = {
        x: 0.25 * l.x + 0.75 * s.x,
        y: 0.25 * l.y + 0.75 * s.y
      };
      i.push(u, f);
    }
    r = i;
  }
  return r;
}
function Cu(e, t) {
  const r = Bu(e, 5), n = No(r);
  let i = Math.max(n.xMax - n.xMin, n.yMax - n.yMin) / 100, a = Fi(r, i), o = 0;
  for (; a.length > t && o < 20; )
    i *= 1.1, o += 1, a = Fi(r, i);
  return a;
}
const Di = {
  light: {
    fontFamily: "system-ui,sans-serif",
    clusterLabelColor: "#000",
    clusterLabelOutlineColor: "rgba(255,255,255,0.8)",
    clusterLabelOpacity: 0.8,
    statusBar: !0,
    statusBarTextColor: "#525252",
    statusBarBackgroundColor: "rgba(255,255,255,0.9)",
    brandingLink: { text: "Embedding Atlas", href: "https://apple.github.io/embedding-atlas" }
  },
  dark: {
    fontFamily: "system-ui,sans-serif",
    clusterLabelColor: "#ccc",
    clusterLabelOutlineColor: "rgba(0,0,0,0.8)",
    clusterLabelOpacity: 0.8,
    statusBar: !0,
    statusBarTextColor: "#d9d9d9",
    statusBarBackgroundColor: "rgba(0,0,0,0.9)",
    brandingLink: { text: "Embedding Atlas", href: "https://apple.github.io/embedding-atlas" }
  }
};
function Uu(e, t) {
  return e == null ? Di[t] : { ...Di[t], ...e, ...e[t] != null ? e[t] : {} };
}
function ku(e, t, r, n, i, a, o) {
  let l = Math.max(n, i) / a, s = e / (r * r) / (l * l), u = 1 / (s / (a * a)) * 0.2, f = Math.sqrt(e / t / (l * l)), h = Math.log(f), p = Math.log(r), d = (Math.min(Math.max((p - h) * 2, -1), 1) + 1) / 2, v;
  if (o != null)
    v = o * a;
  else {
    let _ = 0.25 / Math.sqrt(s);
    v = Math.max(0.2, Math.min(5, _)) * a;
  }
  let g = 1 - d, y = 0.5 + d * 0.5;
  return {
    densityScaler: u,
    densityAlpha: g,
    contoursAlpha: g,
    pointSize: v,
    pointAlpha: 0.7,
    pointsAlpha: y,
    densityBandwidth: 20
  };
}
var Nu = /* @__PURE__ */ Pt("<div></div>"), Lu = /* @__PURE__ */ mt("<circle></circle>"), Gu = /* @__PURE__ */ mt("<circle></circle>"), zu = /* @__PURE__ */ mt('<text dominant-baseline="middle"> </text>'), Iu = /* @__PURE__ */ mt("<g></g>"), Ou = /* @__PURE__ */ mt("<g><!></g>"), $u = /* @__PURE__ */ mt("<g></g>"), qu = /* @__PURE__ */ Pt('<div><canvas></canvas> <div><!></div> <svg role="none"><!><!><!><!></svg> <!> <!></div>');
function ta(e, t) {
  Ft(t, !0);
  let r = R(t, "data", 19, () => ({ x: new Float32Array(), y: new Float32Array(), category: null })), n = R(t, "categoryCount", 3, 1), i = R(t, "categoryColors", 3, null), a = R(t, "width", 3, 800), o = R(t, "height", 3, 800), l = R(t, "pixelRatio", 3, 2), s = R(t, "theme", 3, null), u = R(t, "config", 3, null), f = R(t, "totalCount", 3, null), h = R(t, "maxDensity", 3, null), p = R(t, "labels", 3, null), d = R(t, "queryClusterLabels", 3, null), v = R(t, "tooltip", 7, null), g = R(t, "selection", 7, null), y = R(t, "querySelection", 3, null), _ = R(t, "rangeSelection", 7, null), w = R(t, "defaultViewportState", 3, null), x = R(t, "viewportState", 7, null), T = R(t, "customTooltip", 3, null), F = R(t, "customOverlay", 3, null), S = R(t, "onViewportState", 3, null), C = R(t, "onTooltip", 3, null), G = R(t, "onSelection", 3, null), N = R(t, "onRangeSelection", 3, null), q = R(t, "cache", 3, null), O = /* @__PURE__ */ k(() => u()?.colorScheme ?? "light"), j = /* @__PURE__ */ k(() => Uu(s(), c(O))), pe = /* @__PURE__ */ k(() => i() ?? jr(n())), K = /* @__PURE__ */ k(() => x() ?? w() ?? { x: 0, y: 0, scale: 1 }), oe = /* @__PURE__ */ k(() => new zr(c(K), a(), o())), ee = /* @__PURE__ */ k(() => c(oe).pixelLocationFunction()), B = /* @__PURE__ */ k(() => c(oe).coordinateAtPixelFunction()), ae = /* @__PURE__ */ te(!1);
  function fe(b, A) {
    return b.x == A.x && b.y == A.y && b.category == A.category && b.text == A.text;
  }
  let Ue = /* @__PURE__ */ k(() => g()?.length == 1 && v() != null && fe(g()[0], v()));
  function ge(b) {
    Rt(x(), b) || (x(b), S()?.(b));
  }
  function de(b) {
    Rt(v(), b) || (v(b), C()?.(b));
  }
  function le(b) {
    Rt(g(), b) || (g(b), G()?.(b));
  }
  function we(b) {
    Rt(_(), b) || (_(b), N()?.(b));
  }
  let Ee = /* @__PURE__ */ te(Nt([])), Q = /* @__PURE__ */ te(null), it = /* @__PURE__ */ te("none"), xt = /* @__PURE__ */ k(() => a() * l()), ot = /* @__PURE__ */ k(() => o() * l()), E = /* @__PURE__ */ te(null), M = /* @__PURE__ */ te(null), X = /* @__PURE__ */ te(null), ne = /* @__PURE__ */ k(() => u()?.minimumDensity ?? 1 / 16), re = /* @__PURE__ */ k(() => u()?.pointSize ?? null), Ye = /* @__PURE__ */ k(() => u()?.mode ?? "points"), Hr = /* @__PURE__ */ k(() => u()?.autoLabelEnabled), Bt = /* @__PURE__ */ k(() => u()?.downsampleMaxPoints ?? 4e6), Ct = /* @__PURE__ */ k(() => u()?.downsampleDensityWeight ?? 5), _t = /* @__PURE__ */ k(() => ku(h() ?? (f() ?? r().x.length) / 4, c(ne), c(K).scale, c(xt), c(ot), l(), c(re))), at = /* @__PURE__ */ k(() => c(_t).pointSize), $n = !0;
  gr(() => {
    c(M)?.setProps({
      mode: c(Ye),
      colorScheme: c(O),
      viewportX: c(K).x,
      viewportY: c(K).y,
      viewportScale: c(K).scale,
      width: c(xt),
      height: c(ot),
      x: r().x,
      y: r().y,
      category: r().category,
      categoryCount: n(),
      categoryColors: c(pe),
      downsampleMaxPoints: c(Bt),
      downsampleDensityWeight: c(Ct),
      ...c(_t)
    }) && (na(), (c(Hr) !== !1 || p() != null) && $n && c(M) != null && r().x != null && r().x.length > 0 && w() != null && ($n = !1, da(w())));
  });
  function qn() {
    Qr = null, !(!c(E) || !c(M)) && (c(E).width = c(M).props.width, c(E).height = c(M).props.height, c(E).style.width = `${c(M).props.width / l()}px`, c(E).style.height = `${c(M).props.height / l()}px`, c(M).render());
  }
  let Qr = null;
  function na() {
    Qr == null && (Qr = requestAnimationFrame(qn));
  }
  function Vn(b) {
    z(X, "WebGPU is unavailable. Falling back to WebGL.");
    let A;
    function P() {
      if (A = b.getContext("webgl2", { antialias: !1 }), A == null) {
        console.error("Could not get WebGL 2 context");
        return;
      }
      A.getExtension("EXT_color_buffer_float"), A.getExtension("EXT_float_blend"), A.getExtension("OES_texture_float_linear"), z(M, new Js(A, c(xt), c(ot)), !0);
    }
    P(), b.addEventListener("webglcontextlost", () => {
      c(M)?.destroy(), z(M, null), A = null;
    }), b.addEventListener("webglcontextrestored", () => {
      P();
    });
  }
  function ia(b) {
    let A = !0;
    async function P() {
      let U = await Ma();
      if (U == null) {
        console.error("Could not get WebGPU device"), A && Vn(b);
        return;
      }
      let L = b.getContext("webgpu");
      if (L == null) {
        console.error("Could not get WebGPU canvas context"), A && Vn(b);
        return;
      }
      A = !1, U.lost.then(async (Z) => {
        console.info(`WebGPU device was lost: ${Z.message}`), Z.reason != "destroyed" && (c(M)?.destroy(), z(M, null), L.unconfigure(), await P());
      });
      let I = navigator.gpu.getPreferredCanvasFormat();
      L.configure({ device: U, format: I, alphaMode: "premultiplied" }), z(M, new xu(L, U, I, c(xt), c(ot)), !0);
    }
    P();
  }
  function oa(b) {
    b != null && x() == null && ge(b);
  }
  gr(() => oa(w())), Ln(() => {
    if (c(E) == null)
      return;
    ia(c(E));
    let b = c(E).toDataURL;
    c(E).toDataURL = (...A) => (qn(), b.apply(c(E), A));
  }), Nl(() => {
    c(M)?.destroy(), z(M, null);
  });
  function Wt(b) {
    let A = c(E)?.getBoundingClientRect() ?? { left: 0, top: 0 };
    return { x: b.clientX - A.left, y: b.clientY - A.top };
  }
  function aa(b) {
    b.preventDefault();
    let { x: A, y: P } = Wt(b), U = Math.exp(-b.deltaY / 200);
    la(U, { x: A, y: P });
  }
  function la(b, A) {
    let { x: P, y: U, scale: L } = c(K);
    de(null);
    let I = (w()?.scale ?? 1) * 100, Z = (w()?.scale ?? 1) * 0.01, se = Math.min(I, Math.max(Z, L * b)), J = c(E).getBoundingClientRect(), ye = Math.max(J.width, J.height), lt = (A.x - J.width / 2) / ye * 2, Me = (J.height / 2 - A.y) / ye * 2, Ae = P + lt / L - lt / se, wt = U + Me / L - Me / se;
    ge({ x: Ae, y: wt, scale: se });
  }
  function sa(b) {
    de(null);
    let A = "pan";
    c(it) != "none" ? b.modifiers.shift || (A = c(it)) : b.modifiers.shift && (A = b.modifiers.meta ? "lasso" : "marquee");
    let P = Wt(b);
    switch (A) {
      case "marquee":
        return {
          move: (U) => {
            if (de(null), c(M) == null)
              return;
            let L = Wt(U), I = c(B)(P.x, P.y), Z = c(B)(L.x, L.y);
            we({
              xMin: Math.min(I.x, Z.x),
              yMin: Math.min(I.y, Z.y),
              xMax: Math.max(I.x, Z.x),
              yMax: Math.max(I.y, Z.y)
            });
          }
        };
      case "lasso": {
        let U = [c(B)(P.x, P.y)];
        return {
          move: (L) => {
            if (de(null), c(M) == null)
              return;
            let I = Wt(L);
            U = [...U, c(B)(I.x, I.y)], U.length >= 3 && we(Cu(U, 24));
          }
        };
      }
      case "pan": {
        let U = c(B)(0, 0), L = c(B)(1, 1), I = U.x - L.x, Z = U.y - L.y, se = c(K).x, J = c(K).y;
        return {
          move: (ye) => {
            ge({
              x: se + (ye.clientX - b.clientX) * I,
              y: J + (ye.clientY - b.clientY) * Z,
              scale: c(K).scale
            });
          }
        };
      }
    }
  }
  async function ua(b) {
    if (_() != null)
      we(null);
    else {
      const A = await Xn(Wt(b));
      if (A == null)
        le([]), de(null);
      else if (b.modifiers.shift || b.modifiers.ctrl || b.modifiers.meta) {
        let P = g()?.findIndex((U) => U.x == A.x && U.y == A.y && U.category == A.category);
        g() == null || P == null || P < 0 ? (le([...g() ?? [], A]), de(A)) : (le([
          ...g().slice(0, P),
          ...g().slice(P + 1)
        ]), de(null));
      } else
        le([A]), de(A);
    }
  }
  let Zr = Hl(
    async (b) => {
      let A = b ? Wt(b) : null;
      if (g() != null && g().length == 1) {
        let P = c(ee)(g()[0].x, g()[0].y);
        A != null && Ql(A, P) < 10 && de(g()[0]);
      } else
        de(await Xn(A));
    },
    () => v() != null
  );
  function fa(b) {
    b != null ? c(ae) || Zr(b) : Zr(null);
  }
  gr(() => {
    c(ae) && Zr(null);
  });
  async function Xn(b) {
    if (c(M) == null || b == null || y() == null)
      return null;
    let { x: A, y: P } = c(B)(b.x, b.y), U = Math.abs(c(B)(b.x + 1, b.y).x - A);
    return await y()(A, P, U);
  }
  async function Yn(b, A, P, U = 5e-3) {
    let L = await b.densityMap(1e3, 1e3, A, P), I = await Mu(L.data, L.width, L.height), Z = [];
    for (let J = 0; J < I.length; J++) {
      let ye = I[J], lt = L.coordinateAtPixel(ye.meanX, ye.meanY), Me = ye.boundaryRectApproximation.map(([Ae, wt, Jr, en]) => {
        let Ge = L.coordinateAtPixel(Ae, wt), Ut = L.coordinateAtPixel(Jr, en);
        return {
          xMin: Math.min(Ge.x, Ut.x),
          xMax: Math.max(Ge.x, Ut.x),
          yMin: Math.min(Ge.y, Ut.y),
          yMax: Math.max(Ge.y, Ut.y)
        };
      });
      Z.push({
        x: lt.x,
        y: lt.y,
        sumDensity: ye.sumDensity,
        rects: Me,
        bandwidth: A
      });
    }
    let se = Z.reduce((J, ye) => Math.max(J, ye.sumDensity), 0);
    return Z.filter((J) => J.sumDensity / se > U);
  }
  async function ca(b) {
    if (c(M) == null || d() == null)
      return [];
    let A = await Kl({
      autoLabel: {
        version: 2,
        viewport: b,
        stopWords: u()?.autoLabelStopWords,
        densityThreshold: u()?.autoLabelDensityThreshold
      }
    });
    if (q() != null) {
      let L = await q().get(A);
      if (L != null)
        return L;
    }
    let P = await Yn(c(M), 10, b, u()?.autoLabelDensityThreshold ?? 5e-3);
    if (P = P.concat(await Yn(c(M), 5, b)), d()) {
      let L = await d()(P.map((I) => I.rects));
      for (let I = 0; I < P.length; I++)
        P[I].label = L[I];
    }
    let U = P.filter((L) => L.label != null && L.label.length > 0).map((L) => ({
      x: L.x,
      y: L.y,
      text: L.label,
      priority: L.sumDensity,
      level: L.bandwidth == 10 ? 0 : 1
    }));
    return q() != null && await q().set(A, U), U;
  }
  async function da(b) {
    let A = new zr(b, 1e3, 1e3);
    if (c(M) != null)
      if (p() != null)
        z(Ee, await Ei(A.scale(), p(), c(j).fontFamily), !0);
      else {
        z(Q, "Generating labels...");
        let P = await ca(b);
        z(Ee, await Ei(A.scale(), P, c(j).fontFamily), !0), z(Q, null);
      }
  }
  class ha {
    content;
    constructor(A, P) {
      let U = document.createElement("div");
      this.content = U, this.update(P), A.appendChild(U);
    }
    update(A) {
      let P = this.content;
      P.style.fontFamily = A.fontFamily, c(O) == "light" ? (P.style.color = "#000", P.style.background = "#fff", P.style.border = "1px solid #000") : (P.style.color = "#ccc", P.style.background = "#000", P.style.border = "1px solid #ccc"), P.style.borderRadius = "2px", P.style.padding = "5px", P.style.fontSize = "12px", P.style.maxWidth = "300px", P.innerText = A.tooltip.text ?? JSON.stringify(A.tooltip);
    }
  }
  var Tr = qu();
  let Wn;
  var Kr = ve(Tr);
  Y(Kr, "", {}, { position: "absolute", top: "0", left: "0" }), xn(Kr, (b) => z(E, b), () => c(E));
  var Er = ie(Kr, 2);
  let jn;
  var pa = ve(Er);
  {
    var va = (b) => {
      const A = /* @__PURE__ */ k(() => Lo(F())), P = /* @__PURE__ */ k(() => ({
        location: c(ee),
        width: a(),
        height: o()
      }));
      var U = fr(), L = Ht(U);
      Ll(L, () => c(A), (I) => {
        var Z = Nu();
        Oe(Z, (se, J) => c(A)?.(se, J), () => Go(F(), { proxy: c(P) })), ue(I, Z);
      }), ue(b, U);
    };
    Se(pa, (b) => {
      F() && b(va);
    });
  }
  ce(Er);
  var bt = ie(Er, 2);
  Y(bt, "", {}, { position: "absolute", left: "0", top: "0" });
  var Hn = ve(bt);
  {
    var ga = (b) => {
      const A = /* @__PURE__ */ k(() => {
        const { x: Z, y: se } = c(ee)(v().x, v().y);
        return { x: Z, y: se };
      }), P = /* @__PURE__ */ k(() => Math.max(3, c(at) / l()) + 1);
      var U = fr(), L = Ht(U);
      {
        var I = (Z) => {
          var se = Lu();
          let J;
          Ne(() => {
            D(se, "cx", c(A).x), D(se, "cy", c(A).y), D(se, "r", c(P)), J = Y(se, "", J, {
              stroke: c(O) == "light" ? "#000" : "#fff",
              "stroke-width": 1,
              fill: "none"
            });
          }), ue(Z, se);
        };
        Se(L, (Z) => {
          isFinite(c(A).x) && isFinite(c(A).y) && isFinite(c(P)) && Z(I);
        });
      }
      ue(b, U);
    };
    Se(Hn, (b) => {
      v() != null && c(M) != null && b(ga);
    });
  }
  var Qn = ie(Hn);
  {
    var ya = (b) => {
      var A = fr(), P = Ht(A);
      nn(P, 17, g, rn, (U, L) => {
        const I = /* @__PURE__ */ k(() => {
          const { x: Me, y: Ae } = c(ee)(c(L).x, c(L).y);
          return { x: Me, y: Ae };
        }), Z = /* @__PURE__ */ k(() => c(L).category != null ? c(pe)[c(L).category] : c(pe)[0]), se = /* @__PURE__ */ k(() => Math.max(3, c(at) / l()) + 1);
        var J = fr(), ye = Ht(J);
        {
          var lt = (Me) => {
            var Ae = Gu();
            let wt;
            Ne(() => {
              D(Ae, "cx", c(I).x), D(Ae, "cy", c(I).y), D(Ae, "r", c(se)), wt = Y(Ae, "", wt, {
                stroke: c(O) == "light" ? "#000" : "#fff",
                "stroke-width": 2,
                fill: c(Z)
              });
            }), ue(Me, Ae);
          };
          Se(ye, (Me) => {
            isFinite(c(I).x) && isFinite(c(I).y) && isFinite(c(se)) && Me(lt);
          });
        }
        ue(U, J);
      }), ue(b, A);
    };
    Se(Qn, (b) => {
      g() != null && c(M) != null && b(ya);
    });
  }
  var Zn = ie(Qn);
  {
    var ma = (b) => {
      var A = $u();
      nn(A, 21, () => c(Ee), rn, (P, U) => {
        const L = /* @__PURE__ */ k(() => c(U).text.split(`
`)), I = /* @__PURE__ */ k(() => c(ee)(c(U).coordinate.x, c(U).coordinate.y)), Z = /* @__PURE__ */ k(() => c(oe).scale()), se = /* @__PURE__ */ k(() => c(U).placement != null && c(U).placement.minScale <= c(Z) && c(Z) <= c(U).placement.maxScale);
        var J = Ou(), ye = ve(J);
        {
          var lt = (Me) => {
            var Ae = Iu();
            nn(Ae, 21, () => c(L), rn, (wt, Jr, en) => {
              var Ge = zu();
              D(Ge, "x", 0);
              let Ut;
              var Ra = ve(Ge, !0);
              ce(Ge), Ne(() => {
                D(Ge, "y", (en - (c(L).length - 1) / 2) * c(U).fontSize), D(Ge, "font-size", c(U).fontSize), Ut = Y(Ge, "", Ut, {
                  "paint-order": "stroke",
                  "stroke-width": "4",
                  "stroke-linejoin": "round",
                  "stroke-linecap": "round",
                  "text-anchor": "middle",
                  fill: c(j).clusterLabelColor,
                  stroke: c(j).clusterLabelOutlineColor,
                  opacity: c(j).clusterLabelOpacity,
                  "user-select": "none",
                  "-webkit-user-select": "none",
                  "font-family": c(j).fontFamily
                }), yr(Ra, c(Jr));
              }), ue(wt, Ge);
            }), ce(Ae), ue(Me, Ae);
          };
          Se(ye, (Me) => {
            c(se) && Me(lt);
          });
        }
        ce(J), Ne(() => D(J, "transform", `translate(${c(I).x ?? ""},${c(I).y ?? ""})`)), ue(P, J);
      }), ce(A), ue(b, A);
    };
    Se(Zn, (b) => {
      b(ma);
    });
  }
  var xa = ie(Zn);
  {
    var _a = (b) => {
      var A = fr(), P = Ht(A);
      {
        var U = (I) => {
          rs(I, {
            get value() {
              return _();
            },
            get pointLocation() {
              return c(ee);
            }
          });
        }, L = (I) => {
          jl(I, {
            get value() {
              return _();
            },
            onChange: we,
            get pointLocation() {
              return c(ee);
            },
            get coordinateAtPoint() {
              return c(B);
            },
            preventHover: (Z) => {
              z(ae, Z, !0);
            }
          });
        };
        Se(P, (I) => {
          _() instanceof Array ? I(U) : I(L, !1);
        });
      }
      ue(b, A);
    };
    Se(xa, (b) => {
      _() != null && c(M) != null && b(_a);
    });
  }
  ce(bt), Oe(bt, (b, A) => We?.(b, A), () => ({ click: ua, drag: sa, hover: fa }));
  var Kn = ie(bt, 2);
  {
    var ba = (b) => {
      const A = /* @__PURE__ */ k(() => c(ee)(v().x, v().y));
      {
        let P = /* @__PURE__ */ k(() => Math.max(3, c(at) / l())), U = /* @__PURE__ */ k(() => T() ?? {
          class: ha,
          props: {
            colorScheme: c(O),
            fontFamily: c(j).fontFamily
          }
        });
        ps(b, {
          get location() {
            return c(A);
          },
          get allowInteraction() {
            return c(Ue);
          },
          get targetHeight() {
            return c(P);
          },
          get customTooltip() {
            return c(U);
          },
          get tooltip() {
            return v();
          }
        });
      }
    };
    Se(Kn, (b) => {
      v() != null && c(M) != null && b(ba);
    });
  }
  var wa = ie(Kn, 2);
  {
    var Aa = (b) => {
      {
        let A = /* @__PURE__ */ k(() => c(Q) ?? c(X)), P = /* @__PURE__ */ k(() => 1 / (c(ee)(1, 0).x - c(ee)(0, 0).x));
        cs(b, {
          get resolvedTheme() {
            return c(j);
          },
          get statusMessage() {
            return c(A);
          },
          get distancePerPoint() {
            return c(P);
          },
          get pointCount() {
            return r().x.length;
          },
          get selectionMode() {
            return c(it);
          },
          onSelectionMode: (U) => z(it, U, !0)
        });
      }
    };
    Se(wa, (b) => {
      c(j).statusBar && b(Aa);
    });
  }
  ce(Tr), Ne(() => {
    Wn = Y(Tr, "", Wn, {
      width: `${a() ?? ""}px`,
      height: `${o() ?? ""}px`,
      position: "relative"
    }), jn = Y(Er, "", jn, {
      width: `${a() ?? ""}px`,
      height: `${o() ?? ""}px`,
      position: "absolute",
      top: "0",
      left: "0"
    }), D(bt, "width", a()), D(bt, "height", o());
  }), Ml("wheel", bt, aa), ue(e, Tr), Dt();
}
function ra(e, t, r = 0, n = e.length - 1, i = Vu) {
  for (; n > r; ) {
    if (n - r > 600) {
      const s = n - r + 1, u = t - r + 1, f = Math.log(s), h = 0.5 * Math.exp(2 * f / 3), p = 0.5 * Math.sqrt(f * h * (s - h) / s) * (u - s / 2 < 0 ? -1 : 1), d = Math.max(r, Math.floor(t - u * h / s + p)), v = Math.min(n, Math.floor(t + (s - u) * h / s + p));
      ra(e, t, d, v, i);
    }
    const a = e[t];
    let o = r, l = n;
    for (dr(e, r, t), i(e[n], a) > 0 && dr(e, r, n); o < l; ) {
      for (dr(e, o, l), o++, l--; i(e[o], a) < 0; ) o++;
      for (; i(e[l], a) > 0; ) l--;
    }
    i(e[r], a) === 0 ? dr(e, r, l) : (l++, dr(e, l, n)), l <= t && (r = l + 1), t <= l && (n = l - 1);
  }
}
function dr(e, t, r) {
  const n = e[t];
  e[t] = e[r], e[r] = n;
}
function Vu(e, t) {
  return e < t ? -1 : e > t ? 1 : 0;
}
function Pi(e) {
  let t = new Float32Array(e), r = Math.floor(e.length / 2);
  return ra(t, r), t[r];
}
function Xu(e) {
  return e.length == 0 ? 0 : e.reduce((t, r) => t + r, 0) / e.length;
}
function Bi(e) {
  if (e.length == 0)
    return 0;
  let t = Xu(e);
  return Math.sqrt(e.reduce((r, n) => r + (n - t) * (n - t)) / e.length);
}
function Yu(e, t, r, n = 0, i = 0) {
  let a = new ArrayBuffer(8), o = new Uint32Array(a), l = new BigUint64Array(a), s = /* @__PURE__ */ new Map();
  for (let f = 0; f < e.length; f++) {
    o[0] = Math.floor((e[f] - n) / r), o[1] = Math.floor((t[f] - i) / r);
    let h = l[0];
    s.set(h, (s.get(h) ?? 0) + 1);
  }
  let u = 0;
  for (let f of s.values())
    u = Math.max(f, u);
  return u / (r * r);
}
function Wu(e, t) {
  Ft(t, !0);
  let r = R(t, "tooltip", 3, null), n = R(t, "selection", 3, null), i = R(t, "rangeSelection", 3, null), a = R(t, "categoryColors", 3, null), o = R(t, "width", 3, null), l = R(t, "height", 3, null), s = R(t, "pixelRatio", 3, null), u = R(t, "theme", 3, null), f = R(t, "config", 3, null), h = R(t, "viewportState", 3, null), p = R(t, "labels", 3, null), d = R(t, "customTooltip", 3, null), v = R(t, "customOverlay", 3, null), g = R(t, "querySelection", 3, null), y = R(t, "queryClusterLabels", 3, null), _ = R(t, "onViewportState", 3, null), w = R(t, "onTooltip", 3, null), x = R(t, "onSelection", 3, null), T = R(t, "onRangeSelection", 3, null), F = R(t, "cache", 3, null), S = /* @__PURE__ */ k(() => C(t.data));
  function C(G) {
    let N = 1;
    G.category != null && (N = G.category.reduce((B, ae) => Math.max(B, ae), 0) + 1);
    let q = Pi(G.x), O = Pi(G.y), j = Bi(G.x), pe = Bi(G.y), K = 1 / (Math.max(j, pe, 1e-3) * 3), oe = 0.1 / K, ee = Yu(G.x, G.y, oe, q, O);
    return {
      count: G.x.length,
      categoryCount: N,
      maxDensity: ee,
      defaultViewportState: { x: q, y: O, scale: K * 0.95 }
    };
  }
  {
    let G = /* @__PURE__ */ k(() => o() ?? 800), N = /* @__PURE__ */ k(() => l() ?? 800), q = /* @__PURE__ */ k(() => s() ?? 2), O = /* @__PURE__ */ k(() => ({
      x: t.data.x,
      y: t.data.y,
      category: t.data.category ?? null
    }));
    ta(e, {
      get width() {
        return c(G);
      },
      get height() {
        return c(N);
      },
      get pixelRatio() {
        return c(q);
      },
      get theme() {
        return u();
      },
      get config() {
        return f();
      },
      get data() {
        return c(O);
      },
      get totalCount() {
        return c(S).count;
      },
      get maxDensity() {
        return c(S).maxDensity;
      },
      get categoryCount() {
        return c(S).categoryCount;
      },
      get categoryColors() {
        return a();
      },
      get defaultViewportState() {
        return c(S).defaultViewportState;
      },
      get querySelection() {
        return g();
      },
      get queryClusterLabels() {
        return y();
      },
      get labels() {
        return p();
      },
      get customTooltip() {
        return d();
      },
      get customOverlay() {
        return v();
      },
      get tooltip() {
        return r();
      },
      get onTooltip() {
        return w();
      },
      get selection() {
        return n();
      },
      get onSelection() {
        return x();
      },
      get viewportState() {
        return h();
      },
      get onViewportState() {
        return _();
      },
      get rangeSelection() {
        return i();
      },
      get onRangeSelection() {
        return T();
      },
      get cache() {
        return F();
      }
    });
  }
  Dt();
}
class tf {
  component;
  currentProps;
  constructor(t, r) {
    this.currentProps = { ...r }, this.component = Co({ component: Wu, target: t, props: r });
  }
  update(t) {
    let r = {};
    for (let n in t)
      t[n] !== this.currentProps[n] && (r[n] = t[n], this.currentProps[n] = t[n]);
    this.component.$set(r);
  }
  destroy() {
    this.component.$destroy();
  }
}
function Ci(e, t) {
  if (t.length == 0)
    return m.literal(!1);
  if (e.identifier != null) {
    let r = e.identifier;
    return m.or(...t.map((n) => m.eq(m.column(r), m.literal(n.identifier))));
  } else {
    let r = e.x, n = e.y, i = e.category;
    return i != null ? m.or(
      ...t.map(
        (a) => m.and(
          m.eq(m.cast(m.column(r), "DOUBLE"), m.literal(a.x)),
          m.eq(m.cast(m.column(n), "DOUBLE"), m.literal(a.y)),
          m.eq(m.cast(m.column(i), "INTEGER"), m.literal(a.category))
        )
      )
    ) : m.or(
      ...t.map(
        (a) => m.and(
          m.eq(m.cast(m.column(r), "DOUBLE"), m.literal(a.x)),
          m.eq(m.cast(m.column(n), "DOUBLE"), m.literal(a.y))
        )
      )
    );
  }
}
function ju(e, t, r) {
  let n = [];
  for (let a = 0; a < r.length; a++) {
    let o = (a + 1) % r.length, { x: l, y: s } = r[a], { x: u, y: f } = r[o], h = s < f ? m.and(m.lte(m.literal(s), t), m.lt(t, m.literal(f))) : m.and(m.lte(m.literal(f), t), m.lt(t, m.literal(s))), p = (s < f ? m.lt : m.gt)(
      m.sub(m.mul(m.literal(u - l), t), m.mul(m.literal(f - s), e)),
      m.literal((u - l) * s - (f - s) * l)
    );
    n.push(m.cast(m.and(h, p), "INT"));
  }
  let i = n.reduce((a, o) => m.add(a, o));
  return m.eq(m.mod(i, m.literal(2)), m.literal(1));
}
function Hu(e, t) {
  if (t instanceof Array) {
    if (t.length < 3)
      return m.literal(!1);
    let r = No(t);
    return m.and(
      m.isBetween(m.column(e.x), [r.xMin, r.xMax]),
      m.isBetween(m.column(e.y), [r.yMin, r.yMax]),
      ju(m.column(e.x), m.column(e.y), t)
    );
  } else
    return m.and(
      m.isBetween(m.column(e.x), [t.xMin, t.xMax]),
      m.isBetween(m.column(e.y), [t.yMin, t.yMax])
    );
}
async function Qu(e, t) {
  let { x: r, y: n, table: i } = t, a = await e.query(
    m.Query.from(i).select({
      centerX: m.sql`MEDIAN(${m.column(r)})`,
      centerY: m.sql`MEDIAN(${m.column(n)})`,
      stdX: m.sql`STDDEV(${m.column(r)})`,
      stdY: m.sql`STDDEV(${m.column(n)})`,
      ...t.category != null ? {
        maxCategory: m.sql`MAX(${m.column(t.category)}::UTINYINT)`
      } : {}
    })
  ), { centerX: o, centerY: l, stdX: s, stdY: u, maxCategory: f } = a.get(0), h = 1 / (Math.max(s, u, 1e-3) * 3), p = 0.1 / h, d = m.sql`FLOOR((${m.column(r)} - ${o}) / ${p})`, v = m.sql`FLOOR((${m.column(n)} - ${l}) / ${p})`, g = t.category != null ? m.column(t.category) : null, y = g != null ? [d, v, g] : [d, v], _ = m.Query.from(
    m.Query.from(i).select({ count: m.sql`COUNT(*)` }).groupby(...y)
  ).select({
    totalCount: m.sql`SUM(count)::INT`,
    maxCount: m.sql`MAX(count)::INT`
  });
  a = await e.query(_);
  let { maxCount: w, totalCount: x } = a.get(0), T = w / (p * p);
  return {
    centerX: o,
    centerY: l,
    scaler: h,
    totalCount: x,
    categoryCount: (f ?? 0) + 1,
    maxDensity: T
  };
}
class Zu {
  coordinator;
  source;
  lastDistance;
  selectParams;
  constructor(t, r) {
    this.coordinator = t, this.source = r, this.lastDistance = 0;
    let { x: n, y: i, category: a, text: o, identifier: l } = this.source, s = {}, u = r.additionalFields ?? {};
    for (let f in u) {
      let h = u[f];
      typeof h == "string" ? s["field_" + f] = m.column(h) : s["field_" + f] = m.sql`${h.sql}`;
    }
    this.selectParams = {
      x: m.sql`${m.column(n)}::DOUBLE`,
      y: m.sql`${m.column(i)}::DOUBLE`,
      ...a != null ? { category: m.sql`${m.column(a)}::INT` } : {},
      ...o != null ? { text: m.sql`${m.column(o)}` } : {},
      ...l != null ? { identifier: m.sql`${m.column(l)}` } : {},
      ...s
    };
  }
  _convertToDataPoint(t) {
    let r = {};
    for (let n in t)
      n.startsWith("field_") && (r[n.slice(6)] = t[n]);
    return {
      x: t.x,
      y: t.y,
      category: t.category,
      text: t.text,
      identifier: t.identifier,
      fields: r
    };
  }
  async queryClosestPoint(t, r, n, i) {
    let a = i * 12, { x: o, y: l } = this.source;
    for (let s of [this.lastDistance, a]) {
      if (s == 0 || s > a)
        continue;
      let u = m.Query.from(this.source.table).select(this.selectParams);
      u = u.where(m.sql`${m.column(o)} BETWEEN ${r - s} AND ${r + s}`), u = u.where(m.sql`${m.column(l)} BETWEEN ${n - s} AND ${n + s}`), t && (u = u.where(t)), u = u.orderby(m.sql`(x - (${r}))**2 + (y - (${n}))**2`).limit(1);
      let f = (await this.coordinator.query(u)).get(0);
      if (f)
        return this.lastDistance = Math.max(Math.abs(f.x - r), Math.abs(f.y - n)) * 4, this._convertToDataPoint(f);
    }
    return null;
  }
  async queryPoints(t) {
    let { table: r, identifier: n } = this.source;
    if (n == null)
      return [];
    let i = m.Query.from(r).select(this.selectParams);
    return i = i.where(
      m.isIn(
        m.column(n),
        t.map((a) => m.literal(a))
      )
    ), Array.from(await this.coordinator.query(i)).map((a) => this._convertToDataPoint(a));
  }
}
function Ku(e, t) {
  Ft(t, !0);
  let r = R(t, "coordinator", 19, Ta), n = R(t, "category", 3, null), i = R(t, "text", 3, null), a = R(t, "identifier", 3, null), o = R(t, "filter", 3, null), l = R(t, "categoryColors", 3, null), s = R(t, "tooltip", 3, null), u = R(t, "additionalFields", 3, null), f = R(t, "selection", 3, null), h = R(t, "rangeSelection", 3, null), p = R(t, "rangeSelectionValue", 3, null), d = R(t, "width", 3, null), v = R(t, "height", 3, null), g = R(t, "pixelRatio", 3, null), y = R(t, "config", 3, null), _ = R(t, "theme", 3, null), w = R(t, "viewportState", 3, null), x = R(t, "labels", 3, null), T = R(t, "customTooltip", 3, null), F = R(t, "customOverlay", 3, null), S = R(t, "onViewportState", 3, null), C = R(t, "onTooltip", 3, null), G = R(t, "onSelection", 3, null), N = R(t, "onRangeSelection", 3, null), q = R(t, "cache", 3, null), O = /* @__PURE__ */ te(new Float32Array()), j = /* @__PURE__ */ te(new Float32Array()), pe = /* @__PURE__ */ te(null), K = /* @__PURE__ */ te(1), oe = /* @__PURE__ */ te(1), ee = /* @__PURE__ */ te(1), B = /* @__PURE__ */ te(null), ae = /* @__PURE__ */ te(null), fe = /* @__PURE__ */ te(null), Ue = /* @__PURE__ */ te(null), ge = /* @__PURE__ */ te(null);
  st(() => {
    let E = {
      coordinator: r(),
      source: {
        table: t.table,
        x: t.x,
        y: t.y,
        category: n()
      }
    }, M = null, X = !1;
    async function ne() {
      let re = E.source, Ye = await Qu(E.coordinator, re);
      if (X)
        return;
      let Hr = Ye.scaler * 0.95;
      z(B, {
        x: Ye.centerX,
        y: Ye.centerY,
        scale: Hr
      }), z(oe, Ye.totalCount), z(ee, Ye.maxDensity), z(K, Ye.categoryCount), M = Ea({
        coordinator: E.coordinator,
        selection: o() ?? void 0,
        query: (Bt) => m.Query.from(re.table).select({
          x: m.sql`${m.column(re.x)}::FLOAT`,
          y: m.sql`${m.column(re.y)}::FLOAT`,
          ...re.category != null ? { c: m.sql`${m.column(re.category)}::UTINYINT` } : {}
        }).where(Bt),
        queryResult: (Bt) => {
          let Ct = Bt.getChild("x").toArray(), _t = Bt.getChild("y").toArray(), at = Bt.getChild("c")?.toArray() ?? null;
          Ct != null && !(Ct instanceof Float32Array) && (Ct = new Float32Array(Ct)), _t != null && !(_t instanceof Float32Array) && (_t = new Float32Array(_t)), at != null && !(at instanceof Uint8Array) && (at = new Uint8Array(at)), z(O, Ct), z(j, _t), z(pe, at), de(null), le(null);
        }
      }), M.reset = () => {
        we();
      }, z(ge, M);
    }
    return ne(), () => {
      z(ge, null), X = !0, M?.destroy();
    };
  }), st(() => {
    if (Jn(s())) {
      let E = c(ge);
      if (E == null)
        return;
      let M = s();
      z(ae, M.valueFor(E) ?? null);
      let X = () => {
        z(ae, M.valueFor(E) ?? null);
      };
      return st(() => {
        let ne = c(ae), re = {
          x: t.x,
          y: t.y,
          category: n(),
          identifier: a()
        };
        M.update({
          source: E,
          clients: (/* @__PURE__ */ new Set()).add(E),
          predicate: ne != null ? Ci(re, [ne]) : null,
          value: ne
        });
      }), M.addEventListener("value", X), () => {
        M.removeEventListener("value", X), M.update({
          source: E,
          clients: (/* @__PURE__ */ new Set()).add(E),
          value: null,
          predicate: null
        });
      };
    } else if (s() == null || typeof s() == "object")
      z(ae, s());
    else {
      if (c(ae)?.identifier == s())
        return;
      let E = !1;
      return it([s()]).then((M) => {
        E || (M.length > 0 ? z(ae, M[0]) : z(ae, null));
      }), () => {
        E = !0;
      };
    }
  });
  function de(E) {
    Rt(s(), E) || (z(ae, E), C()?.(E));
  }
  st(() => {
    if (Jn(f())) {
      let E = c(ge);
      if (E == null)
        return;
      let M = f();
      z(fe, M.valueFor(E) ?? null);
      let X = () => {
        z(fe, M.valueFor(E) ?? null);
      };
      return st(() => {
        let ne = c(fe), re = {
          x: t.x,
          y: t.y,
          category: n(),
          identifier: a()
        };
        M.update({
          source: E,
          clients: (/* @__PURE__ */ new Set()).add(E),
          predicate: ne != null ? Ci(re, ne) : null,
          value: ne
        });
      }), M.addEventListener("value", X), () => {
        M.removeEventListener("value", X), M.update({
          source: E,
          clients: (/* @__PURE__ */ new Set()).add(E),
          value: null,
          predicate: null
        });
      };
    } else if (f() == null)
      z(fe, null);
    else if (f().length == 0)
      z(fe, []);
    else if (f().every((E) => typeof E == "object"))
      z(fe, f());
    else {
      let E = !1;
      return it(f()).then((M) => {
        E || z(fe, M);
      }), () => {
        E = !0;
      };
    }
  });
  function le(E) {
    Rt(f(), E) || (z(fe, E), G()?.(E));
  }
  st(() => {
    let E = c(ge);
    if (E == null)
      return;
    let M = h();
    if (M != null)
      return st(() => {
        let X = c(Ue), ne = { x: t.x, y: t.y }, re = {
          source: E,
          clients: (/* @__PURE__ */ new Set()).add(E),
          predicate: X != null ? Hu(ne, X) : null,
          value: X
        };
        M.update(re), M.activate(re);
      }), () => {
        M.update({
          source: E,
          clients: (/* @__PURE__ */ new Set()).add(E),
          value: null,
          predicate: null
        });
      };
  }), st(() => {
    Rt(Xt(() => c(Ue)), p()) || z(Ue, p());
  });
  function we() {
    le(null), de(null), N()?.(null), z(Ue, null);
  }
  let Ee = /* @__PURE__ */ k(() => new Zu(r(), {
    table: t.table,
    x: t.x,
    y: t.y,
    category: n(),
    text: i(),
    identifier: a(),
    additionalFields: u()
  }));
  async function Q(E, M, X) {
    return await c(Ee).queryClosestPoint(o()?.predicate?.(c(ge)), E, M, X);
  }
  async function it(E) {
    return await c(Ee).queryPoints(E);
  }
  function xt(E) {
    return m.or(...E.map((M) => m.and(m.isBetween(m.column(t.x), [M.xMin, M.xMax]), m.isBetween(m.column(t.y), [M.yMin, M.yMax]))));
  }
  async function ot(E) {
    return i() == null ? E.map(() => null) : await Promise.all(E.map(async (M) => {
      if (M.length == 0)
        return null;
      let X = m.Query.from(t.table).select({ label: m.column(i()), count: m.count() }).where(m.and(xt(M), m.not(m.isNull(m.column(i()))), m.neq(m.cast(m.column(i()), "VARCHAR"), m.literal("")))).groupby("label").orderby(m.desc(m.count())).limit(1), ne = await r().query(X);
      if (ne.numRows == 0)
        return null;
      let re = ne.get(0)?.label;
      return re == null ? null : `${re}`;
    }));
  }
  {
    let E = /* @__PURE__ */ k(() => d() ?? 800), M = /* @__PURE__ */ k(() => v() ?? 800), X = /* @__PURE__ */ k(() => g() ?? 2), ne = /* @__PURE__ */ k(() => ({
      x: c(O),
      y: c(j),
      category: c(pe)
    }));
    ta(e, {
      get width() {
        return c(E);
      },
      get height() {
        return c(M);
      },
      get pixelRatio() {
        return c(X);
      },
      get theme() {
        return _();
      },
      get config() {
        return y();
      },
      get data() {
        return c(ne);
      },
      get totalCount() {
        return c(oe);
      },
      get maxDensity() {
        return c(ee);
      },
      get categoryCount() {
        return c(K);
      },
      get categoryColors() {
        return l();
      },
      get defaultViewportState() {
        return c(B);
      },
      querySelection: Q,
      queryClusterLabels: ot,
      get labels() {
        return x();
      },
      get customTooltip() {
        return T();
      },
      get customOverlay() {
        return F();
      },
      get tooltip() {
        return c(ae);
      },
      onTooltip: de,
      get selection() {
        return c(fe);
      },
      onSelection: le,
      get viewportState() {
        return w();
      },
      get onViewportState() {
        return S();
      },
      get rangeSelection() {
        return c(Ue);
      },
      onRangeSelection: (re) => {
        z(Ue, re), N()?.(re);
      },
      get cache() {
        return q();
      }
    });
  }
  Dt();
}
class rf {
  component;
  currentProps;
  constructor(t, r) {
    this.currentProps = { ...r }, this.component = Co({ component: Ku, target: t, props: r });
  }
  update(t) {
    let r = {};
    for (let n in t)
      t[n] !== this.currentProps[n] && (r[n] = t[n], this.currentProps[n] = t[n]);
    this.component.$set(r);
  }
  destroy() {
    this.component.$destroy();
  }
}
function nf() {
  return Ui() ? 32 : 4;
}
export {
  jr as J,
  nf as a,
  rf as o,
  tf as r
};
