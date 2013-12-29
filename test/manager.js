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


    it('should create a family if one dosnt exist', function () {
        var family = 'component';
        manager.getFamily(family);
        expect(manager.families[family]).to.exist;

        var comp1 = 'component';
        var comp2 = 'component2';
        var ref = manager._getFamilyReference([comp1, comp2]);
        manager.getFamily(comp1, comp2);
        expect(manager.families[ref]).to.exist;
    });
});
