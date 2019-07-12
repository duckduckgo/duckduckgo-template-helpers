describe('Handlebars.helpers.favicon', function() {
    xit ('should create a synchronous img tag', function() {
        // currently fails, DDG.services.getUrl is undefined
        var expectedTag = '<img width="16" height="16" class="zci__more-at__icon" src="favicon.ico" />';

        expect(Handlebars.helpers.favicon('favicon.ico')).toEqual(expectedTag);
    });

    xit('should create a lazy-load image tag', function() {
        // currently fails, DDG.services.getUrl is undefined
        var expectedTag = '<img width="16" height="16" class="zci__more-at__icon js-lazyload" data-src="favicon.ico" />';
        var options = {
            hash: { lazyload: true }
        };

        expect(Handlebars.helpers.favicon('favicon.ico', options)).toEqual(expectedTag);
    });

    it('should create a tag with no src', function() {
        var expectedTag = '<img width="16" height="16" class="zci__more-at__icon" src="data:," />';
        var undefinedUrl = void(0);

        expect(Handlebars.helpers.favicon(undefinedUrl)).toEqual(expectedTag);
    });
});
