$('.slideshow-container').dacSlideshow({
	btnPrev : '.slideshow-prev',
	btnNext : '.slideshow-next',
	btnPause : '.pauseButton'
});

$('[data-type="AdArea"]').hover(function() {
	$(this).find('[data-type="AdImage"]:first').css("visibility", "visible");
}, function() {
	$(this).find('[data-type="AdImage"]:first').css("visibility", "hidden");
});

var editor = $('#strContent').PSEditor({
	getImgUrl : 'testjson2'
});

$("#getData").click(function() {
	console.log(JSON.stringify(editor.Get(0)));
	console.log(JSON.stringify(editor.GetAll()));
});
