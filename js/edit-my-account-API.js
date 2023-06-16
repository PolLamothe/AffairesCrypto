module.exports = function(express, upload){
    var _function = require('./function.js')

    express.post('/changeProfilePicture',upload.single('file'),async (req,res) =>{
        await _function.storeFileAsBSON(req.file,'username',req.session.pseudo,'User')
        res.send('<img src="data:image/png;base64,'+await _function.getProfilePicture(req.session.pseudo)+'" alt="Image"></img>')
    })
}