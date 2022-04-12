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
})({"DNGJ":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.build = build;

// Source : https://d3-graph-gallery.com/graph/stackedarea_template.html
function build(div) {
  // set the dimensions and margins of the graph
  var bounds = d3.select('#stacked-area-chart').node().getBoundingClientRect();
  var margin = {
    top: 60,
    right: 230,
    bottom: 50,
    left: 70
  },
      width = bounds.width - margin.left - margin.right,
      height = 800 - margin.top - margin.bottom; // append the svg object to the body of the page

  var svg = div.select("#stacked-area-chart").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  d3.csv('./TRIP_STACK.csv', function (d) {
    return {
      date: d3.timeParse("%Y-%m-%d")(d.date),
      Barges: d.Barges,
      Excursion: d.Excursion,
      Fishing: d.Fishing,
      Merchant: d.Merchant,
      Other: d.Other,
      'Pleasure Crafts': d['Pleasure Crafts'],
      Tanker: d.Tanker,
      Tugs: d.Tugs
    };
  }).then(function (data) {
    var keys = data.columns.slice(1); // List of Vessel Types = header of the csv files

    var color = d3.scaleOrdinal().domain(keys).range(d3.schemeSet2);
    var stackedData = d3.stack().keys(keys)(data); // Add X axis

    var x = d3.scaleTime().domain(d3.extent(data, function (d) {
      return d.date;
    })).range([0, width]);
    svg.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x).ticks(10)); // Add X axis label:

    svg.append("text").attr("text-anchor", "end").attr("x", width).attr("y", height + 40).text("Temps"); // Add Y axis

    var y = d3.scaleLinear().domain([0, 800]) // TODO : Y Automatique ?
    .range([height, 0]);
    svg.append("g").call(d3.axisLeft(y).ticks(15)); // Add Y axis label:

    svg.append("text").attr("text-anchor", "end").attr("x", 0).attr("y", -20).text("Nombre de navires").attr("text-anchor", "start"); // Area generator

    var areaChart = svg.append('g');
    var area = d3.area().x(function (d) {
      return x(d.data.date);
    }).y0(function (d) {
      return y(d[0]);
    }).y1(function (d) {
      return y(d[1]);
    }); // Show the areas

    areaChart.selectAll("mylayers").data(stackedData).enter().append("path").attr("class", function (d) {
      return "myArea " + d.key;
    }).style("fill", function (d) {
      return color(d.key);
    }).attr("d", area); // What to do when one group is hovered

    var highlight = function highlight(d) {
      d3.selectAll(".myArea").style("opacity", .1); // reduce opacity of all groups

      d3.select("." + d).style("opacity", 1); // expect the one that is hovered
    }; // And when it is not hovered anymore


    var noHighlight = function noHighlight() {
      d3.selectAll(".myArea").style("opacity", 1);
    }; // LEGEND //


    var size = 20;
    svg.selectAll("myrect") // Add one dot in the legend for each name.
    .data(keys).enter().append("rect").attr("x", width).attr("y", function (_, i) {
      return 10 + i * (size + 5);
    }) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("width", size).attr("height", size).attr("stroke-width", 0.5).attr("stroke", "black").style("fill", function (d) {
      return color(d);
    }).on("mouseover", highlight).on("mouseleave", noHighlight);
    svg.selectAll("mylabels") // Add one dot in the legend for each name.
    .data(keys).enter().append("text").attr("x", width + size * 1.2).attr("y", function (_, i) {
      return 10 + i * (size + 5) + size / 2;
    }) // 100 is where the first dot appears. 25 is the distance between dots
    .style("fill", function (d) {
      return color(d);
    }).text(function (d) {
      return d;
    }).attr("text-anchor", "left").style("alignment-baseline", "middle").on("mouseover", highlight).on("mouseleave", noHighlight);
  });
}
},{}],"nI8S":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.build = build;
exports.buildTable = buildTable;
exports.cleanPortName = cleanPortName;
exports.isPortExcluded = isPortExcluded;
exports.removeDuplicate = removeDuplicate;
exports.reset = reset;
exports.selectPort = selectPort;
exports.setHistogram = setHistogram;
exports.setHistograms = setHistograms;
exports.setStackedBar = setStackedBar;
exports.transformDataMonths = transformDataMonths;
exports.transformDataPorts = transformDataPorts;

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

