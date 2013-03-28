var expect = require('chai').expect;
var sinon = require('sinon');

var Manager = require('../lib/manager');
var System = require('../lib/system');

describe('Entity manager', function () {
    var manager;

    beforeEach(function () {
        manager = new Manager();
    });

    it('should initialize a empty manager', function () {
        expect(manager).to.not.be.undefined;
        expect(manager._ID).to.equal(0);
    });

    it('should have a getComponentRef method for getting a components unique reference', function () {
        var componentRef = 'flanger';
        var component = {
            _name: componentRef
        };

        var ref = manager.getComponentRef(component);

        expect(ref).to.equal(componentRef);
    });

    it('should be able to create a new entity with or without a passed in id', function () {
        var id = 10;
        var entity = manager.createEntity();
        var entity2 = manager.createEntity(id);

        expect(entity._id).to.equal(0);
        expect(entity).to.not.be.undefined;
        expect(entity2).to.not.be.undefined;
        expect(entity2._id).to.equalt(id);
    });

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

    it('should update systems entities when manager calls process method', function () {
        var system = new System();

        manager.add(system);

        manager.process();

        expect(system._entities.length).to.be.greater.than(1);
    });
});
