/**
 * cledit plug-in
 * @author augustine
 */
( function($) {
		//outerlink button
		$.cleditor.buttons.outerlink = {
			name : "outerlink",
			image : "outerlink.png",
			title : "編輯連結",
			command : "inserthtml",
			popupName : "outerlink",
			popupClass : "cleditorPrompt",
			popupContent : '<input type="radio" name="newtab" value="1" checked/>直接導頁<input type="radio" name="newtab" value="2"/>新開頁面<br /><textarea rows="3" maxlength="300" style="width:235px;resize:none;">http://</textarea><br /><button type="button">確認</button>',
			buttonClick : outerlinkClick
		};

		function outerlinkClick(e, data) {
			// Get the editor
			var editor = data.editor;
			var editText = editor.$frame.contents().find('body').html().trim();
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
			this[0].$frame.contents().find("body").html(html.trim().replace(/<!--(.*?)-->/gm, ""));
			//this[0].updateFrame();
		};
	}(jQuery));
