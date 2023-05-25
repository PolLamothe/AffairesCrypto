$("#index_researchCity").on("input",function(){
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
    var index_researchButtonPrice = $('#index_researchButtonPrice')
    if ((!index_citySuggestDepartmentDiv.is(event.target) && !index_citySuggestDepartmentDiv.has(event.target).length) && (!index_researchCity.is(event.target) && !index_researchCity.has(event.target).length)) {
        $('#index_citySuggestDiv').css('display','none')
    }
    if((!index_PriceRangeDiv.is(event.target) && !index_PriceRangeDiv.has(event.target).lenght) && (!index_researchButtonPrice.is(event.target) && !index_researchButtonPrice.has(event.target).lenght)){
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