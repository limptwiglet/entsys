var expect = require('chai').expect;
var sinon = require('sinon');

var Manager = require('../lib/manager');
var System = require('../lib/system');

describe('manager', function () {
    var manager;

    beforeEach(function () {
        manager = new Manager();
    });

    it('should initialize a empty manager', function () {
        expect(manager).to.not.be.undefined;
        expect(manager._ID).to.equal(0);
    });

    describe('systems', function () {
        it('should be able to add systems', function () {
            expect(manager._systems).to.have.length(0);

            manager.add(new System(), new System());

            expect(manager._systems).to.have.length(2);
        });

        it('should call process on each system when process is called on manager', function () {
            var system = new System();
            var system2 = new System();
            var spy = system2.process = system.process = sinon.spy();

            manager.add(system, system2);
            manager.process();

            expect(spy.callCount).to.equal(2);
        });
    });
});
