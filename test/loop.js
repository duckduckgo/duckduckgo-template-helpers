describe("Handlebars.helpers.loop", function () {
    var block;
    beforeEach(function () {
        block = {
            fn: function () {
                return "";
            }
        };

        spyOn(block, "fn");
    });
    it("should run the loops the stated number of times", function() {
        Handlebars.helpers.loop(15, block);

        expect(block.fn.calls.count()).toEqual(15);
    });
    it("should max out at 100", function() {
        Handlebars.helpers.loop(115, block);

        expect(block.fn.calls.count()).toEqual(100);
    });
});
