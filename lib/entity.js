var Entity = module.exports = function (manager) {
    this._manager = manager;
};

Entity.prototype.addComponent = function () {
    var args = Array.prototype.slice.call(arguments);

    return this._manager.addComponent.apply(this._manager, args);
};

Entity.prototype.getComponent = function (component) {
    return this._manager.getComponent(component);
};
