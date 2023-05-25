const MongoClient = require('mongodb').MongoClient
const mongodb = require('mongodb')
const fs = require('fs');

async function getClient(){
    const url = 'mongodb://127.0.0.1:27017'
    return await MongoClient.connect(url)
}

async function returnCityName(String){
    var client = await getClient()
    var collection = client.db('AffairesCrypto').collection('AllFrenchCity')

    const regex = new RegExp('^' + String, 'i'); 

    var result = await collection.find({Nom_commune:regex}).toArray()
    return result
}

module.exports = {returnCityName}