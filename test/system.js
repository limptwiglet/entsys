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
		var s1 = new System({
			components: [c1, c2]
		});
		var s2 = new System({
			components: [c3]
		});

		manager.addSystem(s1);

		var e1 = manager.createEntity().addComponent(c1).addComponent(c2);
		var e2 = manager.createEntity().addComponent(c2).addComponent(c3);
		var e3 = manager.createEntity().addComponent(c1).addComponent(c3);

		manager.addSystem(s2);

		expect(s1.family).to.not.be.undefined;
		expect(s1.family).to.have.length(3);

		expect(s2.family).to.not.be.undefined;
		expect(s2.family).to.have.length(2);

		e2.removeComponent(c3);

		expect(s2.family).to.have.length(1)
	});
});
