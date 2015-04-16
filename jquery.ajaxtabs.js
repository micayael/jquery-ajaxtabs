(function($) {
    $.fn.ajaxtabs = function(options) {

        var settings = $.extend($.fn.ajaxtabs.defaults, options);

        this.each(function() {
            var $this = $(this);

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

        if (settings.autoOpenFromUrl && this.length) {
            if (window.location.hash.length > 1) {
                this.find('a[data-target="#' + window.location.hash.substring(1) + '"]').click();
            }
        }

        return this;
    };

    $.fn.ajaxtabs.bindNewAjaxLinks = function(options) {
        // agrega el evento click en el namespace default para que desde afuera
        // se eliminen nuevamente en caso de volverse a llamar al plugin ajaxlinks.
        $(options.selector).ajaxlinks();
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
