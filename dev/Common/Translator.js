
(function () {

	'use strict';

	var
		window = require('window'),
		$ = require('$'),
		_ = require('_'),
		ko = require('ko'),

		Enums = require('Common/Enums'),
		Globals = require('Common/Globals')
	;

	/**
	 * @constructor
	 */
	function Translator()
	{
		this.data = window['rainloopI18N'] || {};
		this.notificationI18N = {};

		this.trigger = ko.observable(false);

		this.i18n = _.bind(this.i18n, this);
	}

	Translator.prototype.data = {};
	Translator.prototype.notificationI18N = {};

	/**
	 * @param {string} sKey
	 * @param {Object=} oValueList
	 * @param {string=} sDefaulValue
	 * @return {string}
	 */
	Translator.prototype.i18n = function (sKey, oValueList, sDefaulValue)
	{
		var
			sValueName = '',
			sResult = _.isUndefined(this.data[sKey]) ? (_.isUndefined(sDefaulValue) ? sKey : sDefaulValue) : this.data[sKey]
		;

		if (!_.isUndefined(oValueList) && !_.isNull(oValueList))
		{
			for (sValueName in oValueList)
			{
				if (_.has(oValueList, sValueName))
				{
					sResult = sResult.replace('%' + sValueName + '%', oValueList[sValueName]);
				}
			}
		}

		return sResult;
	};

	/**
	 * @param {Object} oElement
	 * @param {boolean=} bAnimate = false
	 */
	Translator.prototype.i18nToNode = function (oElement, bAnimate)
	{
		var self = this;
		_.defer(function () {
			$('.i18n', oElement).each(function () {
				var
					jqThis = $(this),
					sKey = ''
				;

				sKey = jqThis.data('i18n-text');
				if (sKey)
				{
					jqThis.text(self.i18n(sKey));
				}
				else
				{
					sKey = jqThis.data('i18n-html');
					if (sKey)
					{
						jqThis.html(self.i18n(sKey));
					}

					sKey = jqThis.data('i18n-placeholder');
					if (sKey)
					{
						jqThis.attr('placeholder', self.i18n(sKey));
					}

					sKey = jqThis.data('i18n-title');
					if (sKey)
					{
						jqThis.attr('title', self.i18n(sKey));
					}
				}
			});

			if (bAnimate && Globals.bAnimationSupported)
			{
				$('.i18n-animation.i18n', oElement).letterfx({
					'fx': 'fall fade', 'backwards': false, 'timing': 50, 'fx_duration': '50ms', 'letter_end': 'restore', 'element_end': 'restore'
				});
			}
		});
	};

	Translator.prototype.reloadData = function ()
	{
		if (window['rainloopI18N'])
		{
			this.data = window['rainloopI18N'] || {};

			this.i18nToNode($(window.document), true);
			this.trigger(!this.trigger());
		}

		window['rainloopI18N'] = null;
	};

	Translator.prototype.initNotificationLanguage = function ()
	{
		var oN = this.notificationI18N || {};

		oN[Enums.Notification.InvalidToken] = this.i18n('NOTIFICATIONS/INVALID_TOKEN');
		oN[Enums.Notification.AuthError] = this.i18n('NOTIFICATIONS/AUTH_ERROR');
		oN[Enums.Notification.AccessError] = this.i18n('NOTIFICATIONS/ACCESS_ERROR');
		oN[Enums.Notification.ConnectionError] = this.i18n('NOTIFICATIONS/CONNECTION_ERROR');
		oN[Enums.Notification.CaptchaError] = this.i18n('NOTIFICATIONS/CAPTCHA_ERROR');
		oN[Enums.Notification.SocialFacebookLoginAccessDisable] = this.i18n('NOTIFICATIONS/SOCIAL_FACEBOOK_LOGIN_ACCESS_DISABLE');
		oN[Enums.Notification.SocialTwitterLoginAccessDisable] = this.i18n('NOTIFICATIONS/SOCIAL_TWITTER_LOGIN_ACCESS_DISABLE');
		oN[Enums.Notification.SocialGoogleLoginAccessDisable] = this.i18n('NOTIFICATIONS/SOCIAL_GOOGLE_LOGIN_ACCESS_DISABLE');
		oN[Enums.Notification.DomainNotAllowed] = this.i18n('NOTIFICATIONS/DOMAIN_NOT_ALLOWED');
		oN[Enums.Notification.AccountNotAllowed] = this.i18n('NOTIFICATIONS/ACCOUNT_NOT_ALLOWED');

		oN[Enums.Notification.AccountTwoFactorAuthRequired] = this.i18n('NOTIFICATIONS/ACCOUNT_TWO_FACTOR_AUTH_REQUIRED');
		oN[Enums.Notification.AccountTwoFactorAuthError] = this.i18n('NOTIFICATIONS/ACCOUNT_TWO_FACTOR_AUTH_ERROR');

		oN[Enums.Notification.CouldNotSaveNewPassword] = this.i18n('NOTIFICATIONS/COULD_NOT_SAVE_NEW_PASSWORD');
		oN[Enums.Notification.CurrentPasswordIncorrect] = this.i18n('NOTIFICATIONS/CURRENT_PASSWORD_INCORRECT');
		oN[Enums.Notification.NewPasswordShort] = this.i18n('NOTIFICATIONS/NEW_PASSWORD_SHORT');
		oN[Enums.Notification.NewPasswordWeak] = this.i18n('NOTIFICATIONS/NEW_PASSWORD_WEAK');
		oN[Enums.Notification.NewPasswordForbidden] = this.i18n('NOTIFICATIONS/NEW_PASSWORD_FORBIDDENT');

		oN[Enums.Notification.ContactsSyncError] = this.i18n('NOTIFICATIONS/CONTACTS_SYNC_ERROR');

		oN[Enums.Notification.CantGetMessageList] = this.i18n('NOTIFICATIONS/CANT_GET_MESSAGE_LIST');
		oN[Enums.Notification.CantGetMessage] = this.i18n('NOTIFICATIONS/CANT_GET_MESSAGE');
		oN[Enums.Notification.CantDeleteMessage] = this.i18n('NOTIFICATIONS/CANT_DELETE_MESSAGE');
		oN[Enums.Notification.CantMoveMessage] = this.i18n('NOTIFICATIONS/CANT_MOVE_MESSAGE');
		oN[Enums.Notification.CantCopyMessage] = this.i18n('NOTIFICATIONS/CANT_MOVE_MESSAGE');

		oN[Enums.Notification.CantSaveMessage] = this.i18n('NOTIFICATIONS/CANT_SAVE_MESSAGE');
		oN[Enums.Notification.CantSendMessage] = this.i18n('NOTIFICATIONS/CANT_SEND_MESSAGE');
		oN[Enums.Notification.InvalidRecipients] = this.i18n('NOTIFICATIONS/INVALID_RECIPIENTS');

		oN[Enums.Notification.CantSaveFilters] = this.i18n('NOTIFICATIONS/CANT_SAVE_FILTERS');
		oN[Enums.Notification.FiltersAreNotCorrect] = this.i18n('NOTIFICATIONS/FILTERS_ARE_NOT_CORRECT');

		oN[Enums.Notification.CantCreateFolder] = this.i18n('NOTIFICATIONS/CANT_CREATE_FOLDER');
		oN[Enums.Notification.CantRenameFolder] = this.i18n('NOTIFICATIONS/CANT_RENAME_FOLDER');
		oN[Enums.Notification.CantDeleteFolder] = this.i18n('NOTIFICATIONS/CANT_DELETE_FOLDER');
		oN[Enums.Notification.CantDeleteNonEmptyFolder] = this.i18n('NOTIFICATIONS/CANT_DELETE_NON_EMPTY_FOLDER');
		oN[Enums.Notification.CantSubscribeFolder] = this.i18n('NOTIFICATIONS/CANT_SUBSCRIBE_FOLDER');
		oN[Enums.Notification.CantUnsubscribeFolder] = this.i18n('NOTIFICATIONS/CANT_UNSUBSCRIBE_FOLDER');

		oN[Enums.Notification.CantSaveSettings] = this.i18n('NOTIFICATIONS/CANT_SAVE_SETTINGS');
		oN[Enums.Notification.CantSavePluginSettings] = this.i18n('NOTIFICATIONS/CANT_SAVE_PLUGIN_SETTINGS');

		oN[Enums.Notification.DomainAlreadyExists] = this.i18n('NOTIFICATIONS/DOMAIN_ALREADY_EXISTS');

		oN[Enums.Notification.CantInstallPackage] = this.i18n('NOTIFICATIONS/CANT_INSTALL_PACKAGE');
		oN[Enums.Notification.CantDeletePackage] = this.i18n('NOTIFICATIONS/CANT_DELETE_PACKAGE');
		oN[Enums.Notification.InvalidPluginPackage] = this.i18n('NOTIFICATIONS/INVALID_PLUGIN_PACKAGE');
		oN[Enums.Notification.UnsupportedPluginPackage] = this.i18n('NOTIFICATIONS/UNSUPPORTED_PLUGIN_PACKAGE');

		oN[Enums.Notification.LicensingServerIsUnavailable] = this.i18n('NOTIFICATIONS/LICENSING_SERVER_IS_UNAVAILABLE');
		oN[Enums.Notification.LicensingExpired] = this.i18n('NOTIFICATIONS/LICENSING_EXPIRED');
		oN[Enums.Notification.LicensingBanned] = this.i18n('NOTIFICATIONS/LICENSING_BANNED');

		oN[Enums.Notification.DemoSendMessageError] = this.i18n('NOTIFICATIONS/DEMO_SEND_MESSAGE_ERROR');

		oN[Enums.Notification.AccountAlreadyExists] = this.i18n('NOTIFICATIONS/ACCOUNT_ALREADY_EXISTS');
		oN[Enums.Notification.AccountDoesNotExist] = this.i18n('NOTIFICATIONS/ACCOUNT_DOES_NOT_EXIST');

		oN[Enums.Notification.MailServerError] = this.i18n('NOTIFICATIONS/MAIL_SERVER_ERROR');
		oN[Enums.Notification.InvalidInputArgument] = this.i18n('NOTIFICATIONS/INVALID_INPUT_ARGUMENT');
		oN[Enums.Notification.UnknownNotification] = this.i18n('NOTIFICATIONS/UNKNOWN_ERROR');
		oN[Enums.Notification.UnknownError] = this.i18n('NOTIFICATIONS/UNKNOWN_ERROR');
	};

	/**
	 * @param {Function} fCallback
	 * @param {Object} oScope
	 * @param {Function=} fLangCallback
	 */
	Translator.prototype.initOnStartOrLangChange = function (fCallback, oScope, fLangCallback)
	{
		if (fCallback)
		{
			fCallback.call(oScope);
		}

		if (fLangCallback)
		{
			this.trigger.subscribe(function () {
				if (fCallback)
				{
					fCallback.call(oScope);
				}

				fLangCallback.call(oScope);
			});
		}
		else if (fCallback)
		{
			this.trigger.subscribe(fCallback, oScope);
		}
	};

	/**
	 * @param {number} iCode
	 * @param {*=} mMessage = ''
	 * @return {string}
	 */
	Translator.prototype.getNotification = function (iCode, mMessage)
	{
		iCode = window.parseInt(iCode, 10) || 0;
		if (Enums.Notification.ClientViewError === iCode && mMessage)
		{
			return mMessage;
		}

		return _.isUndefined(this.notificationI18N[iCode]) ? '' : this.notificationI18N[iCode];
	};

	/**
	 * @param {*} mCode
	 * @return {string}
	 */
	Translator.prototype.getUploadErrorDescByCode = function (mCode)
	{
		var sResult = '';
		switch (window.parseInt(mCode, 10) || 0) {
		case Enums.UploadErrorCode.FileIsTooBig:
			sResult = this.i18n('UPLOAD/ERROR_FILE_IS_TOO_BIG');
			break;
		case Enums.UploadErrorCode.FilePartiallyUploaded:
			sResult = this.i18n('UPLOAD/ERROR_FILE_PARTIALLY_UPLOADED');
			break;
		case Enums.UploadErrorCode.FileNoUploaded:
			sResult = this.i18n('UPLOAD/ERROR_NO_FILE_UPLOADED');
			break;
		case Enums.UploadErrorCode.MissingTempFolder:
			sResult = this.i18n('UPLOAD/ERROR_MISSING_TEMP_FOLDER');
			break;
		case Enums.UploadErrorCode.FileOnSaveingError:
			sResult = this.i18n('UPLOAD/ERROR_ON_SAVING_FILE');
			break;
		case Enums.UploadErrorCode.FileType:
			sResult = this.i18n('UPLOAD/ERROR_FILE_TYPE');
			break;
		default:
			sResult = this.i18n('UPLOAD/ERROR_UNKNOWN');
			break;
		}

		return sResult;
	};

	/**
	 * @param {string} sLanguage
	 * @param {Function=} fDone
	 * @param {Function=} fFail
	 */
	Translator.prototype.reload = function (sLanguage, fDone, fFail)
	{
		var
			self = this,
			$html = $('html'),
			fEmptyFunction = function () {},
			iStart = (new Date()).getTime()
		;

		$html.addClass('rl-changing-language');

		$.ajax({
				'url': require('Common/Links').langLink(sLanguage),
				'dataType': 'script',
				'cache': true
			})
			.fail(fFail || fEmptyFunction)
			.done(function () {
				_.delay(function () {
					self.reloadData();
					(fDone || fEmptyFunction)();
					$html.removeClass('rl-changing-language');
				}, 500 < (new Date()).getTime() - iStart ? 1 : 500);
			})
		;
	};

	module.exports = new Translator();

}());
