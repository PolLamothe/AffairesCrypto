function containsPseudo(pseudo){
    return !pseudo.includes('<') && !pseudo.includes('>') && !pseudo.includes('@')
}
function containsEmail(pseudo){
    return !pseudo.includes('<') && !pseudo.includes('>')
}
function isPasswordCorrect(){
    const number = ['1','2','3','4','5','6','7','8','9','0']
    var letterMinTemp = 'abcdefghijklmnopqrstuvwxyz'
    var letterMin = letterMinTemp.split('')
    var letterMajTemp = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    var letterMaj = letterMajTemp.split('')
    var target = $('#register_passwordInput')
    const targetArray = target.val().split('')
    var lengthState = false
    var majusculeState = false
    var minusculeState = false
    var numberState = false
    for(var i =0;i<targetArray.length;i++){
        if(target.val().length >= 10){
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
    var result = new Object()
    result['lengthState'] = lengthState
    result['majusculeState'] = majusculeState
    result['minusculeState'] = minusculeState
    result['numberState'] = numberState
    return result
}
$('#register_passwordInput').on('input',function(){
    var isPasswordCorrectVar = isPasswordCorrect()
    if(isPasswordCorrectVar['lengthState']){
        $('#register_passwordLengthImg').attr('src','/assets/img/certified.png')
    }else{
        $('#register_passwordLengthImg').attr('src','/assets/img/redCross.png')
    }
    if(isPasswordCorrectVar['majusculeState']){
        $('#register_passwordMajImg').attr('src','/assets/img/certified.png')
    }else{
        $('#register_passwordMajImg').attr('src','/assets/img/redCross.png')
    }
    if(isPasswordCorrectVar['minusculeState']){
        $('#register_passwordMinImg').attr('src','/assets/img/certified.png')
    }else{
        $('#register_passwordMinImg').attr('src','/assets/img/redCross.png')
    }
    if(isPasswordCorrectVar['numberState']){
        $('#register_passwordNumberImg').attr('src','/assets/img/certified.png')
    }else{
        $('#register_passwordNumberImg').attr('src','/assets/img/redCross.png')
    }
})
$('#register_validateButton').on('click',function(){
    var isPasswordCorrectVar = isPasswordCorrect()
    if($('#register_pseudoInput').val() != '' && $('#register_emailInput').val() != '' && $('#register_passwordInput').val() != ''){
        if(isPasswordCorrectVar['lengthState'] && isPasswordCorrectVar['majusculeState'] && isPasswordCorrectVar['minusculeState'] && isPasswordCorrectVar['numberState']){
            if($("#API_pseudoExistImg").length == 0 && $('#API_emailExistImg').length == 0){
                document.forms['Form'].submit()
            }
        }
    }
})
$('#register_pseudoInput').on('input',async function(){
    var containsState = false
    if(!containsPseudo($('#register_pseudoInput').val())){
        $('#register_exclamationPseudoDiv').append(
            '<img src="/assets/img/exclamation.png" id="API_pseudoExistImg"><p>Votre Pseudo ne peut pas contenir les caractères suivants: @, <, ></p>'
        ) 
        containsState = true               
    }else{
        containsState = false
        $('#register_exclamationPseudoDiv').empty()
    }
    await $.ajax({
        type:'POST',
        url:'/doesThePseudoExist',
        data:{pseudo:$('#register_pseudoInput').val()},
        success : function(output){
            if(output.existState){
                $('#register_exclamationPseudoDiv').append(output.content)                
            }else if(!containsState){
                $('#register_exclamationPseudoDiv').empty()
            }
        }
    })
})
$('#register_emailInput').on('input',async function(){
    var containsState = false
    if(!containsEmail($('#register_emailInput').val())){
        $('#register_exclamationEmailDiv').append(
            '<img src="/assets/img/exclamation.png" id="API_pseudoExistImg"><p>Votre Email ne peut pas contenir les caractères suivants: <, > </p>'
        ) 
        containsState = true               
    }else{
        containsState = false
        $('#register_exclamationEmailDiv').empty()
    }
    $.ajax({
        type:'POST',
        url:'/doesTheEmailExist',
        data:{
            email:$('#register_emailInput').val()
        },
        success : function(output){
            if(output.existState){
                $('#register_exclamationEmailDiv').append(output.content)                
            }else if(!containsState){
                $('#register_exclamationEmailDiv').empty()
            }
        }
    })
})