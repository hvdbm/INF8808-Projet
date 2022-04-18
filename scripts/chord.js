import * as preproc from './preprocess.js'

// https://d3-graph-gallery.com/chord.html
// https://observablehq.com/@d3/directed-chord-diagram
// https://jyu-theartofml.github.io/posts/circos_plot
// http://strongriley.github.io/d3/ex/chord.html
export function build(div, data, startDate, endDate) {
  // TODO : Comment trouver la taille d'une div encore non chargée ?

  let chordWidth = window.innerWidth / 2 // screen.width/2;

  var margin = {
    top: chordWidth*0.17,
    right: chordWidth*0.05, 
    bottom: chordWidth*0.07,
    left: chordWidth*0.20 }, // TODO : Revoir valeur
  width = chordWidth - margin.left - margin.right,
  height = chordWidth - margin.top - margin.bottom;

  //const innerRadius = chordWidth / 4 // TODO : Revoir valeur
  //const outerRadius = innerRadius + 10
  const outerRadius = width/3.5;
  const innerRadius = outerRadius-10
  // create the svg area
  const svg = div.select('#tab-3-chord-diagram')
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + (margin.left+outerRadius) + "," + (margin.top+outerRadius) + ")");

  // create input data: a square matrix that provides flow between entities
  const matrix = preproc.chordMatrix(data, startDate, endDate)
  
  const colors = preproc.REGION_COLOR
  
  const tooltip = d3.select('#tooltip-chord-container')

  // give this matrix to d3.chord(): it will calculates all the info we need to draw arc and ribbon
  const res = d3.chord()
    .padAngle(0.05)     // padding between entities (black arc)
    .sortSubgroups(d3.descending)
    (matrix)

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
      tooltip.select('span#tooltip-chord-region-from-text')
      .text(preproc.REGION_NAME[source.index])
      .style('color', colors[source.index])
      tooltip.select('span#tooltip-chord-region-to-text')
      .text(preproc.REGION_NAME[source.subindex])
      .style('color', colors[source.subindex])
      tooltip.select('span#tooltip-chord-value')
      .text(source.value)
      return tooltip.style("visibility", "visible")
    })
    .on('mousemove', function() {
      tooltip.style('left', d3.event.pageX - 246)
      tooltip.style('top', d3.event.pageY + 5)
    })
    .on('mouseleave', function() { return tooltip.style("visibility", "hidden") })
    .attr("d", d3.ribbon().radius(innerRadius))
    .style("fill", function(d){ return(colors[d.source.index]) }) // colors depend on the source group
    .style("stroke", "black")
    .attr("opacity", 0.5)

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
    .attr("dy", ".25em")
    .attr("transform", function(d) { return d.startAngle > Math.PI ? "rotate(180) translate(-16)" : null; })
    .style("text-anchor", function(d) { return d.startAngle > Math.PI ? "end" : null; })
    .style("fill", function(_, i){ return(colors[i]) })
    .style("font-weight", "bold")
    .style("font-size", 12)
    .text(function(d) { return preproc.REGION_NAME[d.index] })
}

function highlightGroup(event, links) {
  links
    .filter(function(d) { return d.source.index != event.index })
    .attr("opacity", 0.1)
}

function unhighlightGroup(links) {
  links.attr("opacity", 0.5)
}

export function rebuild(div, data, startDate, endDate) {
  div.select('#tab-3-chord-diagram')
    .select('svg')
    .remove()

  build(div, data, startDate, endDate)
}