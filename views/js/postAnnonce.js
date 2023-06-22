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
    var postAnnonce_citySuggestDiv = $('#postAnnonce_citySuggestDiv')
    if ((!index_researchCity.is(event.target) && !index_researchCity.has(event.target).length) && (!postAnnonce_citySuggestDiv.is(event.target) && !postAnnonce_citySuggestDiv.has(event.target).length)) {
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
        $.ajax({
            type:'POST',
            url:'/isCityValid',
            data:{city:$('#postAnnonce_researchCity').val()
        
            },
            success:function(output){
                if(output){
                    $('#postAnnonce_researchCity').css('background-color','var(--mainColor)')
                }else{
                    $('#postAnnonce_researchCity').css('background-color','transparent')
                }
            }
        })
    }else{
        $('div').remove(".Response_SuggestedCityElement")
    }
})
$('#postAnnonce_citySuggestDiv').on('click',function(event){
    if(event.target.classList.contains("Response_SuggestedCityElement")){
        var choice = event.target.id
    }else{
        var choice = $(event.target).parent()[0].id
    }
    $('#postAnnonce_researchCity').val(choice)
    $('#postAnnonce_citySuggestDiv').css('display','none')
    $.ajax({
        type:'POST',
        url:'/isCityValid',
        data:{city:choice},
        success:function(output){
            if(output){
                console.log('working')
                $('#postAnnonce_researchCity').css('background-color','var(--mainColor)')
            }else{
                $('#postAnnonce_researchCity').css('background-color','transparent')
            }
        }
    })
})
$('#postAnnonce_researchCity').on('click',function(){
    if($('#postAnnonce_researchCity').val() != ''){
        $('#postAnnonce_citySuggestDiv').css('display','')
        $('#postAnnonce_citySuggestDepartmentDiv').css('display','')
    }
})
$('.postAnnonce_cross').on('click',function(event){
    var number = parseInt(event.target.id.replace('postAnnonce_closingCross',''))
    $('#postAnnonce_FileInput'+number).val('')
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