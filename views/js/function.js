function xssPrevent(text){
    if(text.includes('>') || text.includes('<')){
        return true
    }else{
        return false
    }
}

var xssErrorMessage = '<img src="/assets/img/exclamation.png"><p>Les caractères suivants sont interdits: <, ></p>'


export {
    xssPrevent,
    xssErrorMessage,
}