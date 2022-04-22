// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"scripts/onglet2.js":[function(require,module,exports) {
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var ROW_CHART_HEIGHT = 16.68;
var ROW_CHART_HEIGHT_MARGIN = 21.75; // Reading the data

d3.csv("./TRIP_PART_1.csv").then(function (data1) {
  d3.csv("./TRIP_PART_2.csv").then(function (data2) {
    d3.csv("./TRIP_PART_3.csv").then(function (data3) {
      d3.csv("./Vessel Type Class.csv").then(function (dataTypes) {
        // Id,Departure Date,Departure Hardour,Departure Region,Departure Latitude,Departure Longitude,Arrival Date,Arrival Hardour,Arrival Region,Arrival Latitude,Arrival Longitude,Vessel Type,Lenght,Width,DeadWeight Tonnage,Maximum Draugth
        // 6079000000783579,    2011-01-01 00:00:00.000,Virtual Harbour (Central Region),Central Region,45.71666667,-84.24861111,2011-01-01 15:30:00.000,Goderich,Central Region,43.745,-81.7294441666667,Merchant Bulk,222.509994506836,22.9400005340576,31751,8.72999954223633
        // 23079000000766048,   2011-01-01 00:10:00.000,Whiffen Head,Newfoundland Region,47.7727836111111,-54.0171797222222,2011-01-01 01:00:00.000,Whiffen Head,Newfoundland Region,47.7727836111111,-54.0171797222222,Tug Fire,38.9000015258789,13.8999996185303,314,3.5
        // 23079000000766035,   2011-01-01 00:57:00.000,Whiffen Head,Newfoundland Region,47.7727836111111,-54.0171797222222,2011-01-02 12:45:00.000,Virtual Harbour (Newfoundland Region),Newfoundland Region,47.75,-53,Merchant Crude,271.799987792969,46.0499992370606,126646,15.3459997177124
        var data = data1.concat(data2).concat(data3);
        var dataVesselTypes = new Map();
        var dataVesselTypesArray = dataTypes.map(function (d) {
          return {
            vesselClass: d.Class,
            vesselType: d.Type
          };
        });

        var _iterator = _createForOfIteratorHelper(dataVesselTypesArray),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var entry = _step.value;
            var vesselClass = entry.vesselClass;
            var vesselType = entry.vesselType;
            dataVesselTypes.set(vesselType, vesselClass);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        data = data.map(function (d, i) {
          var vesselType = d['Vessel Type'];
          var vesselClass = dataVesselTypes.get(d['Vessel Type']);

          if (vesselType == '<Unknown Type>') {
            vesselClass = 'Other';
          }

          return {
            index: i,
            departureDate: d3.timeParse('%Y-%m-%d')(d['Departure Date']),
            departurePort: d['Departure Hardour'],
            arrivalDate: d3.timeParse('%Y-%m-%d')(d['Arrival Date']),
            arrivalPort: d['Arrival Hardour'],
            vesselClass: vesselClass,
            vesselType: d['Vessel Type'],
            vesselLength: +d['Lenght'],
            vesselWidth: +d['Width'],
            vesselCapacity: +d['DeadWeight Tonnage'],
            vesselDraught: +d['Maximum Draugth']
          };
        });
        var chartWidth = 776;
        var chartHeight = 180;
        var chartNbBars = 50;
        var timeSelectWidth = 950;
        var ndx = crossfilter(data);
        var vesselClassX = ndx.dimension(function (d) {
          return d.vesselClass;
        });
        var classes = vesselClassX.group().all().map(function (d) {
          return d.key;
        });
        var typeColorScale = d3.scaleOrdinal(d3.schemeSet2).domain(classes);
        var firstClass = classes[0]; // Longueur

        var vesselLengthRange = 400;
        var vesselLengthBarWidth = vesselLengthRange / chartNbBars;
        var vesselLength = ndx.dimension(function (d) {
          return d.vesselLength;
        });
        var vesselLengths = vesselLength.group(function (d) {
          return Math.floor(d / vesselLengthBarWidth) * vesselLengthBarWidth;
        }).reduce(function (p, v) {
          p[v.vesselClass] = (p[v.vesselClass] || 0) + 1;
          return p;
        }, function (p, v) {
          p[v.vesselClass] = (p[v.vesselClass] || 0) - 1;
          return p;
        }, function () {
          return {};
        });
        var vesselLengthChart = new dc.BarChart('#length-chart').width(chartWidth).height(chartHeight).margins({
          top: 10,
          right: 50,
          bottom: 30,
          left: 50
        }).x(d3.scaleLinear().domain([0, vesselLengthRange])).xUnits(function () {
          return chartNbBars;
        }).brushOn(false).colors(typeColorScale).xAxisLabel('Longueur (m)').elasticY(true).dimension(vesselLength).group(vesselLengths, firstClass, function (d) {
          return d.value[firstClass];
        });

        var _loop = function _loop(i) {
          var type = classes[i];
          vesselLengthChart.stack(vesselLengths, type, function (d) {
            return d.value[type];
          });
        };

        for (var i = 1; i < classes.length; i++) {
          _loop(i);
        }

        vesselLengthChart.yAxis().ticks(8);
        vesselLengthChart.render(); // Largeur

        var vesselWidthRange = 180;
        var vesselWidthBarWidth = vesselWidthRange / chartNbBars;
        var vesselWidth = ndx.dimension(function (d) {
          return d.vesselWidth;
        });
        var vesselWidths = vesselWidth.group(function (d) {
          return Math.floor(d / vesselWidthBarWidth) * vesselWidthBarWidth;
        }).reduce(function (p, v) {
          p[v.vesselClass] = (p[v.vesselClass] || 0) + 1;
          return p;
        }, function (p, v) {
          p[v.vesselClass] = (p[v.vesselClass] || 0) - 1;
          return p;
        }, function () {
          return {};
        });
        var vesselWidthChart = new dc.BarChart('#width-chart').width(chartWidth).height(chartHeight).margins({
          top: 10,
          right: 50,
          bottom: 30,
          left: 50
        }).x(d3.scaleLinear().domain([0, vesselWidthRange])).xUnits(function () {
          return chartNbBars;
        }).brushOn(false).colors(typeColorScale).xAxisLabel('Largeur (m)').elasticY(true).dimension(vesselWidth).group(vesselWidths, firstClass, function (d) {
          return d.value[firstClass];
        });

        var _loop2 = function _loop2(_i) {
          var type = classes[_i];
          vesselWidthChart.stack(vesselWidths, type, function (d) {
            return d.value[type];
          });
        };

        for (var _i = 1; _i < classes.length; _i++) {
          _loop2(_i);
        }

        vesselWidthChart.yAxis().ticks(7);
        vesselWidthChart.render(); // Capacité

        var vesselCapacityRange = 650000;
        var vesselCapacityBarWidth = vesselCapacityRange / chartNbBars;
        var vesselCapacity = ndx.dimension(function (d) {
          return d.vesselCapacity;
        });
        var vesselCapacities = vesselCapacity.group(function (d) {
          return Math.floor(d / vesselCapacityBarWidth) * vesselCapacityBarWidth;
        }).reduce(function (p, v) {
          p[v.vesselClass] = (p[v.vesselClass] || 0) + 1;
          return p;
        }, function (p, v) {
          p[v.vesselClass] = (p[v.vesselClass] || 0) - 1;
          return p;
        }, function () {
          return {};
        });
        var vesselCapacityChart = new dc.BarChart('#capacity-chart').width(chartWidth).height(chartHeight).margins({
          top: 10,
          right: 50,
          bottom: 30,
          left: 50
        }).x(d3.scaleLinear().domain([0, vesselCapacityRange])).xUnits(function () {
          return chartNbBars;
        }).brushOn(false).colors(typeColorScale).xAxisLabel('Capacité (t)').elasticY(true).dimension(vesselCapacity).group(vesselCapacities, firstClass, function (d) {
          return d.value[firstClass];
        });

        var _loop3 = function _loop3(_i2) {
          var type = classes[_i2];
          vesselCapacityChart.stack(vesselCapacities, type, function (d) {
            return d.value[type];
          });
        };

        for (var _i2 = 1; _i2 < classes.length; _i2++) {
          _loop3(_i2);
        }

        vesselCapacityChart.yAxis().ticks(9);
        vesselCapacityChart.render(); // Tirant d'eau

        var vesselDraughtRange = 30;
        var vesselDraughtBarWidth = vesselDraughtRange / chartNbBars;
        var vesselDraught = ndx.dimension(function (d) {
          return d.vesselDraught;
        });
        var vesselDraughts = vesselDraught.group(function (d) {
          return Math.floor(d / vesselDraughtBarWidth) * vesselDraughtBarWidth;
        }).reduce(function (p, v) {
          p[v.vesselClass] = (p[v.vesselClass] || 0) + 1;
          return p;
        }, function (p, v) {
          p[v.vesselClass] = (p[v.vesselClass] || 0) - 1;
          return p;
        }, function () {
          return {};
        });
        var vesselDraughtChart = new dc.BarChart('#draught-chart').width(chartWidth).height(chartHeight).margins({
          top: 10,
          right: 50,
          bottom: 30,
          left: 50
        }).x(d3.scaleLinear().domain([0, vesselDraughtRange])).xUnits(function () {
          return chartNbBars;
        }).brushOn(false).colors(typeColorScale).xAxisLabel("Tirant d'eau (m)").elasticY(true).dimension(vesselDraught).group(vesselDraughts, firstClass, function (d) {
          return d.value[firstClass];
        });

        var _loop4 = function _loop4(_i3) {
          var type = classes[_i3];
          vesselDraughtChart.stack(vesselDraughts, type, function (d) {
            return d.value[type];
          });
        };

        for (var _i3 = 1; _i3 < classes.length; _i3++) {
          _loop4(_i3);
        }

        vesselDraughtChart.yAxis().ticks(6);
        vesselDraughtChart.render(); // Types

        var vesselTypeY = ndx.dimension(function (_) {
          return 0;
        });
        var vesselTypesY = vesselTypeY.group().reduce(function (p, v) {
          p[v.vesselClass] = (p[v.vesselClass] || 0) + 1;
          return p;
        }, function (p, v) {
          p[v.vesselClass] = (p[v.vesselClass] || 0) - 1;
          return p;
        }, function () {
          return {};
        });
        var vesselTypeChart = new dc.BarChart("#type-chart").x(d3.scaleOrdinal().domain([0, 0])).width(200).height(750).margins({
          top: 10,
          right: 50,
          bottom: 180,
          left: 0
        }).dimension(vesselTypeY).group(vesselTypesY, firstClass, function (d) {
          return d.value[firstClass];
        }).xUnits(function () {
          return 1;
        }).colors(typeColorScale).brushOn(false).elasticY(true).legend(dc.legend().y(600));

        var _loop5 = function _loop5(_i4) {
          var type = classes[_i4];
          vesselTypeChart.stack(vesselTypesY, type, function (d) {
            return d.value[type];
          });
        };

        for (var _i4 = 1; _i4 < classes.length; _i4++) {
          _loop5(_i4);
        }

        vesselTypeChart.filter = function () {};

        vesselTypeChart.render(); // Trafic

        var vesselTraffic = ndx.dimension(function (d) {
          return d.departureDate;
        });
        var vesselTraffics = vesselTraffic.group(d3.timeMonth);
        var minDate = vesselTraffic.bottom(1)[0].departureDate;
        var maxDate = vesselTraffic.top(1)[0].departureDate; // const vesselTrafficRange = maxDate - minDate
        // const vesselTrafficBarWidth = vesselTrafficRange / chartNbBars

        var vesselTrafficChart = new dc.BarChart('#tab-2-content .traffic-chart').width(timeSelectWidth).height(125).margins({
          top: 10,
          right: 50,
          bottom: 30,
          left: 30
        }).dimension(vesselTraffic).group(vesselTraffics).round(d3.timeMonth).x(d3.scaleTime().domain([minDate, maxDate]).rangeRound([0, timeSelectWidth])).brushOn(true).elasticY(true);
        vesselTrafficChart.yAxis().ticks(5);
        vesselTrafficChart.render();
        var portDim = ndx.dimension(function (d) {
          return d.departurePort;
        });
        ndx.dimension(function (d) {
          return d.departurePort;
        }).filter(function (d) {
          return !d.includes('Virtual harbour');
        });
        var portTraffic = portDim.group().reduceCount();
        var filteredGroup = remove_empty_bins(portTraffic);
        var portChart = new dc.RowChart('#port-chart').width(600).height(900).margins({
          top: 30,
          right: 50,
          bottom: 30,
          left: 30
        }).dimension(portDim).group(filteredGroup).x(d3.scaleLinear().domain([0, portTraffic.top(1)[0].value]).rangeRound([0, 500])).xAxis(d3.axisTop()).colors(d3.scaleOrdinal(['#1f77b4'])).othersGrouper(false).elasticX(true).label(function (d) {
          return d.key + ': ' + d.value;
        }).fixedBarHeight(ROW_CHART_HEIGHT);
        portChart.on('pretransition', function () {
          portChart.select('g.axis').attr('transform', 'translate(0,0)');
          portChart.selectAll('line.grid-line').attr('y2', portChart.effectiveHeight());
          var count = filteredGroup.all().length;
          var height = count * ROW_CHART_HEIGHT_MARGIN + 20;
          portChart.select('svg').attr('height', height);
        });
        portChart.render();
        d3.select("#loader").style("display", "none");
        d3.select("#loader-container").style("display", "none");
      });
    });
  });
});

