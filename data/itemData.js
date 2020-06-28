const mongoCollections = require("../mongoCollections");
const itemDataCollection = mongoCollections.itemData;
const gameCalc = require("./gameCalc");

function listAllItems(){
    return itemDataCollection().then((itemData) => {
      return itemData.find({}).toArray();
    });
}

function getItemDataById(id) {
  return itemDataCollection().then((itemData) => {
      return itemData.findOne({ _id: id }).then((item) => {
          if (!item) return null;
          return item;
      });
  });
}

function newItem(itemData){
    return itemDataCollection().then((itemdata) => {
  
      let newItemData = {
          _id: itemData.id,
          name: itemData.name,
          itemType: itemData.itemType,
          bonusMult: itemData.bonusMult,
          crit: itemData.crit,
          special: itemData.special
      };
  
      return itemdata.insertOne(newItemData).then((newInsertInformation) => {
          return newInsertInformation.insertedId;
      }).then((newId) => {
          return getItemDataById(newId);
      });
    });
}

function seedItems(){
    return itemDataCollection().then(async (itemData) => {
        console.log("Seeding Item Database");
  
        let ironSword = await newItem({
            id: 1,
            name: "Iron Sword",
            itemType: "weapon",
            bonusMult: 1,
            crit: 30,
            special: 0
        });

        let ironShield = await newItem({
            id: 2,
            name: "Iron Shield",
            itemType: "shield",
            bonusMult: 1,
            crit: -1,
            special: 0
        });

        let ironHelmet = await newItem({
            id: 3,
            name: "Iron Helmet",
            itemType: "helmet",
            bonusMult: 1,
            crit: -1,
            special: 0
        });

        let ironChestplate = await newItem({
            id: 4,
            name: "Iron Chestplate",
            itemType: "chestplate",
            bonusMult: 1,
            crit: -1,
            special: 0
        });

        let ironBoots = await newItem({
            id: 5,
            name: "Iron Boots",
            itemType: "boots",
            bonusMult: 1,
            crit: -1,
            special: 0
        });
    });
}

async function pickRandomItem(enemyLevel) {
    let selectedId = gameCalc.rand(1, 6);
    let item = await getItemDataById(selectedId);

    let rarityVal = gameCalc.rand(1,101);
    let rarity = 1;
    let rarityMult = 1;

    if (rarityVal <= 35) {// common: 35%
        rarity = 1;
        rarityMult = 1;
    } else if (rarityVal > 35 && rarityVal <= 60) {// uncommon: 25%
        rarity = 2;
        rarityMult = 1.2;
    } else if (rarityVal > 60 && rarityVal <= 80) {// rare: 20%
        rarity = 3;
        rarityMult = 1.4;
    } else if (rarityVal > 80 && rarityVal <= 95) {// super rare: 15%
        rarity = 4;
        rarityMult = 1.6;
    } else if (rarityVal > 95) {// ultra rare: 5%
        rarity = 5;
        rarityMult = 1.8;
    }

    let bonusBase = 0;
    let bonusGrowth = 0;

    if (item.itemType === "shield") {
        bonusBase = 75;
        bonusGrowth = 122;
    } else if (item.itemType === "helmet") {
        bonusBase = 25;
        bonusGrowth = 113;
    } else {
        bonusBase = 10;
        bonusGrowth = 120;
    }

    let bonus = Math.round(rarityMult * (bonusBase * Math.pow((gameCalc.rand(bonusGrowth, bonusGrowth + 2) / 100), enemyLevel)));

    let MPCost = 0;

    if (item.itemType !== "weapon") {
        MPCost = -1;
    } else {
        MPCost = 5 + (5 * enemyLevel);
    }

    let newItem = {
        name: item.name,
        level: enemyLevel,
        rarity: rarity,
        itemType: item.itemType,
        image: "",
        bonus: bonus,
        MPCost: MPCost,
        crit: item.crit,
        special: item.special
    }
    return newItem;
}

module.exports = {
    listAllItems: listAllItems,
    getItemDataById: getItemDataById,
    newItem: newItem,
    seedItems: seedItems,
    pickRandomItem: pickRandomItem
}