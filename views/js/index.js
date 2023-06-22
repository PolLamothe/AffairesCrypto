$("#index_researchCity").on("input",function(){
    $('#index_citySuggestDiv').css('display','')
    $('#index_citySuggestDepartmentDiv').css('display','')
    if($('#index_researchCity').val() != ''){
        $.ajax({
            type:'POST',
            url:'/returnCityName',
            data:{
                userInput : $('#index_researchCity').val()
            },
            success : function(output){
                $('div').remove(".Response_SuggestedCityElement")
                $('#index_citySuggestDiv').append(output)
            }
        })
        $.ajax({
            type:'POST',
            url:'/isCityValid',
            data:{city:$('#index_researchCity').val()
            },
            success:function(output){
                if(output){
                    $('#index_researchCity').css('background-color','var(--mainColor)')
                }else{
                    $('#index_researchCity').css('background-color','#EEEEEE')
                }
            }
        })
    }else{
        $('div').remove(".Response_SuggestedCityElement")
    }
})
$('#index_citySuggestDepartmentButton').on('click',function(){
    if($('#index_citySuggestDepartmentButton').hasClass('index_citySuggestDepartmentButtonEmpty')){
        $('#index_citySuggestDepartmentButton').removeClass('index_citySuggestDepartmentButtonEmpty')
        $('#index_citySuggestDepartmentButton').addClass('index_citySuggestDepartmentButtonFill')
    }else{
        $('#index_citySuggestDepartmentButton').addClass('index_citySuggestDepartmentButtonEmpty')
        $('#index_citySuggestDepartmentButton').removeClass('index_citySuggestDepartmentButtonFill')
    }
})
$(document).click(function(event){
    var index_citySuggestDepartmentDiv = $('#index_citySuggestDepartmentDiv')
    var index_researchCity = $('#index_researchCity')
    var index_PriceRangeDiv = $('#index_PriceRangeDiv')
    var index_researchButtonPriceClass= $('.index_researchButtonPriceClass')
    var index_researchButtonPrice = $('#index_researchButtonPrice')
    if ((!index_citySuggestDepartmentDiv.is(event.target) && !index_citySuggestDepartmentDiv.has(event.target).length) && (!index_researchCity.is(event.target) && !index_researchCity.has(event.target).length)) {
        $('#index_citySuggestDiv').css('display','none')
    }
    if(!$(event.target).hasClass('index_researchButtonPriceClass')){
        index_PriceRangeDiv.css('display','none')
    }
})
$('#index_researchCity').on('click',function(){
    $('#index_citySuggestDiv').css('display','')
    $('#index_citySuggestDepartmentDiv').css('display','')
})
$('#index_researchButtonPrice').on('click',function(){
    $('#index_PriceRangeDiv').css('display','grid')
})
$('#index_citySuggestDiv').on('click',function(event){
    if(event.target.classList.contains("Response_SuggestedCityElement")){
        var choice = event.target.id
    }else{
        var choice = $(event.target).parent()[0].id
    }
    $('#index_researchCity').val(choice)
    $('#index_citySuggestDiv').css('display','none')
    $.ajax({
        type:'POST',
        url:'/isCityValid',
        data:{city:choice},
        success:function(output){
            if(output){
                console.log('working')
                $('#index_researchCity').css('background-color','var(--mainColor)')
            }else{
                $('#index_researchCity').css('background-color','#EEEEEE')
            }
        }
    })
})
$('#index_researchButtonSearch').on('click',function(){
    if($('#index_citySuggestDepartmentButton').hasClass('index_citySuggestDepartmentButtonFill')){
        window.location = `/search?location=${$('#index_researchCity').val()}&keyword=${$('#index_researchItem').val()}&departmentToggle=true&minPrice=${$('#index_minPrice').val()}&maxPrice=${$('#index_maxPrice').val()}`
    }else{

    }
})