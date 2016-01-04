describe('Handlebars.helpers.ellipsis', function() {

    var tests = [
        { text: '', len: 1, expected: '' },
        { text: 'The quick brown fox', len: 12, expected: 'The quick...' },
        { text: 'This is shorter than the limit', len: 42, expected: 'This is shorter than the limit' },
        { text: 'This is as long as the limit', len: 28, expected: 'This is as long as the limit' }
    ];

    it('should truncate words correctly', function() {
        tests.forEach(function(test) {
            expect(Handlebars.helpers.ellipsis(test.text, test.len)).toEqual(test.expected);
        });
    });

    it('should use the default limit of 100 when none is explicitly passed in', function() {
        var text = 'This text is dependent on the default because we are not going to pass a limit into the function call, which will force it to use the default limit that is defined in the function',
            expected = text.substr(0,97).trim() + '...';

        expect(Handlebars.helpers.ellipsis(text)).toEqual(expected);
    });

});
