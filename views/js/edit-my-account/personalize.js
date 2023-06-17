$('#edit_changeProfilePictureInput').change(function(){
    if(this.files[0].size > 5000000){
        alert('désolé mais la taille de votre photo de profile ne peut pas dépasser 5Mo')
        $('#edit_changeProfilePictureInput').val('')
    }else{
        $('#edit_changeProfilePictureImg').attr("src",URL.createObjectURL(document.getElementById('edit_changeProfilePictureInput').files[0]))
    }
})

$('#edit_ChangeProifileValidate').on('click',function(){
    let formData = new FormData()
    formData.append("file", document.getElementById('edit_changeProfilePictureInput').files[0])
    $.ajax({
        method:'POST',
        url:'/changeProfilePicture',
        processData : false,
        contentType: false,
        data:formData,
        success: function(output){
            console.log(output)
            $('#edit_content').append(output.toString())
        }
    })
})

$('#edit_ChangePseudoValidate').on('click',function(){
    $.ajax({
        type:'POST',
        url:'/changePseudo',
        data:{
            pseudo : $('#edit_changePseudoInput').val()
        }
    })
})