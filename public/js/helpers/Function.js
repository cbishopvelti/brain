  //FUNCTION OVERRIDES
Function.prototype.createDelegate = function(c, b, a) {
  var d = this;
  return function() {
    var f = b || arguments;
    if (a === true) {
      f = Array.prototype.slice.call(arguments, 0);
      f = f.concat(b);
    } else {
      if (typeof a == "number") {
        f = Array.prototype.slice.call(arguments, 0);
        var e = [a, 0].concat(b);
        Array.prototype.splice.apply(f, e);
      }
    }
    return d.apply(c || this, f);
  };
};

if( typeof window == "undefined" ){
  window = global;
}

window.namespace = function() {
  var a = arguments,
    o = null,
    i, j, d, rt;
  for (i = 0; i < a.length; ++i) {
    d = a[i].split(".");
    rt = d[0];
    eval("if (typeof window." + rt + " == \"undefined\"){window." + rt + " = {};} o = window." + rt + ";");
    for (j = 1; j < d.length; ++j) {
      o[d[j]] = o[d[j]] || {};
      o = o[d[j]];
    }
  }
};
