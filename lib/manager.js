var _ = require('lodash');
var System = require('./system');
var Entity = require('./entity');


/**
 * Manager class acts as a container for entities
 * @return {Manager} Returns manager instance
 */
var Manager = module.exports = function () {
    this._ID = 0;
    this._entityMap = {};
    this._families = {};
    this._componentFamilyMap = {};

    this._systems = [];

    return this;
};


/**
 * Adds entities or systems to the manager
 * @method add
 * @args
 * @return {Manager}
 */
Manager.prototype.add = function () {
    var args = Array.prototype.slice.call(arguments);

    args.forEach(function (arg) {
        if (arg.constructor === System) {
            this._systems.push(arg);
        }
    }.bind(this));

    return this;
};


/**
 * Creates a unique manager ID
 * @method _generateId
 * @return {Number}
 */
Manager.prototype._generateId = function () {
    return this._ID++;
};


/**
 * Returns a consistent string format for multiple components
 * that can be used as a family reference
 * @method _getFamilyRef
 * @param {Components..}
 * @return {String}
 */
Manager.prototype._getFamilyRef = function () {
	var manager = this;
	var components = Array.prototype.slice.call(arguments);

	return components.map(function (component) {
		return manager.getComponentRef(component);
	}).sort().join('-');
};


/**
 * Loops through systems calling each systems process method
 * @method process
 * @return {Manager}
 */
Manager.prototype.process = function () {
    for (var i = 0, l = this._systems.length; i < l; i += 1) {
        this._systems[i].process([]);
    }

    return this;
};


/**
 * Returns the unique component identifier from the component instance
 * @method getComponentRef
 * @param {Object} component The component to find the reference for
 */
Manager.prototype.getComponentRef = function (component) {
    var type = typeof component;
    var ret;

    if (type === 'object' || type === 'function') {
        ret = component._name;
    } else {
        ret = component;
    }

    return ret;
};


/**
 * Returns the named family
 * @method getFamily
 * @return {Object} family
 */
Manager.prototype.getFamily = function () {
	var componentRef = this._getFamilyRef.apply(this, _.toArray(arguments));
	return this._families[componentRef];
};


/**
 * Creates a new family based on the component references
 * @method createFamily
 * @param {Array} components The components the family needs to container
 * @return {object} family The newly created family
 */
Manager.prototype.createFamily = function () {
	var components = _.toArray(arguments);

    var keys = components.map(function (component) {
        return this.getComponentRef(component);
    }.bind(this));

	var name = this._getFamilyRef.apply(this, components);
	console.log('here', name);

    var family = this._families[name] = {};

    var componentFamilyMap = this._componentFamilyMap;

    keys.forEach(function (key) {
        var map = componentFamilyMap[key];

        if (!map) {
            map = componentFamilyMap[key] = [];
        }

        map.push(name);
    });

    return family;
};


/**
 * Creates and returns a reference to the newly created entity
 * @method createEntity
 * @param id An id to assign to the entity, if none is given then one will be created
 */
Manager.prototype.createEntity = function (id) {
    id = this.assignEntity(id || this._generateId());
    return new Entity(this, id);
};


/**
 * Adds the passed in id to the entity map as a new object
 * @method assignEntity
 * @param {String|Number} id The id of the entity
 * @return {String|Number} id
 */
Manager.prototype.assignEntity = function (id) {
    this._entityMap[id] = {};
    return id;
};


/**
 * Adds the passed in component to the entities object in the entityMap as a property with
 * the key name of the components ref, component families will then be updated
 * @param {String|Number} id The entity id
 * @param {Component} component The component to add
 */
Manager.prototype.addComponent = function (id, component) {
    this._entityMap[id][this.getComponentRef(component)] = component;
};


/**
 * Removes the passed in component from the entity
 * @param {String|Number} id The entity id
 * @param {Component} component The component to remove
 */
Manager.prototype.removeComponent = function (id, component) {
	delete this._entityMap[id][this.getComponentRef(component)];
};
