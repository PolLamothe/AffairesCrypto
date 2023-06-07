module.exports = function(express, nodemailer){
    var _function = require('./function.js')

    express.get('/',function(req,res){
        res.render('index.ejs')
    })
    express.get('/mon-compte',async function(req,res){
        res.render('compte.ejs',{rate:await _function.getUserRate("Pol")})
    })
    express.get('/compte/:PSEUDO',async function(req,res){
        var Pseudo = req.params.PSEUDO
        res.render('./compte.ejs',{rate : await _function.getUserRate(Pseudo),
            pseudo : Pseudo,
            sell_number : await _function.getSellNumber(Pseudo),
            phone_number : await _function.getPhoneNumber(Pseudo),
        })
    })
    express.get('/register',function(req,res){
        res.render('./register.ejs')
    })
    express.get('/verifyEmail',function(req,res){
        if (req.session.email != undefined || req.session.emailVerificationCode == undefined){
            res.render('verifyEmail.ejs',{email:req.session.email})
        }else{
            res.redirect('/')
        }
    })

    express.post('/returnCityName', async function(req,res){
        var result = await _function.returnCityName(req.body.userInput)
        var treatedResult = ''
        for(var i = 0;i<result.length;i++){
            if(i == 5){
                break
            }
            var name = result[i].Nom_commune
            var codePostal = result[i].Code_postal
            treatedResult += `<div class='Response_SuggestedCityElement'><p>${name}(${codePostal})</p></div>`
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
        if(! await _function.doesPseudoExist(req.body.pseudo)){
            if(_function.isPasswordCorrect(req.body.password)){
                if(! await _function.doesEmailExist(req.body.email)){
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
    })
    express.post('/verifyEmail',async function(req,res){
        var {createHash}  = require('crypto');
        if(req.body.code == req.session.emailVerificationCode){
            var obj = {
                username : req.session.pseudo,
                password : createHash('sha-256').update(req.session.password).digest('hex'),
                email : req.session.email,
                sell_number : 0,
            }
            await _function.insertData('User',obj)
            res.send('Finish')
        }else{
            res.send('Problemo')
        }
    })
}