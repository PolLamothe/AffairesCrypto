import { xssErrorMessage, xssPrevent } from "./function.js"

for(var i =1;i<=4;i++){
    if(document.getElementById('postAnnonce_FileInput'+i).files[0] != undefined){
        $('#postAnnonce_picture'+i).attr("src",URL.createObjectURL(document.getElementById('postAnnonce_FileInput'+i).files[0]))
    }
}

function clickFileInput(id){
    $('#'+id).click()
}
$('.postAnnonce_Picture').on('click',function(event){
    var inputNumber = 4
    for(var i = 1; i<=inputNumber; i++){
        if($('#postAnnonce_FileInput'+i).val() == ''){
            $('#postAnnonce_FileInput'+i).click()
            break
        }
    }
})
$('.postAnnonce_invisibleInput').on('input',function(event){
    var file = document.getElementById(event.target.id).files[0]
    if(file.size > 5000000){
        alert('désolé mais la taille de la photo de dois pas dépasser 5Mo')
        $('#'+event.target.id).val('')
    }else{
        console.log(file)
        var number = event.target.id.replace('postAnnonce_FileInput','')
        var pictureID = 'postAnnonce_picture'+number.toString()
        $('#'+pictureID).attr("src",URL.createObjectURL(document.getElementById(event.target.id).files[0]))
    }
})

$(document).click(function(event){
    var index_researchCity = $('#postAnnonce_researchCity')
    if ((!index_researchCity.is(event.target) && !index_researchCity.has(event.target).length)) {
        $('#postAnnonce_citySuggestDiv').css('display','none')
    }
})
$("#postAnnonce_researchCity").on("input",function(){
    if($('#postAnnonce_researchCity').val() != ''){
        $('#postAnnonce_citySuggestDiv').css('display','')
        $('#postAnnonce_citySuggestDepartmentDiv').css('display','')
    }else{
        $('#postAnnonce_citySuggestDiv').css('display','none')
        $('#postAnnonce_citySuggestDepartmentDiv').css('display','none')
    }
    if($('#postAnnonce_researchCity').val() != ''){
        $.ajax({
            type:'POST',
            url:'/returnCityName',
            data:{
                userInput : $('#postAnnonce_researchCity').val()
            },
            success : function(output){
                $('div').remove(".Response_SuggestedCityElement")
                $('#postAnnonce_citySuggestDiv').append(output)
            }
        })
    }else{
        $('div').remove(".Response_SuggestedCityElement")
    }
})
$('#postAnnonce_researchCity').on('click',function(){
    if($('#postAnnonce_researchCity').val() != ''){
        $('#postAnnonce_citySuggestDiv').css('display','')
        $('#postAnnonce_citySuggestDepartmentDiv').css('display','')
    }
})
$('.postAnnonce_cross').on('click',function(event){
    var number = parseInt(event.target.id.replace('postAnnonce_closingCross',''))
    $('#postAnnonce_FileInput1').val('')
    $('#postAnnonce_picture'+number).attr('src','/assets/img/camera.png')
})
$('.function_xssPrevent').on('input',function(event){
    var id = event.target.id
    var idSplitted = id.split('_')
    var trueId = idSplitted[1]
    var divId = 'function_exclamation'+trueId+'Div'
    console.log('#'+divId)
    if(xssPrevent($('#'+id).val())){
        $('#'+divId).append(
            xssErrorMessage
        )
    }else{
        $('#'+divId).empty()
    }
})