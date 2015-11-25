describe('Handlebars.helpers.loader', function() {

    it('should return a div', function() {
        var expected = '<div class="loader" style="background-image:url(\'/assets/loader/blackx1.png\');"></div>';
        expect(Handlebars.helpers.loader('black')).toEqual(expected);
    });

});
