module.exports = function(express, nodemailer){
    var _function = require('./function.js')

    express.get('/',async function(req,res){
        console.log('connection')
        res.render('index.ejs')
    })
    express.get('/mon-compte',async function(req,res){
        if(await _function.checkConnection(req,res) != false){
            if(req.session.pseudo != undefined){
                res.redirect('/compte/'+req.session.pseudo)
            }else if(await _function.checkConnection(req, res) != false){
                res.redirect('/compte/'+req.session.pseudo)
            }
        }
    })
    express.get('/compte/:PSEUDO',async function(req,res){
        var Pseudo = req.params.PSEUDO
        if(await _function.doesPseudoExist(Pseudo)){
            if(req.session.pseudo != undefined){
                if(req.session.pseudo == Pseudo){
                    var ownAccount = true
                }else{
                    var ownAccount = false
                }
            }else{
                var ownAccount = false
            }
            var allUserPost = await _function.getAllUserPost(Pseudo)
            for(i=1;i<=allUserPost.length;i++){
                allUserPost[i-1].Picture.File1 = allUserPost[i-1].Picture.File1.buffer.toString('base64')
            }
            res.render('./compte.ejs',{rate : await _function.getUserRate(Pseudo),
                pseudo : Pseudo,
                sell_number : await _function.getSellNumber(Pseudo),
                phone_number : await _function.getPhoneNumber(Pseudo),
                ownAccount : ownAccount,
                profilePicture: await _function.getProfilePicture(Pseudo),
                allUserPost : allUserPost
            })
        }else{
            res.redirect('/')
        }
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
    express.get('/login',async function(req,res){
        res.render('./login.ejs')
    })
    express.get('/edit-my-account',async function(req,res){
        
        if(_function.checkConnection(req, res) != false){
            var pseudo = req.session.pseudo
            var email = await _function.getEmailFromPseudo(pseudo)
            _function.editMyAccountRender(res,'personalize',pseudo, await _function.getProfilePicture(pseudo))
        }
    })
    express.get('/postAnnonce',async function(req,res){
        if(await _function.checkConnection(req,res) != false){
            res.render('postAnnonce.ejs')
        }
    })
    express.get('/annonce/:ID',async function(req,res){
        var obj = await _function.getPostData(req.params.ID)

        for(var i =1;i<=Object.keys(obj.Picture).length;i++){
            obj.Picture['File'+i] = obj.Picture['File'+i].buffer.toString('base64')
        }

        res.render('annonce.ejs',{
            titre : obj.titre,
            pseudo : obj.username,
            description : obj.description,
            prix : obj.prix,
            ville : obj.Ville,
            picture : obj.Picture,
            pictureNumber : Object.keys(obj.Picture).length,
            profilePicture : await _function.getProfilePicture(obj.username)
        })
    })
    express.get('/search',async function(req,res){
        if((req.query.location != undefined && req.query.keyword != undefined)){
            if(await _function.doesCityExist(req.query.location)){
                var result = await _function.getDataFromSearch(req.query.keyword,req.query.location,req.query.departmentToggle,req.query.minPrice,req.query.maxPrice)
                for(var i =1;i<=result.length;i++){
                    result[i-1].Picture.File1 = result[i-1].Picture.File1.buffer.toString('base64')
                }
                res.render('search.ejs',{result:result})
            }
        }else{
            res.redirect('/')
        }
    })
    express.get('/message',async function(req,res){
        if(_function.checkConnection(req,res)){
            res.render('message.ejs')
        }
    })
}