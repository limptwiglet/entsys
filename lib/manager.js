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
    id = this.assignEntity(id);
    return new Entity(this, id);
};
