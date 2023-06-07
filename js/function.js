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

async function getUserRate(Pseudo){
    var client = await getClient()
    var collection = client.db('AffairesCrypto').collection('User')
    var result = await collection.find({username:Pseudo}).toArray()
    return result[0].stars
}

async function getSellNumber(Pseudo){
    var client = await getClient()
    var collection = client.db('AffairesCrypto').collection('User')
    var result = await collection.find({username:Pseudo}).toArray()
    return result[0].sell_number
}

async function doesPseudoExist(Pseudo){
    var client = await getClient()
    var collection = client.db('AffairesCrypto').collection('User')
    var result = await collection.find({username:Pseudo}).toArray()
    if(result.length == 0){
        return false
    }else{
        return true
    }
}

async function doesEmailExist(Email){
    var client = await getClient()
    var collection = client.db('AffairesCrypto').collection('User')
    var result = await collection.find({email:Email}).toArray()
    if(result.length == 0){
        return false
    }else{
        return true
    }
}

async function sendEmail(nodemailer,Destinataire, sujet, message){
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
    var transporter = nodemailer.createTransport({
        host:'smtp.office365.com',
        port:587,
        secure:false,
        auth: {
            user: 'python.pol29@outlook.fr',
            pass: '.18LnxR25*'
        }
    });
    await transporter.sendMail({
        from:"python.pol29@outlook.fr",
        to: Destinataire,
        subject:sujet,
        text:message
    })
}

function isPasswordCorrect(password){
    const number = ['1','2','3','4','5','6','7','8','9','0']
    var letterMinTemp = 'abcdefghijklmnopqrstuvwxyz'
    var letterMin = letterMinTemp.split('')
    var letterMajTemp = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    var letterMaj = letterMajTemp.split('')
    const targetArray = password.split('')
    var lengthState = false
    var majusculeState = false
    var minusculeState = false
    var numberState = false
    for(var i =0;i<targetArray.length;i++){
        if(password.length >= 10){
            lengthState = true
        }
        if(targetArray[i].toUpperCase() == targetArray[i] && number.indexOf(targetArray[i]) == -1 && letterMaj.indexOf(targetArray[i]) != -1 && targetArray[i] != ''){
            majusculeState = true
        }
        if(targetArray[i].toLowerCase() == targetArray[i]  && number.indexOf(targetArray[i]) == -1 && letterMin.indexOf(targetArray[i]) != -1 && targetArray[i] != ''){
            minusculeState = true 
        }
        if(number.indexOf(targetArray[i]) != -1){
            numberState = true
        }
    }
    if(numberState ||lengthState || majusculeState || minusculeState){
        return true
    }else{
        return false
    }
}

async function insertData(collection, obj){
    var client = await getClient()
    var collection = client.db('AffairesCrypto').collection(collection)
    await collection.insertOne(obj)
}

async function getPhoneNumber(pseudo){
    var client = await getClient()
    var collection = client.db('AffairesCrypto').collection('User')
    var result = await collection.find({username:pseudo}).toArray()
    return result[0].phone_number
}

module.exports = {
    returnCityName,
    getUserRate,
    getSellNumber,
    doesPseudoExist,
    doesEmailExist,
    sendEmail,
    isPasswordCorrect,
    insertData,
    getPhoneNumber,
}