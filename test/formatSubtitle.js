describe('Handlebars.helpers.formatSubtitle', function() {
    it('should return %nbsp for falsy value', function() {
        spyOn(DDG, 'exec_template');
        expect(Handlebars.helpers.formatSubtitle()).toEqual("&nbsp;");
        expect(DDG.exec_template).not.toHaveBeenCalled();
    });

    it('should return call to subtitle template for a single component value', function() {
        spyOn(DDG, 'exec_template').and.returnValue('bar');
        expect(Handlebars.helpers.formatSubtitle('foo')).toEqual('bar');
        expect(DDG.exec_template).toHaveBeenCalledWith('subtitle', { components: ['foo'] });
    });
    
    it('should return call subtitle template for an array of component values', function() {
        spyOn(DDG, 'exec_template').and.returnValue('bar');
        expect(Handlebars.helpers.formatSubtitle([1, 2, 3])).toEqual('bar');
        expect(DDG.exec_template).toHaveBeenCalledWith('subtitle', { components: [1, 2, 3] });
    });
});
