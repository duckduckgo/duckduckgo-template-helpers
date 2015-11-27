describe('Handlebars.helpers.loader', function() {

    var getExpectedDiv = function(color, size) {
            return '<div class="loader" style="background-image:url(\'/assets/loader/' + color + size + '.png\');"></div>';
        },

        setup = function(bgColor, isDark, size) {
            window.DDG = {
                is3x: size === '3x' ? true : false,
                is2x:  size === '2x' ? true : false,
                settings: {
                    get: function() {
                        return bgColor;
                    }
                }
            };

            window.tinycolor = function(){
                return {
                    isValid: function(){ return true; },
                    toHsl: function(){
                        return {
                            l: isDark ? 0 : 1
                        };
                    }
                }
            };
        };

    describe('light background color + 1x', function() {
        beforeEach(function() {
            setup('#fff', false, '1x');
        });

        it('should return a div string with the right background image sprite', function() {
            expect(Handlebars.helpers.loader()).toEqual(getExpectedDiv('black','x1'));
        });
    });

    describe('dark background color + 1x', function() {
        beforeEach(function() {
            setup('#333', true, '1x');
        });

        it('should return a div string with the right background image sprite', function() {
            expect(Handlebars.helpers.loader()).toEqual(getExpectedDiv('white','x1'));
        });
    });

    describe('light background color + 2x', function() {
        beforeEach(function() {
            setup('#fff', false, '2x');
        });

        it('should return a div string with the right background image sprite', function() {
            expect(Handlebars.helpers.loader()).toEqual(getExpectedDiv('black','x2'));
        });
    });

    describe('dark background color + 3x', function() {
        beforeEach(function() {
            setup('#222', true, '3x');
        });

        it('should return a div string with the right background image sprite', function() {
            expect(Handlebars.helpers.loader()).toEqual(getExpectedDiv('white','x3'));
        });
    });
});