// import { crossfilter } from './crossfilter'
function removeDuplicate(name) {
  if (name == 'Saint John NB') {
    return "St. John's";
  }

  return name;
}

function cleanPortName(name) {
  name = removeDuplicate(name);
  var words = name.split(/,| |\/|-/);
  words.forEach(function (word, index) {
    if (word.length > 2) {
      var newWord = word.toLowerCase();
      var letterIndex = 0;

      while (true) {
        var letter = newWord[letterIndex];

        if (letter.match(/[a-z]/i)) {
          newWord = newWord.substring(0, letterIndex) + letter.toUpperCase() + newWord.substring(letterIndex + 1);
          break;
        }

        letterIndex += 1;
      }

      words[index] = newWord;
    }
  });
  return words.join(' ');
}

function isPortExcluded(name) {
  if (name.includes('Virtual Harbour')) {
    return true;
  }

  return false;
}

var dataPerMonth;
var dataPerPort;
var data;
var selectWidth = 950;
var selectHeight = 125; // Reading the data

d3.csv("./TRIP_Part1.csv").then(function (data1) {
  d3.csv("./TRIP_Part2.csv").then(function (data2) {
    d3.csv("./TRIP_Part3.csv").then(function (data3) {
      // Id,Departure Date,Departure Hardour,Departure Region,Departure Latitude,Departure Longitude,Arrival Date,Arrival Hardour,Arrival Region,Arrival Latitude,Arrival Longitude,Vessel Type,Lenght,Width,DeadWeight Tonnage,Maximum Draugth
      // 6079000000783579,    2011-01-01 00:00:00.000,Virtual Harbour (Central Region),Central Region,45.71666667,-84.24861111,2011-01-01 15:30:00.000,Goderich,Central Region,43.745,-81.7294441666667,Merchant Bulk,222.509994506836,22.9400005340576,31751,8.72999954223633
      // 23079000000766048,   2011-01-01 00:10:00.000,Whiffen Head,Newfoundland Region,47.7727836111111,-54.0171797222222,2011-01-01 01:00:00.000,Whiffen Head,Newfoundland Region,47.7727836111111,-54.0171797222222,Tug Fire,38.9000015258789,13.8999996185303,314,3.5
      // 23079000000766035,   2011-01-01 00:57:00.000,Whiffen Head,Newfoundland Region,47.7727836111111,-54.0171797222222,2011-01-02 12:45:00.000,Virtual Harbour (Newfoundland Region),Newfoundland Region,47.75,-53,Merchant Crude,271.799987792969,46.0499992370606,126646,15.3459997177124
      data = data1.concat(data2).concat(data3);
      dataPerPort = transformDataPorts(data);
      dataPerMonth = transformDataMonths(data);
      setHistograms(data);
      setStackedBar(data);
      build(d3.select('#tab-2-content'), dataPerMonth, dataPerPort);
    });
  });
});

function transformDataPorts(data) {
  var map = new Map();
  data.forEach(function (line) {
    var arrivalPort = cleanPortName(line['Arrival Hardour']);
    var departurePort = cleanPortName(line['Departure Hardour']);

    if (!isPortExcluded(arrivalPort)) {
      if (!map.has(arrivalPort)) {
        map.set(arrivalPort, {
          'name': arrivalPort,
          'traffic': 1
        });
      } else {
        map.get(arrivalPort).traffic += 1;
      }
    }

    if (!isPortExcluded(departurePort)) {
      if (!map.has(departurePort)) {
        map.set(departurePort, {
          'name': departurePort,
          'traffic': 1
        });
      } else {
        map.get(departurePort).traffic += 1;
      }
    }
  });
  var dataPerPort = Array.from(map.values());
  dataPerPort.sort(function (a, b) {
    return b.traffic - a.traffic;
  });
  return dataPerPort;
}

function transformDataMonths(data) {
  var map = new Map();
  data.forEach(function (line) {
    var departureDate = new Date(line['Departure Date']);
    departureDate.setDate(1);
    var arrivalDate = new Date(line['Arrival Date']);
    arrivalDate.setDate(1);

    for (var date = departureDate; date <= arrivalDate; date.setMonth(date.getMonth() + 1)) {
      var sDate = date.toDateString();

      if (!map.has(sDate)) {
        map.set(sDate, {
          'date': sDate,
          'traffic': 1
        });
      } else {
        map.get(sDate).traffic += 1;
      }
    }
  });
  var dataPerMonth = Array.from(map.values());
  dataPerMonth.forEach(function (month) {
    month.date = new Date(month.date);
  });
  return dataPerMonth;
}

