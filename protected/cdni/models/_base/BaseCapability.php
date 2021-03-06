<?php

/**
 * This is the model base class for the table "capability".
 * DO NOT MODIFY THIS FILE! It is automatically generated by giix.
 * If any changes are necessary, you must set or override the required
 * property or method in class "Capability".
 *
 * Columns in table "capability" available as properties of the model,
 * followed by relations of table "capability" available as properties of the model.
 *
 * @property string $id
 * @property string $value
 *
 * @property EndpointCapability[] $endpointCapabilities
 */
abstract class BaseCapability extends GxActiveRecord {

	public static function model($className=__CLASS__) {
		return parent::model($className);
	}

	public function tableName() {
		return 'capability';
	}

	public static function label($n = 1) {
		return Yii::t('app', 'Capability|Capabilities', $n);
	}

	public static function representingColumn() {
		return 'value';
	}

	public function rules() {
		return array(
			array('value', 'required'),
			array('value', 'length', 'max'=>20),
			array('id, value', 'safe', 'on'=>'search'),
		);
	}

	public function relations() {
		return array(
			//'endpointCapabilities' => array(self::HAS_MANY, 'EndpointCapability', 'capability_id'),
			'endpoints' => array(self::MANY_MANY, 'Endpoint', 'endpoint_capability(endpoint_id,capability_id)'),
		);
	}

	public function pivotModels() {
		return array(
			'endpoints' => 'EndpointCapability',
		);
	}

	public function attributeLabels() {
		return array(
			'id' => Yii::t('app', 'ID'),
			'value' => Yii::t('app', 'Value'),
			'endpointCapabilities' => null,
		);
	}

	public function search() {
		$criteria = new CDbCriteria;

		$criteria->compare('id', $this->id, true);
		$criteria->compare('value', $this->value, true);

		return new CActiveDataProvider($this, array(
			'criteria' => $criteria,
		));
	}
}