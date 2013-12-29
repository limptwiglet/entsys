var _ = require('lodash');

var Entity = require('./entity');
var id = 0;

module.exports = Manager = function () {
    this.entities = {};
    this.families = {};
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

        if (this.families[familyRef]) {
            return this.families[familyRef];
        } else {
            return this.families[familyRef] = [];
        }
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
        var entity = this.get(id);
        var componentRef = this._getComponentRef(component);

        var comp = entity[componentRef];

        if (typeof comp === 'undefined') {
            comp = {};
        }

        entity[componentRef] = _.extend(comp, component.data);
    },

    /**
     * Create an incremental id
     * @return {Number} - New id
     */
    _getId: function () {
        return id++;
    }
};
