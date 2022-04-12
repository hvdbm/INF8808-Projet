import * as preproc from './preprocess.js'
import d3Tip from 'd3-tip'
// https://d3-graph-gallery.com/chord.html
// https://observablehq.com/@d3/directed-chord-diagram
// https://jyu-theartofml.github.io/posts/circos_plot
// http://strongriley.github.io/d3/ex/chord.html
export function build(div, data) {
  // TODO : Comment trouver la taille d'une div encore non chargée ?
  const bounds = d3.select('#stacked-area-chart').node().getBoundingClientRect()

  var margin = {top: bounds.width*0.22, right: bounds.width*0.25, bottom: bounds.width*0.25, left: bounds.width*0.25}, // TODO : Revoir valeur
  width = bounds.width - margin.left - margin.right,
  height = bounds.width - margin.top - margin.bottom;

  const innerRadius = bounds.width / 6.5 // TODO : Revoir valeur
  const outerRadius = innerRadius + 10

  // create the svg area
  const svg = div.select('#tab-3-chord-diagram')
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // create input data: a square matrix that provides flow between entities
  const matrix = preproc.chordMatrix(data, "2010-01-01", "2023-01-01")
  
  const colors = preproc.REGION_COLOR

  // give this matrix to d3.chord(): it will calculates all the info we need to draw arc and ribbon
  const res = d3.chord()
    .padAngle(0.05)     // padding between entities (black arc)
    .sortSubgroups(d3.descending)
    (matrix)
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
  const links = svg
  .datum(res)
  .append("g")
  .attr("id", "links")
  .selectAll("path")
  .data(function(d) { return d; })
  .enter()
  .append("path")
    .attr("class", "chord")
    .on('mouseenter', function({source, target}, _) {
      const tooltip = d3.select(`#${preproc.REGION_NAME_ALT[source.index]}${preproc.REGION_NAME_ALT[source.subindex]}`)
      return tooltip.style("visibility", "visible");
    })
    .on('mouseleave', function({source, target}, _) {
      const tooltip = d3.select(`#${preproc.REGION_NAME_ALT[source.index]}${preproc.REGION_NAME_ALT[source.subindex]}`)
      return tooltip.style("visibility", "hidden");
    })
    .attr("d", d3.ribbon()
      .radius(innerRadius)
    )
    .style("fill", function(d){ return(colors[d.source.index]) }) // colors depend on the source group. Change to target otherwise.
    .style("stroke", "black")
    .attr("opacity", 0.5)

  const tooltips = svg
    .datum(res)
    .append("g")
    .attr("id","tooltip")
    .selectAll("path")
    .data(function(d) { return d; })
    .enter()
    .append("text")
      .attr("id",function(d) {
        return (`${preproc.REGION_NAME_ALT[d.source.index]}${preproc.REGION_NAME_ALT[d.source.subindex]}`);})
      .attr("class", "tooltip")
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .text(function(d) {
        return `${preproc.REGION_NAME[d.source.index]} --> ${preproc.REGION_NAME[d.source.subindex]} : ${d.source.value} navires`
      })
      .style("visibility", "hidden")



  // Version sans ticks :
  // add the groups on the outer part of the circle
  svg.datum(res)
    .append("g")
    .attr("id", "groups")
    .selectAll("g")
    .data(function(d) { return d.groups; })
    .enter()
    .append("g")
    .attr("class", "group")
    .append("path")
      .style("fill", function(_,i){ return colors[i] })
      .style("stroke", "black")
      .attr("d", d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
      )
      .on("mouseover", function(event, _) {
        console.log(`Région ${preproc.REGION_NAME[event.index]} (${event.value} navires)`)
        highlightGroup(event, links)
      })
      .on("mouseleave", function() {
        unhighlightGroup(links)
      })

  // add the label of groups
  svg.datum(res)
    .append("g")
    .attr("id", "labels")
    .selectAll("text")
    .data(function(d) { return d.groups; })
    .enter()
    .append("g")
    .attr("transform", function(d) { return "rotate(" + (d.startAngle * 180 / Math.PI - 90) + ") translate(" + outerRadius + ",0)"; })  // TODO : Revoir valeur
    .append("text")
    .attr("x", 8)
    .attr("dy", ".35em")
    .attr("transform", function(d) { return d.startAngle > Math.PI ? "rotate(180) translate(-16)" : null; })
    .style("text-anchor", function(d) { return d.startAngle > Math.PI ? "end" : null; })
    .style("fill", function(_, i){ return(colors[i]) })
    .style("font-weight", "bold")
    .text(function(d) { return preproc.REGION_NAME[d.index] })

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
  links
    .filter(function(d) {
      // TODO : Seulement source ? ou source et target ?
      return d.source.index != event.index // && d.target.index != event.index
    })
    .attr("opacity", 0.1)
}

function unhighlightGroup(links) {
  links.attr("opacity", 0.5)
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