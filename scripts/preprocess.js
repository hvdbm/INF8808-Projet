export const GLOBAL_VESSEL_TYPE = ['Barges', 'Excursion', 'Fishing', 'Merchant', 'Other', 'Pleasure Crafts', 'Tanker', 'Tugs']
export const REGION_NAME = ['Arctic', 'Central', 'East Canadian Water', 'Newfoundland', 'Maritimes', 'Pacific', 'Quebec', 'St. Lawrence Seaway', 'West Canadian Water']
export const REGION_COLOR = ['#CAB2D6', '#6A3D9A', '#33A02C', '#FB9A99', '#FDBF6F', '#E31A1C', '#1F78B4', '#A6CEE3', '#FF7F00']

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

export function clean(data) {
  const cleanData = []
  data.forEach(element => {
    if (element['Lenght'] != 0 && 
        element['Width'] != 0 & 
        element['Maximum Draugth'] < 30 &&
        element['Departure Date'] < ['Arrival Date']) {
      cleanData.push({
        'Arrival Date': element['Arrival Date'].substring(0,10),
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
      })
    }
  })

  return cleanData
}

export function chordMatrix(data, departureDate, arrivalDate) {
  const matrix = new Array(REGION_NAME.length)
  for (let index = 0; index < matrix.length; index++) {
    matrix[index] = new Array(REGION_NAME.length)
  }
  
  REGION_NAME.forEach((departureRegion, i) => {
    REGION_NAME.forEach((arrivalRegion, j) => {
      matrix[i][j] = data
        .filter((d) => {
          return departureRegion === d['Departure Region'].slice(0,-7)
            && arrivalRegion === d['Arrival Region'].slice(0,-7)
            && departureDate <= d['Departure Date']
            && arrivalDate >= d['Arrival Date']
        })
        .map((value) => value.count)
        .reduce((partialSum, v) => Number(partialSum) + Number(v), 0)
    })
  })

  return matrix
}