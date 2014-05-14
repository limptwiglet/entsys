module.exports = Entity = function (id, manager) {
	this._id = id;
	this._manager = manager;
};

Entity.prototype = {
	addComponent: function (component) {
		this._manager.addComponent(this._id, component);
		return this;
	},

	removeComponent: function (component) {
		this._manager.removeComponent(this._id, component);
		return this;
	}
};
