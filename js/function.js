const MongoClient = require('mongodb').MongoClient

async function getClient(){
    const url = 'mongodb://127.0.0.1:27017'
    return await MongoClient.connect(url)
}

function isXSSProof(String){
    return (!String.includes('<') && !String.includes('>'))
}

async function returnCityName(Ville){
    var client = await getClient()
    var collection = client.db('AffairesCrypto').collection('AllFrenchCity')
    var result = await collection.find({Nom_commune:{$regex:`^${Ville}`,$options:'i'}}).toArray()
    return result
    
}

async function getUserRate(Pseudo){
    var client = await getClient()
    var collection = client.db('AffairesCrypto').collection('User')
    var result = await collection.find({username:Pseudo}).toArray()
    if(result[0].stars != undefined){
        return result[0].stars
    }else{
        return undefined
    }
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

async function generateSessionID(){
    function getRandomInt(max) {
        return Math.random() * max;
    }
    var client = await getClient()
    var collection = client.db('AffairesCrypto').collection('User')
    const caractere = 'abcdefghijklmnopqrstuvwxyz'
    const number = '0123456789'
    const ratio = number.split('').length/caractere.split('').length
    var final = ''
    x = true
    while(x){
        for(var i = 0;i<25;i++){
            if(getRandomInt(1) < ratio){
                var choice = caractere
                var index = Math.floor(getRandomInt(choice.split('').length))
                var luck = Math.floor(getRandomInt(2))
                if(luck == 0){
                    final = final + choice.split('')[index]
                }else{
                    final = final + (choice.split('')[index].toUpperCase())
                }
            }else{
                var choice = number
                var index = Math.floor(getRandomInt(choice.split('').length))
                final = final + choice.split('')[index]
            }
        }
        var result = await collection.find({session_ID : final}).toArray()
        if(result.length == 0){
            x = false
        }
    }
    return final
}

async function doesSession_IDExist(session_ID){
    var client = await getClient()
    var collection = client.db('AffairesCrypto').collection('User')
    var result = await collection.find({session_ID : session_ID}).toArray()
    if(result.length != 0){
        return true
    }else{
        return false
    }
}

async function changeDBValue(collection, query, newValues){
    var client = await getClient()
    var collection = client.db('AffairesCrypto').collection(collection)
    await collection.update(query, newValues)
}

async function checkConnection(req, res){
    var client = await getClient()
    var collection = client.db('AffairesCrypto').collection('User')
    if(req.cookies.session_ID != undefined){
        var result = await collection.find({"session_ID.value" : req.cookies.session_ID.value}).toArray()
        if(result.length == 0){
            res.redirect('/login')
            return false
        }else{
            if(result[0].session_ID.expires < req.cookies.session_ID.value){
                res.redirect('/login')
            }else if(result[0].session_ID.expires < new Date()){//si l'id de session actuel est périmé
                var query = {"session_ID.expires" : result[0].session_ID.expire}
                var newValues = {$set: {
                    "session_ID.expires":generateNewSession_IDExpiresDate(),
                    "session_ID.value":await generateSessionID()
                }}
                await changeDBValue('User',query,newValues)

                return false
            }else{
                req.session.pseudo = result[0].username
                return true
            }
        }
    }else{
        res.redirect('/login')
        return false
    }
}

function isPseudoValid(pseudo){
    if(pseudo != ''){
        return !pseudo.includes('<') && !pseudo.includes('>') && !pseudo.includes('@')
    }else{
        return false
    }
}

function isEmailValid(email){
    if(email != ''){
        return !email.includes('<') && !email.includes('>') && email.includes('@')
    }else{
        return false
    }
}

async function isEmailAndPasswordValid(id, password, emailOrUsername, {createHash}){
    var client = await getClient()
    var collection = client.db('AffairesCrypto').collection('User')
    if(emailOrUsername == 'email'){
        var result = await collection.find({
            email : id,
            password : createHash('sha-256').update(password).digest('hex')
        }).toArray()
        if(result.length != 0){
            return true
        }else{
            return false
        }
    }else if(emailOrUsername == 'username'){
        var result = await collection.find({
            username : id,
            password : createHash('sha-256').update(password).digest('hex')
        }).toArray()
        if(result.length != 0){
            return true
        }else{
            return false
        }
    }
}

async function getSessionID(username){
    var client = await getClient()
    var collection = client.db('AffairesCrypto').collection('User')
    var result = await collection.find({username : username}).toArray()
    return result[0].session_ID
}

async function getPseudoFromEmail(email){
    var client = await getClient()
    var collection = client.db('AffairesCrypto').collection('User')
    var result = await collection.find({email : email}).toArray()
    return result[0].username
}

async function getExpiresSession_ID(pseudo){
    var client = await getClient()
    var collection = client.db('AffairesCrypto').collection('User')
    var result = await collection.find({username : pseudo}).toArray()
    return result[0].session_ID.expires
}

function generateNewSession_IDExpiresDate(){
    return new Date(Date.now() + 2592000000)
}

function editMyAccountRender(res, target, pseudo, profilePicture){
    res.render('./edit-my-account.ejs',{
        target:target,
        pseudo:pseudo,
        profilePicture:profilePicture
    })
}

async function getEmailFromPseudo(username){
    var client = await getClient()
    var collection = client.db('AffairesCrypto').collection('User')
    var result = await collection.find({username:username}).toArray()
    return result[0].email
}

function isImageValid(file){
    var validMime = ['image/png','image/jpg','image/jpeg']
    if(file.size < 5000000){
        if(validMime.indexOf(file.mimetype) == -1){
            return true
        }
    }
    return false
}

async function storeFileAsBSON(file, params, paramsValue, collection){
    const fs = require('fs');
    const mongodb = require('mongodb');
    var client = await getClient()
    var collection = client.db('AffairesCrypto').collection(collection)
    const filePath = file.path;
    const fileData = fs.readFileSync(filePath);
    collection.updateOne({[params]:paramsValue}, {$set:{
        profilePicture: new mongodb.Binary(fileData)
    }})
    fs.unlinkSync(filePath);
}

async function getProfilePicture(pseudo){
    var client = await getClient()
    var collection = client.db('AffairesCrypto').collection('User')
    var result = await collection.find({username : pseudo}).toArray()
    if(result[0].profilePicture == undefined){
        return null
    }else{
        return result[0].profilePicture.buffer.toString('base64')
    }
}

async function changePseudo(oldPseudo, newPseudo){
    var client = await getClient()
    var collection = client.db('AffairesCrypto').collection('User')
    collection.updateOne({username: oldPseudo},{$set:{
        username: newPseudo
    }})
    var collection = client.db('AffairesCrypto').collection('Annonce')
    collection.updateMany({username: oldPseudo},{$set:{
        username: newPseudo
    }})
}

async function doesCityExist(City){
    var client = await getClient()
    var collection = client.db('AffairesCrypto').collection('AllFrenchCity')
    if(City.includes('(') || City.includes(')')){
        City = City.split(')')
        City.pop()
        City = City.toString()
        var array = City.split('(')
        var result = await collection.find({Nom_commune : array[0],Code_postal : parseInt(array[1])}).toArray()
        if(result.length != 0){
            return true
        }else{
            return false
        }
    }else{
        return false
    }
}

async function createNewPost(pseudo,Title,Description,Price,City,File, FileNumber){
    const fs = require('fs');
    const mongodb = require('mongodb');
    var client = await getClient()
    var collection = client.db('AffairesCrypto').collection('Annonce')
    var Picture = {}
    for(var i=1;i<=FileNumber;i++){
        var file = File['File'+i][0]
        var filePath = file.path;
        var fileData = fs.readFileSync(filePath);
        Picture['File'+i] = new mongodb.Binary(fileData)
        fs.unlinkSync(filePath);
    }
    var Departement = City.split('(')
    Departement = Departement[1].split('')
    Departement = Departement[0]+Departement[1]
    Price = parseInt(Price)
    var obj = {
        username : pseudo,
        titre : Title,
        description : Description,
        prix : Price,
        Ville : City,
        Picture:Picture,
        Departement : Departement
    }
    await collection.insertOne(obj)
}
async function getPostData(id){
    const {mongodb, ObjectId } = require('mongodb');
    var client = await getClient()
    var collection = client.db('AffairesCrypto').collection('Annonce')
    var result = await collection.find({_id: new ObjectId(id)}).toArray()
    return result[0]
}

async function getAllUserPost(pseudo){
    var client = await getClient()
    var collection = client.db('AffairesCrypto').collection('Annonce')
    var result = await collection.find({username : pseudo}).toArray()
    return result
}

async function getDataFromSearch(keyword, location, departmentToggle,minPrice,maxPrice){
    var client = await getClient()
    var collection = client.db('AffairesCrypto').collection('Annonce')
    if(minPrice == undefined || minPrice == ''){
        minPrice = 0
    }else{
        minPrice = parseInt(minPrice)
    }
    if(maxPrice == undefined || maxPrice == ''){
        maxPrice = 99999999
    }else{
        maxPrice = parseInt(maxPrice)
    }
    if(departmentToggle == 'true'){
        location = location.split('(')
        location = location[1][0] + location[1][1]
    }
    var tempKeyword = keyword.split(' ')
    var result = []
    for(var i =0;i<tempKeyword.length;i++){
        if(departmentToggle == 'true'){
            var temp = await collection.find({
                $or:[{
                    "titre" : {
                        $regex : tempKeyword[i],
                        $options : 'i'
                    }},{
                    "description" : {
                        $regex : tempKeyword[i],
                        $options : 'i'
                    }}
                ],
                prix:{
                    $gt : minPrice,
                    $lt : maxPrice
                },
                Departement: location.toString(),
            }).toArray()
            for(var x=0;x<temp.length;x++){
                presenceState = undefined
                for(var y=0;y<result.length;y++){
                    if(temp[x]._id.equals(result[y]._id)){
                        presenceState = true
                    }else if(presenceState != true){
                        presenceState = false
                    }
                }
                if(presenceState != true){
                    result.push(temp[x])
                }
            }
        }else{ 
            var temp = await collection.find({
                $or:[{
                    "titre" : {
                        $regex : tempKeyword[i],
                        $options : 'i'
                    }},{
                    "description" : {
                        $regex : tempKeyword[i],
                        $options : 'i'
                    }}
                ],
                prix:{
                    $gt : minPrice,
                    $lt : maxPrice
                },
                Ville: location.toString(),
            }).toArray()
            for(var x=0;x<temp.length;x++){
                presenceState = undefined
                for(var y=0;y<result.length;y++){
                    if(temp[x]._id.equals(result[y]._id)){
                        presenceState = true
                    }else if(presenceState != true){
                        presenceState = false
                    }
                }
                if(presenceState != true){
                    result.push(temp[x])
                }
            }
        }
    }
    return result
}

async function getUserMessagesList(pseudo){
    var client = await getClient()
    var collection = client.db('AffairesCrypto').collection('Annonce')
    var result = collection.find({$or:[
        {user1:pseudo},
        {user2:pseudo}
    ]})
}

async function getMessagePreview(ID){
    
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
    generateSessionID,
    doesSession_IDExist,
    checkConnection,
    isPseudoValid,
    isEmailValid,
    isEmailAndPasswordValid,
    getSessionID,
    getPseudoFromEmail,
    getExpiresSession_ID,
    changeDBValue,
    generateNewSession_IDExpiresDate,
    editMyAccountRender,
    getEmailFromPseudo,
    isImageValid,
    storeFileAsBSON,
    getProfilePicture,
    changePseudo,
    doesCityExist,
    isXSSProof,
    createNewPost,
    getPostData,
    getAllUserPost,
    getDataFromSearch,
    getUserMessagesList,
}