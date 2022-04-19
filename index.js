import * as onglet1 from './scripts/onglet1.js'
import * as onglet3 from './scripts/onglet3.js'
import * as chord from './scripts/chord.js'

let chordData

(function (d3) {
    d3.csv('./TRIP_STACK_HALF_MONTH.csv').then (function(stackData) {
        onglet1.build(d3.select('#tab-1-content'), stackData)
    
        d3.csv('./TRIP_CHORD.csv').then(function(data) {
            chordData = data
            chord.build(d3.select('#tab-3-content'), data, "2010-01-01", "2023-01-01")
    
            time_graph(stackData)
        })
    
        onglet3.buildHeatmap(d3.select('#tab-3-content'), "2010-01-01", "2023-01-01")
    })

})(d3)

$('.tab-button').click(function () {
    if (!$(this).hasClass('tab-button-active')) {
        const tab = $(this).data('tab')
    
        $('button.tab-button').removeClass('tab-button-active')
        $(this).addClass('tab-button-active')
    
        $('.tab-content').removeClass('visible-tab')
        $(`.tab-content#tab-${tab}-content`).addClass('visible-tab')
    }
})

function time_graph(stackData) {
    const data = stackData.map(d => {
        return { 
            date: d3.timeParse("%Y-%m-%d")(d.date),
            traffic: +d.Merchant
            + +d.Barges
            + +d.Other
            + +d.Tugs
            + +d.Tanker
            + +d.Fishing
            + +d.PleasureCrafts
            + +d.Excursion
        }
    })
    const ndx = crossfilter(data)

    const vesselTraffic = ndx.dimension(d => d3.timeMonth(d.date))
    const vesselTraffics = vesselTraffic.group().reduceSum(d => d.traffic)
    
    const minDate = vesselTraffic.bottom(1)[0].date
    const maxDate = vesselTraffic.top(1)[0].date

    const timeScale = d3.scaleTime()
    .domain([minDate, maxDate])
    .rangeRound([0, 950])

    const vesselTrafficChart = new dc.BarChart('#tab-3-content .traffic-chart')
    .width(950)
    .height(125)
    .margins({top: 10, right: 50, bottom: 30, left: 30})
    .dimension(vesselTraffic)
    .group(vesselTraffics)
    .round(d3.timeMonth)
    .x(timeScale)
    .brushOn(true)
    .elasticY(true)

    vesselTrafficChart.yAxis().ticks(5)

    vesselTrafficChart.render()

    vesselTrafficChart.on('preRedraw', () => {
        const selection = d3.select('#tab-3-content .traffic-chart g.brush rect.selection')
        const x = selection.attr('x')
        const width = selection.attr('width')
        let startString
        let endString
        if (x == null || width == null) {
            startString = minDate.toISOString().split('T')[0]
            endString = maxDate.toISOString().split('T')[0]
        } else {
            const start = timeScale.invert(x)
            const end = timeScale.invert(x + width)
            startString = start.toISOString().split('T')[0]
            endString = end.toISOString().split('T')[0]
        }
        chord.rebuild(d3.select('#tab-3-content'), chordData, startString, endString)
        onglet3.rebuild(d3.select('#tab-3-content'), startString, endString)
    })
}