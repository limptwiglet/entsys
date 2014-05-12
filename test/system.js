var expect = require('chai').expect;
var entsys = require('../lib');
var Manager = entsys.Manager;
var System = entsys.System;

describe('Systems', function () {
	var manager;
	var c1 = {name: 'c1'};
	var c2 = {name: 'c2'};
	var c3 = {name: 'c3'};

	beforeEach(function () {
		manager = new Manager();
	});


	it('should be able to add systems to a manager', function () {
		var system = new System();
		manager.addSystem(system);

		expect(manager.systems).to.contain(system);
	});


	it('should add family to system', function () {
		var system = new System({
			components: [c1, c2]
		});
		manager.addSystem(system);

		manager.createEntity().addComponent(c1).addComponent(c2);
		manager.createEntity().addComponent(c2).addComponent(c3);
		manager.createEntity().addComponent(c1).addComponent(c3);

		expect(system.family).to.not.be.undefined;
		expect(system.family).to.have.length(3);
	});
});
