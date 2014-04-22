var expect = require('chai').expect;
var sinon = require('sinon');

var Manager = require('../lib/manager');
var System = require('../lib/system');
var Component = require('../lib/component');

describe('Entity manager', function () {
    var manager;

    beforeEach(function () {
        manager = new Manager();
    });

    describe('initalization', function () {
		it('should initialize a empty manager', function () {
			expect(manager).to.not.be.undefined;
			expect(manager._ID).to.equal(0);
		});
    });

    describe('_generateId', function () {
		it('should have a generateId method for creating unique ids', function () {
			var id = manager._generateId();

			expect(id).to.equal(0);
			expect(manager._ID).to.equal(1);
		});
    });

    describe('getComponentRef', function () {
		it('should have a getComponentRef method for getting a components unique reference', function () {
			var componentRef = 'flanger';
			var component = {
				_name: componentRef
			};

			var ref = manager.getComponentRef(component);

			expect(ref).to.equal(componentRef);
		});
    });

    describe('getFamilyRef', function () {
		it('should have a getFamilyRef method for returning components family name', function () {
			var components = [
				{
					_name: 'b'
				},
				{
					_name: 'g'
				},
				{
					_name: '1'
				},
				{
					_name: '0'
				}
			];
			var exp = '0-1-b-g';

			var res = manager._getFamilyRef.apply(manager, components);
			expect(res).to.equal(exp);
		});
    });


    it('should have a createFamily method for creating new entity component families', function () {
        var components = [
            {
                _name: 'test'
            },
            {
                _name: 'test2'
            }
        ];
        var familyName = manager._getFamilyRef.apply(manager, components);
        var family = manager.createFamily.apply(manager, components);

        expect(manager._families[familyName]).to.not.be.undefined;
        expect(manager._componentFamilyMap['test']).to.contain(familyName);
        expect(manager._componentFamilyMap['test2']).to.contain(familyName);
    });

    it('should be able to create a new entity with or without a passed in id', function () {
        var entity = manager.createEntity();
        expect(entity._id).to.equal(0);
        expect(entity).to.not.be.undefined;

        var id = 10;
        var entity2 = manager.createEntity(id);
        expect(entity2).to.not.be.undefined;
        expect(entity2._id).to.equal(id);
    });

    describe('add component', function () {
        it('should be able to add a component to an entity', function () {
            var component = new Component();
            var component2 = new Component();
            component2._name = 'component2';

            var entity = manager.createEntity();
            entity.addComponent(component);
            entity.addComponent(component2);

            expect(manager._entityMap[entity._id][manager.getComponentRef(component)]).to.not.be.undefined;
            expect(manager._entityMap[entity._id][manager.getComponentRef(component2)]).to.not.be.undefined;
        });

        it('should add entity to family when adding component that matches families', function () {
			var entity = manager.createEntity();
			var comp = {_name: 'comp'};
			entity.addComponent(comp);

			var family1 = manager.createFamily(comp);

			expect(family1).to.include.keys(entity._id);
        });
    });

    describe('remove component', function () {
		it('should be able to remove a component from an entity', function () {
			var component = new Component();
			component._name = 'component2';

			var entity = manager.createEntity();
			entity.addComponent(component);

			expect(manager._entityMap[entity._id][manager.getComponentRef(component)]).to.not.be.undefined;

			entity.removeComponent(component._name);

			expect(manager._entityMap[entity._id][manager.getComponentRef(component)]).to.be.undefined;
		});
    });

	describe('add systems and components', function () {
		it('should be able to add systems', function () {
			expect(manager._systems).to.have.length(0);

			manager.add(new System(), new System());

			expect(manager._systems).to.have.length(2);
		});
	});

	describe('process', function () {
		it('should call process on each system when process is called on manager', function () {
			var system = new System();
			var system2 = new System();
			var spy = system2.process = system.process = sinon.spy();

			manager.add(system, system2);
			manager.process();

			expect(spy.callCount).to.equal(2);
		});

		it('should pass correct family to system when calling process method', function () {
			var system = new System();
			var spy = system.process = sinon.spy();

			manager.add(system);
			manager.process();

			expect(spy.called).to.have.be.true;

			var arg = spy.args[0][0];

			expect(arg).to.not.be.undefined;
			expect(arg).to.be.an('array');
		});
	});
});
