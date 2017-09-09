// ==UserScript==
// @name	Shutterfly Copy Paste Users
// @namespace	http://github.com/kruton
// @version	0.1
// @description	Make it easy to copy and paste users on Shutterfly sites
// @author	Kenny Root <kenny@the-b.org>
// @match	https://*.shutterfly.com/contacts
// @require	https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.js
// @grant	none
// @run-at	document-end
// @downloadURL	https://github.com/kruton/userscripts/raw/master/shutterfly-copy-paste-users.user.js
// @updateURL	https://github.com/kruton/userscripts/raw/master/shutterfly-copy-paste-users.user.js
// ==/UserScript==

(function() {
    'use strict';

    $(document.body).prepend('<div style="margin: 0 auto 0 auto; ' +
    'border-bottom: 1px solid #000000; margin-bottom: 5px; ' +
    'font-size: small; background-color: #000000; ' +
    'color: #ffffff; position: fixed; top: 0; z-index: 102">'+
                             '<textarea id="paste-contents" /><br/><button id="pasteButton" type="button">Paste</button>'+
    '<p id="error-text" style="color: #FF0000"></p></div>');
    $(".roster-header-message").append('<br /><button id="copyButton" type="button">Copy</button><br /><textarea id="copy-contents" />');

    $("#copyButton").click(function(ev) {
        var data = "";
        $('.siteroster').each(function(i1) {
            var name = $.trim($(this).find('.roster-name').first().text());
            var first = name.substr(0,name.indexOf(' '));
            var last = name.substr(name.indexOf(' ')+1);
            data += first + "," + last + ",";
            data += $.trim($(this).find('.roster-phone').first().text()) + ",";

            data += $.trim($(this).find('.p1-name').first().text()) + ",";
            data += $.trim($(this).find('.p1-email').first().text()) + ",";

            data += $.trim($(this).find('.p2-name').first().text()) + ",";
            data += $.trim($(this).find('.p2-email').first().text());
            data += "\n";
        });

        $("#copy-contents").val(data);
    });

    $('#pasteButton').click(function(ev) {
        var data = $('#paste-contents').val();

        var lines = data.split('\n');

        if (!$('#ba-form').length) {
            $('#error-text').text('Open batch add form first!');
            console.log("Can't find form!");
            return;
        }
        $('#error-text').text('');

        while ($("#ba-form").find('.ba-row').length < lines.length) {
            console.log("clicking add more since rows " + $("#ba-form").find('#ba-row').length + " and " + lines.length);
            $('#ba-addMore').find('a').trigger('click');
        }

        var rows = $('#ba-form').find('.ba-row');
        console.log("Now I have " + rows.length + " rows");

        $.each(lines, function(i) {
            console.log("Row " + i);

            var parts = lines[i].split(",");
            if (parts.length != 7) {
                console.log("line is broken: " + lines[i]);
                return;
            }

            $(rows.get(i)).find("input[name='firstName']").first().val(parts[0]);
            $(rows.get(i)).find("input[name='lastName']").first().val(parts[1]);
            $(rows.get(i)).find("input[name='phone']").first().val(parts[2]);
            $(rows.get(i)).find("input[name='parent1.name']").first().val(parts[3]);
            $(rows.get(i)).find("input[name='parent1.email']").first().val(parts[4]);
            $(rows.get(i)).find("input[name='parent2.name']").first().val(parts[5]);
            $(rows.get(i)).find("input[name='parent2.email']").first().val(parts[6]);
        });
    });
})();
