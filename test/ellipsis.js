describe('Handlebars.helpers.ellipsis', function() {

    var tests = [
        { text: '', len: 1, expected: '' },
        { text: 'The quick brown fox', len: 12, expected: 'The quick...' },
        { text: 'This is shorter than the limit', len: 42, expected: 'This is shorter than the limit' },
        { text: 'This is as long as the limit', len: 28, expected: 'This is as long as the limit' },
    ];

    it('should truncate words correctly', function() {
        tests.forEach(function(test) {
            expect(Handlebars.helpers.ellipsis(test.text, test.len)).toEqual(test.expected);
        });
    });
});
