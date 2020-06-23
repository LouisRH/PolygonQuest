const mongoCollections = require("../mongoCollections");
const enemyDataCollection = mongoCollections.enemyData;
const gameCalc = require("./gameCalc");

function listAllEnemies(){
    return enemyDataCollection().then((enemyData) => {
      return enemyData.find({}).toArray();
    });
}

function getEnemyDataById(id) {
  return enemyDataCollection().then((enemyData) => {
      return enemyData.findOne({ _id: id }).then((enemy) => {
          if (!enemy) return null;
          return enemy;
      });
  });
}

function newEnemy(enemyData){
    return enemyDataCollection().then((enemydata) => {
  
      let newEnemyData = {
          _id: enemyData.id,
          name: enemyData.name,
          HPScale: enemyData.HPScale,
          MPScale: enemyData.MPScale,
          strScale: enemyData.strScale,
          defScale: enemyData.defScale,
          agiScale: enemyData.agiScale,
          aiVals: {
              attack: enemyData.aiVals.attack,
              cure: enemyData.aiVals.cure,
              fire: enemyData.aiVals.fire,
              water: enemyData.aiVals.water,
              wind: enemyData.aiVals.wind,
              earth: enemyData.aiVals.earth
          }
      };
  
      return enemydata.insertOne(newEnemyData).then((newInsertInformation) => {
          return newInsertInformation.insertedId;
      }).then((newId) => {
          return getEnemyDataById(newId);
      });
    });
}

function seedEnemies(){
    return enemyDataCollection().then(async (enemydata) => {
        console.log("Seeding Enemy Database");
  
        let bandit = await newEnemy({
            id: 1,
            name: "Bandit",
            HPScale: 100,
            MPScale: 100,
            strScale: 100,
            defScale: 100,
            agiScale: 100,
            aiVals: {
                attack: 5,
                cure: 0,
                fire: 5,
                water: 5,
                wind: 5,
                earth: 5
            }
        });
    
        let warrior = await newEnemy({
            id: 2,
            name: "Warrior",
            HPScale: 150,
            MPScale: 60,
            strScale: 120,
            defScale: 120,
            agiScale: 50,
            aiVals: {
                attack: 7,
                cure: 0,
                fire: 3,
                water: 3,
                wind: 3,
                earth: 3
            }
        });
    
        let mage = await newEnemy({
            id: 3,
            name: "Mage",
            HPScale: 70,
            MPScale: 130,
            strScale: 110,
            defScale: 70,
            agiScale: 110,
            aiVals: {
                attack: 3,
                cure: 0,
                fire: 7,
                water: 7,
                wind: 7,
                earth: 7
            }
        });
      });
  }

async function pickRandomEnemy() {
    let selectedId = gameCalc.rand(1, 4);
    let enemy = await getEnemyDataById(selectedId);
    return enemy;
}

module.exports = {
    listAllEnemies: listAllEnemies,
    getEnemyDataById: getEnemyDataById,
    newEnemy: newEnemy,
    seedEnemies: seedEnemies,
    pickRandomEnemy: pickRandomEnemy
}