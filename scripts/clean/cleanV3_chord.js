const fs = require('fs')
const csv = require('csv-parser');

let data = []
let map = new Map();

fs.createReadStream('TRIP_CHORD.csv')
  .pipe(csv())
  .on('data', (row) => {
    // clean(row)
    data.push(row)
  })
  .on('end', () => {
    console.log('data:', data.length)
    console.log('CSV file successfully processed');
    format()
    console.log('map:', map.size)
    console.log('format is done')
    fs.writeFile('Output.csv', writeClean(), (err) => {
      if (err) throw err;
    }) 
});

function clean(element) {
  if (element['Lenght'] != 0 && 
      element['Width'] != 0 & 
      element['Maximum Draugth'] < 30 &&
      element['Departure Date'] < ['Arrival Date']) {
    data.push({
      'Arrival Date': element['Arrival Date'],
      'Arrival Region': element['Arrival Region'],
      'Departure Date': element['Departure Date'].substring(0, 10),
      'Departure Region': element['Departure Region'],
    })
  }
}

function writeClean() {
  let csv2 = []

  const mapArray = Array.from(map.values())

  csv2.push(Object.keys(mapArray[0]).map((key) => {
    if (key.includes(',')) return `"${key}"`
    return key
  }).join(','))


  mapArray.forEach(element => {
    csv2.push(Object.values(element).map((value) => {
      if (value.toString().includes(',')) return `"${value}"`
      return value
    }).join(','));
  })

  return csv2.join('\n')
}

function format() {
  data.forEach((d) => {
    const key = d['Arrival Date']+d['Arrival Region']+d['Departure Date']+d['Departure Region']

    if (!map.has(key)) {
      map.set(key, {
      'Arrival Date': d['Arrival Date'],
      'Arrival Region': d['Arrival Region'],
      'Departure Date': d['Departure Date'],
      'Departure Region': d['Departure Region'],
      'count': 1
      })
    } else {
      const current = map.get(key)
      current.count += 1
      map.set(key, current)
    }
  })
}
