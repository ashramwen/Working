/**
 * WYSIWYG Post & See Editor v1.0
 *
 * @author augustine
 *
 * Date: 2014/01/13
 */
( function($) {
		var $sender;
		var imgIndex = 0;
		var defaultOption = {
			colors : "FFF FCC FC9 FF9 FFC 9F9 9FF CFF CCF FCF " + "CCC F66 F96 FF6 FF3 6F9 3FF 6FF 99F F9F " + "BBB F00 F90 FC6 FF0 3F3 6CC 3CF 66C C6C " + "999 C00 F60 FC3 FC0 3C0 0CC 36F 63F C3C " + "666 900 C60 C93 990 090 399 33F 60C 939 " + "333 600 930 963 660 060 366 009 339 636 " + "000 300 630 633 330 030 033 006 309 303",
			fonts : "Arial,Arial Black,Comic Sans MS,Courier New,Narrow,Garamond," + "Georgia,Impact,Sans Serif,Serif,Tahoma,Trebuchet MS,Verdana",
			sizes : "1,2,3,4,5,6,7",
			styles : [["Paragraph", "<p>"], ["Header 1", "<h1>"], ["Header 2", "<h2>"], ["Header 3", "<h3>"], ["Header 4", "<h4>"], ["Header 5", "<h5>"], ["Header 6", "<h6>"]],
			useCSS : false,
			docType : '',
			docCSSFile : "",
			bodyStyle : "margin: 4px; font-family:微軟正黑體, Arial; cursor:text"
		};
		$.fn.PSEditor = function(options) {
			var settings = $.extend({
				getImgUrl : ""
			}, options);
			return this.each(function() {
				initEditor(this);
			});
		};

		function initEditor(sender) {
			var src = $('script[src$="jquery.pseditor.js"]:first').attr("src").replace("jquery.pseditor.js", "pseditor.html");
			if ($("#PSEditor").length == 0) {
				$.ajax({
					async : false,
					url : src
				}).done(function(data) {
					$('body').append(data);
				});
			}
			//TextEditor & TextImageEditor
			initTextImageEditor(sender);
			//ImgSelector
			initImgSelector(sender);
			//MovieEditor
			initMovieEditor(sender);
			//SwitchEditor
			initSwitchEditor(sender);
			//cancel click
			$("#PSEditor .ps_cnl").click(closeMask);
			albumMove();
		}

		function openMask($target, newWidth, newHeight) {
			var h = ($(window).height() - newHeight) / 2 + $(window).scrollTop();
			var w = ($(window).width() - newWidth) / 2 + $(window).scrollLeft();
			if (h < 0)
				h = $(window).scrollTop();

			$target.css({
				width : newWidth,
				"max-height" : newHeight,
				top : h + "px",
				left : w + "px"
			});

			//$("body").css("overflow", "hidden");
			$target.show();
			$("#PSEditor_mask").fadeTo(250, 0.4);
		}

		function closeMask() {
			$('#PSEditor textarea').val('');
			$("body").css("overflow", "auto");
			$("#PSEditor .ps_dialog").hide();
			$("#PSEditor #PSEditor_mask").hide();
			$("#PSEditor .ps_divGallery").css('left', 0);
			imgIndex = 0;
		}

		function albumMove() {
			var imgW = "74";
			var imgMax = 6;
			var imgLength = $("#PSEditor .ps_divGallery:first").find(".ps_gallery").length - imgMax;
			$("#PSEditor .ps_content .ps_picL").click(function() {
				if (imgIndex == 0)
					return;
				imgIndex--;
				$("#PSEditor .ps_divGallery").animate({
					left : "+=" + imgW
				}, '200');
			});
			$("#PSEditor .ps_picR").click(function() {
				if (imgLength <= imgMax || imgIndex == imgLength)
					return;
				imgIndex++;
				$("#PSEditor .ps_divGallery").animate({
					left : "-=" + imgW
				}, '200');
			});
		}

		//TextEditor & TextImageEditor
		function initTextImageEditor(sender) {
			var imgPattern = '<div class="ps_gallery"><img src="images/7.jpg" /></div>';
			var $textEditor = $("#PSEditor .textEditor");
			var option = {
				width : 428,
				height : 297,
				controls : "bold italic underline | bullets | color | link | pastetext"
			};
			$.extend(true, option, defaultOption);
			var $txtEdit = $textEditor.find("textarea").cleditor(option);
			$textEditor.find(".ps_ok").click(function() {
				$sender.html($txtEdit.getHtml());
				closeMask();
			});
			$(sender).delegate('[data-type="Text"]', 'click', function() {
				$sender = $(this);
				$textEditor.find(".ps_content").hide();
				$txtEdit.updateHtml($sender.html());
				openMask($textEditor, 500, 497);
			});
			$(sender).delegate('[data-type="TextImage"]', 'click', function() {
				$sender = $(this);
				$textEditor.find(".ps_content").show();
				$txtEdit.updateHtml($sender.html());
				openMask($textEditor, 500, 497);
			});
		}

		function initImgSelector(sender) {
			var imgPattern = '<div class="ps_gallery"><img src="images/7.jpg" /></div>';
			var $ImgSelector = $('#PSEditor .imgSelector');
			$ImgSelector.find(".ps_album img").click(function() {
				$ImgSelector.find(".ps_album img.blueborder").removeClass("blueborder");
				$(this).addClass("blueborder");
			});
			$ImgSelector.find(".ps_ok").click(function() {
				var src = $ImgSelector.find(".ps_album img.blueborder").data("src");
				$sender.find("img:first").attr("src", src);
				closeMask();
			});
			$(sender).delegate('[data-type="Image"]', 'click', function() {
				$sender = $(this);
				var src = $sender.find("img:first").attr("src");
				$ImgSelector.find(".ps_album img.blueborder").removeClass("blueborder");
				$ImgSelector.find('.ps_album img[data-src="' + src + '"]').addClass("blueborder");
				openMask($ImgSelector, 476, 441);
			});
		}

		//get youtube vedio id
		function getYoutubeId(url) {
			var regExp = /^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/;
			var match = url.match(regExp);
			if (match)
				return match[2];
			return '';
		}

		function initMovieEditor(sender) {
			var youtube = '<iframe width="640" height="360" src="http://www.youtube.com/embed/{0}" frameborder="0" data-id="{0}" allowfullscreen="0"></iframe>';
			var $MovieEditor = $('#PSEditor .movieEditor');
			$MovieEditor.find(".ps_ok").click(function() {
				$sender.find("img").remove();
				$sender.find("iframe").remove();
				$sender.prepend(String.format(youtube, getYoutubeId($MovieEditor.find('textarea').val())));
				closeMask();
			});
			$MovieEditor.find('textarea').click(function() {
				this.select();
			});
			$(sender).delegate('[data-type="Movie"]', 'click', function() {
				$sender = $(this);
				if ($sender.find("iframe").length > 0)
					$MovieEditor.find('textarea').val($sender.find("iframe").attr("src"));
				openMask($MovieEditor, 500, 497);
			});
		}

		function initSwitchEditor(sender) {
			var $SwitchEditor = $('#PSEditor .switchEditor');
			var option1 = {
				width : 315,
				height : 90,
				controls : "outerlink"
			};
			var option2 = {
				width : 315,
				height : 90,
				controls : "bold italic underline | bullets | color | link | pastetext"
			};
			$.extend(true, option1, defaultOption);
			var $switchArea1 = $SwitchEditor.find(".switchArea1").cleditor(option1);
			$switchArea1[0].$frame.contents().find("body").keypress(function(e) {
				e.preventDefault();
			});
			var $switchArea2 = $SwitchEditor.find(".switchArea2").cleditor(option2);
			$SwitchEditor.find(".ps_drag").draggable({
				revert : "invalid", // when not dropped, the item will revert back to its initial position
				helper : "clone",
				appendTo : ".switchEditor"
			});
			$SwitchEditor.find(".ps_widget_content_div").droppable({
				accept : ".ps_drag",
				drop : function(event, ui) {
					var img = ui.draggable.find("img").attr("src");
					$(this).find("img").attr("src", img);
				}
			});
			$SwitchEditor.find(".ps_icon_trash").click(function() {
				$(this).parent().find("img").attr("src", "");
			});
			$SwitchEditor.find(".ps_ok").click(function() {
				$SwitchEditor.find(".ps_widget_content_div img").each(function(index, element) {
					$sender.find('[data-type="AdImage"] img').eq(index).attr('src', $(element).attr('src'));
				});
				$sender.find('[data-type="AdUrl"]').html($switchArea1.getHtml());
				$sender.find('[data-type="AdText"]').html($switchArea2.getHtml());
				closeMask();
			});
			$(sender).delegate('[data-type="AdArea"]', 'click', function() {
				$sender = $(this);
				openMask($SwitchEditor, 500, 497);
				$switchArea1[0].focus();
			});
		}

	}(jQuery));
