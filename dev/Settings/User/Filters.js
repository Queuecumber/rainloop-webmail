
(function () {

	'use strict';

	var
		ko = require('ko'),
		_ = require('_'),

		Enums = require('Common/Enums'),
		Utils = require('Common/Utils'),
		Translator = require('Common/Translator'),

		FilterStore = require('Stores/Filter'),

		Remote = require('Storage/User/Remote')
	;

	/**
	 * @constructor
	 */
	function FiltersUserSettings()
	{
		var self = this;

		this.modules = FilterStore.modules;
		this.filters = FilterStore.collection;

		this.haveChanges = ko.observable(false);

		this.processText = ko.observable('');
		this.saveErrorText = ko.observable('');

		this.visibility = ko.observable(false);

		this.filters.subscribe(Utils.windowResizeCallback);

		this.filterRaw = FilterStore.raw;
		this.filterRaw.capa = FilterStore.capa;
		this.filterRaw.active = ko.observable(false);
		this.filterRaw.allow = ko.observable(false);
		this.filterRaw.error = ko.observable(false);

		this.processText = ko.computed(function () {
			return this.filters.loading() ? Translator.i18n('SETTINGS_FILTERS/LOADING_PROCESS') : '';
		}, this);

		this.visibility = ko.computed(function () {
			return '' === this.processText() ? 'hidden' : 'visible';
		}, this);

		this.filterForDeletion = ko.observable(null).extend({'falseTimeout': 3000}).extend(
			{'toggleSubscribeProperty': [this, 'deleteAccess']});

		this.saveChanges = Utils.createCommand(this, function () {

			if (!this.filters.saving())
			{
				if ('' === Utils.trim(this.filterRaw()))
				{
					this.filterRaw.error(true);
					return false;
				}

				this.filters.saving(true);
				this.saveErrorText('');

				Remote.filtersSave(function (sResult, oData) {

					self.filters.saving(false);

					if (Enums.StorageResultType.Success === sResult && oData && oData.Result)
					{
						self.haveChanges(false);
						self.updateList();
					}
					else
					{
						self.saveErrorText(oData && oData.ErrorCode ? Translator.getNotification(oData.ErrorCode) :
							Translator.getNotification(Enums.Notification.CantSaveFilters));
					}

				}, this.filters(), this.filterRaw(), this.filterRaw.active());
			}

			return true;

		}, function () {
			return this.haveChanges();
		});

		this.filters.subscribe(function () {
			this.haveChanges(true);
		}, this);

		this.filterRaw.subscribe(function () {
			this.haveChanges(true);
			this.filterRaw.error(false);
		}, this);

		this.filterRaw.active.subscribe(function () {
			this.haveChanges(true);
			this.filterRaw.error(false);
		}, this);
	}

	FiltersUserSettings.prototype.scrollableOptions = function ()
	{
		return {
			// handle: '.drag-handle'
		};
	};

	FiltersUserSettings.prototype.updateList = function ()
	{
		var
			self = this,
			FilterModel = require('Model/Filter')
		;

		this.filters.loading(true);

		Remote.filtersGet(function (sResult, oData) {

			self.filters.loading(false);

			if (Enums.StorageResultType.Success === sResult && oData &&
				oData.Result && Utils.isArray(oData.Result.Filters))
			{
				var aResult = _.compact(_.map(oData.Result.Filters, function (aItem) {
					var oNew = new FilterModel();
					return (oNew && oNew.parse(aItem)) ? oNew : null;
				}));

				self.filters(aResult);

				self.modules(oData.Result.Modules ? oData.Result.Modules : {});

				self.filterRaw(oData.Result.Raw || '');
				self.filterRaw.capa(Utils.isArray(oData.Result.Capa) ? oData.Result.Capa.join(' ') : '');
				self.filterRaw.active(!!oData.Result.RawIsActive);
				self.filterRaw.allow(!!oData.Result.RawIsAllow);
			}
			else
			{
				self.filters([]);
				self.modules({});
				self.filterRaw('');
				self.filterRaw.capa({});
			}

			self.haveChanges(false);
		});
	};

	FiltersUserSettings.prototype.deleteFilter = function (oFilter)
	{
		this.filters.remove(oFilter);
		Utils.delegateRunOnDestroy(oFilter);
	};

	FiltersUserSettings.prototype.addFilter = function ()
	{
		var
			self = this,
			FilterModel = require('Model/Filter'),
			oNew = new FilterModel()
		;

		oNew.generateID();
		require('Knoin/Knoin').showScreenPopup(
			require('View/Popup/Filter'), [oNew, function  () {
				self.filters.push(oNew);
				self.filterRaw.active(false);
			}, false]);
	};

	FiltersUserSettings.prototype.editFilter = function (oEdit)
	{
		var
			self = this,
			oCloned = oEdit.cloneSelf()
		;

		require('Knoin/Knoin').showScreenPopup(
			require('View/Popup/Filter'), [oCloned, function  () {

				var
					aFilters = self.filters(),
					iIndex = aFilters.indexOf(oEdit)
				;

				if (-1 < iIndex && aFilters[iIndex])
				{
					Utils.delegateRunOnDestroy(aFilters[iIndex]);
					aFilters[iIndex] = oCloned;

					self.filters(aFilters);
					self.haveChanges(true);
				}

			}, true]);
	};

	FiltersUserSettings.prototype.onBuild = function (oDom)
	{
		var self = this;

		oDom
			.on('click', '.filter-item .e-action', function () {
				var oFilterItem = ko.dataFor(this);
				if (oFilterItem)
				{
					self.editFilter(oFilterItem);
				}
			})
		;

		this.updateList();
	};

	module.exports = FiltersUserSettings;

}());