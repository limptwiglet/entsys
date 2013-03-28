var Entity = module.exports = function (manager, id) {
    this._manager = manager;
    this._id = id;
};

Entity.prototype.addComponent = function () {
    var args = Array.prototype.slice.call(arguments);

    return this._manager.addComponent.apply(this._manager, args);
};

Entity.prototype.getComponent = function (component) {
    return this._manager.getComponent(component);
};
