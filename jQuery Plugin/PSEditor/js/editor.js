String.format = function() {
	if (arguments.length == 0)
		return null;
	var str = arguments[0];
	for (var i = 1; i < arguments.length; i++) {
		var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
		str = str.replace(re, arguments[i]);
	}
	return str;
};
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
	var a=1;
	//var b = editor.GetElement();
});
