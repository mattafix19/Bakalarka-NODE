<?php

/**
 * This is the model base class for the table "endpoint".
 * DO NOT MODIFY THIS FILE! It is automatically generated by giix.
 * If any changes are necessary, you must set or override the required
 * property or method in class "Endpoint".
 *
 * Columns in table "endpoint" available as properties of the model,
 * followed by relations of table "endpoint" available as properties of the model.
 *
 * @property string $id
 * @property string $name
 * @property string $url
 * @property string $url_translator
 * @property string $url_cdn
 * @property integer $port_cdn
 * @property string $login
 * @property string $pass
 * @property string $priority
 * @property string $endpoint_status_id
 * @property string $endpoint_type_id
 * @property integer $endpoint_gateway_type_id
 *
 * @property EndpointStatus $endpointStatus
 * @property EndpointType $endpointType
 * @property EndpointGatewayType $endpointGatewayType
 * @property EndpointCapability[] $endpointCapabilities
 * @property Footprint[] $footprints
 */
abstract class BaseEndpoint extends GxActiveRecord {

	public static function model($className=__CLASS__) {
		return parent::model($className);
	}

	public function tableName() {
		return 'endpoint';
	}

	public static function label($n = 1) {
		return Yii::t('app', 'Endpoint|Endpoints', $n);
	}

	public static function representingColumn() {
		return 'name';
	}

	public function rules() {
		return array(
			array('name, url, url_translator, url_cdn, port_cdn, login, pass, endpoint_type_id', 'required'),
			array('port_cdn, endpoint_gateway_type_id', 'numerical', 'integerOnly'=>true),
			array('name, login, pass', 'length', 'max'=>20),
			array('url, url_translator, url_cdn', 'length', 'max'=>100),
			array('priority, endpoint_status_id, endpoint_type_id', 'length', 'max'=>1),
			array('priority, endpoint_status_id, endpoint_gateway_type_id', 'default', 'setOnEmpty' => true, 'value' => null),
			array('id, name, url, url_translator, url_cdn, port_cdn, login, pass, priority, endpoint_status_id, endpoint_type_id, endpoint_gateway_type_id', 'safe', 'on'=>'search'),
		);
	}

	public function relations() {
		return array(
			'endpointStatus' => array(self::BELONGS_TO, 'EndpointStatus', 'endpoint_status_id'),
			'endpointType' => array(self::BELONGS_TO, 'EndpointType', 'endpoint_type_id'),
			'endpointGatewayType' => array(self::BELONGS_TO, 'EndpointGatewayType', 'endpoint_gateway_type_id'),
			'endpointCapabilities' => array(self::HAS_MANY, 'EndpointCapability', 'endpoint_id'),
			'footprints' => array(self::HAS_MANY, 'Footprint', 'endpoint_id'),
		);
	}

	public function pivotModels() {
		return array(
		);
	}

	public function attributeLabels() {
		return array(
			'id' => Yii::t('app', 'ID'),
			'name' => Yii::t('app', 'Name'),
			'url' => Yii::t('app', 'Url'),
			'url_translator' => Yii::t('app', 'Url Translator'),
			'url_cdn' => Yii::t('app', 'Url Cdn'),
			'port_cdn' => Yii::t('app', 'Port Cdn'),
			'login' => Yii::t('app', 'Login'),
			'pass' => Yii::t('app', 'Pass'),
			'priority' => Yii::t('app', 'Priority'),
			'endpoint_status_id' => null,
			'endpoint_type_id' => null,
			'endpoint_gateway_type_id' => null,
			'endpointStatus' => null,
			'endpointType' => null,
			'endpointGatewayType' => null,
			'endpointCapabilities' => null,
			'footprints' => null,
		);
	}

	public function search() {
		$criteria = new CDbCriteria;

		$criteria->compare('id', $this->id, true);
		$criteria->compare('name', $this->name, true);
		$criteria->compare('url', $this->url, true);
		$criteria->compare('url_translator', $this->url_translator, true);
		$criteria->compare('url_cdn', $this->url_cdn, true);
		$criteria->compare('port_cdn', $this->port_cdn);
		$criteria->compare('login', $this->login, true);
		$criteria->compare('pass', $this->pass, true);
		$criteria->compare('priority', $this->priority, true);
		$criteria->compare('endpoint_status_id', $this->endpoint_status_id);
		$criteria->compare('endpoint_type_id', $this->endpoint_type_id);
		$criteria->compare('endpoint_gateway_type_id', $this->endpoint_gateway_type_id);

		return new CActiveDataProvider($this, array(
			'criteria' => $criteria,
		));
	}
}