var SingularStackedBarChart = /*#__PURE__*/function () {
  function SingularStackedBarChart(parent, group) {
    _classCallCheck(this, SingularStackedBarChart);

    this._groupAll = null;
    this._colors = null;
    this._width = this._height = 200;
    this._duration = 500;
    this._root = d3.select(parent);
    dc.registerChart(this, group);
    this._rect = null;
  }

  _createClass(SingularStackedBarChart, [{
    key: "groupAll",
    value: function groupAll(_groupAll) {
      if (!arguments.length) return this._groupAll;
      this._groupAll = _groupAll;
      return this;
    }
  }, {
    key: "colors",
    value: function colors(_colors) {
      if (!arguments.length) return this._colors;
      this._colors = _colors;
      return this;
    }
  }, {
    key: "render",
    value: function render() {
      var width = 200,
          height = 200;

      var svg = this._root.selectAll('svg').data([0]).join('svg').attr('width', width).attr('height', width);

      this._rect = svg.selectAll('rect.swatch').data([0]).join('rect').attr('class', 'swatch').attr('width', width).attr('height', width);
      this.redraw();
    }
  }, {
    key: "redraw",
    value: function redraw() {
      this._rect.transition().duration(this._duration).attr('fill', this._colors(this._groupAll.value()));
    }
  }]);

  return SingularStackedBarChart;
}(); // https://github.com/dc-js/dc.js/wiki/FAQ#how-do-i-filter-the-data-before-its-charted


function remove_empty_bins(source_group) {
  return {
    all: function all() {
      return source_group.all().filter(function (d) {
        return d.value !== 0;
      });
    }
  };
}
},{}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "56007" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","scripts/onglet2.js"], null)
//# sourceMappingURL=/onglet2.69249ac7.js.map