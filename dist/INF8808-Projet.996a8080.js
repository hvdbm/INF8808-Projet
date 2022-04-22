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
})({"LdDo":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.vesselTypeClasses = vesselTypeClasses;

function vesselTypeClasses() {
  return ["Barges", "Excursion", "Fishing", "Merchant", "Other", "PleasureCrafts", "Tanker", "Tugs", "Other"];
}
},{}],"DNGJ":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.build = build;

var _vesselTypeClasses = require("./vesselTypeClasses.js");

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
      height = 650 - margin.top - margin.bottom; // append the svg object to the body of the page

  var svg = div.select("#stacked-area-chart").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  d3.csv('./TRIP_STACK_HALF_MONTH.csv', function (d) {
    return {
      date: d3.timeParse("%Y-%m-%d")(d.date),
      Other: d.Other,
      Tugs: d.Tugs,
      Fishing: d.Fishing,
      Barges: d.Barges,
      Tanker: d.Tanker,
      PleasureCrafts: d.PleasureCrafts,
      Excursion: d.Excursion,
      Merchant: d.Merchant
    };
  }).then(function (data) {
    var keys = data.columns.slice(1); // List of Vessel Types = header of the csv files

    var color = d3.scaleOrdinal().domain((0, _vesselTypeClasses.vesselTypeClasses)()).range(d3.schemeSet2);
    var stackedData = d3.stack().keys(keys)(data); // Add X axis

    var x = d3.scaleTime().domain(d3.extent(data, function (d) {
      return d.date;
    })).range([0, width]);
    svg.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x).ticks(10)); // Add X axis label:

    svg.append("text").attr("text-anchor", "end").attr("x", width).attr("y", height + 40).text("Temps"); // Add Y axis

    var y = d3.scaleLinear().domain([0, 12000]).range([height, 0]);
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
    .data(keys.sort()).enter().append("rect").attr("x", width).attr("y", function (_, i) {
      return 10 + i * (size + 5);
    }) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("width", size).attr("height", size).attr("rx", 4).attr("ry", 4).style("fill", function (d) {
      return color(d);
    }).on("mouseover", highlight).on("mouseleave", noHighlight);
    svg.selectAll("mylabels") // Add one dot in the legend for each name.
    .data(keys.sort()).enter().append("text").attr("x", width + size * 1.2).attr("y", function (_, i) {
      return 10 + i * (size + 5) + size / 2;
    }) // 100 is where the first dot appears. 25 is the distance between dots
    .style("fill", function (d) {
      return color(d);
    }).text(function (d) {
      return d;
    }).attr("text-anchor", "left").style("alignment-baseline", "middle").on("mouseover", highlight).on("mouseleave", noHighlight);
  });
}
},{"./vesselTypeClasses.js":"LdDo"}],"LFDw":[function(require,module,exports) {
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
exports.buildHeatmap = buildHeatmap;
exports.rebuild = rebuild;

var preproc = _interopRequireWildcard(require("./preprocess.js"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function rebuild(div, startDate, endDate) {
  div.select("#tab-3-heatmap").select('svg').remove();
  buildHeatmap(div, startDate, endDate);
} // https://d3-graph-gallery.com/heatmap.html


function buildHeatmap(div, startDate, endDate) {
  var size = 0.28 * window.innerWidth; // set the dimensions and margins of the graph

  var margin = {
    top: 10,
    right: 5,
    bottom: 90,
    left: 115
  },
      width = size - margin.left - margin.right,
      height = size - margin.top - margin.bottom; // append the svg object to the body of the page

  var svg = div.select("#tab-3-heatmap").append("svg").attr("width", width + margin.left + margin.right + 50).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(".concat(margin.left, ",").concat(margin.top, ")")); // Labels of row and columns

  var myGroups = preproc.GLOBAL_VESSEL_TYPE;
  var myVars = preproc.REGION_NAME; // Build X scales and axis:

  var x = d3.scaleBand().range([0, width]).domain(myGroups).padding(0.01);
  svg.append("g").attr("transform", "translate(0, ".concat(height, ")")).call(d3.axisBottom(x)).selectAll('text').attr('transform', 'translate(-20,20)rotate(-45)'); // Build Y scales and axis:

  var y = d3.scaleBand().range([height, 0]).domain(myVars).padding(0.01);
  svg.append("g").call(d3.axisLeft(y)); // Build color scale

  var myColor = d3.scaleLinear().range(["white", "#ff0000"]);

  function transformData(d, departureDate, arrivalDate) {
    var map = heatmapMap();
    var data = d.filter(function (line) {
      return departureDate <= line['Departure Date'] && arrivalDate >= line['Arrival Date'];
    });
    data.forEach(function (line) {
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
        'count': value.count / (2 * data.length) * 100
      });

      if (value.count / (2 * data.length) * 100 >= max) {
        max = value.count / (2 * data.length) * 100;
      }
    });
    myColor.domain([0, max]);
    return p;
  } //Read the data


  d3.csv("./TRIP_HEATMAP.csv").then(function (data) {
    // add the squares and interaction
    var transformedData = transformData(data, startDate, endDate);
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
exports.rebuild = rebuild;

var preproc = _interopRequireWildcard(require("./preprocess.js"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// https://d3-graph-gallery.com/chord.html
// https://observablehq.com/@d3/directed-chord-diagram
// https://jyu-theartofml.github.io/posts/circos_plot
// http://strongriley.github.io/d3/ex/chord.html
function build(div, data, startDate, endDate) {
  var chordWidth = window.innerWidth / 2;
  var margin = {
    top: chordWidth * 0.175,
    right: chordWidth * 0.05,
    bottom: chordWidth * 0.07,
    left: chordWidth * 0.20
  },
      // TODO : Revoir valeur
  width = chordWidth - margin.left - margin.right,
      height = chordWidth - margin.top - margin.bottom;
  var outerRadius = width / 3.5;
  var innerRadius = outerRadius - 10; // create the svg area

  var svg = div.select('#tab-3-chord-diagram').append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + (margin.left + outerRadius) + "," + (margin.top + outerRadius) + ")"); // create input data: a square matrix that provides flow between entities

  var matrix = preproc.chordMatrix(data, startDate, endDate);
  var colors = preproc.REGION_COLOR;
  var tooltip = d3.select('#tooltip-chord-container'); // give this matrix to d3.chord(): it will calculates all the info we need to draw arc and ribbon

  var res = d3.chord().padAngle(0.05) // padding between entities (black arc)
  .sortSubgroups(d3.descending)(matrix); // add the links between groups

  var links = svg.datum(res).append("g").attr("id", "links").selectAll("path").data(function (d) {
    return d;
  }).enter().append("path").attr("class", "chord").on('mouseenter', function (_ref, _) {
    var source = _ref.source,
        target = _ref.target;
    tooltip.select('span#tooltip-chord-region-from-text').text(preproc.REGION_NAME[source.index]).style('color', colors[source.index]);
    tooltip.select('span#tooltip-chord-region-to-text').text(preproc.REGION_NAME[source.subindex]).style('color', colors[source.subindex]);
    tooltip.select('span#tooltip-chord-value').text(source.value);
    return tooltip.style("visibility", "visible");
  }).on('mousemove', function () {
    tooltip.style('left', d3.event.pageX - 246);
    tooltip.style('top', d3.event.pageY + 5);
  }).on('mouseleave', function () {
    return tooltip.style("visibility", "hidden");
  }).attr("d", d3.ribbon().radius(innerRadius)).style("fill", function (d) {
    return colors[d.source.index];
  }) // colors depend on the source group
  .style("stroke", "black").attr("opacity", 0.5); // add the groups on the outer part of the circle

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
  .append("text").attr("x", 8).attr("dy", ".25em").attr("transform", function (d) {
    return d.startAngle > Math.PI ? "rotate(180) translate(-16)" : null;
  }).style("text-anchor", function (d) {
    return d.startAngle > Math.PI ? "end" : null;
  }).style("fill", function (_, i) {
    return colors[i];
  }).style("font-weight", "bold").style("font-size", 12).text(function (d) {
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

function rebuild(div, data, startDate, endDate) {
  div.select('#tab-3-chord-diagram').select('svg').remove();
  build(div, data, startDate, endDate);
}
},{"./preprocess.js":"LFDw"}],"Focm":[function(require,module,exports) {
"use strict";

var onglet1 = _interopRequireWildcard(require("./scripts/onglet1.js"));

var onglet3 = _interopRequireWildcard(require("./scripts/onglet3.js"));

var chord = _interopRequireWildcard(require("./scripts/chord.js"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var chordData;

(function (d3) {
  d3.csv('./TRIP_STACK_HALF_MONTH.csv').then(function (stackData) {
    onglet1.build(d3.select('#tab-1-content'), stackData);
    d3.csv('./TRIP_CHORD.csv').then(function (data) {
      chordData = data;
      chord.build(d3.select('#tab-3-content'), data, "2010-01-01", "2023-01-01");
      time_graph(stackData);
    });
    onglet3.buildHeatmap(d3.select('#tab-3-content'), "2010-01-01", "2023-01-01");
  });
})(d3);

$('.tab-button').click(function () {
  if (!$(this).hasClass('tab-button-active')) {
    var tab = $(this).data('tab');
    d3.select(".visible-tips").style("display", "none");
    d3.select(".visible-tips").classed("visible-tips", false);
    d3.select("#tab-".concat(tab, "-tips")).style("display", "block").classed("visible-tips", true);
    $('button.tab-button').removeClass('tab-button-active');
    $(this).addClass('tab-button-active');
    $('.tab-content').removeClass('visible-tab');
    $(".tab-content#tab-".concat(tab, "-content")).addClass('visible-tab');
  }
});

function time_graph(stackData) {
  var data = stackData.map(function (d) {
    return {
      date: d3.timeParse("%Y-%m-%d")(d.date),
      traffic: +d.Merchant + +d.Barges + +d.Other + +d.Tugs + +d.Tanker + +d.Fishing + +d.PleasureCrafts + +d.Excursion
    };
  });
  var ndx = crossfilter(data);
  var vesselTraffic = ndx.dimension(function (d) {
    return d3.timeMonth(d.date);
  });
  var vesselTraffics = vesselTraffic.group().reduceSum(function (d) {
    return d.traffic;
  });
  var minDate = vesselTraffic.bottom(1)[0].date;
  var maxDate = vesselTraffic.top(1)[0].date;
  var timeScale = d3.scaleTime().domain([minDate, maxDate]).rangeRound([0, 950]);
  var vesselTrafficChart = new dc.BarChart('#tab-3-content .traffic-chart').width(950).height(125).margins({
    top: 10,
    right: 50,
    bottom: 30,
    left: 30
  }).dimension(vesselTraffic).group(vesselTraffics).round(d3.timeMonth).x(timeScale).brushOn(true).elasticY(true);
  vesselTrafficChart.yAxis().ticks(5);
  vesselTrafficChart.render();
  vesselTrafficChart.on('preRedraw', function () {
    var selection = d3.select('#tab-3-content .traffic-chart g.brush rect.selection');
    var x = selection.attr('x');
    var width = selection.attr('width');
    var startString;
    var endString;

    if (x == null || width == null) {
      startString = minDate.toISOString().split('T')[0];
      endString = maxDate.toISOString().split('T')[0];
    } else {
      var start = timeScale.invert(x);
      var end = timeScale.invert(x + width);
      startString = start.toISOString().split('T')[0];
      endString = end.toISOString().split('T')[0];
    }

    chord.rebuild(d3.select('#tab-3-content'), chordData, startString, endString);
    onglet3.rebuild(d3.select('#tab-3-content'), startString, endString);
  });
}
},{"./scripts/onglet1.js":"DNGJ","./scripts/onglet3.js":"YjD1","./scripts/chord.js":"QAKd"}]},{},["Focm"], null)
//# sourceMappingURL=/INF8808-Projet.996a8080.js.map