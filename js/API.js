module.exports = function(express){
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
            emailVerified : await _function.getEmailVerificationState(Pseudo)})
    })
    express.get('/register',function(req,res){
        res.render('./register.ejs')
    })

    express.post('/returnCityName', async function(req,res){
        var result = await _function.returnCityName(req.body.userInput)
        var treatedResult = ''
        for(var i = 0;i<result.length;i++){
            if(i == 4){
                break
            }
            var name = result[i].Nom_commune
            var codePostal = result[i].Code_postal
            treatedResult += `<div class='Response_SuggestedCityElement'><p>${name}(${codePostal})</p></div>`
        }
        res.send(treatedResult)
    })
}