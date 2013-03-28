var Entity = module.exports = function (manager, id) {
    this._manager = manager;
    this._id = id;
};

Entity.prototype.addComponent = function (component) {
    return this._manager.addComponent(this._id, component);
};

Entity.prototype.getComponent = function (component) {
    return this._manager.getComponent(this._id, component);
};
