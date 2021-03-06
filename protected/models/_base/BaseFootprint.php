<?php

/**
 * This is the model base class for the table "footprint".
 * DO NOT MODIFY THIS FILE! It is automatically generated by giix.
 * If any changes are necessary, you must set or override the required
 * property or method in class "Footprint".
 *
 * Columns in table "footprint" available as properties of the model,
 * followed by relations of table "footprint" available as properties of the model.
 *
 * @property string $id
 * @property string $endpoint_id
 * @property string $subnet_num
 * @property string $mask_num
 * @property string $subnet_ip
 * @property string $prefix
 *
 * @property Endpoint $endpoint
 */
abstract class BaseFootprint extends GxActiveRecord {

	public static function model($className=__CLASS__) {
		return parent::model($className);
	}

	public function tableName() {
		return 'footprint';
	}

	public static function label($n = 1) {
		return Yii::t('app', 'Footprint|Footprints', $n);
	}

	public static function representingColumn() {
		return 'subnet_ip';
	}

	public function rules() {
		return array(
			array('endpoint_id, subnet_num, mask_num, subnet_ip, prefix', 'required'),
			array('endpoint_id, subnet_num, mask_num', 'length', 'max'=>10),
			array('subnet_ip', 'length', 'max'=>15),
			array('prefix', 'length', 'max'=>1),
			array('id, endpoint_id, subnet_num, mask_num, subnet_ip, prefix', 'safe', 'on'=>'search'),
		);
	}

	public function relations() {
		return array(
			'endpoint' => array(self::BELONGS_TO, 'Endpoint', 'endpoint_id'),
		);
	}

	public function pivotModels() {
		return array(
		);
	}

	public function attributeLabels() {
		return array(
			'id' => Yii::t('app', 'ID'),
			'endpoint_id' => null,
			'subnet_num' => Yii::t('app', 'Subnet Num'),
			'mask_num' => Yii::t('app', 'Mask Num'),
			'subnet_ip' => Yii::t('app', 'Subnet Ip'),
			'prefix' => Yii::t('app', 'Prefix'),
			'endpoint' => null,
		);
	}

	public function search() {
		$criteria = new CDbCriteria;

		$criteria->compare('id', $this->id, true);
		$criteria->compare('endpoint_id', $this->endpoint_id);
		$criteria->compare('subnet_num', $this->subnet_num, true);
		$criteria->compare('mask_num', $this->mask_num, true);
		$criteria->compare('subnet_ip', $this->subnet_ip, true);
		$criteria->compare('prefix', $this->prefix, true);

		return new CActiveDataProvider($this, array(
			'criteria' => $criteria,
		));
	}
}