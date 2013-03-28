var System = require('./system');
var Entity = require('./entity');

var Manager = module.exports = function () {
    this._ID = 0;
    this._entityMap = {};
    this._families = {};
    this._componentFamilyMap = {};

    this._systems = [];
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
 * Loops through systems calling each systems process method
 * @method process
 * @return {Manager}
 */
Manager.prototype.process = function () {
    for (var i = 0, l = this._systems.length; i < l; i += 1) {
        this._systems[i].process();
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
