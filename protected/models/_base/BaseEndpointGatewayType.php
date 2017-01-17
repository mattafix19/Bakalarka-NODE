<?php

/**
 * This is the model base class for the table "endpoint_gateway_type".
 * DO NOT MODIFY THIS FILE! It is automatically generated by giix.
 * If any changes are necessary, you must set or override the required
 * property or method in class "EndpointGatewayType".
 *
 * Columns in table "endpoint_gateway_type" available as properties of the model,
 * followed by relations of table "endpoint_gateway_type" available as properties of the model.
 *
 * @property integer $id
 * @property string $value
 *
 * @property Endpoint[] $endpoints
 */
abstract class BaseEndpointGatewayType extends GxActiveRecord {

	public static function model($className=__CLASS__) {
		return parent::model($className);
	}

	public function tableName() {
		return 'endpoint_gateway_type';
	}

	public static function label($n = 1) {
		return Yii::t('app', 'EndpointGatewayType|EndpointGatewayTypes', $n);
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
			'endpoints' => array(self::HAS_MANY, 'Endpoint', 'endpoint_gateway_type_id'),
		);
	}

	public function pivotModels() {
		return array(
		);
	}

	public function attributeLabels() {
		return array(
			'id' => Yii::t('app', 'ID'),
			'value' => Yii::t('app', 'Value'),
			'endpoints' => null,
		);
	}

	public function search() {
		$criteria = new CDbCriteria;

		$criteria->compare('id', $this->id);
		$criteria->compare('value', $this->value, true);

		return new CActiveDataProvider($this, array(
			'criteria' => $criteria,
		));
	}
}