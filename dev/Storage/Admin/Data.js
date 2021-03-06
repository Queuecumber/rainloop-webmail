
(function () {

	'use strict';

	var
		_ = require('_'),
		ko = require('ko'),

		AbstractData = require('Storage/AbstractData')
	;

	/**
	 * @constructor
	 * @extends AbstractData
	 */
	function DataAdminStorage()
	{
		AbstractData.call(this);

		this.domains = ko.observableArray([]);
		this.domains.loading = ko.observable(false).extend({'throttle': 100});

		this.plugins = ko.observableArray([]);
		this.plugins.loading = ko.observable(false).extend({'throttle': 100});

		this.packagesReal = ko.observable(true);
		this.packagesMainUpdatable = ko.observable(true);
		this.packages = ko.observableArray([]);
		this.packages.loading = ko.observable(false).extend({'throttle': 100});

		this.coreReal = ko.observable(true);
		this.coreChannel = ko.observable('stable');
		this.coreType = ko.observable('stable');
		this.coreUpdatable = ko.observable(true);
		this.coreAccess = ko.observable(true);
		this.coreChecking = ko.observable(false).extend({'throttle': 100});
		this.coreUpdating = ko.observable(false).extend({'throttle': 100});
		this.coreRemoteVersion = ko.observable('');
		this.coreRemoteRelease = ko.observable('');
		this.coreVersionCompare = ko.observable(-2);

		this.licensing = ko.observable(false);
		this.licensingProcess = ko.observable(false);
		this.licenseValid = ko.observable(false);
		this.licenseExpired = ko.observable(0);
		this.licenseError = ko.observable('');

		this.licenseTrigger = ko.observable(false);

		this.adminManLoading = ko.computed(function () {
			return '000' !== [this.domains.loading() ? '1' : '0', this.plugins.loading() ? '1' : '0', this.packages.loading() ? '1' : '0'].join('');
		}, this);

		this.adminManLoadingVisibility = ko.computed(function () {
			return this.adminManLoading() ? 'visible' : 'hidden';
		}, this).extend({'rateLimit': 300});
	}

	_.extend(DataAdminStorage.prototype, AbstractData.prototype);

	DataAdminStorage.prototype.populateDataOnStart = function()
	{
		AbstractData.prototype.populateDataOnStart.call(this);
	};

	module.exports = new DataAdminStorage();

}());