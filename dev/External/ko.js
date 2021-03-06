
(function (ko) {

	'use strict';

	var
		window = require('window'),
		_ = require('_'),
		$ = require('$'),

		fDisposalTooltipHelper = function (oElement, $oEl, oSubscription) {
			ko.utils.domNodeDisposal.addDisposeCallback(oElement, function () {

				if (oSubscription && oSubscription.dispose)
				{
					oSubscription.dispose();
				}

				if ($oEl)
				{
					$oEl.off('click.koTooltip');

					if ($oEl.tooltip)
					{
						$oEl.tooltip('destroy');
					}
				}

				$oEl = null;
			});
		}
	;

	ko.bindingHandlers.tooltip = {
		'init': function (oElement, fValueAccessor) {

			var
				$oEl = null,
				bi18n = true,
				sClass  = '',
				sPlacement  = '',
				oSubscription = null,
				Globals = require('Common/Globals'),
				Translator = require('Common/Translator')
			;

			if (!Globals.bMobileDevice)
			{
				$oEl = $(oElement);
				sClass = $oEl.data('tooltip-class') || '';
				bi18n = 'on' === ($oEl.data('tooltip-i18n') || 'on');
				sPlacement = $oEl.data('tooltip-placement') || 'top';

				$oEl.tooltip({
					'delay': {
						'show': 500,
						'hide': 100
					},
					'html': true,
					'container': 'body',
					'placement': sPlacement,
					'trigger': 'hover',
					'title': function () {
						var sValue = bi18n ? ko.unwrap(fValueAccessor()) : fValueAccessor()();
						return '' === sValue || $oEl.is('.disabled') || Globals.dropdownVisibility() ? '' :
							'<span class="tooltip-class ' + sClass + '">' + (bi18n ? Translator.i18n(sValue) : sValue) + '</span>';
					}
				}).on('click.koTooltip', function () {
					$oEl.tooltip('hide');
				});

				oSubscription = Globals.tooltipTrigger.subscribe(function () {
					$oEl.tooltip('hide');
				});

				fDisposalTooltipHelper(oElement, $oEl, oSubscription);
			}
		}
	};

	ko.bindingHandlers.tooltipForTest = {
		'init': function (oElement) {

			var
				$oEl = $(oElement),
				oSubscription = null,
				Globals = require('Common/Globals')
			;

			$oEl.tooltip({
				'container': 'body',
				'trigger': 'hover manual',
				'title': function () {
					return $oEl.data('tooltip3-data') || '';
				}
			});

			$(window.document).on('click', function () {
				$oEl.tooltip('hide');
			});

			oSubscription = Globals.tooltipTrigger.subscribe(function () {
				$oEl.tooltip('hide');
			});

			fDisposalTooltipHelper(oElement, $oEl, oSubscription);
		},
		'update': function (oElement, fValueAccessor) {
			var sValue = ko.unwrap(fValueAccessor());
			if ('' === sValue)
			{
				$(oElement).data('tooltip3-data', '').tooltip('hide');
			}
			else
			{
				$(oElement).data('tooltip3-data', sValue).tooltip('show');
			}
		}
	};

	ko.bindingHandlers.registrateBootstrapDropdown = {
		'init': function (oElement) {
			var Globals = require('Common/Globals');
			if (Globals && Globals.aBootstrapDropdowns)
			{
				Globals.aBootstrapDropdowns.push($(oElement));
//				ko.utils.domNodeDisposal.addDisposeCallback(oElement, function () {
//					// TODO
//				});
			}
		}
	};

	ko.bindingHandlers.openDropdownTrigger = {
		'update': function (oElement, fValueAccessor) {
			if (ko.unwrap(fValueAccessor()))
			{
				var
					$oEl = $(oElement),
					Utils = require('Common/Utils')
				;

				if (!$oEl.hasClass('open'))
				{
					$oEl.find('.dropdown-toggle').dropdown('toggle');
					Utils.detectDropdownVisibility();
				}

				fValueAccessor()(false);
			}
		}
	};

	ko.bindingHandlers.dropdownCloser = {
		'init': function (oElement) {
			$(oElement).closest('.dropdown').on('click', '.e-item', function () {
				$(oElement).dropdown('toggle');
			});
		}
	};

	ko.bindingHandlers.popover = {
		'init': function (oElement, fValueAccessor) {
			$(oElement).popover(ko.unwrap(fValueAccessor()));

			ko.utils.domNodeDisposal.addDisposeCallback(oElement, function () {
				$(oElement).popover('destroy');
			});
		}
	};

	ko.bindingHandlers.csstext = {
		'init': function (oElement, fValueAccessor) {
			var Utils = require('Common/Utils');
			if (oElement && oElement.styleSheet && !Utils.isUnd(oElement.styleSheet.cssText))
			{
				oElement.styleSheet.cssText = ko.unwrap(fValueAccessor());
			}
			else
			{
				$(oElement).text(ko.unwrap(fValueAccessor()));
			}
		},
		'update': function (oElement, fValueAccessor) {
			var Utils = require('Common/Utils');
			if (oElement && oElement.styleSheet && !Utils.isUnd(oElement.styleSheet.cssText))
			{
				oElement.styleSheet.cssText = ko.unwrap(fValueAccessor());
			}
			else
			{
				$(oElement).text(ko.unwrap(fValueAccessor()));
			}
		}
	};

	ko.bindingHandlers.resizecrop = {
		'init': function (oElement) {
			$(oElement).addClass('resizecrop').resizecrop({
				'width': '100',
				'height': '100',
				'wrapperCSS': {
					'border-radius': '10px'
				}
			});
		},
		'update': function (oElement, fValueAccessor) {
			fValueAccessor()();
			$(oElement).resizecrop({
				'width': '100',
				'height': '100'
			});
		}
	};

	ko.bindingHandlers.onEnter = {
		'init': function (oElement, fValueAccessor, fAllBindingsAccessor, oViewModel) {
			$(oElement).on('keypress.koOnEnter', function (oEvent) {
				if (oEvent && 13 === window.parseInt(oEvent.keyCode, 10))
				{
					$(oElement).trigger('change');
					fValueAccessor().call(oViewModel);
				}
			});

			ko.utils.domNodeDisposal.addDisposeCallback(oElement, function () {
				$(oElement).off('keypress.koOnEnter');
			});
		}
	};

	ko.bindingHandlers.onEsc = {
		'init': function (oElement, fValueAccessor, fAllBindingsAccessor, oViewModel) {
			$(oElement).on('keypress.koOnEsc', function (oEvent) {
				if (oEvent && 27 === window.parseInt(oEvent.keyCode, 10))
				{
					$(oElement).trigger('change');
					fValueAccessor().call(oViewModel);
				}
			});

			ko.utils.domNodeDisposal.addDisposeCallback(oElement, function () {
				$(oElement).off('keypress.koOnEsc');
			});
		}
	};

	ko.bindingHandlers.clickOnTrue = {
		'update': function (oElement, fValueAccessor) {
			if (ko.unwrap(fValueAccessor()))
			{
				$(oElement).click();
			}
		}
	};

	ko.bindingHandlers.modal = {
		'init': function (oElement, fValueAccessor) {

			var
				Globals = require('Common/Globals'),
				Utils = require('Common/Utils')
			;

			$(oElement).toggleClass('fade', !Globals.bMobileDevice).modal({
				'keyboard': false,
				'show': ko.unwrap(fValueAccessor())
			})
			.on('shown.koModal', Utils.windowResizeCallback)
			.find('.close').on('click.koModal', function () {
				fValueAccessor()(false);
			});

			ko.utils.domNodeDisposal.addDisposeCallback(oElement, function () {
				$(oElement)
					.off('shown.koModal')
					.find('.close')
					.off('click.koModal')
				;
			});
		},
		'update': function (oElement, fValueAccessor) {
			$(oElement).modal(ko.unwrap(fValueAccessor()) ? 'show' : 'hide');
		}
	};

	ko.bindingHandlers.i18nInit = {
		'init': function (oElement) {
			require('Common/Translator').i18nToNode(oElement);
		}
	};

	ko.bindingHandlers.i18nUpdate = {
		'update': function (oElement, fValueAccessor) {
			ko.unwrap(fValueAccessor());
			require('Common/Translator').i18nToNode(oElement);
		}
	};

	ko.bindingHandlers.link = {
		'update': function (oElement, fValueAccessor) {
			$(oElement).attr('href', ko.unwrap(fValueAccessor()));
		}
	};

	ko.bindingHandlers.title = {
		'update': function (oElement, fValueAccessor) {
			$(oElement).attr('title', ko.unwrap(fValueAccessor()));
		}
	};

	ko.bindingHandlers.textF = {
		'init': function (oElement, fValueAccessor) {
			$(oElement).text(ko.unwrap(fValueAccessor()));
		}
	};

	ko.bindingHandlers.initDom = {
		'init': function (oElement, fValueAccessor) {
			fValueAccessor()(oElement);
		}
	};

	ko.bindingHandlers.initFixedTrigger = {
		'init': function (oElement, fValueAccessor) {
			var
				aValues = ko.unwrap(fValueAccessor()),
				$oContainer = null,
				$oElement = $(oElement),
				oOffset = null,

				iTop = aValues[1] || 0
			;

			$oContainer = $(aValues[0] || null);
			$oContainer = $oContainer[0] ? $oContainer : null;

			if ($oContainer)
			{
				$(window).resize(function () {
					oOffset = $oContainer.offset();
					if (oOffset && oOffset.top)
					{
						$oElement.css('top', oOffset.top + iTop);
					}
				});
			}
		}
	};

	ko.bindingHandlers.initResizeTrigger = {
		'init': function (oElement, fValueAccessor) {
			var aValues = ko.unwrap(fValueAccessor());
			$(oElement).css({
				'height': aValues[1],
				'min-height': aValues[1]
			});
		},
		'update': function (oElement, fValueAccessor) {

			var
				Utils = require('Common/Utils'),
				Globals = require('Common/Globals'),
				aValues = ko.unwrap(fValueAccessor()),
				iValue = Utils.pInt(aValues[1]),
				iSize = 0,
				iOffset = $(oElement).offset().top
			;

			if (0 < iOffset)
			{
				iOffset += Utils.pInt(aValues[2]);
				iSize = Globals.$win.height() - iOffset;

				if (iValue < iSize)
				{
					iValue = iSize;
				}

				$(oElement).css({
					'height': iValue,
					'min-height': iValue
				});
			}
		}
	};

	ko.bindingHandlers.appendDom = {
		'update': function (oElement, fValueAccessor) {
			$(oElement).hide().empty().append(ko.unwrap(fValueAccessor())).show();
		}
	};

	ko.bindingHandlers.draggable = {
		'init': function (oElement, fValueAccessor, fAllBindingsAccessor) {

			var
				Globals = require('Common/Globals'),
				Utils = require('Common/Utils')
			;

			if (!Globals.bMobileDevice)
			{
				var
					iTriggerZone = 100,
					iScrollSpeed = 3,
					fAllValueFunc = fAllBindingsAccessor(),
					sDroppableSelector = fAllValueFunc && fAllValueFunc['droppableSelector'] ? fAllValueFunc['droppableSelector'] : '',
					oConf = {
						'distance': 20,
						'handle': '.dragHandle',
						'cursorAt': {'top': 22, 'left': 3},
						'refreshPositions': true,
						'scroll': true
					}
				;

				if (sDroppableSelector)
				{
					oConf['drag'] = function (oEvent) {

						$(sDroppableSelector).each(function () {
							var
								moveUp = null,
								moveDown = null,
								$this = $(this),
								oOffset = $this.offset(),
								bottomPos = oOffset.top + $this.height()
							;

							window.clearInterval($this.data('timerScroll'));
							$this.data('timerScroll', false);

							if (oEvent.pageX >= oOffset.left && oEvent.pageX <= oOffset.left + $this.width())
							{
								if (oEvent.pageY >= bottomPos - iTriggerZone && oEvent.pageY <= bottomPos)
								{
									moveUp = function() {
										$this.scrollTop($this.scrollTop() + iScrollSpeed);
										Utils.windowResize();
									};

									$this.data('timerScroll', window.setInterval(moveUp, 10));
									moveUp();
								}

								if (oEvent.pageY >= oOffset.top && oEvent.pageY <= oOffset.top + iTriggerZone)
								{
									moveDown = function() {
										$this.scrollTop($this.scrollTop() - iScrollSpeed);
										Utils.windowResize();
									};

									$this.data('timerScroll', window.setInterval(moveDown, 10));
									moveDown();
								}
							}
						});
					};

					oConf['stop'] =	function() {
						$(sDroppableSelector).each(function () {
							window.clearInterval($(this).data('timerScroll'));
							$(this).data('timerScroll', false);
						});
					};
				}

				oConf['helper'] = function (oEvent) {
					return fValueAccessor()(oEvent && oEvent.target ? ko.dataFor(oEvent.target) : null);
				};

				$(oElement).draggable(oConf).on('mousedown.koDraggable', function () {
					Utils.removeInFocus();
				});

				ko.utils.domNodeDisposal.addDisposeCallback(oElement, function () {
					$(oElement)
						.off('mousedown.koDraggable')
						.draggable('destroy')
					;
				});
			}
		}
	};

	ko.bindingHandlers.droppable = {
		'init': function (oElement, fValueAccessor, fAllBindingsAccessor) {
			var Globals = require('Common/Globals');
			if (!Globals.bMobileDevice)
			{
				var
					fValueFunc = fValueAccessor(),
					fAllValueFunc = fAllBindingsAccessor(),
					fOverCallback = fAllValueFunc && fAllValueFunc['droppableOver'] ? fAllValueFunc['droppableOver'] : null,
					fOutCallback = fAllValueFunc && fAllValueFunc['droppableOut'] ? fAllValueFunc['droppableOut'] : null,
					oConf = {
						'tolerance': 'pointer',
						'hoverClass': 'droppableHover'
					}
				;

				if (fValueFunc)
				{
					oConf['drop'] = function (oEvent, oUi) {
						fValueFunc(oEvent, oUi);
					};

					if (fOverCallback)
					{
						oConf['over'] = function (oEvent, oUi) {
							fOverCallback(oEvent, oUi);
						};
					}

					if (fOutCallback)
					{
						oConf['out'] = function (oEvent, oUi) {
							fOutCallback(oEvent, oUi);
						};
					}

					$(oElement).droppable(oConf);

					ko.utils.domNodeDisposal.addDisposeCallback(oElement, function () {
						$(oElement).droppable('destroy');
					});
				}
			}
		}
	};

	ko.bindingHandlers.nano = {
		'init': function (oElement) {
			var Globals = require('Common/Globals');
			if (!Globals.bDisableNanoScroll)
			{
				$(oElement)
					.addClass('nano')
					.nanoScroller({
						'iOSNativeScrolling': false,
						'preventPageScrolling': true
					})
				;
			}
		}
	};

	ko.bindingHandlers.saveTrigger = {
		'init': function (oElement) {

			var $oEl = $(oElement);

			$oEl.data('save-trigger-type', $oEl.is('input[type=text],input[type=email],input[type=password],select,textarea') ? 'input' : 'custom');

			if ('custom' === $oEl.data('save-trigger-type'))
			{
				$oEl.append(
					'&nbsp;&nbsp;<i class="icon-spinner animated"></i><i class="icon-remove error"></i><i class="icon-ok success"></i>'
				).addClass('settings-saved-trigger');
			}
			else
			{
				$oEl.addClass('settings-saved-trigger-input');
			}
		},
		'update': function (oElement, fValueAccessor) {
			var
				mValue = ko.unwrap(fValueAccessor()),
				$oEl = $(oElement)
			;

			if ('custom' === $oEl.data('save-trigger-type'))
			{
				switch (mValue.toString())
				{
					case '1':
						$oEl
							.find('.animated,.error').hide().removeClass('visible')
							.end()
							.find('.success').show().addClass('visible')
						;
						break;
					case '0':
						$oEl
							.find('.animated,.success').hide().removeClass('visible')
							.end()
							.find('.error').show().addClass('visible')
						;
						break;
					case '-2':
						$oEl
							.find('.error,.success').hide().removeClass('visible')
							.end()
							.find('.animated').show().addClass('visible')
						;
						break;
					default:
						$oEl
							.find('.animated').hide()
							.end()
							.find('.error,.success').removeClass('visible')
						;
						break;
				}
			}
			else
			{
				switch (mValue.toString())
				{
					case '1':
						$oEl.addClass('success').removeClass('error');
						break;
					case '0':
						$oEl.addClass('error').removeClass('success');
						break;
					case '-2':
	//					$oEl;
						break;
					default:
						$oEl.removeClass('error success');
						break;
				}
			}
		}
	};

	ko.bindingHandlers.emailsTags = {
		'init': function(oElement, fValueAccessor, fAllBindingsAccessor) {

			var
				Utils = require('Common/Utils'),
				EmailModel = require('Model/Email'),

				$oEl = $(oElement),
				fValue = fValueAccessor(),
				fAllBindings = fAllBindingsAccessor(),
				fAutoCompleteSource = fAllBindings['autoCompleteSource'] || null,
				fFocusCallback = function (bValue) {
					if (fValue && fValue.focusTrigger)
					{
						fValue.focusTrigger(bValue);
					}
				}
			;

			$oEl.inputosaurus({
				'parseOnBlur': true,
				'allowDragAndDrop': true,
				'focusCallback': fFocusCallback,
				'inputDelimiters': [',', ';'],
				'autoCompleteSource': fAutoCompleteSource,
				'parseHook': function (aInput) {
					return _.map(aInput, function (sInputValue) {

						var
							sValue = Utils.trim(sInputValue),
							oEmail = null
						;

						if ('' !== sValue)
						{
							oEmail = new EmailModel();
							oEmail.mailsoParse(sValue);
							return [oEmail.toLine(false), oEmail];
						}

						return [sValue, null];

					});
				},
				'change': _.bind(function (oEvent) {
					$oEl.data('EmailsTagsValue', oEvent.target.value);
					fValue(oEvent.target.value);
				}, this)
			});
		},
		'update': function (oElement, fValueAccessor, fAllBindingsAccessor) {

			var
				$oEl = $(oElement),
				fAllValueFunc = fAllBindingsAccessor(),
				fEmailsTagsFilter = fAllValueFunc['emailsTagsFilter'] || null,
				sValue = ko.unwrap(fValueAccessor())
			;

			if ($oEl.data('EmailsTagsValue') !== sValue)
			{
				$oEl.val(sValue);
				$oEl.data('EmailsTagsValue', sValue);
				$oEl.inputosaurus('refresh');
			}

			if (fEmailsTagsFilter && ko.unwrap(fEmailsTagsFilter))
			{
				$oEl.inputosaurus('focus');
			}
		}
	};

	ko.bindingHandlers.command = {
		'init': function (oElement, fValueAccessor, fAllBindingsAccessor, oViewModel) {
			var
				jqElement = $(oElement),
				oCommand = fValueAccessor()
			;

			if (!oCommand || !oCommand.enabled || !oCommand.canExecute)
			{
				throw new Error('You are not using command function');
			}

			jqElement.addClass('command');
			ko.bindingHandlers[jqElement.is('form') ? 'submit' : 'click'].init.apply(oViewModel, arguments);
		},

		'update': function (oElement, fValueAccessor) {

			var
				bResult = true,
				jqElement = $(oElement),
				oCommand = fValueAccessor()
			;

			bResult = oCommand.enabled();
			jqElement.toggleClass('command-not-enabled', !bResult);

			if (bResult)
			{
				bResult = oCommand.canExecute();
				jqElement.toggleClass('command-can-not-be-execute', !bResult);
			}

			jqElement.toggleClass('command-disabled disable disabled', !bResult).toggleClass('no-disabled', !!bResult);

			if (jqElement.is('input') || jqElement.is('button'))
			{
				jqElement.prop('disabled', !bResult);
			}
		}
	};

	// extenders

	ko.extenders.trimmer = function (oTarget)
	{
		var
			Utils = require('Common/Utils'),
			oResult = ko.computed({
				'read': oTarget,
				'write': function (sNewValue) {
					oTarget(Utils.trim(sNewValue.toString()));
				},
				'owner': this
			})
		;

		oResult(oTarget());
		return oResult;
	};

	ko.extenders.posInterer = function (oTarget, iDefault)
	{
		var
			Utils = require('Common/Utils'),
			oResult = ko.computed({
				'read': oTarget,
				'write': function (sNewValue) {
					var iNew = Utils.pInt(sNewValue.toString(), iDefault);
					if (0 >= iNew)
					{
						iNew = iDefault;
					}

					if (iNew === oTarget() && '' + iNew !== '' + sNewValue)
					{
						oTarget(iNew + 1);
					}

					oTarget(iNew);
				}
			})
		;

		oResult(oTarget());
		return oResult;
	};

	ko.extenders.limitedList = function (oTarget, mList)
	{
		var
			Utils = require('Common/Utils'),
			oResult = ko.computed({
				'read': oTarget,
				'write': function (sNewValue) {

					var
						sCurrentValue = ko.unwrap(oTarget),
						aList = ko.unwrap(mList)
					;

					if (Utils.isNonEmptyArray(aList))
					{
						if (-1 < Utils.inArray(sNewValue, aList))
						{
							oTarget(sNewValue);
						}
						else if (-1 < Utils.inArray(sCurrentValue, aList))
						{
							oTarget(sCurrentValue + ' ');
							oTarget(sCurrentValue);
						}
						else
						{
							oTarget(aList[0] + ' ');
							oTarget(aList[0]);
						}
					}
					else
					{
						oTarget('');
					}
				}
			})
		;

		oResult(oTarget());

		if (!oResult.valueHasMutated)
		{
			oResult.valueHasMutated = function () {
				oTarget.valueHasMutated();
			};
		}

		return oResult;
	};

	ko.extenders.reversible = function (oTarget)
	{
		var mValue = oTarget();

		oTarget.commit = function ()
		{
			mValue = oTarget();
		};

		oTarget.reverse = function ()
		{
			oTarget(mValue);
		};

		oTarget.commitedValue = function ()
		{
			return mValue;
		};

		return oTarget;
	};

	ko.extenders.toggleSubscribe = function (oTarget, oOptions)
	{
		oTarget.subscribe(oOptions[1], oOptions[0], 'beforeChange');
		oTarget.subscribe(oOptions[2], oOptions[0]);

		return oTarget;
	};

	ko.extenders.toggleSubscribeProperty = function (oTarget, oOptions)
	{
		var sProp = oOptions[1];

		if (sProp)
		{
			oTarget.subscribe(function (oPrev) {
				if (oPrev && oPrev[sProp])
				{
					oPrev[sProp](false);
				}
			}, oOptions[0], 'beforeChange');

			oTarget.subscribe(function (oNext) {
				if (oNext && oNext[sProp])
				{
					oNext[sProp](true);
				}
			}, oOptions[0]);
		}

		return oTarget;
	};

	ko.extenders.falseTimeout = function (oTarget, iOption)
	{
		var Utils = require('Common/Utils');

		oTarget.iTimeout = 0;
		oTarget.subscribe(function (bValue) {
			if (bValue)
			{
				window.clearTimeout(oTarget.iTimeout);
				oTarget.iTimeout = window.setTimeout(function () {
					oTarget(false);
					oTarget.iTimeout = 0;
				}, Utils.pInt(iOption));
			}
		});

		return oTarget;
	};

	// functions

	ko.observable.fn.validateNone = function ()
	{
		this.hasError = ko.observable(false);
		return this;
	};

	ko.observable.fn.validateEmail = function ()
	{
		var Utils = require('Common/Utils');

		this.hasError = ko.observable(false);

		this.subscribe(function (sValue) {
			sValue = Utils.trim(sValue);
			this.hasError('' !== sValue && !(/^[^@\s]+@[^@\s]+$/.test(sValue)));
		}, this);

		this.valueHasMutated();
		return this;
	};

	ko.observable.fn.validateSimpleEmail = function ()
	{
		var Utils = require('Common/Utils');

		this.hasError = ko.observable(false);

		this.subscribe(function (sValue) {
			sValue = Utils.trim(sValue);
			this.hasError('' !== sValue && !(/^.+@.+$/.test(sValue)));
		}, this);

		this.valueHasMutated();
		return this;
	};

	ko.observable.fn.validateFunc = function (fFunc)
	{
		var Utils = require('Common/Utils');

		this.hasFuncError = ko.observable(false);

		if (Utils.isFunc(fFunc))
		{
			this.subscribe(function (sValue) {
				this.hasFuncError(!fFunc(sValue));
			}, this);

			this.valueHasMutated();
		}

		return this;
	};

	module.exports = ko;

}(ko));
