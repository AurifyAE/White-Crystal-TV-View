// import { readSpreadValues } from '../core/spotrateDB.js';
import {
  getFirestore,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";
import { app } from "../../../config/db.js";
import { USER_ID } from "../../../global/global.js";

const script = document.createElement("script");
script.src =
  "https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.2.0/socket.io.js";
document.head.appendChild(script);

const socket = io("https://capital-server-9ebj.onrender.com/", {
  query: { secret: "aurify@123" }, // Pass secret key as query parameter
});

const firestore = getFirestore(app);
socket.on("connect", () => {
  console.log("Connected to WebSocket server");
  requestMarketData(["GOLD", "SILVER"]);
});

// Request market data based on symbols
function requestMarketData(symbols) {
  socket.emit("request-data", symbols);
}
setInterval(fetchData1, 500);

setInterval(() => {
  fetchData();
}, 1200);

showTable();

let askSpread,
  bidSpread,
  silverBidSpread,
  silverAskSpread,
  goldBuy,
  goldAskingPrice,
  goldBiddingPrice,
  goldSell,
  silverBuy,
  silverSell,
  silverValue,
  goldHigh,
  goldLow,
  silverLow,
  silverHigh,
  silverAskingPrice,
  silverBiddingPrice;

let goldData = {};
let silverData = {};

async function fetchData() {
  socket.on("market-data", (data) => {
    // console.log('Received gold value:', data);

    if (data && data.symbol) {
      if (data.symbol === "Gold") {
        goldData = data;
        // updateGoldUI();
      } else if (data.symbol === "Silver") {
        silverData = data;
      }
    } else {
      console.warn("Received malformed market data:", data);
    }

    const value = goldData.bid;
    goldHigh = goldData.high;
    goldLow = goldData.low;
    goldBuy = (value + bidSpread).toFixed(2);
    goldSell = (value + bidSpread + askSpread + parseFloat(0.5)).toFixed(2);

    const value2 = silverData.bid;
    silverHigh = silverData.high;
    silverLow = silverData.low;
    silverBuy = (value2 + silverBidSpread).toFixed(2);
    silverSell = (
      value2 +
      silverBidSpread +
      silverAskSpread +
      parseFloat(0.5)
    ).toFixed(2);
  });

  var goldBuyUSD = (goldBuy / 31.103).toFixed(4);
  goldBiddingPrice = (goldBuyUSD * 3.674).toFixed(4);

  var goldSellUSD = (goldSell / 31.103).toFixed(4);
  goldAskingPrice = (goldSellUSD * 3.674).toFixed(4);

  // var silverBuyUSD = (silverBuy / 31.103).toFixed(4);
  // silverBiddingPrice = (silverBuyUSD * 3.674).toFixed(4);

  // var silverSellUSD = (silverSell / 31.103).toFixed(4);
  // silverAskingPrice = (silverSellUSD * 3.674).toFixed(4);
}

// Function to Fetch Gold API Data
async function fetchData1() {
  try {
    var currentGoldBuy = goldBuy ? goldBuy : '0';
    var currentGoldSell = goldSell ? goldSell : '0';
    var currentSilverBuy = silverBuy ? silverBuy : '0';
    var currentSilverSell = silverSell ? silverSell : '0';

    function updatePrice() {
      var newGoldBuy = goldBuy ? goldBuy : '0';
      var newGoldSell = goldSell ? goldSell : '0';
      var newSilverBuy = silverBuy ? silverBuy : '0';
      var newSilverSell = silverSell ? silverSell : '0';

      var element1 = document.getElementById("goldInputLow");
      var element2 = document.getElementById("goldInputHigh");
      var element3 = document.getElementById("silverInputLow");
      var element4 = document.getElementById("silverInputHigh");

      element1.innerHTML = newGoldBuy;
      element2.innerHTML = newGoldSell;
      element3.innerHTML = newSilverBuy;
      element4.innerHTML = newSilverSell;

      // Determine color for each element
      var color1;
      var fontColor1;
      if (newGoldBuy > currentGoldBuy) {
        color1 = "green";
        fontColor1 = "white";
      } else if (newGoldBuy < currentGoldBuy) {
        color1 = "red";
        fontColor1 = "white";
      } else {
        color1 = "#323e4e"; // Set to white if no change
        fontColor1 = "white";
      }

      var color2;
      var fontColor2;
      if (newGoldSell > currentGoldSell) {
        color2 = "green";
        fontColor2 = "white";
      } else if (newGoldSell < currentGoldSell) {
        color2 = "red";
        fontColor2 = "white";
      } else {
        color2 = "#323e4e"; // Set to white if no change
        fontColor2 = "white";
      }

      var color3;
      var fontColor3;
      if (newSilverBuy > currentSilverBuy) {
        color3 = "green";
        fontColor3 = "white";
      } else if (newSilverBuy < currentSilverBuy) {
        color3 = "red";
        fontColor3 = "white";
      } else {
        color3 = "#323e4e"; // Set to white if no change
        fontColor3 = "white";
      }

      var color4;
      var fontColor4;
      if (newSilverSell > currentSilverSell) {
        color4 = "green";
        fontColor4 = "white";
      } else if (newSilverSell < currentSilverSell) {
        color4 = "red";
        fontColor4 = "white";
      } else {
        color4 = "#323e4e"; // Set to white if no change
        fontColor4 = "white";
      }

      element1.style.backgroundColor = color1;
      element2.style.backgroundColor = color2;
      element3.style.backgroundColor = color3;
      element4.style.backgroundColor = color4;

      element1.style.color = fontColor1;
      element2.style.color = fontColor2;
      element3.style.color = fontColor3;
      element4.style.color = fontColor4;

      currentGoldBuy = newGoldBuy ? newGoldBuy : '0';
      currentGoldSell = newGoldSell ? newGoldSell : '0';
      currentSilverBuy = newSilverBuy ? newSilverBuy : '0';
      currentSilverSell = newSilverSell ? newSilverSell : '0';

      setTimeout(updatePrice, 300);
    }

    updatePrice();

    document.getElementById("lowLabelGold").innerHTML = goldLow ? goldLow : '0';
    document.getElementById("highLabelGold").innerHTML = goldHigh ? goldHigh : '0';
    document.getElementById("lowLabelSilver").innerHTML = silverLow ? silverLow : '0';
    document.getElementById("highLabelSilver").innerHTML = silverHigh ? silverHigh : '0';

    var element;

    // LowLabelGold
    element = document.getElementById("lowLabelGold");
    element.style.backgroundColor = "red";

    // HighLabelGold
    element = document.getElementById("highLabelGold");
    element.style.backgroundColor = "green";

    // LowLabelSilver
    element = document.getElementById("lowLabelSilver");
    element.style.backgroundColor = "red";

    // HighLabelSilver
    element = document.getElementById("highLabelSilver");
    element.style.backgroundColor = "green";
  } catch (error) {
    console.error("Error fetching gold and silver values:", error);
  }
}

async function readSpreadValues() {
  try {
    const uid = USER_ID;
    if (!uid) {
      console.error("User not authenticated");
      throw new Error("User not authenticated");
    }

    const spreadCollection = collection(firestore, `users/${uid}/spread`);
    const querySnapshot = await getDocs(spreadCollection);

    const spreadDataArray = [];
    querySnapshot.forEach((doc) => {
      const spreadData = doc.data();
      const spreadDocId = doc.id;
      spreadDataArray.push({ id: spreadDocId, data: spreadData });
    });

    // console.log(spreadDataArray);

    return spreadDataArray;
  } catch (error) {
    console.error("Error reading data from Firestore: ", error);
    throw error;
  }
}

async function displaySpreadValues() {
  try {
    const spreadDataArray = await readSpreadValues();

    spreadDataArray.forEach((spreadData) => {
      askSpread = spreadData ? spreadData.data.editedAskSpreadValue : 0;
      bidSpread = spreadData ? spreadData.data.editedBidSpreadValue : 0;
      silverAskSpread = spreadData ? spreadData.data.editedAskSilverSpreadValue : 0;
      silverBidSpread = spreadData ? spreadData.data.editedBidSilverSpreadValue : 0;
    });
  } catch (error) {
    console.error("Error reading spread values: ", error);
    throw error;
  }
}

// Function to read data from the Firestore collection
async function readData() {
  // Get the UID of the authenticated user
  const uid = USER_ID;

  if (!uid) {
    console.error("User not authenticated");
    return Promise.reject("User not authenticated");
  }

  const querySnapshot = await getDocs(
    collection(firestore, `users/${uid}/commodities`)
  );
  const result = [];
  querySnapshot.forEach((doc) => {
    result.push({
      id: doc.id,
      data: doc.data(),
    });
  });
  return result;
}


async function showTable() {
  try {
    const tableData = await readData();

    // Loop through the tableData
    for (const data of tableData) {
      // Assign values from data to variables
      const metalInput = data.data.metal;
      const purityInput = data.data.purity;
      const unitInput = data.data.unit;
      const weightInput = data.data.weight;
      const sellAEDInput = data.data.sellAED;
      const buyAEDInput = data.data.buyAED;
      const sellPremiumInputAED = data.data.sellPremiumAED;
      const buyPremiumInputAED = data.data.buyPremiumAED;

      let metal;
      let purity;
      if (weightInput === "KG") {
        metal = "GOLD";
        purity = purityInput;
      } else if (weightInput === "TTB") {
        metal = "GOLD";
        purity = "TEN TOLA";
      } else if (weightInput === "GM") {
        metal = "22";
        purity = "KT";
      } else {
        metal = metalInput;
        purity = purityInput;
      }
     
      displaySpreadValues();

      setInterval(async () => {
        let weight = weightInput;
        let unitMultiplier = 1;

        // Adjust unit multiplier based on the selected unit
        if (weight === "GM") {
          unitMultiplier = 1;
        } else if (weight === "KG") {
          unitMultiplier = 1000;
        } else if (weight === "TTB") {
          unitMultiplier = 116.64;
        } else if (weight === "TOLA") {
          unitMultiplier = 11.664;
        } else if (weight === "OZ") {
          unitMultiplier = 31.1034768;
        }

        let sellPremium = sellPremiumInputAED || 0;
        let buyPremium = buyPremiumInputAED || 0;
        let askSpreadValue = askSpread || 0;
        let bidSpreadValue = bidSpread || 0;

        if (purityInput === '999') {
          // Update the sellAED and buyAED values for the current
          const AskValue = parseFloat(
            (
              goldAskingPrice *
              unitInput *
              unitMultiplier *
              (purityInput / Math.pow(10, purityInput.length)) +
              parseFloat(sellPremium)
            ).toFixed(2)
          );
          document.getElementById('goldRate1').textContent = AskValue ? AskValue : '0'
        } 

        if (metal = 'GOLD TEN TOLA') {
          // Update the sellAED and buyAED values for the current
          const AskValue = parseFloat(
            (
              goldAskingPrice *
              unitInput *
              unitMultiplier *
              (purityInput / Math.pow(10, purityInput.length)) +
              parseFloat(sellPremium)
            ).toFixed(2)
          );
          document.getElementById('goldRate2').textContent = AskValue ? AskValue : '0'
        } 

        if (purityInput === '916') {
          // Update the sellAED and buyAED values for the current
          const AskValue = parseFloat(
            (
              goldAskingPrice *
              unitInput *
              unitMultiplier *
              (purityInput / Math.pow(10, purityInput.length)) +
              parseFloat(sellPremium)
            ).toFixed(2)
          );
          document.getElementById('goldRate3').textContent = AskValue ? AskValue : '0'
        } 
      }, 500);
    }
  } catch (error) {
    console.error("Error reading data:", error);
  }
}


// async function showTable() {
//   try {
//     const tableData = await readData();

//     console.log(goldAskingPrice);
    

//     // Function to calculate and display the gold rates
//     function displayGoldRate(elementId) {
//       const metalInput = tableData.data.metal;
//       const purityInput = tableData.data.purity;
//       const unitInput = tableData.data.unit;
//       const weightInput = tableData.data.weight;
//       const sellPremiumInputAED = tableData.data.sellPremiumAED;
//       const buyPremiumInputAED = tableData.data.buyPremiumAED;

//       let metal;
//       let purity;
//       let unitMultiplier = 1;

//       if (weightInput === "KG") {
//         metal = "GOLD";
//         purity = purityInput;
//         unitMultiplier = 1000;
//       } else if (weightInput === "TTB") {
//         metal = "GOLD";
//         purity = "TEN TOLA";
//         unitMultiplier = 116.64;
//       } else if (weightInput === "GM") {
//         metal = "22 KT";
//         unitMultiplier = 1;
//       } else {
//         metal = metalInput;
//         purity = purityInput;
//       }

//       let sellPremium = sellPremiumInputAED || 0;
//       let buyPremium = buyPremiumInputAED || 0;

//       let sellRate = (
//         goldAskingPrice *
//         unitInput *
//         unitMultiplier *
//         (purityInput / Math.pow(10, purityInput.length)) +
//         parseFloat(sellPremium)
//       ).toFixed(2);

//       // let buyRate = (
//       //   goldBiddingPrice *
//       //   unitInput *
//       //   unitMultiplier *
//       //   (purityInput / Math.pow(10, purityInput.length)) +
//       //   parseFloat(buyPremium)
//       // ).toFixed(2);

//       document.getElementById(elementId).textContent = sellRate;
//     }

//     // Display the gold rates in the specified divs
//     displayGoldRate("goldRate1");
//     displayGoldRate("goldRate2");
//     displayGoldRate("goldRate3");
//   } catch (error) {
//     console.error("Error displaying gold rates:", error);
//   }
// }
