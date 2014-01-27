$(function() {
	$('.slideshow-container').dacSlideshow({
		btnPrev : '.slideshow-prev',
		btnNext : '.slideshow-next',
		btnPause : '.pauseButton'
	});

	var editor = $('#strContent').PSEditor({
		getImgUrl : 'testjson2'
	});
	var test = $("#element").pluginName();
	$("#getData").click(function(){
		//var v = editor.GetAll();
		console.log(JSON.stringify(editor.Get(0)));
		console.log(JSON.stringify(editor.GetAll()));
	});
	var a=1;
});
