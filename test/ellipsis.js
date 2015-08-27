describe('Handlebars.helpers.ellipsis', function() {

    var tests = [
        { text: 'The quick brown fox', len: 12, expected: 'The quick...' }
    ];

    it('should truncate words correctly', function() {
        tests.forEach(function(test) {
            expect(Handlebars.helpers.ellipsis(test.text, test.len)).toEqual(test.expected);
        });
    });
});
