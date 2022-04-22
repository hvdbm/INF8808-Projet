import { vesselTypeClasses } from './vesselTypeClasses.js'

// Source : https://d3-graph-gallery.com/graph/stackedarea_template.html
export function build(div) {
  // set the dimensions and margins of the graph
  const bounds = d3.select('#stacked-area-chart').node().getBoundingClientRect()
  var margin = {top: 60, right: 230, bottom: 50, left: 70},
  width = bounds.width - margin.left - margin.right,
  height = 650 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = div.select("#stacked-area-chart")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

  d3.csv('./TRIP_STACK_HALF_MONTH.csv', function(d){
      return { 
        date : d3.timeParse("%Y-%m-%d")(d.date),
        Other : d.Other,
        Tugs : d.Tugs,
        Fishing : d.Fishing,
        Barges : d.Barges,
        Tanker : d.Tanker,
        PleasureCrafts: d.PleasureCrafts,
        Excursion : d.Excursion,
        Merchant : d.Merchant,
      }
  }).then( function(data) {
    const keys = data.columns.slice(1)  // List of Vessel Types = header of the csv files

    const color = d3.scaleOrdinal()
      .domain(vesselTypeClasses())
      .range(d3.schemeSet2);

    const stackedData = d3.stack()
      .keys(keys)
    (data)

    // Add X axis
    const x = d3.scaleTime()
    .domain(d3.extent(data, d => d.date))
    .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(10))

    // Add X axis label:
    svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height+40 )
      .text("Temps");

    // Add Y axis
    const y = d3.scaleLinear()
      .domain([0, 12000])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y).ticks(15))

    // Add Y axis label:
    svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", 0)
      .attr("y", -20 )
      .text("Nombre de navires")
      .attr("text-anchor", "start")

    // Area generator
    const areaChart = svg.append('g')
    const area = d3.area()
      .x(function(d) { return x(d.data.date); })
      .y0(function(d) { return y(d[0]); })
      .y1(function(d) { return y(d[1]); })

    // Show the areas
    areaChart
    .selectAll("mylayers")
    .data(stackedData)
    .enter()
    .append("path")
      .attr("class", function(d) { return "myArea " + d.key })
      .style("fill", function(d) { return color(d.key); })
      .attr("d", area)

    // What to do when one group is hovered
    const highlight = function(event, d) {
      d3.selectAll(".myArea").style("opacity", .1)  // reduce opacity of all groups
      d3.select("."+d).style("opacity", 1)  // expect the one that is hovered
    }

    // And when it is not hovered anymore
    const noHighlight = function(){
      d3.selectAll(".myArea").style("opacity", 1)
    }

    // LEGEND //
    const size = 20
    svg.selectAll("myrect")   // Add one dot in the legend for each name.
      .data(keys.sort())
      .enter()
      .append("rect")
        .attr("x", width)
        .attr("y", function(_,i){ return 10 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("width", size)
        .attr("height", size)
        .attr("rx", 4)
        .attr("ry", 4)
        .style("fill", function(d){ return color(d)})
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)

    svg.selectAll("mylabels")   // Add one dot in the legend for each name.
      .data(keys.sort())
      .enter()
      .append("text")
        .attr("x", width + size*1.2)
        .attr("y", function(_,i){ return 10 + i*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function(d){ return color(d)})
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)
    })
}
