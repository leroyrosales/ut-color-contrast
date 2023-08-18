var EightShapes = EightShapes || {};

EightShapes.CodeSnippet = function() {
    'use strict';
    var $codeSnippet,
        formattedCss = false,
        showInlineStylesAsHex = true;

    function removeInteractionHooksFromMarkup(html) {
        var $markup = $(html).clone();
        $markup = $markup.find(".es-contrast-grid__key-swatch-controls").remove().end();
        $markup = $markup.find(".es-contrast-grid__table--dragtable-initialized").removeClass('es-contrast-grid__table--dragtable-initialized').end();
        $markup = $markup.find(".es-contrast-grid__content--sortable-initialized.ui-sortable").removeClass('es-contrast-grid__content--sortable-initialized ui-sortable').end();
        return $markup.prop('outerHTML');
    }

    function updatePersistentUrl() {
        $(".es-code-snippet__persistent-url").val(window.location.href);
    }

    function convertRgbInlineStylesToHex(string) {
        const rgbRegex = /rgba?\((\d+),\s?(\d+),\s?(\d+)\)/gim;
        let m;

        function replaceWithHex(match, p1, p2, p3) {
            return "#" +
              ("0" + parseInt(p1,10).toString(16)).slice(-2) +
              ("0" + parseInt(p2,10).toString(16)).slice(-2) +
              ("0" + parseInt(p3,10).toString(16)).slice(-2)
        }

        string = string.replace(rgbRegex, replaceWithHex);
        return string;
    }

    function getGridMarkup() {
        var markup = $(".es-contrast-grid").prop('outerHTML');
        if (showInlineStylesAsHex) {
            markup = convertRgbInlineStylesToHex(markup);
        }

        return markup;
    }

    function showCodeSnippetLoading() {
        $(".es-code-snippet").addClass("es-code-snippet--loading");
    }

    function hideCodeSnippetLoading() {
        $(".es-code-snippet").removeClass("es-code-snippet--loading");
    }

    function updateContent(e) {
        updatePersistentUrl();
        showCodeSnippetLoading();

        setTimeout(function(){
            var content = getGridMarkup();
            content = removeInteractionHooksFromMarkup(content);
            $codeSnippet = $(".es-code-snippet code");

            var html = html_beautify(content, {preserve_newlines: false});
            $codeSnippet.html(html);
            hideCodeSnippetLoading();
        }, 50);
    }

    function setEventHandlers() {
        var clipboard = new Clipboard('.es-code-snippet__copy-button');
        clipboard.on('success', function(e) {
            $(e.trigger).removeClass("es-code-snippet__copy-button--clicked");
            $(e.trigger).prop('offsetHeight');
            $(e.trigger).addClass("es-code-snippet__copy-button--clicked").find(".es-code-snippet__copy-response").text('Copied!');
            e.clearSelection();
        });

        clipboard.on('error', function(e) {
            $(e.trigger).removeClass("es-code-snippet__copy-button--clicked");
            $(e.trigger).prop('offsetHeight');
            $(e.trigger).addClass("es-code-snippet__copy-button--clicked").find(".es-code-snippet__copy-response").text('Press Ctrl + C to copy');
        });

        $("body").on("click", ".es-code-snippet__copy-button", function(e){
            e.preventDefault();
        });

        $(document).on("escg.show-tab-es-tabs__global-panel--copy-code", updateContent)

        // $(document).on("escg.contrastGridUpdated", updateContent);
    }

    var initialize = function initialize() {
        $codeSnippet = $(".es-code-snippet");
        setEventHandlers();
    };

    var public_vars = {
        'initialize': initialize
    };

    return public_vars;
}();
