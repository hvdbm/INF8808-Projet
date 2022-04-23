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
})({"nI8S":[function(require,module,exports) {
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _get() { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(arguments.length < 3 ? target : receiver); } return desc.value; }; } return _get.apply(this, arguments); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var ROW_CHART_HEIGHT = 16.68;
var ROW_CHART_HEIGHT_MARGIN = 21.75; // Reading the data

d3.csv("./TRIP_PART_1.csv").then(function (data1) {
  d3.csv("./TRIP_PART_2.csv").then(function (data2) {
    d3.csv("./TRIP_PART_3.csv").then(function (data3) {
      d3.csv("./Vessel Type Class.csv").then(function (dataTypes) {
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
        }).title(function (d) {
          return d.key + '[' + this.layer + ']: ' + d.value[this.layer];
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
        }).title(function (d) {
          return d.key + '[' + this.layer + ']: ' + d.value[this.layer];
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
        }).title(function (d) {
          return d.key + '[' + this.layer + ']: ' + d.value[this.layer];
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
        }).title(function (d) {
          return d.key + '[' + this.layer + ']: ' + d.value[this.layer];
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

        var nullDimension = ndx.dimension(function (_) {
          return 0;
        });
        var vesselClassesY = nullDimension.group().reduce(function (p, v) {
          p[v.vesselClass] = (p[v.vesselClass] || 0) + 1;
          return p;
        }, function (p, v) {
          p[v.vesselClass] = (p[v.vesselClass] || 0) - 1;
          return p;
        }, function () {
          return {};
        });
        var vesselTypeChart = new ReverseBarChart("#type-chart").x(d3.scaleOrdinal().domain([0, 0])).width(200).height(750).margins({
          top: 10,
          right: 50,
          bottom: 180,
          left: 0
        }).dimension(nullDimension).group(vesselClassesY, firstClass, function (d) {
          return d.value[firstClass];
        }).xUnits(function () {
          return 1;
        }).colors(typeColorScale).brushOn(false).elasticY(true).legend(dc.legend().y(600)).title(function (d) {
          return this.layer + ': ' + d.value[this.layer];
        });

        var _loop5 = function _loop5(_i4) {
          var vesselClass = classes[_i4];
          vesselTypeChart.stack(vesselClassesY, vesselClass, function (d) {
            return d.value[vesselClass];
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

var ReverseBarChart = /*#__PURE__*/function (_dc$BarChart) {
  _inherits(ReverseBarChart, _dc$BarChart);

  var _super = _createSuper(ReverseBarChart);

  function ReverseBarChart() {
    _classCallCheck(this, ReverseBarChart);

    return _super.apply(this, arguments);
  }

  _createClass(ReverseBarChart, [{
    key: "legendables",
    value: function legendables() {
      var items = _get(_getPrototypeOf(ReverseBarChart.prototype), "legendables", this).call(this);

      return items.reverse();
    }
  }]);

  return ReverseBarChart;
}(dc.BarChart); // https://github.com/dc-js/dc.js/wiki/FAQ#how-do-i-filter-the-data-before-its-charted


function remove_empty_bins(source_group) {
  return {
    all: function all() {
      return source_group.all().filter(function (d) {
        return d.value !== 0;
      });
    }
  };
}
},{}]},{},["nI8S"], null)
//# sourceMappingURL=/onglet2.4f7528f5.js.map