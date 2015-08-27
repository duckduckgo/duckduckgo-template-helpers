describe('Handlebars.helpers.formatSubtitle', function() {

    var tests = [
        { input: 'test', output: 'test' },
        { input: ['test', 'test'], output: 'test<span class="sep"></span>test' },
        { input: {
              href: 'http://duckduckgo.com',
              className: 'link--test',
              text: 'Hi I am a link'
          },
          output: '<a href="http://duckduckgo.com" class="link--test">Hi I am a link</a>'
        },
        { input: [
              { href: 'http://yahoo.com', text: 'Yahoo' },
              { href: 'http://nytimes.com', text: 'NYT' },
              'Plain Text'
          ],
          output: '<a href="http://yahoo.com">Yahoo</a><span class="sep"></span><a href="http://nytimes.com">NYT</a><span class="sep"></span>Plain Text'
        }
    ];

    it('should return the correct value', function() {
        tests.forEach(function(test) {
            expect(Handlebars.helpers.formatSubtitle(test.input)).toEqual(test.output);
        });
    });

});
