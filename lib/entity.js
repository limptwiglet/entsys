var Entity = module.exports = function (manager, id) {
    this._manager = manager;
    this._id = id;
};

/**
 * Adds a component to the entity, this is just a passthrough method calling
 * the managers addComponent
 * @param {Component} component The component to add to the enity
 */
Entity.prototype.addComponent = function (component) {
    return this._manager.addComponent(this._id, component);
};


/**
 * Removes a component from the entity, this is just a passthrough method calling
 * the managers removeComponent
 * @param {Component} component The component to add to the enity
 */
Entity.prototype.removeComponent = function (component) {
    return this._manager.removeComponent(this._id, component);
};

Entity.prototype.getComponent = function (component) {
    return this._manager.getComponent(this._id, component);
};
