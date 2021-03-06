<?php

namespace RainLoop\Providers\Filters\Classes;

class Filter
{
	/**
	 * @var string
	 */
	private $sID;

	/**
	 * @var bool
	 */
	private $bEnabled;

	/**
	 * @var string
	 */
	private $sName;

	/**
	 * @var array
	 */
	private $aConditions;

	/**
	 * @var string
	 */
	private $sConditionsType;

	/**
	 * @var string
	 */
	private $sActionType;

	/**
	 * @var string
	 */
	private $sActionValue;

	/**
	 * @var string
	 */
	private $sActionValueSecond;

	/**
	 * @var bool
	 */
	private $bMarkAsRead;

	/**
	 * @var bool
	 */
	private $bSkipOthers;

	/**
	 * @var bool
	 */
	private $bKeep;

	public function __construct()
	{
		$this->Clear();
	}

	public function Clear()
	{
		$this->sID = '';
		$this->sName = '';

		$this->bEnabled = true;

		$this->aConditions = array();

		$this->sConditionsType = \RainLoop\Providers\Filters\Enumerations\ConditionsType::ANY;

		$this->sActionType = \RainLoop\Providers\Filters\Enumerations\ActionType::MOVE_TO;
		$this->sActionValue = '';
		$this->sActionValueSecond = '';

		$this->bMarkAsRead = false;
		$this->bSkipOthers = false;
		$this->bKeep = true;
	}

	/**
	 * @return string
	 */
	public function ID()
	{
		return $this->sID;
	}

	/**
	 * @return bool
	 */
	public function Enabled()
	{
		return $this->bEnabled;
	}

	/**
	 * @return string
	 */
	public function Name()
	{
		return $this->sName;
	}

	/**
	 * @return array
	 */
	public function Conditions()
	{
		return $this->aConditions;
	}

	/**
	 * @return string
	 */
	public function ConditionsType()
	{
		return $this->sConditionsType;
	}

	/**
	 * @return string
	 */
	public function ActionType()
	{
		return $this->sActionType;
	}

	/**
	 * @return string
	 */
	public function ActionValue()
	{
		return $this->sActionValue;
	}

	/**
	 * @return string
	 */
	public function ActionValueSecond()
	{
		return $this->sActionValueSecond;
	}

	/**
	 * @return bool
	 */
	public function MarkAsRead()
	{
		return $this->bMarkAsRead;
	}

	/**
	 * @return bool
	 */
	public function SkipOthers()
	{
		return $this->bSkipOthers;
	}

	/**
	 * @return bool
	 */
	public function Keep()
	{
		return $this->bKeep;
	}

	/**
	 * @return string
	 */
	public function serializeToJson()
	{
		return \json_encode($this->ToSimpleJSON());
	}

	/**
	 * @param string $sFilterJson
	 */
	public function unserializeFromJson($sFilterJson)
	{
		$aFilterJson = \json_decode(\trim($sFilterJson), true);
		if (\is_array($aFilterJson))
		{
			return $this->FromJSON($aFilterJson);
		}

		return false;
	}

	/**
	 * @param array $aFilter
	 *
	 * @return array
	 */
	public function FromJSON($aFilter)
	{
		if (\is_array($aFilter))
		{
			$this->sID = isset($aFilter['ID']) ? $aFilter['ID'] : '';
			$this->sName = isset($aFilter['Name']) ? $aFilter['Name'] : '';

			$this->bEnabled = isset($aFilter['Enabled']) ? '1' === (string) $aFilter['Enabled'] : true;

			$this->sConditionsType = isset($aFilter['ConditionsType']) ? $aFilter['ConditionsType'] :
				\RainLoop\Providers\Filters\Enumerations\ConditionsType::ANY;

			$this->sActionType = isset($aFilter['ActionType']) ? $aFilter['ActionType'] :
				\RainLoop\Providers\Filters\Enumerations\ActionType::MOVE_TO;

			$this->sActionValue = isset($aFilter['ActionValue']) ? $aFilter['ActionValue'] : '';
			$this->sActionValueSecond = isset($aFilter['ActionValueSecond']) ? $aFilter['ActionValueSecond'] : '';

			$this->bKeep = isset($aFilter['Keep']) ? '1' === (string) $aFilter['Keep'] : true;
			$this->bMarkAsRead = isset($aFilter['MarkAsRead']) ? '1' === (string) $aFilter['MarkAsRead'] : false;
			$this->bSkipOthers = isset($aFilter['SkipOthers']) ? '1' === (string) $aFilter['SkipOthers'] : false;

			$this->aConditions = \RainLoop\Providers\Filters\Classes\FilterCondition::CollectionFromJSON(
				isset($aFilter['Conditions']) ? $aFilter['Conditions'] : array());

			return true;
		}

		return false;
	}

	/**
	 * @param bool $bAjax = false
	 *
	 * @return array
	 */
	public function ToSimpleJSON($bAjax = false)
	{
		$aConditions = array();
		foreach ($this->Conditions() as $oItem)
		{
			if ($oItem)
			{
				$aConditions[] = $oItem->ToSimpleJSON($bAjax);
			}
		}

		return array(
			'ID' => $this->ID(),
			'Enabled' => $this->Enabled(),
			'Name' => $this->Name(),
			'Conditions' => $aConditions,
			'ConditionsType' => $this->ConditionsType(),
			'ActionType' => $this->ActionType(),
			'ActionValue' => $this->ActionValue(),
			'ActionValueSecond' => $this->ActionValueSecond(),
			'Keep' => $this->Keep(),
			'MarkAsRead' => $this->MarkAsRead(),
			'SkipOthers' => $this->SkipOthers()
		);
	}
}
