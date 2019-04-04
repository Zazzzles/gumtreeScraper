require("isomorphic-fetch")
const io = require("console-read-write")
const Parser = require("node-html-parser")
const { parse } = Parser
main()
async function main() {
  io.write("What type of car are you looking for? (bmw|audi)")
  const carType = await io.read()
  let choseType = carType === 'bmw' || carType === 'audi';
  while (!choseType) {
    io.write('Please choose either bmw or audi');
    const carType = await io.read()
    choseType = carType === 'bmw' || carType === 'audi';
  }
  io.write("Max price?")
  const maxPrice = await io.read()
  let chosePrice = maxPrice !== ""
  while (!chosePrice) {
    io.write('Please select a max price');
    const maxPrice = await io.read()
    chosePrice = maxPrice !== ""
  }
  io.write("Transmission type? (automatic|manual)")
  const transmissionType = await io.read()
  let choseTransmissionType = transmissionType === 'automatic' || carType === 'manual';
  while (!choseTransmissionType) {
    io.write('Please choose either automatic or manual');
    const transmissionType = await io.read()
    choseTransmissionType = transmissionType === 'automatic' || carType === 'manual';
  }
  io.write("Max kms on clock?")
  const maxKms = await io.read()
  let choseKms = maxKms !== ""
  while (!choseKms) {
    io.write('Please select max kms');
    const maxKms = await io.read()
    choseKms = maxKms !== ""
  }
  requestParse(carType, maxPrice, transmissionType, maxKms)
}
function requestParse(carType, maxPrice, transmissionType, maxKms) {
  const TARGET_URL = `https://www.gumtree.co.za/s-cars-bakkies/western-cape/${carType}~petrol~${transmissionType}/v1c9077l3100001a3mafutrp1?pr=,${maxPrice}&km=,${maxKms}&st=delr`
  console.log("Finding ads... ")
  fetch(TARGET_URL)
    .then(res => {
      res.text().then(text => {
        parsePageData(text)
      })
    })
    .catch(err => {
      console.log("Error retreiving ads")
      console.log(err)
    })
  parsePageData = rawHtml => {
    const parsedResponse = parse(rawHtml)
    const wrapper = parsedResponse
      .querySelector(".results.list-view")
      .querySelector(".view")
    if(wrapper){
        wrapper.childNodes.forEach(node => {
            const sanitizedResults = node.childNodes.filter(
              item => item.structuredText
            )
            if (sanitizedResults.length) {
              sanitizedResults.forEach((childNode, index) => {
                const split = childNode.structuredText.split("\n")
                if (split.length > 3) {
                  console.table({
                    index: `(${index + 1} / ${sanitizedResults.length} )`,
                    title: split[1],
                    //description: split[2],
                    price: split[3]
                  })
                }
              })
            }
          })
    }else{
        console.log("No ads found")
    }
  }
}
