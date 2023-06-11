$('#login_validateButton').on('click',function(){
    if($('#login_pseudoInput').val() != '' && $('#login_passwordInput').val() != '')
    document.forms['form'].submit()
})