function build(div, dataPerMonth, dataPerPort) {
  var nb = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 20;
  buildTable(div, dataPerPort, nb);
  var xScale = d3.scaleBand().padding(0.7);
  xScale.domain(dataPerMonth.map(function (month) {
    return month.date;
  })).range([0, 950]);
  var yScale = d3.scaleLinear();
  var max = 0;

  var _iterator = _createForOfIteratorHelper(dataPerMonth),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var month = _step.value;

      if (month.traffic > max) {
        max = month.traffic;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  yScale.domain([0, max]).range([125, 0]);
  div.select('#time-select-graph  #graph-clip-path').selectAll('rect').data(dataPerMonth).join('rect').attr('width', 950 / dataPerMonth.length).attr('height', function (data) {
    return 125 - yScale(data.traffic);
  }).attr('x', function (data) {
    return xScale(data.date);
  }).attr('y', function (data) {
    return yScale(data.traffic);
  });
  div.select('#time-select-graph').select('.x.axis').attr('transform', 'translate(0, ' + 125 + ')').call(d3.axisBottom(xScale).tickValues(xScale.domain().filter(function (d, i) {
    return !(i % 12 - 1);
  })).tickFormat(d3.timeFormat("%Y")));
}

function buildTable(div, dataPerPort, nb) {
  var topTraffic = dataPerPort[0].traffic;
  var row = div.select('#port-table tbody').selectAll('tr.port-row').data(dataPerPort).enter().filter(function (data, index) {
    return nb <= 0 || index < nb;
  }).append('tr').attr('data-port', function (data, index) {
    return data.name;
  });
  row.append('td').attr('class', 'port-cell column-rank').append('div').attr('class', 'rank-container').append('span').text(function (data, index) {
    return index + 1;
  });
  row.append('td').attr('class', 'port-cell column-port').append('div').attr('class', 'port-container').append('span').text(function (data, index) {
    return data.name;
  });
  row.append('td').attr('class', 'port-cell column-traffic').append('div').attr('class', 'traffic-container').append('span').text(function (data, index) {
    return data.traffic;
  });
  row.append('td').attr('class', 'port-cell-graph column-proportions').append('div').attr('class', 'proportions-container').style('width', function (data, index) {
    return data.traffic / topTraffic * 100 + '%';
  });
  div.selectAll('#port-table tr').on('click', function () {
    var row = d3.select(this);
    var selected = row.classed('selected');
    d3.selectAll('#port-table tr').classed('selected', false);
    row.classed('selected', !selected);
    var port = selected ? undefined : row.attr('data-port');
    selectPort(port);
  });
}

d3.select('#tab-2-content #row-nb-control-refresh').on('click', function () {
  reset(d3.select('#tab-2-content'));
  var nbLines = d3.select('#row-nb-control').property('value');
  build(d3.select('#tab-2-content'), dataPerMonth, dataPerPort, nbLines);
});

function reset(div) {
  div.select('#port-table tbody').html('');
  selectPort(undefined);
}

function selectPort(port) {
  var title = d3.select('#caracteristics-title-port');

  if (port == undefined) {
    title.text('AUCUN PORT SÉLECTIONNÉ - CARACTÉRISTIQUES GLOBALES');
  } else {
    title.text(port);
  }
}

function setHistogram(data, max, width, height, id, title) {
  var svg = d3.select(id).append("svg").attr("width", width).attr("height", height).append("g").attr("transform", "translate(50,10)");
  var x = d3.scaleLinear().domain([0, max]).range([0, width - 100]);
  svg.append("g").attr("transform", "translate(0," + (height - 30) + ")").call(d3.axisBottom(x));
  var hist = d3.histogram().value(function (d) {
    return d[title];
  }).domain(x.domain()).thresholds(x.ticks(40));
  var bins = hist(data);
  var y = d3.scaleLinear().range([height - 30, 0]).domain([0, d3.max(bins, function (d) {
    return d.length;
  })]);
  svg.append("g").call(d3.axisLeft(y).ticks(5));
  svg.selectAll("rect").data(bins).enter().append("rect").attr("x", 1).attr("transform", function (d) {
    return "translate(" + x(d.x0) + "," + y(d.length) + ")";
  }).attr("width", function (d) {
    return x(d.x1) - x(d.x0);
  }).attr("height", function (d) {
    return height - y(d.length) - 30;
  }).style("fill", "#4479AB");
}

function setHistograms(data) {
  setHistogram(data, 400, 776, 160, "#repartition-length", "Lenght");
  setHistogram(data, 180, 776, 160, "#repartition-width", "Width");
  setHistogram(data, 650000, 776, 160, "#repartition-tonnage", "DeadWeight Tonnage");
  setHistogram(data, 30, 776, 160, "#repartition-draught", "Maximum Draugth");
}

function setStackedBar(data) {
  var svg = d3.select("#repartition-types").append("svg").attr("height", 556).attr("width", 130).append("g").attr("transform", "translate(10,10)");
  var total = 0;
  var map = new Map();
  data.forEach(function (line) {
    var type = line['Global Vessel Type'];
    var subtype = line['Vessel Type'];
    total++;

    if (!map.has(type)) {
      map.set(type, {
        'type': type,
        'number': 1,
        'subtypes': {}
      });
    } else {
      map.get(type).number += 1;
    }

    if (!(subtype in map.get(type).subtypes)) {
      map.get(type).subtypes[subtype] = 1;
    } else {
      map.get(type).subtypes[subtype] += 1;
    }
  });
  var colors = {
    "Barges": "#66c2a5",
    "Excursion": "#fc8d62",
    "Fishing": "#8da0cb",
    "Merchant": "#e78ac3",
    "Other": "#a6d854",
    "Pleasure Crafts": "#ffd92f",
    "Tanker": "#e5c494",
    "Tugs": "#b3b3b3"
  };
  var darker_colors = {
    "Barges": "#46b08f",
    "Excursion": "#d66236",
    "Fishing": "#748cc2",
    "Merchant": "#d96aae",
    "Other": "#8fbd44",
    "Pleasure Crafts": "#d6b313",
    "Tanker": "#cfa569",
    "Tugs": "#919191"
  };
  var currSum = 10;

  var _iterator2 = _createForOfIteratorHelper(map.entries()),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var type = _step2.value;
      var i = 0;

      for (var subtype in type[1].subtypes) {
        var color_list = i % 2 == 0 ? colors : darker_colors;
        i++;
        svg.append("rect").attr("width", 130).attr("height", Math.ceil(490 * type[1].subtypes[subtype] / total)).attr("transform", "translate(10," + currSum + ")").attr("fill", color_list[type[0]]);
        currSum += Math.ceil(490 * type[1].subtypes[subtype] / total);
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
}
},{}],"LFDw":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.REGION_NAME_ALT = exports.REGION_NAME = exports.REGION_COLOR = exports.GLOBAL_VESSEL_TYPE = void 0;
exports.chordMatrix = chordMatrix;
exports.clean = clean;
var GLOBAL_VESSEL_TYPE = ['Barges', 'Excursion', 'Fishing', 'Merchant', 'Other', 'Pleasure Crafts', 'Tanker', 'Tugs'];
exports.GLOBAL_VESSEL_TYPE = GLOBAL_VESSEL_TYPE;
var REGION_NAME = ['Arctic', 'Central', 'East Canadian Water', 'Newfoundland', 'Maritimes', 'Pacific', 'Quebec', 'St. Lawrence Seaway', 'West Canadian Water'];
exports.REGION_NAME = REGION_NAME;
var REGION_COLOR = ['#CAB2D6', '#6A3D9A', '#33A02C', '#FB9A99', '#FDBF6F', '#E31A1C', '#1F78B4', '#A6CEE3', '#FF7F00'];
exports.REGION_COLOR = REGION_COLOR;
var REGION_NAME_ALT = ['Arctic', 'Central', 'East_Canadian_Water', 'Newfoundland', 'Maritimes', 'Pacific', 'Quebec', 'St_Lawrence_Seaway', 'West_Canadian_Water'];
exports.REGION_NAME_ALT = REGION_NAME_ALT;

