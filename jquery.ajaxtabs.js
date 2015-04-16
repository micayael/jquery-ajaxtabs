(function($) {
    $.ajaxtabs = function(selector) {

        var tabs = $(selector);

        tabs.ajaxtabs();

        if ($.fn.ajaxtabs.defaults.autoOpenFromUrl && tabs.length) {
            if (window.location.hash.length > 1) {
                tabs.find('a[data-target="#' + window.location.hash.substring(1) + '"]').click();
            }
        }
    };

    $.fn.ajaxtabs = function(options) {

        var settings = $.extend($.fn.ajaxtabs.defaults, options);

        return this.each(function() {
            var $this = $(this);

            console.log(this);

            var tabLinks = $this.find(settings.tabLinksSelector);
            var defaultTabLink = $this.find(settings.defaultTabLinksSelector);

            if (!tabLinks.length)
                return;

            defaultTabLink.on('click.postAjaxTabRender', function() {
                $(this).tab('show');

                if (settings.useUrlFragments) {
                    $.fn.ajaxtabs.removeUrlHash();
                }
            });

            tabLinks.ajaxlinks({
                effect: false,
                removeAfterSuccess: settings.removeAfterSuccess,
                clickNamespace: 'preAjaxTabRender',
                afterRender: function(data, target, el) {
                    el.attr('data-loaded', 'true');
                    el.tab('show');

                    if (settings.useUrlFragments) {
                        $.fn.ajaxtabs.changeUrlHash(target);
                    }

                    el.on('click.postAjaxTabRender', function() {
                        if (settings.useUrlFragments) {
                            $.fn.ajaxtabs.changeUrlHash(target);
                        }
                    });

                    if (settings.bindNewAjaxLinks) {
                        settings.bindNewAjaxLinks(settings.bindNewAjaxLinksOptions);
                    }

                    settings.afterOpenTab(data, target, el);
                },
                fail: function(jqXHR, textStatus) {
                    if (settings.fail) {
                        settings.fail(jqXHR, textStatus);
                    } else {
                        alert('Request failed: ' + textStatus);
                    }
                }
            });
        });
    };

    $.fn.ajaxtabs.bindNewAjaxLinks = function(options) {
        $(options.selector).ajaxlinks({
            clickNamespace: 'postAjaxTabOpen'
        });
    };

    $.fn.ajaxtabs.defaults = {
        tabLinksSelector: 'li[role=presentation] a:not([data-loaded=true])',
        defaultTabLinksSelector: 'li[role=presentation].active a',
        useUrlFragments: true,
        autoOpenFromUrl: true,
        removeAfterSuccess: true,
        bindNewAjaxLinks: $.fn.ajaxtabs.bindNewAjaxLinks,
        bindNewAjaxLinksOptions: {
            selector: 'a.ajax-call'
        },
        afterOpenTab: function(data, target, el) {}
    };

    $.fn.ajaxtabs.changeUrlHash = function(hash) {

        if (hash && hash.substring(0, 1) == '#') {
            hash = hash.substring(1);
        }

        if (history.pushState) {
            history.pushState(null, null, '#' + hash);
        } else {
            location.hash = hash;
        }
    };

    $.fn.ajaxtabs.removeUrlHash = function() {
        if (history.pushState) {
            history.pushState('', document.title, window.location.pathname + window.location.search);
        } else {
            location.hash = '';
        }
    };
}(jQuery));
