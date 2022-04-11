import * as onglet1 from './scripts/onglet1.js'
import * as onglet2 from './scripts/onglet2.js'
import * as onglet3 from './scripts/onglet3.js'
import * as chord from './scripts/chord.js'

(function (d3) {
    onglet1.build(d3.select('#tab-1-content'))
    // onglet2.build(d3.select('#tab-2-content'))
    // onglet3.build(d3.select('#tab-3-content'))

    // d3.csv('./TRIP_V1.csv', d3.autoType).then((data) => {   
    //     onglet1.build(d3.select('#tab-1-content'))
    // })

    // window.addEventListener('resize', () => {
    //    onglet1.rebuild(d3.select('#tab-1-content'))
    // })

    d3.csv('./TRIP_CHORD.csv').then(function(chordData) {
        chord.build(d3.select('#tab-3-content'), chordData)
    })

    onglet3.build(d3.select('#tab-3-content'))

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