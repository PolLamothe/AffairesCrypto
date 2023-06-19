module.exports = function(express, nodemailer){
    var _function = require('./function.js')

    express.get('/',async function(req,res){
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
            res.render('./compte.ejs',{rate : await _function.getUserRate(Pseudo),
                pseudo : Pseudo,
                sell_number : await _function.getSellNumber(Pseudo),
                phone_number : await _function.getPhoneNumber(Pseudo),
                ownAccount : ownAccount,
                profilePicture: await _function.getProfilePicture(Pseudo),
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
}