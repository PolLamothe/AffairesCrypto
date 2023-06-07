$('#verifyEmail_codeInput').on('click',function(){
    if($('#verifyEmail_codeInput').val() != ''){
        document.forms['Form'].submit()
    }
})