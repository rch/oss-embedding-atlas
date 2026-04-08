function i(t, u, ...n) {
  try {
    if (n.every((e) => e !== void 0)) {
      const e = t[u];
      if (typeof e == "function")
        return e(...n);
    }
  } catch (e) {
    console.error(e);
  }
}
const w = 2;
function v(t) {
  return {
    clientX: t.clientX,
    clientY: t.clientY,
    pageX: t.pageX,
    pageY: t.pageY,
    modifiers: { shift: t.shiftKey, ctrl: t.ctrlKey, alt: t.altKey, meta: t.metaKey }
  };
}
function L(t, u) {
  let n = u, e, a = !1, l = !1;
  const d = (o) => {
    let c = v(o);
    o.preventDefault(), o.stopPropagation(), y(), a = !0, e && (i(e, "up"), e = void 0);
    let p = (s) => {
      let r = v(s);
      n.drag && !e ? Math.hypot(c.clientX - r.clientX, c.clientY - r.clientY) > w && (e = i(n, "drag", c), e && i(e, "move", r)) : e && i(e, "move", r);
    }, E = (s) => {
      let r = v(s);
      a = !1, window.removeEventListener("mousemove", p), window.removeEventListener("mouseup", E), e ? (i(e, "up", s), e = void 0) : n.click && i(n, "click", r);
    };
    window.addEventListener("mousemove", p, { passive: !0 }), window.addEventListener("mouseup", E, { passive: !0 });
  }, f = (o) => {
    if (!a) {
      n.hover && (i(n, "hover", v(o)), l = !0);
      return;
    }
  }, m = (o) => {
    l && n.hover && (i(n, "hover", null), l = !1);
  };
  return t.addEventListener("mousedown", d, { passive: !1 }), t.addEventListener("mousemove", f, { passive: !0 }), t.addEventListener("mouseleave", m, { passive: !0 }), {
    update: (o) => {
      n = o;
    },
    destroy: () => {
      t.removeEventListener("mousedown", d), t.removeEventListener("mousemove", f), t.removeEventListener("mouseleave", m);
    }
  };
}
function y() {
  try {
    document.activeElement && document.activeElement !== document.body && document.activeElement.blur?.();
  } catch {
  }
}
export {
  L as i
};
