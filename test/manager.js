var expect = require('chai').expect;
var Manager = require('../lib/manager');

describe('Manager', function () {
	var manager;

	beforeEach(function () {
		manager = new Manager();
	});


	it('should initalize correctly', function () {
		expect(manager.entities).to.be.empty;
	});


	it('should create incremental ids', function () {
		expect(manager._getId()).to.equal(0);
		expect(manager._getId()).to.equal(1);
	});


	it('should add an entity to the entities map when calling createEntity', function () {
		manager.createEntity();
		expect(manager.entities).to.not.be.empty;
	});


	it('should return the entity object when calling get', function () {
		var entity =  manager.createEntity();
		expect(manager.get(entity._id)).to.be.defined;
	});


	it('should return a components reference when calling _getComponentRef', function () {
		var name = 'testcomp';
		expect(manager._getComponentRef({name: name})).to.equal(name);
	});


	it('should add a component to an entity object', function () {
		var component = {
			name: 'component',
			data: {
				test: 'test'
			}
		};

		var entity = manager.createEntity();
		manager.addComponent(entity._id, component);

		expect(manager.entities[entity._id]).to.include.keys(component.name);
	});


	it('should merge data for an existing component with new data', function () {
		var compName = 'component';
		var component = {
			name: compName,
			data: {
				a: 'test',
				b: 'test'
			}
		};
		var component2 = {
			name: compName,
			data: {
				a: 'test2'
			}
		};

		var entity = manager.createEntity();
		manager.addComponent(entity._id, component);
		manager.addComponent(entity._id, component2);

		var comp = manager.get(entity._id)[compName];

		expect(comp).to.have.property('a', 'test2');
		expect(comp).to.have.property('b', 'test');
	});


	it('should return a family or create a new one when calling getFamily', function () {
		var family = 'component';
		manager.getFamily(family);
		expect(manager.families[family]).to.exist;
		expect(manager.getFamily(family)).to.exist;

		var comp1 = 'component';
		var comp2 = 'component2';
		var ref = manager._getFamilyReference([comp1, comp2]);
		manager.getFamily(comp1, comp2);
		expect(manager.families[ref]).to.exist;
	});


	describe('adding/removing components', function () {
		var c1 = {
			name: 'c1',
			data: {
				testFamily: 'test'
			}
		};
		var c2 = {
			name: 'c2',
			data: {
				test: 'test'
			}
		};

		it('should add entity to correct family when adding components', function () {
			var f1 = manager.getFamily(c1, c2);
			var f2 = manager.getFamily(c2);

			var entity = manager.createEntity();
			manager.addComponent(entity._id, c1);
			manager.addComponent(entity._id, c2);

			expect(f1).to.not.be.empty;
			expect(f1).to.contain(manager.entities[entity._id]);

			expect(f2).to.not.be.empty;
			expect(f2).to.contain(manager.entities[entity._id]);
		});


		it('should not add entity to family if it alreayd exists', function () {
			var f1 = manager.getFamily(c1, c2);

			var entity = manager.createEntity();
			entity.addComponent(c1);

			expect(f1).to.contain(manager.entities[entity._id]);

			entity.addComponent({name: 'c1', data: {boom: 'bang'}});

			expect(f1).to.have.length(1);
		});


		it('should update component entity map', function () {
			var entMap = manager.componentEntityMap;
			var e1 = manager.createEntity().addComponent(c1).addComponent(c2);
			var e2 = manager.createEntity().addComponent(c2).addComponent(c1);

			expect(entMap).to.have.keys(c1.name, c2.name);
			expect(entMap[c1.name]).to.contain(e1._id, e2._id);
			expect(entMap[c2.name]).to.contain(e1._id, e2._id);

			e1.removeComponent(c1);
			e2.removeComponent(c1);

			expect(entMap[c1.name]).to.not.contain(e1._id);
			expect(entMap[c1.name]).to.not.contain(e2._id);
		});


		it('should add entities to families when they are created', function () {
			var entity = manager.createEntity();
			manager.addComponent(entity._id, c1);
			manager.addComponent(entity._id, c2);

			var f1 = manager.getFamily(c1, c2);
			var f2 = manager.getFamily(c2);

			expect(f1).to.not.be.empty;
			expect(f1).to.contain(manager.entities[entity._id]);

			expect(f2).to.not.be.empty;
			expect(f2).to.contain(manager.entities[entity._id]);
		});


		it('should remove entity from families when removing components', function () {

			var ref1 = manager._getFamilyReference([c1]);
			var ref2 = manager._getFamilyReference([c2]);

			var f1 = manager.getFamily(c1);
			var f2 = manager.getFamily(c2);

			var entity = manager.createEntity();
			manager.addComponent(entity._id, c1);
			manager.addComponent(entity._id, c2);
			manager.removeComponent(entity._id, c1);

			expect(manager.get(entity._id)).to.not.contain.keys(ref1);
			expect(f1).to.be.empty;
		});
	});
});
