var System = require('./system');

var Manager = module.exports = function () {
	this._ID = 0;
	this._entityMap = {};
	this._families = {};
	this._componentFamilyMap = {};

	this._systems = [];
};


Manager.prototype.add = function () {
	var args = Array.prototype.slice.call(arguments);

	args.forEach(function (arg) {
		if (arg.constructor === System) {
			this._systems.push(arg);
		}
	}.bind(this));
};


Manager.prototype.process = function () {
	for (var i = 0, l = this._systems.length; i < l; i += 1) {
		this._systems[i].process();
	}
};
