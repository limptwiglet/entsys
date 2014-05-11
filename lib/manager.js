var _ = require('lodash');

var Entity = require('./entity');
var id = 0;

module.exports = Manager = function () {
    this.entities = {};
    this.families = {};
    this.componentFamilyMap = {};
};

Manager.prototype = {
    /**
     * Create and return an entity
     * @return {Entity}
     */
    createEntity: function () {
        var id = this._getId();
        this.entities[id] = {};
        return new Entity(id, this);
    },

    /**
     * Returns an entity by id
     * @param {String} - id of the entity
     * @return {Entity} - Entity
     */
    get: function (id) {
        return this.entities[id];
    },

    /**
     * Returns a component family or creates a new one if one dosnt
     * exist
     * @return {ComponentFamily} - The component family
     */
    getFamily: function () {
        var manager = this;
        var components = Array.prototype.slice.apply(arguments, [0, arguments.length]);
        var familyRef = this._getFamilyReference(components);
        var family = null;

        if (this.families[familyRef]) {
            family = this.families[familyRef];
        } else {
            family = this._createFamily(components);
        }

        components.forEach(function (component) {
            var componentRef = manager._getComponentRef(component);
            var familyMap = manager.componentFamilyMap[componentRef];

            if (!familyMap) {
                familyMap = manager.componentFamilyMap[componentRef] = [];
            }

            familyMap.push(familyRef);
        });

        return family;
    },

    _createFamily: function (components) {
        var familyRef = this._getFamilyReference(components);
        return this.families[familyRef] = [];
    },

    _getFamilyReference: function (components) {
        var manager = this;
        return components.map(function (component) {
            return manager._getComponentRef(component);
        }).sort().join('_');
    },

    /**
     * Gets a components reference this is usually a name property on the
     * component object
     * @param {Component} - Component object
     * @return {String} - Component reference
     */
    _getComponentRef: function (component) {
        if (typeof component === 'object' && typeof component.name !== 'undefined') {
            return component.name;
        } else if (typeof component === 'string') {
            return component;
        }
    },

    /**
     * Add a component to the passed entity id
     * @param {String} - Entity id to add component to
     * @param {Object} - Component data object
     */
    addComponent: function (id, component) {
        var manager = this;
        var entity = this.get(id);
        var componentRef = this._getComponentRef(component);

        var comp = entity[componentRef];

        if (typeof comp === 'undefined') {
            comp = {};
        }

        entity[componentRef] = _.extend(comp, component.data);

        var families = this.componentFamilyMap[componentRef];
        if (families) {
            families.forEach(function (k) {
                manager.families[k].push(manager.entities[id]);
            });
        }
	},

	removeComponent: function (id, component) {
		var manager = this;
		var componentRef = this._getComponentRef(component);
		var entity = this.get(id);

		delete entity[componentRef];

		var families = this.componentFamilyMap[componentRef];
		if (families) {
			families.forEach(function (k) {
				var family = manager.families[k];
				var i = family.indexOf(entity);
				family.splice(i, 1);
			});
		}
	},

    _updateComponentFamilyMap: function (component) {
        var componentRef = this._getComponentRef(component);
        var keys = Object.keys(this.families);

        keys.forEach(function (family) {
            if (family.split('_').indexOf(componentRef) !== -1) {
            }
        });
    },

    /**
     * Create an incremental id
     * @return {Number} - New id
     */
    _getId: function () {
        return id++;
    }
};
