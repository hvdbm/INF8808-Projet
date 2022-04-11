const fs = require('fs')
const csv = require('csv-parser');

let data = []
let map = new Map();

fs.createReadStream('TRIP_CLEAN.csv')
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

function findGlobalVesselType(vesselType) {
  if (['Barge Bulk Cargo', 'Barge Chemical','Barge Chips','Barge Derrick','Barge General','Barge Log','Barge Miscellaneous','Barge Oil Drilling Rig', 'Barge Oil/Petroleum', 'Barge Rail/Trailer','Barge Self-Propelled','Barge Towed',"Don't use",'Landing Craft','Logs Raft Section'].includes(vesselType)) {
    return 'Barges'
  } else if (['Excursion Passenger'].includes(vesselType)) {
    return 'Excursion'
  } else if (['Crab Boat', 'Dragger (Scallop, Clam, etc.)', 'Factory Ship', 'Fishery Patrol', 'Fishing Vessel', 'Gillnetter', 'Groundfish Boat (Open Boat)', 'Lobster Boat', 'Longliner', 'Other Fishing VSL (Open Boat)', 'Seiner', 'Shrimp Boat', 'Trawler', 'Troller'].includes(vesselType)) {
    return 'Fishing'
  } else if (['Cruise', 'Merchant (Dry)', 'Merchant Auto', 'Merchant Bulk', 'Merchant Cement', 'Merchant Coastal', 'Merchant Container', 'Merchant Ferry', 'Merchant General', 'Merchant Lash', 'Merchant Livestock', 'Merchant Ore', 'Merchant Passenger', 'Merchant Rail/Trailer Ferry', 'Merchant Reefer', 'Merchant RO/RO'].includes(vesselType)) {
    return 'Merchant'
  } else if (['Yacht - Pleasure Crafts', 'Yacht Power', 'Yacht Sails'].includes(vesselType)) {
    return 'Pleasure Crafts'
  } else if(['Merchant (Tanker)', 'Merchant Chemical', 'Merchant Chemical/Oil Products Tanker','Merchant Crude','Merchant Gasoline','Merchant Liquified Gas','Merchant Molasses','Merchant Ore/Bulk/Oil','Merchant Super Tanker','Merchant ULCC','Merchant VLCC','Merchant Water'].includes(vesselType)) {
    return 'Tanker'
  } else if (['Tug', 'Tug Fire', 'Tug Harbour', 'Tug Ocean', 'Tug Supply', 'Tugs Workboat'].includes(vesselType)) {
    return 'Tugs'
  } else {
    return 'Other'
  }
}

function clean(element) {
  if (element['Lenght'] != 0 && 
      element['Width'] != 0 & 
      element['Maximum Draugth'] < 30 &&
      element['Departure Date'] < ['Arrival Date']) {
    data.push({
      'Arrival Date': element['Arrival Date'].substring(0,10),
      'Arrival Region': element['Arrival Region'],
      'Departure Date': element['Departure Date'].substring(0, 10),
      'Departure Region': element['Departure Region'],
      'Global Vessel Type': findGlobalVesselType(element['Vessel Type']),
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
    const key = d['Arrival Date']+d['Arrival Region']+d['Departure Date']+d['Departure Region']+d['Global Vessel Type']

    if (!map.has(key)) {
      map.set(key, {
      'Arrival Date': d['Arrival Date'],
      'Arrival Region': d['Arrival Region'],
      'Departure Date': d['Departure Date'],
      'Departure Region': d['Departure Region'],
      'Global Vessel Type': d['Global Vessel Type'],
      'count': 1
      })
    } else {
      const current = map.get(key)
      current.count += 1
      map.set(key, current)
    }
  })
}
