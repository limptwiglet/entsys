var _ = require('lodash');

var Entity = require('./entity');

module.exports = Manager = function () {
	this.id = 0;
	this.systems = [];
    this.entities = {};
    this.families = {};
    this.componentFamilyMap = {};
    this.componentEntityMap = {};
};

Manager.prototype = {
    /**
     * Create an incremental id used for entity refs
     * @return {Number} - New id
     */
    _getId: function () {
        return this.id++;
    },

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

	/**
	 * Create a family based on passed components
	 * @method _createFamily
	 * @private
	 * @param {Array} - Array of components
	 * @returns {Array} - Returns the newly created family
	 */
    _createFamily: function (components) {
    	var manager = this;
        var familyRef = this._getFamilyReference(components);
        var family = this.families[familyRef] = [];

        components.forEach(function (component) {
			var componentRef = manager._getComponentRef(component);
			var entMap = manager.componentEntityMap[componentRef];

			if (entMap && entMap.length) {
				entMap.forEach(function (id) {
					family.push(manager.get(id));
				});
			}
        });

        return family;
    },

	/**
	 * Returns a reference which is used to define families based on
	 * component names
	 * @private
	 * @method _getFamilyReference
	 * @param {Array} - Array of components
	 * @returns {String} - The family reference
	 */
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
     * @return {Manager}
     */
    addComponent: function (id, component) {
        var manager = this;
        var entity = this.get(id);
        var componentRef = this._getComponentRef(component);
        var entMap = this.componentEntityMap[componentRef];

        if (!entMap) {
			entMap = this.componentEntityMap[componentRef] = [];
        }

		if (entMap.indexOf(id) === -1) {
			entMap.push(id);
		}

        var comp = entity[componentRef];

        if (typeof comp === 'undefined') {
            comp = {};
        }

        entity[componentRef] = _.extend(comp, component.data);

        var families = this.componentFamilyMap[componentRef];
        if (families) {
            families.forEach(function (k) {
            	var family = manager.families[k];

				if (family.indexOf(entity) === -1) {
					family.push(manager.entities[id]);
				}
            });
        }

        return this;
	},

	/**
	 * Removes a component from an entity and updates families
	 * @method removeComponent
	 * @param {String} - Entity id
	 * @param {Component} - Component
	 * @return {Manager}
	 */
	removeComponent: function (id, component) {
		var manager = this;
		var componentRef = this._getComponentRef(component);
		var entity = this.get(id);
        var entMap = this.componentEntityMap[componentRef];
        var entMapIndex = entMap.indexOf(id);

        if (entMapIndex !== -1) {
			entMap.splice(entMapIndex, 1);
        }

		delete entity[componentRef];

		var families = this.componentFamilyMap[componentRef];
		if (families) {
			families.forEach(function (k) {
				var family = manager.families[k];
				var i = family.indexOf(entity);
				family.splice(i, 1);
			});
		}

		return this;
	},

	addSystem: function (system) {
		if (typeof system.options.components !== 'undefined') {
			var family = this.getFamily.apply(this, system.options.components);
			system.registerFamily(family);
		}

		this.systems.push(system);
	}
};