function findGlobalVesselType(vesselType) {
  if (['Barge Bulk Cargo', 'Barge Chemical', 'Barge Chips', 'Barge Derrick', 'Barge General', 'Barge Log', 'Barge Miscellaneous', 'Barge Oil Drilling Rig', 'Barge Oil/Petroleum', 'Barge Rail/Trailer', 'Barge Self-Propelled', 'Barge Towed', "Don't use", 'Landing Craft', 'Logs Raft Section'].includes(vesselType)) {
    return 'Barges';
  } else if (['Excursion Passenger'].includes(vesselType)) {
    return 'Excursion';
  } else if (['Crab Boat', 'Dragger (Scallop, Clam, etc.)', 'Factory Ship', 'Fishery Patrol', 'Fishing Vessel', 'Gillnetter', 'Groundfish Boat (Open Boat)', 'Lobster Boat', 'Longliner', 'Other Fishing VSL (Open Boat)', 'Seiner', 'Shrimp Boat', 'Trawler', 'Troller'].includes(vesselType)) {
    return 'Fishing';
  } else if (['Cruise', 'Merchant (Dry)', 'Merchant Auto', 'Merchant Bulk', 'Merchant Cement', 'Merchant Coastal', 'Merchant Container', 'Merchant Ferry', 'Merchant General', 'Merchant Lash', 'Merchant Livestock', 'Merchant Ore', 'Merchant Passenger', 'Merchant Rail/Trailer Ferry', 'Merchant Reefer', 'Merchant RO/RO'].includes(vesselType)) {
    return 'Merchant';
  } else if (['Yacht - Pleasure Crafts', 'Yacht Power', 'Yacht Sails'].includes(vesselType)) {
    return 'Pleasure Crafts';
  } else if (['Merchant (Tanker)', 'Merchant Chemical', 'Merchant Chemical/Oil Products Tanker', 'Merchant Crude', 'Merchant Gasoline', 'Merchant Liquified Gas', 'Merchant Molasses', 'Merchant Ore/Bulk/Oil', 'Merchant Super Tanker', 'Merchant ULCC', 'Merchant VLCC', 'Merchant Water'].includes(vesselType)) {
    return 'Tanker';
  } else if (['Tug', 'Tug Fire', 'Tug Harbour', 'Tug Ocean', 'Tug Supply', 'Tugs Workboat'].includes(vesselType)) {
    return 'Tugs';
  } else {
    return 'Other';
  }
}

