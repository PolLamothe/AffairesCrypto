module.exports = function(express, nodemailer, upload){
    var _function = require('./function.js')
    
    express.post('/returnCityName', async function(req,res){
        var result = await _function.returnCityName(req.body.userInput)
        var treatedResult = ''
        for(var i = 0;i<result.length;i++){
            if(i == 5){
                break
            }
            var name = result[i].Nom_commune
            var codePostal = result[i].Code_postal
            treatedResult += `<div class='Response_SuggestedCityElement' id='${name}(${codePostal})'><p>${name}(${codePostal})</p></div>`
        }
        res.send(treatedResult)
    })
    express.post('/doesThePseudoExist', async function(req,res){
        res.send({existState : await _function.doesPseudoExist(req.body.pseudo),content:'<img src="/assets/img/exclamation.png" id="API_pseudoExistImg"><p>Ce pseudo existe déja !</p>'})
    })
    express.post('/doesTheEmailExist',async function(req,res){
        res.send({existState: await _function.doesEmailExist(req.body.email), content:'<img src="/assets/img/exclamation.png" id="API_emailExistImg"><p>Cet email existe déja !</p>'})
    })
    express.post('/register',async function(req,res){
        function getRandomInt(max) {
            return Math.floor(Math.random() * max);
        }
        var code = getRandomInt(899999) + 100000
        if(req.body.email != undefined && req.body.pseudo != undefined){
            if(req.body.email != '' && req.body.pseudo != ''){
                if(!await _function.doesPseudoExist(req.body.pseudo) || _function.isPseudoValid(req.body.pseudo)){
                    if(_function.isPasswordCorrect(req.body.password) && _function.isEmailValid(req.body.email)){
                        if(!await _function.doesEmailExist(req.body.email)){
                            req.session.emailVerificationCode = code
                            req.session.email = req.body.email
                            req.session.pseudo = req.body.pseudo
                            req.session.password = req.body.password
                            req.session.save()
                            await _function.sendEmail(nodemailer,req.body.email,'Code de vérification',code.toString())
                            res.redirect('/verifyEmail')
                        }
                    }
                }
            }
        }
    })
    express.post('/verifyEmail',async function(req,res){
        var {createHash}  = require('crypto');
        if(req.body.code == req.session.emailVerificationCode){
            var session_ID = await _function.generateSessionID()
            var obj = {
                username : req.session.pseudo,
                password : createHash('sha-256').update(req.session.password).digest('hex'),
                email : req.session.email,
                sell_number : 0,
                session_ID : {value : session_ID,expires : _function.generateNewSession_IDExpiresDate()}
            }
            await _function.insertData('User',obj)
            res.cookie('session_ID',session_ID,{
                expires: _function.generateNewSession_IDExpiresDate(),
                secure : true,
                httpOnly: true,
                sameSite: 'lax',})
            res.redirect('/compte/'+req.session.pseudo)
        }else{
            res.send('Test')
        }
    })
    express.post('/login',async function(req,res){
        var {createHash}  = require('crypto');
        if(req.body.id != undefined && req.body.password != undefined){
            if(req.body.id != '' && req.body.password != ''){
                if(req.body.id.includes('@')){
                    if(_function.isEmailAndPasswordValid(req.body.id,req.body.password,'email',{createHash})){
                        var username = await _function.getPseudoFromEmail(req.body.id)
                        var session_ID = await _function.getSessionID(username)
                        await res.cookie('session_ID',session_ID,{
                            expires : await _function.getExpiresSession_ID(username),
                            secure : true,
                            httpOnly: true,
                            sameSite: 'lax',})
                        req.session.pseudo = username
                        res.redirect('/compte/'+await req.session.pseudo)
                    }
                }else{
                    if(_function.isEmailAndPasswordValid(req.body.id,req.body.password,'username',{createHash})){
                        var username = req.body.id
                        var session_ID = await _function.getSessionID(username)
                        res.cookie('session_ID',session_ID,{
                            expires : await _function.getExpiresSession_ID(username),
                            secure : true,
                            httpOnly: true,
                            sameSite: 'lax',})
                        req.session.pseudo = username
                        res.redirect('/compte/'+await req.session.pseudo)
                    }
                }
            }
        }
    })
    express.post('/isCityValid',async function(req,res){
        if(await _function.doesCityExist(req.body.city)){
            res.send(true)
        }else{
            res.send(false)
        }
    })
    express.post('/postAnnonce', upload.fields([
        {name:'File1'},
        {name:'File2'},
        {name:'File3'},
        {name:'File4'}
    ]),async function(req,res){
        var Title = req.body.Title  
        var Description = req.body.description
        var Price = req.body.Price
        var City = req.body.city
        if(await _function.checkConnection(req,res) != false){
            if(Title != '' && Description != '' && Price != '' && City != ''){
                if(_function.isXSSProof(Title) && _function.isXSSProof(Description) && _function.isXSSProof(Price) && _function.isXSSProof(City)){
                    if(!(!req.files || Object.keys(req.files).length === 0)){ //si il y'a au moins un fichier qui a été upload
                        for(var i=1;i<=4;i++){
                            if(req.files['File'+i] == undefined){
                            }else{
                                for(var x=1;x<=4;x++){
                                    if(i>x){
                                        if(req.files['File'+x] == undefined){
                                            req.files['File'+x] = req.files['File'+i]
                                            req.files['File'+i] = undefined
                                        }
                                    }
                                }
                            }
                        }
                        var obj = {}
                        var FileNumber = 0
                        for(var i=1;i<=4;i++){
                            if(req.files['File'+i] != undefined){
                                obj['File'+i] = req.files['File'+i]
                                FileNumber++
                            }
                        }   
                        await _function.createNewPost(req.session.pseudo,Title,Description,Price,City,obj,FileNumber)
                        res.redirect('/')
                    }
                }
            }
        }
    })
}