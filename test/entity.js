var expect = require('chai').expect;
var Manager = require('../lib/manager');

describe('Entity', function () {
	var manager;
	var entity;
	var c1 = {
		name: 'c1',
		date: {}
	};

	beforeEach(function () {
		manager = new Manager();
		entity = manager.createEntity();
	});

	it('should be able to add components via entity', function () {
		var me = manager.get(entity._id);
		entity.addComponent(c1);
		expect(me).to.have.keys(c1.name);
	});

	it('should be able to remove components via entity', function () {
		var me = manager.get(entity._id);
		entity.addComponent(c1);
		entity.removeComponent(c1);
		expect(me).to.not.have.keys(c1.name);
	});
});