function clean(data) {
  var cleanData = [];
  data.forEach(function (element) {
    if (element['Lenght'] != 0 && element['Width'] != 0 & element['Maximum Draugth'] < 30 && element['Departure Date'] < ['Arrival Date']) {
      cleanData.push({
        'Arrival Date': element['Arrival Date'].substring(0, 10),
        'Arrival Hardour': element['Arrival Hardour'],
        'Arrival Region': element['Arrival Region'],
        'DeadWeight Tonnage': element['DeadWeight Tonnage'],
        'Departure Date': element['Departure Date'].substring(0, 10),
        'Departure Hardour': element['Departure Hardour'],
        'Departure Region': element['Departure Region'],
        'Lenght': element['Lenght'],
        'Maximum Draugth': element['Maximum Draugth'],
        'Vessel Type': element['Vessel Type'],
        'Global Vessel Type': findGlobalVesselType(element['Vessel Type']),
        'Width': element['Width']
      });
    }
  });
  return cleanData;
}

function chordMatrix(data, departureDate, arrivalDate) {
  var matrix = new Array(REGION_NAME.length);

  for (var index = 0; index < matrix.length; index++) {
    matrix[index] = new Array(REGION_NAME.length);
  }

  REGION_NAME.forEach(function (departureRegion, i) {
    REGION_NAME.forEach(function (arrivalRegion, j) {
      matrix[i][j] = data.filter(function (d) {
        return departureRegion === d['Departure Region'].slice(0, -7) && arrivalRegion === d['Arrival Region'].slice(0, -7) && departureDate <= d['Departure Date'] && arrivalDate >= d['Arrival Date'];
      }).map(function (value) {
        return value.count;
      }).reduce(function (partialSum, v) {
        return Number(partialSum) + Number(v);
      }, 0);
    });
  });
  return matrix;
}
},{}],"YjD1":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.build = build;

