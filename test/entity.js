var expect = require('chai').expect;
var sinon = require('sinon');

var Entity = require('../lib/entity');

describe('Entity', function () {
    it('should have a addComponent method that calls its manager addComponent method', function () {
        var component = 'component';
        var spy = sinon.spy();
        var manager = {
            addComponent: spy
        };

        var entity = new Entity(manager);
        entity.addComponent(component);
        expect(spy.callCount).to.equal(1);
        expect(spy.args[0][1]).to.equal(component);
    });

    it('should have a getComponent method that it delegates to its manager', function () {
        var component = 'component';
        var spy = sinon.spy();
        var manager = {
            getComponent: spy
        };

        var entity = new Entity(manager);
        entity.getComponent(component);
        expect(spy.callCount).to.equal(1);
        expect(spy.args[0][1]).to.equal(component);
    });
});

