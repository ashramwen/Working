$(function() {
	$('.slideshow-container').dacSlideshow({
		btnPrev : '.slideshow-prev',
		btnNext : '.slideshow-next',
		btnPause : '.pauseButton'
	});

	$('#strContent').PSEditor({
		getImgUrl : 'testjson2'
	});
});

