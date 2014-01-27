/**
 * WYSIWYG Post & See Editor v1.0
 *
 * @author augustine
 *
 * Date: 2014/01/13
 */
String.format = function() {
	if (arguments.length == 0)
		return null;
	var str = arguments[0];
	for (var i = 1; i < arguments.length; i++) {
		var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
		str = str.replace(re, arguments[i]);
	}
	return str;
}; ( function($) {
		var PSEditor = function(element1, options) {
			var $sender;
			var imgIndex = 0;
			var imgArray = {};
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
			var settings = $.extend({
				getImgUrl : ''
			}, options);

			var plugin = this;
			this.publicMethod = function() {
				console.log('public method called!');
			};
			plugin.GetElement = function() {
				return "text";
			};

			function initPSEditor(sender, getImgUrl) {
				if ($("#PSEditor").length == 0) {
					var src = "";
					if ($('script[src$="jquery.pseditor.min.js"]:first').length > 0)
						src = $('script[src$="jquery.pseditor.min.js"]:first').attr("src").replace("jquery.pseditor.min.js", "pseditor.html");
					else if ($('script[src$="jquery.pseditor.js"]:first').length > 0)
						src = $('script[src$="jquery.pseditor.js"]:first').attr("src").replace("jquery.pseditor.js", "pseditor.html");
					$.when($.get(src), $.get(getImgUrl)).then(function(ajax1, ajax2) {
						var editorHtml = ajax1[0];
						var imgJson = JSON.parse(ajax2[0]);
						var i = 0;
						var imgs = new Array();
						for (var img in imgJson) {
							imgs[i++] = imgJson[img];
						}
						generateImg(imgs);
						$('body').append(editorHtml);
						initEditors(sender);
					});
				} else
					initEditors(sender);
			}

			function generateImg(imgs) {
				var thumbPattern = '<div><img src="{0}" data-src="{1}" /></div>';
				var imgPattern = '<div><img src="{0}" /></div>';
				for (var i = 0; i < imgs[0].length; i++) {
					imgs[0][i] = String.format(thumbPattern, imgs[0][i], imgs[1][i]);
					imgs[1][i] = String.format(imgPattern, imgs[1][i]);
				}
				imgArray.thumb = imgs[0].join("");
				imgArray.original = imgs[1].join("");
			}

			function initEditors(sender) {
				//TextEditor & TextImageEditor
				initTextImageEditor(sender);
				//ImgSelector
				initImgSelector(sender);
				//MovieEditor
				initMovieEditor(sender);
				//SwitchEditor
				initSwitchEditor(sender);
				//BannerEditor
				initBannerEditor(sender);
				//cancel click
				$("#PSEditor .ps_cnl").click(closeMask);
				//Gallery Move
				galleryMove();
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

			//Gallery Move
			function galleryMove() {
				var imgW = "74";
				var imgMax = 6;
				$("#PSEditor .ps_content .ps_picL").click(function() {
					var $divGallery = $(this).parent(".ps_content").find(".ps_divGallery");
					var imgLength = $divGallery.find(".ps_gallery").length - imgMax;
					if (imgIndex == 0)
						return;
					imgIndex--;
					$divGallery.animate({
						left : "+=" + imgW
					}, '200');
				});
				$("#PSEditor .ps_content .ps_picR").click(function() {
					var $divGallery = $(this).parent(".ps_content").find(".ps_divGallery");
					var imgLength = $divGallery.find(".ps_gallery").length - imgMax;
					if (imgLength <= 0 || imgIndex == imgLength)
						return;
					imgIndex++;
					$divGallery.animate({
						left : "-=" + imgW
					}, '200');
				});
			}

			//TextEditor & TextImageEditor
			function initTextImageEditor(sender) {
				var $textEditor = $("#PSEditor .textEditor");
				$textEditor.find(".ps_divGallery").append($(imgArray.original).addClass("ps_gallery"));
				var option = {
					width : 428,
					height : 297,
					controls : "bold italic underline | bullets | color | insertlink unlink | pastetext"
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
				var $ImgSelector = $('#PSEditor .imgSelector');
				$ImgSelector.find(".ps_album").append($(imgArray.thumb).find("img").addClass("albumimg ps_size80"));
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
				$SwitchEditor.find(".ps_divGallery").append($(imgArray.thumb).addClass("ps_gallery ps_drag"));
				var a = 1;
				var option1 = {
					width : 315,
					height : 90,
					controls : "outerlink"
				};
				var option2 = {
					width : 315,
					height : 90,
					controls : "bold italic underline | bullets | color | insertlink unlink | pastetext"
				};
				$.extend(true, option1, defaultOption);
				var $switchArea1 = $SwitchEditor.find(".switchArea1").cleditor(option1);
				$switchArea1[0].$frame.contents().find("body").keypress(function(e) {
					e.preventDefault();
				});
				$switchArea1[0].focus();
				$.extend(true, option2, defaultOption);
				var $switchArea2 = $SwitchEditor.find(".switchArea2").cleditor(option2);
				$SwitchEditor.find(".ps_drag").draggable({
					revert : "invalid", // when not dropped, the item will revert back to its initial position
					helper : "clone",
					appendTo : ".switchEditor"
				});
				$SwitchEditor.find(".ps_widget_content_div").droppable({
					accept : ".ps_drag",
					drop : function(event, ui) {
						var img = ui.draggable.find("img").data("src");
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
					$sender.find('[data-type="AdImage"] img').each(function(index, element) {
						$SwitchEditor.find(".ps_widget_content_div img").eq(index).attr('src', $(element).attr('src'));
					});
					$switchArea1.updateHtml($sender.find('[data-type="AdUrl"]').html());
					$switchArea2.updateHtml($sender.find('[data-type="AdText"]').html());
					openMask($SwitchEditor, 500, 479);
				});
			}

			function initBannerEditor(sender) {
				var $BannerEditor = $('#PSEditor .bannerEditor');
				$BannerEditor.find(".ps_divGallery").append($(imgArray.thumb).addClass("ps_gallery ps_drag"));
				var option1 = {
					width : 315,
					height : 90,
					controls : "outerlink"
				};
				$.extend(true, option1, defaultOption);
				var switchArea = new Array();
				$BannerEditor.find("textarea").each(function(index) {
					var editor = $(this).cleditor(option1);
					editor.focus();
					editor[0].$frame.contents().find("body").keypress(function(e) {
						e.preventDefault();
					});
					switchArea[index] = editor;
				});
				$BannerEditor.find(".ps_drag").draggable({
					revert : "invalid", // when not dropped, the item will revert back to its initial position
					helper : "clone",
					appendTo : ".bannerEditor"
				});
				$BannerEditor.find(".ps_widget_content_div").droppable({
					accept : ".ps_drag",
					drop : function(event, ui) {
						var img = ui.draggable.find("img").data("src");
						$(this).find("img").attr("src", img);
					}
				});
				$BannerEditor.find(".ps_icon_trash").click(function() {
					$(this).parent().find("img").attr("src", "");
				});
				$BannerEditor.find(".ps_ok").click(function() {
					$BannerEditor.find(".ps_divSwitch").each(function(index, element) {
						$sender.find('[data-type="BannerImage"] img').eq(index).attr('src', $(element).find("img").attr('src'));
						$sender.find('[data-type="BannerUrl"]').eq(index).html(switchArea[index].getHtml());
					});
					closeMask();
				});
				$(sender).delegate('[data-type="BannerArea"]', 'click', function() {
					$sender = $(this);
					$.each(switchArea, function(index, element) {
						$BannerEditor.find(".ps_widget_content_div img").eq(index).attr('src', $sender.find('[data-type="BannerImage"] img').eq(index).attr('src'));
						element.updateHtml($sender.find('[data-type="BannerUrl"]').eq(index).html());
					});
					openMask($BannerEditor, 500, 642);
				});
			};( function init() {
					if (settings.getImgUrl == '')
						throw 'The option [getImgUrl] is required.';
					initPSEditor(element1, settings.getImgUrl);
				}());
		};

		$.fn.PSEditor = function(options) {
			var o = this.each(function() {
				if (undefined == $(this).data('PSEditor')) {
					var plugin = new PSEditor(this, options);
					$(this).data('PSEditor', plugin);
				}
			});
			return new Editor(o);
		};

		var Editor = function(div) {
			function getElement(element) {
				var $self = $(element);
				var data = new Element();
				data.Name = $self.attr('data-element');
				data.Type = $self.attr('data-type');
				switch($self.attr('data-type')) {
					case "AdImage":
					case "BannerImage":
					case "Image":
						data.Value = $self.find("img").attr("src");
						break;
					case "Movie":
						if ($self.find("iframe").length > 0)
							data.Value = $self.find("iframe").attr("src");
						break;
					default:
						data.Value = $.trim($self.html()).replace(/<!--(.*?)-->/gm, "");
						break;
				}
				return data;
			}

			function getData(element) {
				var $self = $(element);
				var elements = new Array();
				$self.find('[data-element]').each(function() {
					elements.push(getElement(this));
				});
				return elements;
			}


			this.Get = function(index) {
				try {
					return getData(div[index]);
				} catch(err) {
					throw err;
				}
			};
			this.GetAll = function() {
				var editors = new Array();
				try {
					$.each(div, function(i, item) {
						editors.push(getData(item));
					});
					return editors;
				} catch(err) {
					throw err;
				}
			};
		};

		var Element = function() {
			this.Name = "";
			this.Type = "";
			this.Value = "";
		};
	}(jQuery));

