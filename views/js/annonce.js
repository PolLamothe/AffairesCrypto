for(var i=2;i<=$('.annonce_sliderPictureDiv').length;i++){
    $('#annonce_sliderPictureDiv'+i).css('display','none')
}

function delay(milliseconds){
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}


async function changePicture(intialNumber,direction){
    if(direction == 'right'){
        $('#annonce_sliderPictureDiv'+intialNumber).addClass('sliderPictureGoLeft')
        intialNumber++
        $('#annonce_sliderPictureDiv'+(intialNumber)).css('display','')
        $('#annonce_sliderPictureDiv'+intialNumber).addClass('sliderPictureComeRight')
        intialNumber--
    }else{
        $('#annonce_sliderPictureDiv'+intialNumber).addClass('sliderPictureGoRight')
        intialNumber--
        $('#annonce_sliderPictureDiv'+(intialNumber)).css('display','')
        $('#annonce_sliderPictureDiv'+intialNumber).addClass('sliderPictureComeLeft')
        intialNumber++
    }
    await delay(1000)
    $('#annonce_sliderPictureDiv'+intialNumber).css('display','none')
    if(direction == 'right'){
        $('#annonce_sliderPictureDiv'+intialNumber).removeClass('sliderPictureGoLeft')
        intialNumber++
        $('#annonce_sliderPictureDiv'+intialNumber).removeClass('sliderPictureComeRight')
    }else{
        $('#annonce_sliderPictureDiv'+intialNumber).removeClass('sliderPictureGoRight')
        intialNumber--
        $('#annonce_sliderPictureDiv'+intialNumber).removeClass('sliderPictureComeLeft')

    }
}

$('.annonce_arrow').on('click',function(event){
    var number = event.target.id.replace('annonce_','')
    number = number.replace('rightArrow','')
    number = number.replace('leftArrow','')
    if(event.target.id.includes('right')){
        var direction = 'right'
    }else{
        var direction = 'left'
    }
    changePicture(number,direction)
})