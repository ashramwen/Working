/**
 * cledit plug-in
 * @author augustine
 */
( function($) {
		var popupContent = '<input type="radio" name="newtab" value="1" checked/>直接導頁<input type="radio" name="newtab" value="2"/>新開頁面<br /><textarea rows="3" maxlength="300" style="width:235px;resize:none;">http://</textarea><br /><button type="button">確認</button>';

		$.cleditor.buttons.insertlink = {
			name : "insertlink",
			image : "outerlink.png",
			title : "請選擇欲插入連結的文字",
			command : "inserthtml",
			popupName : "insertlink",
			popupClass : "cleditorPrompt",
			popupContent : '<input type="radio" name="newtab" value="1" checked/>直接導頁<input type="radio" name="newtab" value="2"/>新開頁面<br /><textarea rows="3" maxlength="300" style="width:235px;resize:none;">http://</textarea><br /><button type="button">確認</button>',
			buttonClick : insertlinkClick
		};

		function insertlinkClick(e, data) {
			var editor = data.editor;
			var clicktext = editor.selectedText(editor);
			if (clicktext === "") {
				editor.showMessage("請選擇欲插入連結的文字", data.button);
				return false;
			} else {
				// Wire up the submit button click event
				$(data.popup).children(":button").unbind("click").bind("click", function(e) {
					// Get the entered outerlink
					var outerlink = $(data.popup).find("textarea").val();
					$(data.popup).find("textarea").val("");

					// Insert some html into the document
					var html = "";
					if ($(data.popup).find(':radio:last').prop('checked'))
						html = "<a href=\"" + outerlink + "\" target=\"_blank\" >" + clicktext + "</a>";
					else
						html = "<a href=\"" + outerlink + "\" >" + clicktext + "</a>";

					editor.execCommand(data.command, html, null, data.button);

					// Hide the popup and set focus back to the editor
					editor.hidePopups();
					editor.focus();
				});
			}
		}

		//outerlink button
		$.cleditor.buttons.outerlink = {
			name : "outerlink",
			image : "outerlink.png",
			title : "編輯連結",
			command : "inserthtml",
			popupName : "outerlink",
			popupClass : "cleditorPrompt",
			popupContent : '<input type="radio" name="newtab2" value="1" checked/>直接導頁<input type="radio" name="newtab2" value="2"/>新開頁面<br /><textarea rows="3" maxlength="300" style="width:235px;resize:none;">http://</textarea><br /><button type="button">確認</button>',
			buttonClick : outerlinkClick
		};

		function outerlinkClick(e, data) {
			// Get the editor
			var editor = data.editor;
			var editText = $.trim(editor.$frame.contents().find('body').html());
			if (editText.indexOf('[OpenNewPage]') == -1) {
				$(data.popup).find(':radio:first').prop('checked', true);
				$(data.popup).find(':radio:last').prop('checked', false);
			} else {
				$(data.popup).find(':radio:first').prop('checked', false);
				$(data.popup).find(':radio:last').prop('checked', true);
				editText = editText.replace('[OpenNewPage]', '');
			}
			if (editText != '')
				$(data.popup).find("textarea").val(editText);

			// Wire up the submit button click event
			$(data.popup).children("button").unbind("click").bind("click", function(e) {
				// Get the entered linkURL
				var linkURL = $(data.popup).find("textarea").val();
				if ($(data.popup).find(':radio:last').prop('checked'))
					linkURL = "[OpenNewPage]" + linkURL;

				editor.$frame.contents().find('body').html("");
				editor.execCommand(data.command, linkURL, null, data.button);

				//reset
				$(data.popup).find("textarea").val('http://');
				$(data.popup).find(':radio:first').prop('checked', true);
				$(data.popup).find(':radio:last').prop('checked', false);
				// Hide the popup and set focus back to the editor
				editor.hidePopups();
				editor.focus();
			});
		}

		//get cleditor content html
		$.fn.getHtml = function() {
			return this[0].$frame.contents().find("body").html();
		};

		//update cleditor content html
		$.fn.updateHtml = function(html) {
			this[0].$frame.contents().find("body").html($.trim(html).replace(/<!--(.*?)-->/gm, ""));
			//this[0].updateFrame();
		};
	}(jQuery));