var preproc = _interopRequireWildcard(require("./preprocess.js"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function build(div) {
  buildHeatmap(div);
} // https://d3-graph-gallery.com/heatmap.html


function buildHeatmap(div) {
  // TODO : adapt to div size
  // set the dimensions and margins of the graph
  var margin = {
    top: 30,
    right: 0,
    bottom: 70,
    left: 120
  },
      width = 500 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom; // append the svg object to the body of the page

  var svg = div.select("#tab-3-heatmap").append("svg").attr("width", width + margin.left + margin.right + 50).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(".concat(margin.left, ",").concat(margin.top, ")")); // Labels of row and columns

  var myGroups = preproc.GLOBAL_VESSEL_TYPE;
  var myVars = preproc.REGION_NAME; // Build X scales and axis:

  var x = d3.scaleBand().range([0, width]).domain(myGroups).padding(0.01);
  svg.append("g").attr("transform", "translate(0, ".concat(height, ")")).call(d3.axisBottom(x)).selectAll('text').attr('transform', 'translate(-20,20)rotate(-45)'); // Build Y scales and axis:

  var y = d3.scaleBand().range([height, 0]).domain(myVars).padding(0.01);
  svg.append("g").call(d3.axisLeft(y)); // Build color scale

  var myColor = d3.scaleLinear().range(["white", "#ff0000"]).domain([0, 15]); //maximum hardocodé sur la valeur max

  function transformData(d, departureDate, arrivalDate) {
    var map = heatmapMap();
    d.forEach(function (line) {
      if (departureDate <= d['Departure Date'] && arrivalDate >= d['Arrival Date']) return;
      var keyStart = line['Departure Region'] + line['Global Vessel Type'];
      var keyStop = line['Arrival Region'] + line['Global Vessel Type'];

      if (!map.has(keyStart)) {
        map.set(keyStart, {
          'Region': line['Departure Region'].slice(0, -7),
          'Type': line['Global Vessel Type'],
          'count': 1
        });
      } else {
        var current = map.get(keyStart);
        current.count += 1;
        map.set(keyStart, current);
      }

      if (!map.has(keyStop)) {
        map.set(keyStop, {
          'Region': line['Arrival Region'].slice(0, -7),
          'Type': line['Global Vessel Type'],
          'count': 1
        });
      } else {
        var _current = map.get(keyStop);

        _current.count += 1;
        map.set(keyStop, _current);
      }
    });
    var p = [];
    var max = 0;
    Array.from(map.values()).forEach(function (value) {
      p.push({
        'Region': value.Region,
        'Type': value.Type,
        'count': value.count / (2 * 311859) * 100 // TODO : Trouver le nombre total de voyage dans la période sélectionnée

      });

      if (value.count / (2 * 311859) * 100 >= max) {
        max = value.count / (2 * 311859) * 100;
      }
    });
    myColor.domain([0, max]);
    return p;
  } //Read the data


  d3.csv("./TRIP_HEATMAP.csv").then(function (data) {
    // add the squares and interaction
    var transformedData = transformData(data, "2010-01-01", "2023-01-01");
    svg.selectAll().data(transformedData, function (d) {
      return d.Type + ':' + d.Region;
    }).enter().append("g").attr("class", "square").on('mouseenter', function () {
      rectSelect(this, x, y);
    }).on('mouseleave', function () {
      rectUnselect(this);
    }).append("rect").attr("x", function (d) {
      return x(d.Type);
    }).attr("y", function (d) {
      return y(d.Region);
    }).attr("width", x.bandwidth()).attr("height", y.bandwidth()).style("fill", function (d) {
      return myColor(d.count);
    });
    initLegend(svg, myColor);
    drawLegend(width + margin.right + 10, 0, height, 15, 'url(#gradient)', myColor);
  });
}

function heatmapMap() {
  var map = new Map();
  preproc.REGION_NAME.forEach(function (region) {
    preproc.GLOBAL_VESSEL_TYPE.forEach(function (type) {
      var key = region + type;
      map.set(key, {
        'Region': region,
        'Type': type,
        'count': 0
      });
    });
  });
  return map;
}

function rectSelect(element, x, y) {
  d3.select(element).append("text").attr('x', function (d) {
    return x(d.Type) + x.bandwidth() / 2;
  }).attr('y', function (d) {
    return y(d.Region) + y.bandwidth() / 2;
  }).attr('text-anchor', 'middle').attr('dominant-baseline', 'middle').text(function (d) {
    return d.count.toFixed(2) + '%';
  });
}

function rectUnselect(element) {
  d3.select(element).select('text').remove();
}

function initLegend(svg, colorScale) {
  var defs = svg.append('defs');
  svg.append('rect').attr('class', 'legend bar');
  svg.append('g').attr('class', 'legend axis');
  var linearGradient = defs.append('linearGradient').attr('id', 'gradient').attr('x1', 0).attr('y1', 1).attr('x2', 0).attr('y2', 0);
  linearGradient.selectAll('stop').data(colorScale.ticks().map(function (tick, i, nodes) {
    return {
      offset: "".concat(100 * i / nodes.length, "%"),
      color: colorScale(tick)
    };
  })).join('stop').attr('offset', function (d) {
    return d.offset;
  }).attr('stop-color', function (d) {
    return d.color;
  });
}

function drawLegend(x, y, height, width, fill, colorScale) {
  d3.select('.legend.bar').attr('fill', fill).attr('x', x).attr('y', y).attr('height', height).attr('width', width);
  var scale = d3.scaleLinear().domain(colorScale.domain()).range([height, 0]);
  var axis = d3.axisRight().ticks(7).scale(scale);
  d3.select('.legend.axis').call(axis).attr('transform', 'translate(' + (x + 15) + ',' + y + ')');
}
},{"./preprocess.js":"LFDw"}],"QAKd":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.build = build;

