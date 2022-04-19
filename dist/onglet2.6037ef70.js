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
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var ROW_CHART_HEIGHT = 16.68;
var ROW_CHART_HEIGHT_MARGIN = 21.75; // Reading the data

d3.csv('./TRIP_STACK_HALF_MONTH.csv').then(function (stackData) {
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
              var _vesselType = entry.vesselType;
              dataVesselTypes.set(_vesselType, vesselClass);
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
          var chartHeight = 160;
          var chartNbBars = 50;
          var ndx = crossfilter(data);
          var vesselLengthRange = 400;
          var vesselLengthBarWidth = vesselLengthRange / chartNbBars;
          var vesselLength = ndx.dimension(function (d) {
            return d.vesselLength;
          });
          var vesselLengths = vesselLength.group(function (d) {
            return Math.floor(d / vesselLengthBarWidth) * vesselLengthBarWidth;
          });
          var vesselLengthChart = new dc.BarChart('#length-chart').width(chartWidth).height(chartHeight).margins({
            top: 10,
            right: 50,
            bottom: 30,
            left: 50
          }).x(d3.scaleLinear().domain([0, vesselLengthRange])).xUnits(function () {
            return chartNbBars;
          }).brushOn(false).xAxisLabel("Longueur").elasticY(true).dimension(vesselLength).group(vesselLengths);
          vesselLengthChart.yAxis().ticks(8);
          vesselLengthChart.render();
          var vesselWidthRange = 180;
          var vesselWidthBarWidth = vesselWidthRange / chartNbBars;
          var vesselWidth = ndx.dimension(function (d) {
            return d.vesselWidth;
          });
          var vesselWidths = vesselWidth.group(function (d) {
            return Math.floor(d / vesselWidthBarWidth) * vesselWidthBarWidth;
          });
          var vesselWidthChart = new dc.BarChart('#width-chart').width(chartWidth).height(chartHeight).margins({
            top: 10,
            right: 50,
            bottom: 30,
            left: 50
          }).x(d3.scaleLinear().domain([0, vesselWidthRange])).xUnits(function () {
            return chartNbBars;
          }).brushOn(false).xAxisLabel("Largeur").elasticY(true).dimension(vesselWidth).group(vesselWidths);
          vesselWidthChart.yAxis().ticks(7);
          vesselWidthChart.render();
          var vesselCapacityRange = 650000;
          var vesselCapacityBarWidth = vesselCapacityRange / chartNbBars;
          var vesselCapacity = ndx.dimension(function (d) {
            return d.vesselCapacity;
          });
          var vesselCapacities = vesselCapacity.group(function (d) {
            return Math.floor(d / vesselCapacityBarWidth) * vesselCapacityBarWidth;
          });
          var vesselCapacityChart = new dc.BarChart('#capacity-chart').width(chartWidth).height(chartHeight).margins({
            top: 10,
            right: 50,
            bottom: 30,
            left: 50
          }).x(d3.scaleLinear().domain([0, vesselCapacityRange])).xUnits(function () {
            return chartNbBars;
          }).brushOn(false).xAxisLabel("Capacité").elasticY(true).dimension(vesselCapacity).group(vesselCapacities);
          vesselCapacityChart.yAxis().ticks(9);
          vesselCapacityChart.render();
          var vesselDraughtRange = 30;
          var vesselDraughtBarWidth = vesselDraughtRange / chartNbBars;
          var vesselDraught = ndx.dimension(function (d) {
            return d.vesselDraught;
          });
          var vesselDraughts = vesselDraught.group(function (d) {
            return Math.floor(d / vesselDraughtBarWidth) * vesselDraughtBarWidth;
          });
          var vesselDraughtChart = new dc.BarChart('#draught-chart').width(chartWidth).height(chartHeight).margins({
            top: 10,
            right: 50,
            bottom: 30,
            left: 50
          }).x(d3.scaleLinear().domain([0, vesselDraughtRange])).xUnits(function () {
            return chartNbBars;
          }).brushOn(false).xAxisLabel("Tirant d'eau").elasticY(true).dimension(vesselDraught).group(vesselDraughts);
          vesselDraughtChart.yAxis().ticks(6);
          vesselDraughtChart.render();
          var vesselType = ndx.dimension(function (d) {
            return d.vesselClass;
          });
          var vesselTypes = vesselType.group();
          var typeColorScale = d3.scaleOrdinal(d3.schemeSet2).domain(vesselTypeClasses());
          var vesselTypeChart = new dc.PieChart("#type-chart").width(150).height(310).cy(75).innerRadius(50).dimension(vesselTypes).group(vesselTypes).colors(typeColorScale).minAngleForLabel(360).legend(dc.legend().y(160));

          vesselTypeChart.filter = function () {};

          vesselTypeChart.render();
          var vesselTraffic = ndx.dimension(function (d) {
            return d.departureDate;
          });
          var vesselTraffics = vesselTraffic.group(d3.timeMonth);
          var minDate = vesselTraffic.bottom(1)[0].departureDate;
          var maxDate = vesselTraffic.top(1)[0].departureDate;
          var vesselTrafficChart = new dc.BarChart('#tab-2-content .traffic-chart').width(950).height(125).margins({
            top: 10,
            right: 50,
            bottom: 30,
            left: 20
          }).dimension(vesselTraffic).group(vesselTraffics).round(d3.timeMonth).x(d3.scaleTime().domain([minDate, maxDate]).rangeRound([0, 950])).brushOn(true).elasticY(true);
          vesselTrafficChart.yAxis().ticks(5);
          vesselTrafficChart.render();
          var portDim = ndx.dimension(function (d) {
            return d.departurePort;
          });
          ndx.dimension(function (d) {
            return d.departurePort;
          }).filter(function (d) {
            return !d.includes('Virtual Harbour');
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
        });
      });
    });
  });
}); // https://github.com/dc-js/dc.js/wiki/FAQ#how-do-i-filter-the-data-before-its-charted

function remove_empty_bins(source_group) {
  return {
    all: function all() {
      return source_group.all().filter(function (d) {
        return d.value !== 0;
      });
    }
  };
}

function vesselTypeClasses() {
  return ["Barges", "Excursion", "Fishing", "Merchant", "Other", "PleasureCrafts", "Tanker", "Tugs", "Other"];
}
},{}]},{},["nI8S"], null)
//# sourceMappingURL=/onglet2.6037ef70.js.map