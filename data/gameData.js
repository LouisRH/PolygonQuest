const mongoCollections = require("../mongoCollections");
const uuid = require("uuid");
const gameDataCollection = mongoCollections.gameData;
const enemyData = require("./enemyData");
const gameCalc = require("./gameCalc");

function listAllGames(){
    return gameDataCollection().then((gameData) => {
      return gameData.find({}).toArray();
    });
}

function getGameDataById(id) {
  return gameDataCollection().then((gameData) => {
      return gameData.findOne({ _id: id }).then((game) => {
          if (!game) return null;
          return game;
      });
  });
}

async function newGame(playerData){
    let enemy = await enemyData.pickRandomEnemy();
    return gameDataCollection().then((gameData) => {
      let enemyID = enemy._id;
      let weak;
      let resist;

      weak = gameCalc.rand(1,5);

      if (weak === 1) {
        resist = 2;
      } else if (weak === 2) {
        resist = 1;
      } else if (weak === 3) {
        resist = 4;
      } else if (weak === 4) {
        resist = 3;
      }
  
      let newGameData = {
          name: playerData.name,
          level: 1,
          HP: 85,
          MP: 25,
          str: 12,
          def: 12,
          agi: 12,
          itemHP: 75,
          itemMP: 25,
          itemStr: 10,
          itemDef: 10,
          itemAgi: 10,
          crit: 20,
          MPCost: 10,
          cureMP: 10,
          fireMP: 10,
          waterMP: 10,
          windMP: 10,
          earthMP:10,
          cureLvl: 0,
          fireLvl: 0,
          waterLvl: 0,
          windLvl: 0,
          earthLvl: 0,
          cureMPReduction: 0,
          fireMPReduction: 0,
          waterMPReduction: 0,
          windMPReduction: 0,
          earthMPReduction: 0,
          cureExp: 0,
          fireExp: 0,
          waterExp: 0,
          windExp: 0,
          earthExp: 0,
          exp: 0,
          weapon: {
              name: "Broken Sword",
              level: 1,
              rarity: 1,
              itemType: "weapon",
              image: "",
              bonus: 10,
              MPCost: 10,
              crit: 20,
              special: 0
          },
          shield: {
              name: "Broken Shield",
              level: 1,
              rarity: 1,
              itemType: "shield",
              image: "",
              bonus: 75,
              MPCost: -1,
              crit: -1,
              special: 0
          },
          helmet: {
              name: "Broken Helmet",
              level: 1,
              rarity: 1,
              itemType: "helmet",
              image: "",
              bonus: 25,
              MPCost: -1,
              crit: -1,
              special: 0
          },
          chestplate: {
              name: "Broken Chestplate",
              level: 1,
              rarity: 1,
              itemType: "chestplate",
              image: "",
              bonus: 10,
              MPCost: -1,
              crit: -1,
              special: 0
          },
          boots: {
              name: "Broken Boots",
              level: 1,
              rarity: 1,
              itemType: "boots",
              image: "",
              bonus: 10,
              MPCost: -1,
              crit: -1,
              special: 0
          },
          inventory: [],
          newItem: false,
          enemyID: enemyID,
          enemyWeak: weak,
          enemyResist: resist,
          enemyRarity: 1,
          enemyLevel: 1,
          enemyHP: 75,
          enemyMP: 25,
          enemyStr: 10,
          enemyDef: 10,
          enemyAgi: 10,
          enemyItemHP: 75,
          enemyItemMP: 25,
          enemyItemStr: 10,
          enemyItemDef: 10,
          enemyItemAgi: 10,
          _id: uuid.v4()
      };
  
      return gameData.insertOne(newGameData).then((newInsertInformation) => {
          return newInsertInformation.insertedId;
      }).then((newId) => {
          return getGameDataById(newId);
      });
    });
  }

  function updateGame(playerData){
    return gameDataCollection().then((gameData) => {
      let id = playerData._id;
      return gameData.updateOne({_id:id},{$set: playerData}).then((result) => {
        if(result.matchedCount !== 1)
          throw "Game data not found: " + id;
        return getGameDataById(id);
      });
    });
  }
  
  function deleteGame(id){
    return gameDataCollection().then((gameData) => {
      return gameData.deleteOne({_id:id}).then((result)=>{
          if(result.deletedCount < 1)
            throw "Game data not found: "+id;
          return;
      });
    });
  
  }
  
  module.exports = {
    listAllGames: listAllGames,
    getGameDataById: getGameDataById,
    newGame: newGame,
    updateGame: updateGame,
    deleteGame: deleteGame
  }