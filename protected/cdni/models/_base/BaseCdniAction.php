<?php

/**
 * This is the model base class for the table "cdni_action".
 * DO NOT MODIFY THIS FILE! It is automatically generated by giix.
 * If any changes are necessary, you must set or override the required
 * property or method in class "CdniAction".
 *
 * Columns in table "cdni_action" available as properties of the model,
 * and there are no model relations.
 *
 * @property string $id
 * @property integer $endpoint_id
 * @property string $action
 * @property string $params
 *
 */
abstract class BaseCdniAction extends GxActiveRecord {

	public static function model($className=__CLASS__) {
		return parent::model($className);
	}

	public function tableName() {
		return 'cdni_action';
	}

	public static function label($n = 1) {
		return Yii::t('app', 'CdniAction|CdniActions', $n);
	}

	public static function representingColumn() {
		return 'action';
	}

	public function rules() {
		return array(
			array('endpoint_id, action, params', 'required'),
			array('endpoint_id', 'numerical', 'integerOnly'=>true),
			array('action', 'length', 'max'=>30),
			array('params', 'length', 'max'=>2000),
			array('id, endpoint_id, action, params', 'safe', 'on'=>'search'),
		);
	}

	public function relations() {
		return array(
		);
	}

	public function pivotModels() {
		return array(
		);
	}

	public function attributeLabels() {
		return array(
			'id' => Yii::t('app', 'ID'),
			'endpoint_id' => Yii::t('app', 'Endpoint'),
			'action' => Yii::t('app', 'Action'),
			'params' => Yii::t('app', 'Params'),
		);
	}

	public function search() {
		$criteria = new CDbCriteria;

		$criteria->compare('id', $this->id, true);
		$criteria->compare('endpoint_id', $this->endpoint_id);
		$criteria->compare('action', $this->action, true);
		$criteria->compare('params', $this->params, true);

		return new CActiveDataProvider($this, array(
			'criteria' => $criteria,
		));
	}
}