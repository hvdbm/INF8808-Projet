import * as onglet1 from './scripts/onglet1.js'
import * as onglet2 from './scripts/onglet2.js'
import * as onglet3 from './scripts/onglet3.js'
import * as chord from './scripts/chord.js'

(function (d3) {
    onglet1.build(d3.select('#tab-1-content'))

    d3.csv('./TRIP_CHORD.csv').then(function(chordData) {
        chord.build(d3.select('#tab-3-content'), chordData)
    })

    onglet3.build(d3.select('#tab-3-content'))

    // d3.select('#tab-3-content #date-control-refresh').on('click', function() {
    //     console.log('cc')
    //     const start = d3.select('#date-start-control').property('value')
    //     const end = d3.select('#date-end-control').property('value')

    //     console.log(start, end)
    // })

    // TODO : Resize automatique ?

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