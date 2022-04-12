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
})({"scripts/onglet1.js":[function(require,module,exports) {
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
},{}],"scripts/crossfilter.js":[function(require,module,exports) {
(function (exports) {
  crossfilter.version = "1.3.14";

  function crossfilter_identity(d) {
    return d;
  }

  crossfilter.permute = permute;

  function permute(array, index) {
    for (var i = 0, n = index.length, copy = new Array(n); i < n; ++i) {
      copy[i] = array[index[i]];
    }

    return copy;
  }

  var bisect = crossfilter.bisect = bisect_by(crossfilter_identity);
  bisect.by = bisect_by;

  function bisect_by(f) {
    // Locate the insertion point for x in a to maintain sorted order. The
    // arguments lo and hi may be used to specify a subset of the array which
    // should be considered; by default the entire array is used. If x is already
    // present in a, the insertion point will be before (to the left of) any
    // existing entries. The return value is suitable for use as the first
    // argument to `array.splice` assuming that a is already sorted.
    //
    // The returned insertion point i partitions the array a into two halves so
    // that all v < x for v in a[lo:i] for the left side and all v >= x for v in
    // a[i:hi] for the right side.
    function bisectLeft(a, x, lo, hi) {
      while (lo < hi) {
        var mid = lo + hi >>> 1;
        if (f(a[mid]) < x) lo = mid + 1;else hi = mid;
      }

      return lo;
    } // Similar to bisectLeft, but returns an insertion point which comes after (to
    // the right of) any existing entries of x in a.
    //
    // The returned insertion point i partitions the array into two halves so that
    // all v <= x for v in a[lo:i] for the left side and all v > x for v in
    // a[i:hi] for the right side.


    function bisectRight(a, x, lo, hi) {
      while (lo < hi) {
        var mid = lo + hi >>> 1;
        if (x < f(a[mid])) hi = mid;else lo = mid + 1;
      }

      return lo;
    }

    bisectRight.right = bisectRight;
    bisectRight.left = bisectLeft;
    return bisectRight;
  }

  var heap = crossfilter.heap = heap_by(crossfilter_identity);
  heap.by = heap_by;

  function heap_by(f) {
    // Builds a binary heap within the specified array a[lo:hi]. The heap has the
    // property such that the parent a[lo+i] is always less than or equal to its
    // two children: a[lo+2*i+1] and a[lo+2*i+2].
    function heap(a, lo, hi) {
      var n = hi - lo,
          i = (n >>> 1) + 1;

      while (--i > 0) {
        sift(a, i, n, lo);
      }

      return a;
    } // Sorts the specified array a[lo:hi] in descending order, assuming it is
    // already a heap.


    function sort(a, lo, hi) {
      var n = hi - lo,
          t;

      while (--n > 0) {
        t = a[lo], a[lo] = a[lo + n], a[lo + n] = t, sift(a, 1, n, lo);
      }

      return a;
    } // Sifts the element a[lo+i-1] down the heap, where the heap is the contiguous
    // slice of array a[lo:lo+n]. This method can also be used to update the heap
    // incrementally, without incurring the full cost of reconstructing the heap.


    function sift(a, i, n, lo) {
      var d = a[--lo + i],
          x = f(d),
          child;

      while ((child = i << 1) <= n) {
        if (child < n && f(a[lo + child]) > f(a[lo + child + 1])) child++;
        if (x <= f(a[lo + child])) break;
        a[lo + i] = a[lo + child];
        i = child;
      }

      a[lo + i] = d;
    }

    heap.sort = sort;
    return heap;
  }

  var heapselect = crossfilter.heapselect = heapselect_by(crossfilter_identity);
  heapselect.by = heapselect_by;

  function heapselect_by(f) {
    var heap = heap_by(f); // Returns a new array containing the top k elements in the array a[lo:hi].
    // The returned array is not sorted, but maintains the heap property. If k is
    // greater than hi - lo, then fewer than k elements will be returned. The
    // order of elements in a is unchanged by this operation.

    function heapselect(a, lo, hi, k) {
      var queue = new Array(k = Math.min(hi - lo, k)),
          min,
          i,
          x,
          d;

      for (i = 0; i < k; ++i) {
        queue[i] = a[lo++];
      }

      heap(queue, 0, k);

      if (lo < hi) {
        min = f(queue[0]);

        do {
          if (x = f(d = a[lo]) > min) {
            queue[0] = d;
            min = f(heap(queue, 0, k)[0]);
          }
        } while (++lo < hi);
      }

      return queue;
    }

    return heapselect;
  }

  var insertionsort = crossfilter.insertionsort = insertionsort_by(crossfilter_identity);
  insertionsort.by = insertionsort_by;

  function insertionsort_by(f) {
    function insertionsort(a, lo, hi) {
      for (var i = lo + 1; i < hi; ++i) {
        for (var j = i, t = a[i], x = f(t); j > lo && f(a[j - 1]) > x; --j) {
          a[j] = a[j - 1];
        }

        a[j] = t;
      }

      return a;
    }

    return insertionsort;
  } // Algorithm designed by Vladimir Yaroslavskiy.
  // Implementation based on the Dart project; see lib/dart/LICENSE for details.


  var quicksort = crossfilter.quicksort = quicksort_by(crossfilter_identity);
  quicksort.by = quicksort_by;

  function quicksort_by(f) {
    var insertionsort = insertionsort_by(f);

    function sort(a, lo, hi) {
      return (hi - lo < quicksort_sizeThreshold ? insertionsort : quicksort)(a, lo, hi);
    }

    function quicksort(a, lo, hi) {
      // Compute the two pivots by looking at 5 elements.
      var sixth = (hi - lo) / 6 | 0,
          i1 = lo + sixth,
          i5 = hi - 1 - sixth,
          i3 = lo + hi - 1 >> 1,
          // The midpoint.
      i2 = i3 - sixth,
          i4 = i3 + sixth;
      var e1 = a[i1],
          x1 = f(e1),
          e2 = a[i2],
          x2 = f(e2),
          e3 = a[i3],
          x3 = f(e3),
          e4 = a[i4],
          x4 = f(e4),
          e5 = a[i5],
          x5 = f(e5);
      var t; // Sort the selected 5 elements using a sorting network.

      if (x1 > x2) t = e1, e1 = e2, e2 = t, t = x1, x1 = x2, x2 = t;
      if (x4 > x5) t = e4, e4 = e5, e5 = t, t = x4, x4 = x5, x5 = t;
      if (x1 > x3) t = e1, e1 = e3, e3 = t, t = x1, x1 = x3, x3 = t;
      if (x2 > x3) t = e2, e2 = e3, e3 = t, t = x2, x2 = x3, x3 = t;
      if (x1 > x4) t = e1, e1 = e4, e4 = t, t = x1, x1 = x4, x4 = t;
      if (x3 > x4) t = e3, e3 = e4, e4 = t, t = x3, x3 = x4, x4 = t;
      if (x2 > x5) t = e2, e2 = e5, e5 = t, t = x2, x2 = x5, x5 = t;
      if (x2 > x3) t = e2, e2 = e3, e3 = t, t = x2, x2 = x3, x3 = t;
      if (x4 > x5) t = e4, e4 = e5, e5 = t, t = x4, x4 = x5, x5 = t;
      var pivot1 = e2,
          pivotValue1 = x2,
          pivot2 = e4,
          pivotValue2 = x4; // e2 and e4 have been saved in the pivot variables. They will be written
      // back, once the partitioning is finished.

      a[i1] = e1;
      a[i2] = a[lo];
      a[i3] = e3;
      a[i4] = a[hi - 1];
      a[i5] = e5;
      var less = lo + 1,
          // First element in the middle partition.
      great = hi - 2; // Last element in the middle partition.
      // Note that for value comparison, <, <=, >= and > coerce to a primitive via
      // Object.prototype.valueOf; == and === do not, so in order to be consistent
      // with natural order (such as for Date objects), we must do two compares.

      var pivotsEqual = pivotValue1 <= pivotValue2 && pivotValue1 >= pivotValue2;

      if (pivotsEqual) {
        // Degenerated case where the partitioning becomes a dutch national flag
        // problem.
        //
        // [ |  < pivot  | == pivot | unpartitioned | > pivot  | ]
        //  ^             ^          ^             ^            ^
        // left         less         k           great         right
        //
        // a[left] and a[right] are undefined and are filled after the
        // partitioning.
        //
        // Invariants:
        //   1) for x in ]left, less[ : x < pivot.
        //   2) for x in [less, k[ : x == pivot.
        //   3) for x in ]great, right[ : x > pivot.
        for (var k = less; k <= great; ++k) {
          var ek = a[k],
              xk = f(ek);

          if (xk < pivotValue1) {
            if (k !== less) {
              a[k] = a[less];
              a[less] = ek;
            }

            ++less;
          } else if (xk > pivotValue1) {
            // Find the first element <= pivot in the range [k - 1, great] and
            // put [:ek:] there. We know that such an element must exist:
            // When k == less, then el3 (which is equal to pivot) lies in the
            // interval. Otherwise a[k - 1] == pivot and the search stops at k-1.
            // Note that in the latter case invariant 2 will be violated for a
            // short amount of time. The invariant will be restored when the
            // pivots are put into their final positions.
            while (true) {
              var greatValue = f(a[great]);

              if (greatValue > pivotValue1) {
                great--; // This is the only location in the while-loop where a new
                // iteration is started.

                continue;
              } else if (greatValue < pivotValue1) {
                // Triple exchange.
                a[k] = a[less];
                a[less++] = a[great];
                a[great--] = ek;
                break;
              } else {
                a[k] = a[great];
                a[great--] = ek; // Note: if great < k then we will exit the outer loop and fix
                // invariant 2 (which we just violated).

                break;
              }
            }
          }
        }
      } else {
        // We partition the list into three parts:
        //  1. < pivot1
        //  2. >= pivot1 && <= pivot2
        //  3. > pivot2
        //
        // During the loop we have:
        // [ | < pivot1 | >= pivot1 && <= pivot2 | unpartitioned  | > pivot2  | ]
        //  ^            ^                        ^              ^             ^
        // left         less                     k              great        right
        //
        // a[left] and a[right] are undefined and are filled after the
        // partitioning.
        //
        // Invariants:
        //   1. for x in ]left, less[ : x < pivot1
        //   2. for x in [less, k[ : pivot1 <= x && x <= pivot2
        //   3. for x in ]great, right[ : x > pivot2
        for (var k = less; k <= great; k++) {
          var ek = a[k],
              xk = f(ek);

          if (xk < pivotValue1) {
            if (k !== less) {
              a[k] = a[less];
              a[less] = ek;
            }

            ++less;
          } else {
            if (xk > pivotValue2) {
              while (true) {
                var greatValue = f(a[great]);

                if (greatValue > pivotValue2) {
                  great--;
                  if (great < k) break; // This is the only location inside the loop where a new
                  // iteration is started.

                  continue;
                } else {
                  // a[great] <= pivot2.
                  if (greatValue < pivotValue1) {
                    // Triple exchange.
                    a[k] = a[less];
                    a[less++] = a[great];
                    a[great--] = ek;
                  } else {
                    // a[great] >= pivot1.
                    a[k] = a[great];
                    a[great--] = ek;
                  }

                  break;
                }
              }
            }
          }
        }
      } // Move pivots into their final positions.
      // We shrunk the list from both sides (a[left] and a[right] have
      // meaningless values in them) and now we move elements from the first
      // and third partition into these locations so that we can store the
      // pivots.


      a[lo] = a[less - 1];
      a[less - 1] = pivot1;
      a[hi - 1] = a[great + 1];
      a[great + 1] = pivot2; // The list is now partitioned into three partitions:
      // [ < pivot1   | >= pivot1 && <= pivot2   |  > pivot2   ]
      //  ^            ^                        ^             ^
      // left         less                     great        right
      // Recursive descent. (Don't include the pivot values.)

      sort(a, lo, less - 1);
      sort(a, great + 2, hi);

      if (pivotsEqual) {
        // All elements in the second partition are equal to the pivot. No
        // need to sort them.
        return a;
      } // In theory it should be enough to call _doSort recursively on the second
      // partition.
      // The Android source however removes the pivot elements from the recursive
      // call if the second partition is too large (more than 2/3 of the list).


      if (less < i1 && great > i5) {
        var lessValue, greatValue;

        while ((lessValue = f(a[less])) <= pivotValue1 && lessValue >= pivotValue1) {
          ++less;
        }

        while ((greatValue = f(a[great])) <= pivotValue2 && greatValue >= pivotValue2) {
          --great;
        } // Copy paste of the previous 3-way partitioning with adaptions.
        //
        // We partition the list into three parts:
        //  1. == pivot1
        //  2. > pivot1 && < pivot2
        //  3. == pivot2
        //
        // During the loop we have:
        // [ == pivot1 | > pivot1 && < pivot2 | unpartitioned  | == pivot2 ]
        //              ^                      ^              ^
        //            less                     k              great
        //
        // Invariants:
        //   1. for x in [ *, less[ : x == pivot1
        //   2. for x in [less, k[ : pivot1 < x && x < pivot2
        //   3. for x in ]great, * ] : x == pivot2


        for (var k = less; k <= great; k++) {
          var ek = a[k],
              xk = f(ek);

          if (xk <= pivotValue1 && xk >= pivotValue1) {
            if (k !== less) {
              a[k] = a[less];
              a[less] = ek;
            }

            less++;
          } else {
            if (xk <= pivotValue2 && xk >= pivotValue2) {
              while (true) {
                var greatValue = f(a[great]);

                if (greatValue <= pivotValue2 && greatValue >= pivotValue2) {
                  great--;
                  if (great < k) break; // This is the only location inside the loop where a new
                  // iteration is started.

                  continue;
                } else {
                  // a[great] < pivot2.
                  if (greatValue < pivotValue1) {
                    // Triple exchange.
                    a[k] = a[less];
                    a[less++] = a[great];
                    a[great--] = ek;
                  } else {
                    // a[great] == pivot1.
                    a[k] = a[great];
                    a[great--] = ek;
                  }

                  break;
                }
              }
            }
          }
        }
      } // The second partition has now been cleared of pivot elements and looks
      // as follows:
      // [  *  |  > pivot1 && < pivot2  | * ]
      //        ^                      ^
      //       less                  great
      // Sort the second partition using recursive descent.
      // The second partition looks as follows:
      // [  *  |  >= pivot1 && <= pivot2  | * ]
      //        ^                        ^
      //       less                    great
      // Simply sort it by recursive descent.


      return sort(a, less, great + 1);
    }

    return sort;
  }

  var quicksort_sizeThreshold = 32;
  var crossfilter_array8 = crossfilter_arrayUntyped,
      crossfilter_array16 = crossfilter_arrayUntyped,
      crossfilter_array32 = crossfilter_arrayUntyped,
      crossfilter_arrayLengthen = crossfilter_arrayLengthenUntyped,
      crossfilter_arrayWiden = crossfilter_arrayWidenUntyped;

  if (typeof Uint8Array !== "undefined") {
    crossfilter_array8 = function crossfilter_array8(n) {
      return new Uint8Array(n);
    };

    crossfilter_array16 = function crossfilter_array16(n) {
      return new Uint16Array(n);
    };

    crossfilter_array32 = function crossfilter_array32(n) {
      return new Uint32Array(n);
    };

    crossfilter_arrayLengthen = function crossfilter_arrayLengthen(array, length) {
      if (array.length >= length) return array;
      var copy = new array.constructor(length);
      copy.set(array);
      return copy;
    };

    crossfilter_arrayWiden = function crossfilter_arrayWiden(array, width) {
      var copy;

      switch (width) {
        case 16:
          copy = crossfilter_array16(array.length);
          break;

        case 32:
          copy = crossfilter_array32(array.length);
          break;

        default:
          throw new Error("invalid array width!");
      }

      copy.set(array);
      return copy;
    };
  }

  function crossfilter_arrayUntyped(n) {
    var array = new Array(n),
        i = -1;

    while (++i < n) {
      array[i] = 0;
    }

    return array;
  }

  function crossfilter_arrayLengthenUntyped(array, length) {
    var n = array.length;

    while (n < length) {
      array[n++] = 0;
    }

    return array;
  }

  function crossfilter_arrayWidenUntyped(array, width) {
    if (width > 32) throw new Error("invalid array width!");
    return array;
  }

  function crossfilter_filterExact(bisect, value) {
    return function (values) {
      var n = values.length;
      return [bisect.left(values, value, 0, n), bisect.right(values, value, 0, n)];
    };
  }

  function crossfilter_filterRange(bisect, range) {
    var min = range[0],
        max = range[1];
    return function (values) {
      var n = values.length;
      return [bisect.left(values, min, 0, n), bisect.left(values, max, 0, n)];
    };
  }

  function crossfilter_filterAll(values) {
    return [0, values.length];
  }

  function crossfilter_null() {
    return null;
  }

  function crossfilter_zero() {
    return 0;
  }

  function crossfilter_reduceIncrement(p) {
    return p + 1;
  }

  function crossfilter_reduceDecrement(p) {
    return p - 1;
  }

  function crossfilter_reduceAdd(f) {
    return function (p, v) {
      return p + +f(v);
    };
  }

  function crossfilter_reduceSubtract(f) {
    return function (p, v) {
      return p - f(v);
    };
  }

  exports.crossfilter = crossfilter;

  function crossfilter() {
    var crossfilter = {
      add: add,
      remove: removeData,
      dimension: dimension,
      groupAll: groupAll,
      size: size
    };
    var data = [],
        // the records
    n = 0,
        // the number of records; data.length
    m = 0,
        // a bit mask representing which dimensions are in use
    M = 8,
        // number of dimensions that can fit in `filters`
    filters = crossfilter_array8(0),
        // M bits per record; 1 is filtered out
    filterListeners = [],
        // when the filters change
    dataListeners = [],
        // when data is added
    removeDataListeners = []; // when data is removed
    // Adds the specified new records to this crossfilter.

    function add(newData) {
      var n0 = n,
          n1 = newData.length; // If there's actually new data to add…
      // Merge the new data into the existing data.
      // Lengthen the filter bitset to handle the new records.
      // Notify listeners (dimensions and groups) that new data is available.

      if (n1) {
        data = data.concat(newData);
        filters = crossfilter_arrayLengthen(filters, n += n1);
        dataListeners.forEach(function (l) {
          l(newData, n0, n1);
        });
      }

      return crossfilter;
    } // Removes all records that match the current filters.


    function removeData() {
      var newIndex = crossfilter_index(n, n),
          removed = [];

      for (var i = 0, j = 0; i < n; ++i) {
        if (filters[i]) newIndex[i] = j++;else removed.push(i);
      } // Remove all matching records from groups.


      filterListeners.forEach(function (l) {
        l(0, [], removed);
      }); // Update indexes.

      removeDataListeners.forEach(function (l) {
        l(newIndex);
      }); // Remove old filters and data by overwriting.

      for (var i = 0, j = 0, k; i < n; ++i) {
        if (k = filters[i]) {
          if (i !== j) filters[j] = k, data[j] = data[i];
          ++j;
        }
      }

      data.length = j;

      while (n > j) {
        filters[--n] = 0;
      }
    } // Adds a new dimension with the specified value accessor function.


    function dimension(value) {
      var dimension = {
        filter: filter,
        filterExact: filterExact,
        filterRange: filterRange,
        filterFunction: filterFunction,
        filterAll: filterAll,
        top: top,
        bottom: bottom,
        group: group,
        groupAll: groupAll,
        dispose: dispose,
        remove: dispose // for backwards-compatibility

      };
      var one = ~m & -~m,
          // lowest unset bit as mask, e.g., 00001000
      zero = ~one,
          // inverted one, e.g., 11110111
      values,
          // sorted, cached array
      index,
          // value rank ↦ object id
      newValues,
          // temporary array storing newly-added values
      newIndex,
          // temporary array storing newly-added index
      sort = quicksort_by(function (i) {
        return newValues[i];
      }),
          refilter = crossfilter_filterAll,
          // for recomputing filter
      refilterFunction,
          // the custom filter function in use
      indexListeners = [],
          // when data is added
      dimensionGroups = [],
          lo0 = 0,
          hi0 = 0; // Updating a dimension is a two-stage process. First, we must update the
      // associated filters for the newly-added records. Once all dimensions have
      // updated their filters, the groups are notified to update.

      dataListeners.unshift(preAdd);
      dataListeners.push(postAdd);
      removeDataListeners.push(removeData); // Incorporate any existing data into this dimension, and make sure that the
      // filter bitset is wide enough to handle the new dimension.

      m |= one;

      if (M >= 32 ? !one : m & -(1 << M)) {
        filters = crossfilter_arrayWiden(filters, M <<= 1);
      }

      preAdd(data, 0, n);
      postAdd(data, 0, n); // Incorporates the specified new records into this dimension.
      // This function is responsible for updating filters, values, and index.

      function preAdd(newData, n0, n1) {
        // Permute new values into natural order using a sorted index.
        newValues = newData.map(value);
        newIndex = sort(crossfilter_range(n1), 0, n1);
        newValues = permute(newValues, newIndex); // Bisect newValues to determine which new records are selected.

        var bounds = refilter(newValues),
            lo1 = bounds[0],
            hi1 = bounds[1],
            i;

        if (refilterFunction) {
          for (i = 0; i < n1; ++i) {
            if (!refilterFunction(newValues[i], i)) filters[newIndex[i] + n0] |= one;
          }
        } else {
          for (i = 0; i < lo1; ++i) {
            filters[newIndex[i] + n0] |= one;
          }

          for (i = hi1; i < n1; ++i) {
            filters[newIndex[i] + n0] |= one;
          }
        } // If this dimension previously had no data, then we don't need to do the
        // more expensive merge operation; use the new values and index as-is.


        if (!n0) {
          values = newValues;
          index = newIndex;
          lo0 = lo1;
          hi0 = hi1;
          return;
        }

        var oldValues = values,
            oldIndex = index,
            i0 = 0,
            i1 = 0; // Otherwise, create new arrays into which to merge new and old.

        values = new Array(n);
        index = crossfilter_index(n, n); // Merge the old and new sorted values, and old and new index.

        for (i = 0; i0 < n0 && i1 < n1; ++i) {
          if (oldValues[i0] < newValues[i1]) {
            values[i] = oldValues[i0];
            index[i] = oldIndex[i0++];
          } else {
            values[i] = newValues[i1];
            index[i] = newIndex[i1++] + n0;
          }
        } // Add any remaining old values.


        for (; i0 < n0; ++i0, ++i) {
          values[i] = oldValues[i0];
          index[i] = oldIndex[i0];
        } // Add any remaining new values.


        for (; i1 < n1; ++i1, ++i) {
          values[i] = newValues[i1];
          index[i] = newIndex[i1] + n0;
        } // Bisect again to recompute lo0 and hi0.


        bounds = refilter(values), lo0 = bounds[0], hi0 = bounds[1];
      } // When all filters have updated, notify index listeners of the new values.


      function postAdd(newData, n0, n1) {
        indexListeners.forEach(function (l) {
          l(newValues, newIndex, n0, n1);
        });
        newValues = newIndex = null;
      }

      function removeData(reIndex) {
        for (var i = 0, j = 0, k; i < n; ++i) {
          if (filters[k = index[i]]) {
            if (i !== j) values[j] = values[i];
            index[j] = reIndex[k];
            ++j;
          }
        }

        values.length = j;

        while (j < n) {
          index[j++] = 0;
        } // Bisect again to recompute lo0 and hi0.


        var bounds = refilter(values);
        lo0 = bounds[0], hi0 = bounds[1];
      } // Updates the selected values based on the specified bounds [lo, hi].
      // This implementation is used by all the public filter methods.


      function filterIndexBounds(bounds) {
        var lo1 = bounds[0],
            hi1 = bounds[1];

        if (refilterFunction) {
          refilterFunction = null;
          filterIndexFunction(function (d, i) {
            return lo1 <= i && i < hi1;
          });
          lo0 = lo1;
          hi0 = hi1;
          return dimension;
        }

        var i,
            j,
            k,
            added = [],
            removed = []; // Fast incremental update based on previous lo index.

        if (lo1 < lo0) {
          for (i = lo1, j = Math.min(lo0, hi1); i < j; ++i) {
            filters[k = index[i]] ^= one;
            added.push(k);
          }
        } else if (lo1 > lo0) {
          for (i = lo0, j = Math.min(lo1, hi0); i < j; ++i) {
            filters[k = index[i]] ^= one;
            removed.push(k);
          }
        } // Fast incremental update based on previous hi index.


        if (hi1 > hi0) {
          for (i = Math.max(lo1, hi0), j = hi1; i < j; ++i) {
            filters[k = index[i]] ^= one;
            added.push(k);
          }
        } else if (hi1 < hi0) {
          for (i = Math.max(lo0, hi1), j = hi0; i < j; ++i) {
            filters[k = index[i]] ^= one;
            removed.push(k);
          }
        }

        lo0 = lo1;
        hi0 = hi1;
        filterListeners.forEach(function (l) {
          l(one, added, removed);
        });
        return dimension;
      } // Filters this dimension using the specified range, value, or null.
      // If the range is null, this is equivalent to filterAll.
      // If the range is an array, this is equivalent to filterRange.
      // Otherwise, this is equivalent to filterExact.


      function filter(range) {
        return range == null ? filterAll() : Array.isArray(range) ? filterRange(range) : typeof range === "function" ? filterFunction(range) : filterExact(range);
      } // Filters this dimension to select the exact value.


      function filterExact(value) {
        return filterIndexBounds((refilter = crossfilter_filterExact(bisect, value))(values));
      } // Filters this dimension to select the specified range [lo, hi].
      // The lower bound is inclusive, and the upper bound is exclusive.


      function filterRange(range) {
        return filterIndexBounds((refilter = crossfilter_filterRange(bisect, range))(values));
      } // Clears any filters on this dimension.


      function filterAll() {
        return filterIndexBounds((refilter = crossfilter_filterAll)(values));
      } // Filters this dimension using an arbitrary function.


      function filterFunction(f) {
        refilter = crossfilter_filterAll;
        filterIndexFunction(refilterFunction = f);
        lo0 = 0;
        hi0 = n;
        return dimension;
      }

      function filterIndexFunction(f) {
        var i,
            k,
            x,
            added = [],
            removed = [];

        for (i = 0; i < n; ++i) {
          if (!(filters[k = index[i]] & one) ^ !!(x = f(values[i], i))) {
            if (x) filters[k] &= zero, added.push(k);else filters[k] |= one, removed.push(k);
          }
        }

        filterListeners.forEach(function (l) {
          l(one, added, removed);
        });
      } // Returns the top K selected records based on this dimension's order.
      // Note: observes this dimension's filter, unlike group and groupAll.


      function top(k) {
        var array = [],
            i = hi0,
            j;

        while (--i >= lo0 && k > 0) {
          if (!filters[j = index[i]]) {
            array.push(data[j]);
            --k;
          }
        }

        return array;
      } // Returns the bottom K selected records based on this dimension's order.
      // Note: observes this dimension's filter, unlike group and groupAll.


      function bottom(k) {
        var array = [],
            i = lo0,
            j;

        while (i < hi0 && k > 0) {
          if (!filters[j = index[i]]) {
            array.push(data[j]);
            --k;
          }

          i++;
        }

        return array;
      } // Adds a new group to this dimension, using the specified key function.


      function group(key) {
        var group = {
          top: top,
          all: all,
          reduce: reduce,
          reduceCount: reduceCount,
          reduceSum: reduceSum,
          order: order,
          orderNatural: orderNatural,
          size: size,
          dispose: dispose,
          remove: dispose // for backwards-compatibility

        }; // Ensure that this group will be removed when the dimension is removed.

        dimensionGroups.push(group);
        var groups,
            // array of {key, value}
        groupIndex,
            // object id ↦ group id
        groupWidth = 8,
            groupCapacity = crossfilter_capacity(groupWidth),
            k = 0,
            // cardinality
        select,
            heap,
            reduceAdd,
            reduceRemove,
            reduceInitial,
            update = crossfilter_null,
            reset = crossfilter_null,
            resetNeeded = true,
            groupAll = key === crossfilter_null;
        if (arguments.length < 1) key = crossfilter_identity; // The group listens to the crossfilter for when any dimension changes, so
        // that it can update the associated reduce values. It must also listen to
        // the parent dimension for when data is added, and compute new keys.

        filterListeners.push(update);
        indexListeners.push(add);
        removeDataListeners.push(removeData); // Incorporate any existing data into the grouping.

        add(values, index, 0, n); // Incorporates the specified new values into this group.
        // This function is responsible for updating groups and groupIndex.

        function add(newValues, newIndex, n0, n1) {
          var oldGroups = groups,
              reIndex = crossfilter_index(k, groupCapacity),
              add = reduceAdd,
              initial = reduceInitial,
              k0 = k,
              // old cardinality
          i0 = 0,
              // index of old group
          i1 = 0,
              // index of new record
          j,
              // object id
          g0,
              // old group
          x0,
              // old key
          x1,
              // new key
          g,
              // group to add
          x; // key of group to add
          // If a reset is needed, we don't need to update the reduce values.

          if (resetNeeded) add = initial = crossfilter_null; // Reset the new groups (k is a lower bound).
          // Also, make sure that groupIndex exists and is long enough.

          groups = new Array(k), k = 0;
          groupIndex = k0 > 1 ? crossfilter_arrayLengthen(groupIndex, n) : crossfilter_index(n, groupCapacity); // Get the first old key (x0 of g0), if it exists.

          if (k0) x0 = (g0 = oldGroups[0]).key; // Find the first new key (x1), skipping NaN keys.

          while (i1 < n1 && !((x1 = key(newValues[i1])) >= x1)) {
            ++i1;
          } // While new keys remain…


          while (i1 < n1) {
            // Determine the lesser of the two current keys; new and old.
            // If there are no old keys remaining, then always add the new key.
            if (g0 && x0 <= x1) {
              g = g0, x = x0; // Record the new index of the old group.

              reIndex[i0] = k; // Retrieve the next old key.

              if (g0 = oldGroups[++i0]) x0 = g0.key;
            } else {
              g = {
                key: x1,
                value: initial()
              }, x = x1;
            } // Add the lesser group.


            groups[k] = g; // Add any selected records belonging to the added group, while
            // advancing the new key and populating the associated group index.

            while (!(x1 > x)) {
              groupIndex[j = newIndex[i1] + n0] = k;
              if (!(filters[j] & zero)) g.value = add(g.value, data[j]);
              if (++i1 >= n1) break;
              x1 = key(newValues[i1]);
            }

            groupIncrement();
          } // Add any remaining old groups that were greater than all new keys.
          // No incremental reduce is needed; these groups have no new records.
          // Also record the new index of the old group.


          while (i0 < k0) {
            groups[reIndex[i0] = k] = oldGroups[i0++];
            groupIncrement();
          } // If we added any new groups before any old groups,
          // update the group index of all the old records.


          if (k > i0) for (i0 = 0; i0 < n0; ++i0) {
            groupIndex[i0] = reIndex[groupIndex[i0]];
          } // Modify the update and reset behavior based on the cardinality.
          // If the cardinality is less than or equal to one, then the groupIndex
          // is not needed. If the cardinality is zero, then there are no records
          // and therefore no groups to update or reset. Note that we also must
          // change the registered listener to point to the new method.

          j = filterListeners.indexOf(update);

          if (k > 1) {
            update = updateMany;
            reset = resetMany;
          } else {
            if (!k && groupAll) {
              k = 1;
              groups = [{
                key: null,
                value: initial()
              }];
            }

            if (k === 1) {
              update = updateOne;
              reset = resetOne;
            } else {
              update = crossfilter_null;
              reset = crossfilter_null;
            }

            groupIndex = null;
          }

          filterListeners[j] = update; // Count the number of added groups,
          // and widen the group index as needed.

          function groupIncrement() {
            if (++k === groupCapacity) {
              reIndex = crossfilter_arrayWiden(reIndex, groupWidth <<= 1);
              groupIndex = crossfilter_arrayWiden(groupIndex, groupWidth);
              groupCapacity = crossfilter_capacity(groupWidth);
            }
          }
        }

        function removeData() {
          if (k > 1) {
            var oldK = k,
                oldGroups = groups,
                seenGroups = crossfilter_index(oldK, oldK); // Filter out non-matches by copying matching group index entries to
            // the beginning of the array.

            for (var i = 0, j = 0; i < n; ++i) {
              if (filters[i]) {
                seenGroups[groupIndex[j] = groupIndex[i]] = 1;
                ++j;
              }
            } // Reassemble groups including only those groups that were referred
            // to by matching group index entries.  Note the new group index in
            // seenGroups.


            groups = [], k = 0;

            for (i = 0; i < oldK; ++i) {
              if (seenGroups[i]) {
                seenGroups[i] = k++;
                groups.push(oldGroups[i]);
              }
            }

            if (k > 1) {
              // Reindex the group index using seenGroups to find the new index.
              for (var i = 0; i < j; ++i) {
                groupIndex[i] = seenGroups[groupIndex[i]];
              }
            } else {
              groupIndex = null;
            }

            filterListeners[filterListeners.indexOf(update)] = k > 1 ? (reset = resetMany, update = updateMany) : k === 1 ? (reset = resetOne, update = updateOne) : reset = update = crossfilter_null;
          } else if (k === 1) {
            if (groupAll) return;

            for (var i = 0; i < n; ++i) {
              if (filters[i]) return;
            }

            groups = [], k = 0;
            filterListeners[filterListeners.indexOf(update)] = update = reset = crossfilter_null;
          }
        } // Reduces the specified selected or deselected records.
        // This function is only used when the cardinality is greater than 1.


        function updateMany(filterOne, added, removed) {
          if (filterOne === one || resetNeeded) return;
          var i, k, n, g; // Add the added values.

          for (i = 0, n = added.length; i < n; ++i) {
            if (!(filters[k = added[i]] & zero)) {
              g = groups[groupIndex[k]];
              g.value = reduceAdd(g.value, data[k]);
            }
          } // Remove the removed values.


          for (i = 0, n = removed.length; i < n; ++i) {
            if ((filters[k = removed[i]] & zero) === filterOne) {
              g = groups[groupIndex[k]];
              g.value = reduceRemove(g.value, data[k]);
            }
          }
        } // Reduces the specified selected or deselected records.
        // This function is only used when the cardinality is 1.


        function updateOne(filterOne, added, removed) {
          if (filterOne === one || resetNeeded) return;
          var i,
              k,
              n,
              g = groups[0]; // Add the added values.

          for (i = 0, n = added.length; i < n; ++i) {
            if (!(filters[k = added[i]] & zero)) {
              g.value = reduceAdd(g.value, data[k]);
            }
          } // Remove the removed values.


          for (i = 0, n = removed.length; i < n; ++i) {
            if ((filters[k = removed[i]] & zero) === filterOne) {
              g.value = reduceRemove(g.value, data[k]);
            }
          }
        } // Recomputes the group reduce values from scratch.
        // This function is only used when the cardinality is greater than 1.


        function resetMany() {
          var i, g; // Reset all group values.

          for (i = 0; i < k; ++i) {
            groups[i].value = reduceInitial();
          } // Add any selected records.


          for (i = 0; i < n; ++i) {
            if (!(filters[i] & zero)) {
              g = groups[groupIndex[i]];
              g.value = reduceAdd(g.value, data[i]);
            }
          }
        } // Recomputes the group reduce values from scratch.
        // This function is only used when the cardinality is 1.


        function resetOne() {
          var i,
              g = groups[0]; // Reset the singleton group values.

          g.value = reduceInitial(); // Add any selected records.

          for (i = 0; i < n; ++i) {
            if (!(filters[i] & zero)) {
              g.value = reduceAdd(g.value, data[i]);
            }
          }
        } // Returns the array of group values, in the dimension's natural order.


        function all() {
          if (resetNeeded) reset(), resetNeeded = false;
          return groups;
        } // Returns a new array containing the top K group values, in reduce order.


        function top(k) {
          var top = select(all(), 0, groups.length, k);
          return heap.sort(top, 0, top.length);
        } // Sets the reduce behavior for this group to use the specified functions.
        // This method lazily recomputes the reduce values, waiting until needed.


        function reduce(add, remove, initial) {
          reduceAdd = add;
          reduceRemove = remove;
          reduceInitial = initial;
          resetNeeded = true;
          return group;
        } // A convenience method for reducing by count.


        function reduceCount() {
          return reduce(crossfilter_reduceIncrement, crossfilter_reduceDecrement, crossfilter_zero);
        } // A convenience method for reducing by sum(value).


        function reduceSum(value) {
          return reduce(crossfilter_reduceAdd(value), crossfilter_reduceSubtract(value), crossfilter_zero);
        } // Sets the reduce order, using the specified accessor.


        function order(value) {
          select = heapselect_by(valueOf);
          heap = heap_by(valueOf);

          function valueOf(d) {
            return value(d.value);
          }

          return group;
        } // A convenience method for natural ordering by reduce value.


        function orderNatural() {
          return order(crossfilter_identity);
        } // Returns the cardinality of this group, irrespective of any filters.


        function size() {
          return k;
        } // Removes this group and associated event listeners.


        function dispose() {
          var i = filterListeners.indexOf(update);
          if (i >= 0) filterListeners.splice(i, 1);
          i = indexListeners.indexOf(add);
          if (i >= 0) indexListeners.splice(i, 1);
          i = removeDataListeners.indexOf(removeData);
          if (i >= 0) removeDataListeners.splice(i, 1);
          return group;
        }

        return reduceCount().orderNatural();
      } // A convenience function for generating a singleton group.


      function groupAll() {
        var g = group(crossfilter_null),
            all = g.all;
        delete g.all;
        delete g.top;
        delete g.order;
        delete g.orderNatural;
        delete g.size;

        g.value = function () {
          return all()[0].value;
        };

        return g;
      } // Removes this dimension and associated groups and event listeners.


      function dispose() {
        dimensionGroups.forEach(function (group) {
          group.dispose();
        });
        var i = dataListeners.indexOf(preAdd);
        if (i >= 0) dataListeners.splice(i, 1);
        i = dataListeners.indexOf(postAdd);
        if (i >= 0) dataListeners.splice(i, 1);
        i = removeDataListeners.indexOf(removeData);
        if (i >= 0) removeDataListeners.splice(i, 1);
        m &= zero;
        return filterAll();
      }

      return dimension;
    } // A convenience method for groupAll on a dummy dimension.
    // This implementation can be optimized since it always has cardinality 1.


    function groupAll() {
      var group = {
        reduce: reduce,
        reduceCount: reduceCount,
        reduceSum: reduceSum,
        value: value,
        dispose: dispose,
        remove: dispose // for backwards-compatibility

      };
      var reduceValue,
          reduceAdd,
          reduceRemove,
          reduceInitial,
          resetNeeded = true; // The group listens to the crossfilter for when any dimension changes, so
      // that it can update the reduce value. It must also listen to the parent
      // dimension for when data is added.

      filterListeners.push(update);
      dataListeners.push(add); // For consistency; actually a no-op since resetNeeded is true.

      add(data, 0, n); // Incorporates the specified new values into this group.

      function add(newData, n0) {
        var i;
        if (resetNeeded) return; // Add the added values.

        for (i = n0; i < n; ++i) {
          if (!filters[i]) {
            reduceValue = reduceAdd(reduceValue, data[i]);
          }
        }
      } // Reduces the specified selected or deselected records.


      function update(filterOne, added, removed) {
        var i, k, n;
        if (resetNeeded) return; // Add the added values.

        for (i = 0, n = added.length; i < n; ++i) {
          if (!filters[k = added[i]]) {
            reduceValue = reduceAdd(reduceValue, data[k]);
          }
        } // Remove the removed values.


        for (i = 0, n = removed.length; i < n; ++i) {
          if (filters[k = removed[i]] === filterOne) {
            reduceValue = reduceRemove(reduceValue, data[k]);
          }
        }
      } // Recomputes the group reduce value from scratch.


      function reset() {
        var i;
        reduceValue = reduceInitial();

        for (i = 0; i < n; ++i) {
          if (!filters[i]) {
            reduceValue = reduceAdd(reduceValue, data[i]);
          }
        }
      } // Sets the reduce behavior for this group to use the specified functions.
      // This method lazily recomputes the reduce value, waiting until needed.


      function reduce(add, remove, initial) {
        reduceAdd = add;
        reduceRemove = remove;
        reduceInitial = initial;
        resetNeeded = true;
        return group;
      } // A convenience method for reducing by count.


      function reduceCount() {
        return reduce(crossfilter_reduceIncrement, crossfilter_reduceDecrement, crossfilter_zero);
      } // A convenience method for reducing by sum(value).


      function reduceSum(value) {
        return reduce(crossfilter_reduceAdd(value), crossfilter_reduceSubtract(value), crossfilter_zero);
      } // Returns the computed reduce value.


      function value() {
        if (resetNeeded) reset(), resetNeeded = false;
        return reduceValue;
      } // Removes this group and associated event listeners.


      function dispose() {
        var i = filterListeners.indexOf(update);
        if (i >= 0) filterListeners.splice(i);
        i = dataListeners.indexOf(add);
        if (i >= 0) dataListeners.splice(i);
        return group;
      }

      return reduceCount();
    } // Returns the number of records in this crossfilter, irrespective of any filters.


    function size() {
      return n;
    }

    return arguments.length ? add(arguments[0]) : crossfilter;
  } // Returns an array of size n, big enough to store ids up to m.


  function crossfilter_index(n, m) {
    return (m < 0x101 ? crossfilter_array8 : m < 0x10001 ? crossfilter_array16 : crossfilter_array32)(n);
  } // Constructs a new array of size n, with sequential values from 0 to n - 1.


  function crossfilter_range(n) {
    var range = crossfilter_index(n, n);

    for (var i = -1; ++i < n;) {
      range[i] = i;
    }

    return range;
  }

  function crossfilter_capacity(w) {
    return w === 8 ? 0x100 : w === 16 ? 0x10000 : 0x100000000;
  }
})(typeof exports !== 'undefined' && exports || this);
},{}],"scripts/onglet2.js":[function(require,module,exports) {
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

var _crossfilter = require("./crossfilter");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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
},{"./crossfilter":"scripts/crossfilter.js"}],"scripts/preprocess.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.REGION_NAME = exports.REGION_COLOR = exports.GLOBAL_VESSEL_TYPE = void 0;
exports.chordMatrix = chordMatrix;
exports.clean = clean;
var GLOBAL_VESSEL_TYPE = ['Barges', 'Excursion', 'Fishing', 'Merchant', 'Other', 'Pleasure Crafts', 'Tanker', 'Tugs'];
exports.GLOBAL_VESSEL_TYPE = GLOBAL_VESSEL_TYPE;
var REGION_NAME = ['Arctic', 'Central', 'East Canadian Water', 'Newfoundland', 'Maritimes', 'Pacific', 'Quebec', 'St. Lawrence Seaway', 'West Canadian Water'];
exports.REGION_NAME = REGION_NAME;
var REGION_COLOR = ['#CAB2D6', '#6A3D9A', '#33A02C', '#FB9A99', '#FDBF6F', '#E31A1C', '#1F78B4', '#A6CEE3', '#FF7F00'];
exports.REGION_COLOR = REGION_COLOR;

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
},{}],"scripts/onglet3.js":[function(require,module,exports) {
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

  var svg = div.select("#tab-3-heatmap").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(".concat(margin.left, ",").concat(margin.top, ")")); // Labels of row and columns

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
    drawLegend(margin.left / 2, margin.top + 5, graphSize.height - 10, 15, 'ffffff', myColor);
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
      offset: "".concat(100 * (i / nodes.length), "%"),
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
  var axis = d3.axisLeft().ticks(7).scale(scale);
  d3.select('.legend.axis').call(axis).attr('transform', 'translate(' + x + ',' + y + ')');
}
},{"./preprocess.js":"scripts/preprocess.js"}],"scripts/chord.js":[function(require,module,exports) {
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
    top: Math.max(bounds.width * 0.22, 400),
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
  .sortSubgroups(d3.descending)(matrix); // add the links between groups

  var links = svg.datum(res).append("g").attr("id", "links").selectAll("path").data(function (d) {
    return d;
  }).enter().append("path").attr("class", "chord").on('mouseenter', function (_ref, _) {
    var source = _ref.source,
        target = _ref.target;
    console.log("".concat(preproc.REGION_NAME[source.index], " --> ").concat(preproc.REGION_NAME[source.subindex], " : ").concat(source.value, " navires"));
  }).attr("d", d3.ribbon().radius(innerRadius)).style("fill", function (d) {
    return colors[d.source.index];
  }) // colors depend on the source group. Change to target otherwise.
  .style("stroke", "black").attr("opacity", 0.5); // Version sans ticks :
  // add the groups on the outer part of the circle

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
  /* 
  // Version avec ticks :
  // this group object use each group of the data.groups object
  var group = svg
  .datum(res)
  .append("g")
  .selectAll("g")
  .data(function(d) { return d.groups; })
  .enter()
   // add the group arcs on the outer part of the circle
  group.append("g")
    .append("path")
    .style("fill", function(_,i){ return colors[i] })
    .style("stroke", "black")
    .attr("d", d3.arc()
      .innerRadius(300)
      .outerRadius(310)
    )
   // Add the ticks
  group
  .selectAll(".group-tick")
  .data(function(d) { return groupTicks(d, 25); })    // Controls the number of ticks: one tick each 25 here.
  .enter()
  .append("g")
    .attr("transform", function(d) { return "rotate(" + (d.angle * 180 / Math.PI - 90) + ") translate(" + 305 + ",0)"; })
  .append("line")               // By default, x1 = y1 = y2 = 0, so no need to specify it.
    .attr("x2", 6)
    .attr("stroke", "black")
    const tick = 25000
  // Add the labels of a few ticks:
  group
  .selectAll(".group-tick-label")
  .data(function(d) { return groupTicks(d, tick); })
  .enter()
  .filter(function(d) { return d.value % tick === 0; })
  .append("g")
    .attr("transform", function(d) { return "rotate(" + (d.angle * 180 / Math.PI - 90) + ") translate(" + 305 + ",0)"; })
  .append("text")
    .attr("x", 8)
    .attr("dy", ".35em")
    .attr("transform", function(d) { return d.angle > Math.PI ? "rotate(180) translate(-16)" : null; })
    .style("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
    .text(function(d) { return d.value })
    .style("font-size", 9)
  
  // Returns an array of tick angles and values for a given group and step.
  function groupTicks(d, step) {
    var k = (d.endAngle - d.startAngle) / d.value;
    return d3.range(0, d.value, step).map(function(value) {
      return {value: value, angle: value * k + d.startAngle};
    });
  }
  */
}

function highlightGroup(event, links) {
  links.filter(function (d) {
    return d.source.index != event.index;
  }).attr("opacity", 0.1);
}

function unhighlightGroup(links) {
  links.attr("opacity", 0.5);
}

function showTooltip() {}

function unshowTooltip() {}
},{"./preprocess.js":"scripts/preprocess.js"}],"index.js":[function(require,module,exports) {
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
},{"./scripts/onglet1.js":"scripts/onglet1.js","./scripts/onglet2.js":"scripts/onglet2.js","./scripts/onglet3.js":"scripts/onglet3.js","./scripts/chord.js":"scripts/chord.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "56176" + '/');

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
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/INF8808-Projet.e31bb0bc.js.map