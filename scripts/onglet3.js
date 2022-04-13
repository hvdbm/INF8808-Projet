import * as preproc from './preprocess.js'

export function build(div) {
  buildHeatmap(div)
}

// https://d3-graph-gallery.com/heatmap.html
function buildHeatmap(div) {
  // TODO : adapt to div size

  // set the dimensions and margins of the graph
  const margin = {top: 10, right: 5, bottom: 90, left: 115},
    width = 450 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  const svg = div.select("#tab-3-heatmap")
  .append("svg")
    .attr("width", width + margin.left + margin.right + 50)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)

  // Labels of row and columns
  const myGroups = preproc.GLOBAL_VESSEL_TYPE
  const myVars = preproc.REGION_NAME

  // Build X scales and axis:
  const x = d3.scaleBand()
    .range([ 0, width ])
    .domain(myGroups)
    .padding(0.01)

  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x))
    .selectAll('text')
    .attr('transform', 'translate(-20,20)rotate(-45)')

  // Build Y scales and axis:
  const y = d3.scaleBand()
    .range([ height, 0 ])
    .domain(myVars)
    .padding(0.01)
  svg.append("g")
    .call(d3.axisLeft(y))

  // Build color scale
  const myColor = d3.scaleLinear()
    .range(["white", "#ff0000"])
    .domain([0,15]) //maximum hardocodé sur la valeur max


  function transformData(d, departureDate, arrivalDate) {
    let map = heatmapMap()

    const data = d.filter((line) => {
      return departureDate <= line['Departure Date'] && arrivalDate >= line['Arrival Date']
    })

    data.forEach(line => {
      // if (departureDate <= d['Departure Date'] && arrivalDate >= d['Arrival Date']) return;

      const keyStart = line['Departure Region']+line['Global Vessel Type'];
      const keyStop = line['Arrival Region']+line['Global Vessel Type'];
      if (!map.has(keyStart)) {
        map.set(keyStart, {
          'Region': line['Departure Region'].slice(0,-7),
          'Type': line['Global Vessel Type'],
          'count': 1
          });
      } else {
        const current = map.get(keyStart);
        current.count += 1;
        map.set(keyStart, current);
      }
      if (!map.has(keyStop)) {
        map.set(keyStop, {
          'Region': line['Arrival Region'].slice(0,-7),
          'Type': line['Global Vessel Type'],
          'count': 1
          });
      } else {
        const current = map.get(keyStop);
        current.count += 1;
        map.set(keyStop, current);
      }
    })

    const p = [];
    let max = 0
    Array.from(map.values()).forEach((value) => {
      p.push({
        'Region': value.Region,
        'Type': value.Type,
        'count' : (value.count / (2*data.length)) * 100
      })
      if ((value.count / (2*data.length)) * 100 >= max) {
        max = (value.count / (2*data.length)) * 100
      }
    })
    myColor.domain([0,max])

    return p
  }

  //Read the data
  d3.csv("./TRIP_HEATMAP.csv").then( function(data) {
    // add the squares and interaction
    const transformedData = transformData(data, "2010-01-01", "2023-01-01")
    svg.selectAll()
    .data(transformedData, function(d) {
      return d.Type+':'+d.Region;
    })
    .enter()
    .append("g")
    .attr("class", "square")
    .on('mouseenter', function() { rectSelect(this, x, y) })
    .on('mouseleave', function() { rectUnselect(this) })
    .append("rect")
      .attr("x", function(d) { return x(d.Type) })
      .attr("y", function(d) { return y(d.Region) })
      .attr("width", x.bandwidth() )
      .attr("height", y.bandwidth() )
      .style("fill", function(d) { return myColor(d.count) })
    
      initLegend(svg,myColor)
      drawLegend(width + margin.right + 10, 0, height, 15, 'url(#gradient)', myColor)
  })
}

function heatmapMap() {
  let map = new Map();

  preproc.REGION_NAME.forEach((region) => {
    preproc.GLOBAL_VESSEL_TYPE.forEach((type) => {
      const key = region + type
      map.set(key, {
        'Region': region,
        'Type': type,
        'count': 0
      })
    })
  })
  return map
}

function rectSelect(element, x, y) {
  d3.select(element)
    .append("text")
    .attr('x', function(d) { return x(d.Type) + x.bandwidth() / 2; })
    .attr('y', function(d) { return y(d.Region) + y.bandwidth() / 2; })
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .text(function(d) {
      return d.count.toFixed(2) + '%'
    })
}

function rectUnselect(element) {
  d3.select(element)
    .select('text')
    .remove()
}

function initLegend(svg, colorScale) {
  const defs = svg.append('defs')
  svg.append('rect').attr('class', 'legend bar')
  svg.append('g').attr('class', 'legend axis')

  const linearGradient = defs
  .append('linearGradient')
  .attr('id', 'gradient')
  .attr('x1', 0).attr('y1', 1).attr('x2', 0).attr('y2', 0)

  linearGradient.selectAll('stop')
  .data(colorScale.ticks().map((tick, i, nodes) => (
    {
      offset: `${ (100*i / nodes.length)}%`,
      color: colorScale(tick)
    })))
  .join('stop')
  .attr('offset', d => d.offset)
  .attr('stop-color', d => d.color)
}

function drawLegend(x, y, height, width, fill, colorScale) {
  d3.select('.legend.bar')
    .attr('fill', fill)
    .attr('x', x)
    .attr('y', y)
    .attr('height', height)
    .attr('width', width)
    
  const scale = d3.scaleLinear()
  .domain(colorScale.domain())
  .range([height, 0])

  let axis = d3.axisRight()
  .ticks(7)
  .scale(scale);

  d3.select('.legend.axis')
  .call(axis)
  .attr('transform', 'translate('+ (x+15) + ',' + y + ')')
}