var preproc = _interopRequireWildcard(require("./preprocess.js"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// https://d3-graph-gallery.com/chord.html
// https://observablehq.com/@d3/directed-chord-diagram
// https://jyu-theartofml.github.io/posts/circos_plot
// http://strongriley.github.io/d3/ex/chord.html
function build(div, data) {
  // TODO : Comment trouver la taille d'une div encore non chargée ?
  var bounds = d3.select('#stacked-area-chart').node().getBoundingClientRect();
  var margin = {
    top: bounds.width * 0.22,
    right: bounds.width * 0.25,
    bottom: bounds.width * 0.25,
    left: bounds.width * 0.25
  },
      // TODO : Revoir valeur
  width = bounds.width - margin.left - margin.right,
      height = bounds.width - margin.top - margin.bottom;
  var innerRadius = bounds.width / 6.5; // TODO : Revoir valeur

  var outerRadius = innerRadius + 10; // create the svg area

  var svg = div.select('#tab-3-chord-diagram').append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")"); // create input data: a square matrix that provides flow between entities

  var matrix = preproc.chordMatrix(data, "2010-01-01", "2023-01-01");
  var colors = preproc.REGION_COLOR; // give this matrix to d3.chord(): it will calculates all the info we need to draw arc and ribbon

  var res = d3.chord().padAngle(0.05) // padding between entities (black arc)
  .sortSubgroups(d3.descending)(matrix);
  /*// create a tooltip
  const tooltip = d3.select("#tab-3-chord-diagram")
    .append("div")
    .attr("id","tooltip")
    .attr("x", 8)
    .style("position", "absolute")
    .style("visibility", "hidden")
    .text("I'm a circle!");
  */
  // add the links between groups

  var links = svg.datum(res).append("g").attr("id", "links").selectAll("path").data(function (d) {
    return d;
  }).enter().append("path").attr("class", "chord").on('mouseenter', function (_ref, _) {
    var source = _ref.source,
        target = _ref.target;
    var tooltip = d3.select("#".concat(preproc.REGION_NAME_ALT[source.index]).concat(preproc.REGION_NAME_ALT[source.subindex]));
    return tooltip.style("visibility", "visible");
  }).on('mouseleave', function (_ref2, _) {
    var source = _ref2.source,
        target = _ref2.target;
    var tooltip = d3.select("#".concat(preproc.REGION_NAME_ALT[source.index]).concat(preproc.REGION_NAME_ALT[source.subindex]));
    return tooltip.style("visibility", "hidden");
  }).attr("d", d3.ribbon().radius(innerRadius)).style("fill", function (d) {
    return colors[d.source.index];
  }) // colors depend on the source group. Change to target otherwise.
  .style("stroke", "black").attr("opacity", 0.5);
  var tooltips = svg.datum(res).append("g").attr("id", "tooltip").selectAll("path").data(function (d) {
    return d;
  }).enter().append("text").attr("id", function (d) {
    return "".concat(preproc.REGION_NAME_ALT[d.source.index]).concat(preproc.REGION_NAME_ALT[d.source.subindex]);
  }).attr("class", "tooltip").attr('text-anchor', 'middle').attr('dominant-baseline', 'middle').text(function (d) {
    return "".concat(preproc.REGION_NAME[d.source.index], " --> ").concat(preproc.REGION_NAME[d.source.subindex], " : ").concat(d.source.value, " navires");
  }).style("visibility", "hidden"); // add the groups on the outer part of the circle

  svg.datum(res).append("g").attr("id", "groups").selectAll("g").data(function (d) {
    return d.groups;
  }).enter().append("g").attr("class", "group").append("path").style("fill", function (_, i) {
    return colors[i];
  }).style("stroke", "black").attr("d", d3.arc().innerRadius(innerRadius).outerRadius(outerRadius)).on("mouseover", function (event, _) {
    console.log("R\xE9gion ".concat(preproc.REGION_NAME[event.index], " (").concat(event.value, " navires)"));
    highlightGroup(event, links);
  }).on("mouseleave", function () {
    unhighlightGroup(links);
  }); // add the label of groups

  svg.datum(res).append("g").attr("id", "labels").selectAll("text").data(function (d) {
    return d.groups;
  }).enter().append("g").attr("transform", function (d) {
    return "rotate(" + (d.startAngle * 180 / Math.PI - 90) + ") translate(" + outerRadius + ",0)";
  }) // TODO : Revoir valeur
  .append("text").attr("x", 8).attr("dy", ".35em").attr("transform", function (d) {
    return d.startAngle > Math.PI ? "rotate(180) translate(-16)" : null;
  }).style("text-anchor", function (d) {
    return d.startAngle > Math.PI ? "end" : null;
  }).style("fill", function (_, i) {
    return colors[i];
  }).style("font-weight", "bold").text(function (d) {
    return preproc.REGION_NAME[d.index];
  });
}

function highlightGroup(event, links) {
  links.filter(function (d) {
    return d.source.index != event.index;
  }).attr("opacity", 0.1);
}

function unhighlightGroup(links) {
  links.attr("opacity", 0.5);
}
/*
function getContents (source) {
  // TODO : Generate tooltip contents
  return `
  <div>
    <div>
      <label style="font-weight: bold;">Region de départ : </label>
      <label class="tooltip-value">${preproc.REGION_NAME[source.index]}</label>
    </div>
    <div>
      <label style="font-weight: bold;">Région d'arrivée : </label>
      <label class="tooltip-value">${preproc.REGION_NAME[source.subindex]}</label>
    </div>
    <div>
      <label style="font-weight: bold;">Nombre de navires : </label>
      <label class="tooltip-value">${source.value} $ (navires)</label>
    </div>
  </div>
  `
}

function showTooltip(event, links) {
  
}

function unshowTooltip() {}
*/
},{"./preprocess.js":"LFDw"}],"Focm":[function(require,module,exports) {
"use strict";

var onglet1 = _interopRequireWildcard(require("./scripts/onglet1.js"));

var onglet2 = _interopRequireWildcard(require("./scripts/onglet2.js"));

var onglet3 = _interopRequireWildcard(require("./scripts/onglet3.js"));

var chord = _interopRequireWildcard(require("./scripts/chord.js"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

(function (d3) {
  onglet1.build(d3.select('#tab-1-content')); // onglet2.build(d3.select('#tab-2-content'))
  // onglet3.build(d3.select('#tab-3-content'))
  // d3.csv('./TRIP_V1.csv', d3.autoType).then((data) => {   
  //     onglet1.build(d3.select('#tab-1-content'))
  // })
  // window.addEventListener('resize', () => {
  //    onglet1.rebuild(d3.select('#tab-1-content'))
  // })

  d3.csv('./TRIP_CHORD.csv').then(function (chordData) {
    chord.build(d3.select('#tab-3-content'), chordData);
  });
  onglet3.build(d3.select('#tab-3-content')); // TODO : Resize automatique ?
})(d3);

$('.tab-button').click(function () {
  if (!$(this).hasClass('tab-button-active')) {
    var tab = $(this).data('tab');
    $('button.tab-button').removeClass('tab-button-active');
    $(this).addClass('tab-button-active');
    $('.tab-content').removeClass('visible-tab');
    $(".tab-content#tab-".concat(tab, "-content")).addClass('visible-tab');
  }
});
},{"./scripts/onglet1.js":"DNGJ","./scripts/onglet2.js":"nI8S","./scripts/onglet3.js":"YjD1","./scripts/chord.js":"QAKd"}]},{},["Focm"], null)
//# sourceMappingURL=/INF8808-Projet.2faf2c52.js.map