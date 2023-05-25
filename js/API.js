module.exports = function(express){
    var _function = require('./function.js')

    express.get('/',function(req,res){
        res.render('index.ejs')
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