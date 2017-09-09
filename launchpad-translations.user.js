// ==UserScript==
// @name	Launchpad Translations Helper
// @description	Helps import launchpad changes to the right template and language.
// @namespace	https://github.com/kruton
// @version	0.1
// @author	Kenny Root <kenny@the-b.org>
// @match	https://translations.launchpad.net/+imports/*
// @grant	none
// @downloadURL	https://raw.github.com/kruton/userscripts/master/launchpad-translations.user.js
// @updateURL	https://raw.github.com/kruton/userscripts/master/launchpad-translations.user.js
// ==/UserScript==

(function() {
    'use strict';

    LPJS.use('node', 'lp.translations.importqueueentry',
             function(Y) {
        Y.on('domready', function() {
            var path = Y.one(Y.DOM.byId('field.path'));
            var template = Y.one(Y.DOM.byId('field.potemplate'));
            var language = Y.one(Y.DOM.byId('field.language'));

            console.log('Trying to auto-select template based on path...');

            var path_template_lang = path.get('value').match(/\/([^-\/]*)-([A-Za-z_]*)\.po$/);
            if (path_template_lang) {
                console.log("Looking for template=" + path_template_lang[1] + " lang=" + path_template_lang[2]);

                template.get('options').each(function(n) {
                    if (n.get('text') == path_template_lang[1]) {
                        template.set('value', n.get('value'));
                    }
                });

                language.get('options').each(function(n) {
                    var found = n.get('text').match(/^.* \(([A-Za-z_@]*)\)$/);
                    if (found) {
                        if (found[1] == path_template_lang[2]) {
                            language.set('value', n.get('value'));
                        }
                    }
                });
            }
        });
    });
})();
