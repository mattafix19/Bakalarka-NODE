
var database = require('../models/database');
var db = database.db;

var ipUtils = require('ip2long');
var ip2long = ipUtils.ip2long;
var long2ip = ipUtils.long2ip;

//get data from table cdn_interface with join on foreingn keys
function getData(req, res, next) {
  db.any('SELECT * FROM cdn_interface cdn JOIN endpoint_gateway_type endp ON cdn.endpoint_gateway_type_id = endp.id_gateway JOIN endpoint_type endpt ON cdn.endpoint_type_id = endpt.id_type JOIN offer_status offStat ON cdn.offer_status = offStat.id_offer_status')
    .then(function (result) {

      var redisService = require('../services/redisService');
      var interfaces = redisService.addRemoteInterface(result);

      res.status(200)
        .json({
          status: 'success',
          data: interfaces,
          message: 'Retrieved ALL Data'
        });
    })
    .catch(function (err) {
      var obj = {
        status: 'Failed',
        data: err.message,
        message: "FAILED DURING RETRIEVING ALL INTERFACES: " + err.message
      }
      res.status(404)
        .json(obj);
    });
}

//get all footprints
function getFootprints(req, res, next) {
  db.any('SELECT * from footprint')
    .then(function (result) {

      var redisService = require("../services/redisService");
      var footprints = redisService.addFootprintsRedis(result);

      res.status(200)
        .json({
          status: 'success',
          data: footprints,
          message: 'Retrieved ALL Footprints'
        });
    })
    .catch(function (err) {
      var obj = {
        status: 'Failed',
        data: err.message,
        message: "FAILED DURING RETRIEVING ALL FOOTPRINTS: " + err.message
      }
      res.status(404)
        .json(obj);
    });
}

function deleteFootprints(req, res, next) {
  var id = req.params.footId;
  db.any('DELETE FROM footprint where id = ($1)', [id])
    .then(function (deleteResult) {
      db.any('SELECT * FROM footprint')
        .then(function (selectAllFootRes) {
          var redisService = require("../services/redisService");
          var footprints = redisService.addFootprintsRedis(selectAllFootRes);
          res.json(footprints);
        })
        .catch(function (err) {
          var obj = {
            status: 'Failed',
            data: err.message,
            message: "FAILED DURING RETRIEVING ALL FOOTPRINTS, DELETE SUCCESS: " + err.message
          }
          res.status(404)
            .json(obj);
        })
    })
    .catch(function (err) {
      var obj = {
        status: 'Failed',
        data: err.message,
        message: "FAILED DURING DELETION, NO CHANGES APPLIED: " + err.message
      }
      res.status(404)
        .json(obj);
    })
}

function addFootprints(req, res, next) {

  var cidr = require('cidr.rb');

  var data = {
    endpoint: req.body.endpoint,
    subnetIp: req.body.subnetIp,
    prefix: req.body.prefix
  };

  var network = new cidr.Net(data.subnetIp + "/" + data.prefix);
  var netAddressLong = network.netaddr();
  var netAddress = long2ip(netAddressLong.addr);

  var subnetNum = netAddressLong.addr;
  var maskNum = network.mask.addr;


  db.any('INSERT INTO footprint (endpoint_id,subnet_num,mask_num,subnet_ip,prefix) VALUES ($1,$2,$3,$4,$5)', [data.endpoint, subnetNum, maskNum, netAddress, data.prefix])
    .then(function (result) {
      db.any('SELECT * FROM footprint ORDER BY id ASC')
        .then(function (result2) {
          var redisService = require("../services/redisService");

          var redisService = require("../services/redisService");
          var footprints = redisService.addFootprintsRedis(result2);

          res.status(200)
            .json({
              status: 'success',
              data: footprints,
              message: 'Retrieved ALL footprints after success footprints insertion'
            });
        })
        .catch(function (err) {
          var obj = {
            status: 'Failed',
            data: err.message,
            message: "FAILED DURING RETRIEVING ALL FOOTPRINTS INSERTION SUCCESS " + err.message
          }
          res.status(404)
            .json(obj);
        });
    })
    .catch(function (err) {
      var obj = {
        status: 'Failed',
        data: err.message,
        message: "FAILED DURING INSERTION, NO CHANGES APPLIED: " + err.message
      }
      res.status(404)
        .json(obj);
    });
}

function addCdn(req, res, next) {
  var data = {
    name: req.body.name,
    url: req.body.url,
    url_translator: req.body.url_translator,
    url_cdn: req.body.url_cdn,
    port_cdn: req.body.port_cdn,
    login: req.body.login,
    pass: req.body.pass,
    priority: req.body.priority,
    endpoint_gateway_type: req.body.endpoint_gateway_type,
    endpoint_type: req.body.endpoint_type,
    offer_status: req.body.offerStatus
  };
  db.any('INSERT INTO cdn_interface (name, url, url_translator, url_cdn, port_cdn, login, pass, priority, endpoint_type_id, endpoint_gateway_type_id, offer_status) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)', [data.name, data.url, data.url_translator, data.url_cdn, data.port_cdn, data.login, data.pass, data.priority, data.endpoint_gateway_type, data.endpoint_type, data.offer_status])
    .then(function (result) {
      db.any('SELECT * FROM cdn_interface cdn JOIN endpoint_gateway_type endp ON cdn.endpoint_gateway_type_id = endp.id_gateway JOIN endpoint_type endpt ON cdn.endpoint_type_id = endpt.id_type JOIN offer_status offStat ON cdn.offer_status = offStat.id_offer_status')
        .then(function (result2) {

          var redisService = require('../services/redisService');
          var interfaces = redisService.addRemoteInterface(result2);

          res.status(200)
            .json({
              status: 'success',
              data: interfaces,
              message: 'Retrieved ALL cdn interfaces after success interface insertion'
            });
        })
        .catch(function (err) {
          var obj = {
            status: 'Failed',
            data: err.message,
            message: "FAILED DURING RETRIEVING ALL INTERFACES: " + err.message
          }
          res.status(404)
            .json(obj);
        });
    })
    .catch(function (err) {
      var obj = {
        status: 'Failed',
        data: err.message,
        message: "FAILED DURING INSERTION, NO CHANGES APPLIED: " + err.message
      }
      res.status(404)
        .json(obj);
    });
}

function deleteCDNinterface(req, res, next) {
  var id = req.params.cdnId;

  db.any('DELETE FROM cdn_interface WHERE id=($1)', [id])
    .then(function (result) {
      db.any('SELECT * FROM cdn_interface cdn JOIN endpoint_gateway_type endp ON cdn.endpoint_gateway_type_id = endp.id_gateway JOIN endpoint_type endpt ON cdn.endpoint_type_id = endpt.id_type JOIN offer_status offStat ON cdn.offer_status = offStat.id_offer_status')
        .then(function (result2) {

          var redisService = require('../services/redisService');
          var interfaces = redisService.addRemoteInterface(result2);

          res.status(200)
            .json({
              status: 'success',
              data: interfaces,
              message: 'Retrieved ALL cdn interfaces after success interface deletion'
            });
        })
        .catch(function (err) {
          var obj = {
            status: 'Failed',
            data: err.message,
            message: "FAILED DURING RETRIEVING ALL INTERFACES: " + err.message
          }
          res.status(404)
            .json(obj);
        });
    })
    .catch(function (err) {
      var obj = {
        status: 'Failed',
        data: err.message,
        message: "FAILED DURING DELETION OF CDN INTERFACE, NO CHANGES APPLIED: " + err.message
      }
      res.status(404)
        .json(obj);
    });
}

function loginUser(req, res, next) {

  req.session.login = req.body.login;

  var results = [];

  var data = {
    login: req.body.login,
    pass: req.body.pass
  };

  db.any('SELECT * FROM users WHERE login=($1) AND pass=($2) AND admin="t"', [data.login, data.pass])
    .then(function (result) {
      var users = [];
      for (var i = 0; i < result.length; i++) {
        users.push(result[i]);
      }
      res.status(200)
        .json({
          status: 'success',
          data: users,
          message: 'Retrieved user'
        });
    })
    .catch(function (err) {
      var obj = {
        status: 'Failed',
        data: err.message,
        message: "FAILED DURING LOGGING OR NO USER FOUND: " + err.message
      }
      res.status(404)
        .json(obj);
    });
}

//register offer 
function registerOffer(req, res, next) {
  //after get createOffer check the presence of interface
  db.any('SELECT * from cdn_interface WHERE url=($1)', [req.body.sender.url])
    .then(function (result) {
      //if there is result
      if (result != 0) {
        //update with offer status 5 -> NEW and respond with 200
        var id = result[0].id;
        db.any('UPDATE public.cdn_interface SET offer_status=($1) WHERE id=($2)', [5, id])
          .then(function (result2) {
            res.status(200)
              .json({
                status: 'success',
                data: 'OK',
                message: 'Successfull receive of offer'
              });
          })
          .catch(function (err) {
            var obj = {
              status: 'Failed',
              data: err.message,
              message: "FAILED DURING UPDATING NEW INTERFACE ON REMOTE SIDE: " + err.message
            }
            res.status(404)
              .json(obj);
          });
      }
      //else create record with status 5 and type remote endpoint_type = 2 and respond with 200
      else {
        var data = req.body.sender;
        db.any('INSERT INTO cdn_interface (name, url, url_translator, url_cdn, port_cdn, login, pass, priority, endpoint_type_id, endpoint_gateway_type_id, offer_status) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)', [data.name, data.url, data.url_translator, data.url_cdn, data.port_cdn, data.login, data.pass, data.priority, 2, data.endpoint_gateway_type_id, 5])
          .then(function (result2) {
            db.any('SELECT * FROM cdn_interface cdn JOIN endpoint_gateway_type endp ON cdn.endpoint_gateway_type_id = endp.id_gateway JOIN endpoint_type endpt ON cdn.endpoint_type_id = endpt.id_type JOIN offer_status offStat ON cdn.offer_status = offStat.id_offer_status')
              .then(function (result3) {

                var redisService = require('../services/redisService');
                var interfaces = redisService.addRemoteInterface(result3);

                res.status(200)
                  .json({
                    status: 'success',
                    data: 'OK',
                    message: 'Successfull receive of offer'
                  });
              })
              .catch(function (err) {
                var obj = {
                  status: 'Failed',
                  data: err.message,
                  message: "FAILED DURING RETREIVING ALL INTERFACES ON REMOTE SIDE, CREATING SUCCESSFULL: " + err.message
                }
                res.status(404)
                  .json(obj);
              })
          })
          .catch(function (err) {
            var obj = {
              status: 'Failed',
              data: err.message,
              message: "FAILED DURING CREATION OF NEW INTERFACE ON REMOTE SIDE: " + err.message
            }
            res.status(404)
              .json(obj);
          });
      }
    })
    .catch(function (err) {
      var obj = {
        status: 'Failed',
        data: err.message,
        message: "FAILED DURING SEARCHING ENDPOINT ON REMOTE SIDE, NO CHANGES APPLIED: " + err.message
      }
      res.status(404)
        .json(obj);
    });
}

//notify offer is response to those interfaces which sends offer 
function notifyOffer(req, res, next) {
  var id = req.id;
  db.any('UPDATE public.cdn_interface SET offer_status=($1) WHERE id=($2)', [2, id])
    .then(function (result) {
      db.any('SELECT * FROM cdn_interface cdn JOIN endpoint_gateway_type endp ON cdn.endpoint_gateway_type_id = endp.id_gateway JOIN endpoint_type endpt ON cdn.endpoint_type_id = endpt.id_type JOIN offer_status offStat ON cdn.offer_status = offStat.id_offer_status')
        .then(function (result2) {
          var interfaces = [];
          for (var i = 0; i < result2.length; i++) {
            interfaces.push(result2[i]);
          }
          res.status(200)
            .json({
              status: 'success',
              data: interfaces,
              message: 'Successfull receive of offer'
            });
        })
        .catch(function (err) {
          var obj = {
            status: 'Failed',
            data: err.message,
            message: "FAILED DURING RETRIEVING ALL INTERFACES ON LOCAL SIDE, UPDATE SUCCESS: " + err.message
          }
          res.status(404)
            .json(obj);
        });
    })
    .catch(function (err) {
      var obj = {
        status: 'Failed',
        data: err.message,
        message: "FAILED DURING UPDATING INTERFACE ON LOCAL SIDE AFTER RECEIVING RESPONSE FROM REMOTE INTERFACE: " + err.message
      }
      res.status(404)
        .json(obj);
    });
}

//accept offer
function acceptOffer(req, res, next) {
  //get row from table to get local ID
  db.any('SELECT * from cdn_interface WHERE url=($1)', [req.body.sender.url])
    .then(function (result) {
      //if there is result and is in offer status -> 2 (offered)
      if ((result != 0) && (result[0].offer_status === "2")) {
        //update with offer status 6 -> ACCEPTED DOWNSTREAM and respond with 200
        var id = result[0].id;
        db.any('UPDATE public.cdn_interface SET offer_status=($1) WHERE id=($2)', [6, id])
          .then(function (result2) {
            res.status(200)
              .json({
                status: 'success',
                data: 'OK',
                message: 'Successfull accepted offer'
              });
          })
          .catch(function (err) {
            var obj = {
              status: 'Failed',
              data: err.message,
              message: "FAILED DURING UPDATING OFFER STATUS ON REMOTE INTERFACE: " + err.message
            }
            res.status(404)
              .json(obj);
          });
      }

      else {
        res.status(404)
          .json({
            status: 'FAILED',
            data: 'FAILED',
            message: 'Interface not present or is not offered'
          });
      }
    })
    .catch(function (err) {
      var obj = {
        status: 'Failed',
        data: err.message,
        message: "FAILED DURING SEARCHING REMOTE INTERFACE ON LOCAL SIDE, NO CHANGES APPLIED: " + err.message
      }
      res.status(404)
        .json(obj);
    });
}

//mark valid offer after response of accept
function markValidOffer(req, res, next) {
  var id = req.id;
  //set up offer status 1 which is accepted UPSTREAM
  //save it to redis because during translation we want to translate to only those interfaces
  db.any('UPDATE public.cdn_interface SET offer_status=($1) WHERE id=($2)', [1, id])
    .then(function (result) {
      db.any('SELECT * FROM cdn_interface cdn JOIN endpoint_gateway_type endp ON cdn.endpoint_gateway_type_id = endp.id_gateway JOIN endpoint_type endpt ON cdn.endpoint_type_id = endpt.id_type JOIN offer_status offStat ON cdn.offer_status = offStat.id_offer_status')
        .then(function (result2) {

          var redisService = require('../services/redisService');
          var interfaces = redisService.addRemoteInterface(result2);

          res.status(200)
            .json({
              status: 'success',
              data: interfaces,
              message: 'Successfull receive of offer'
            });
        })
        .catch(function (err) {
          var obj = {
            status: 'Failed',
            data: err.message,
            message: "FAILED DURING RETRIEVING ALL INTERFACES AFTER UPDATE ON LOCAL SIDE AFTER RESPONSE FROM REMOTE SIDE: " + err.message
          }
          res.status(404)
            .json(obj);
        });
    })
    .catch(function (err) {
      var obj = {
        status: 'Failed',
        data: err.message,
        message: "FAILED DURING UPDATE LOCAL INTERFACE AFTER RESPONSE FROM REMOTE SIDE: " + err.message
      }
      res.status(404)
        .json(obj);
    });
}

//function to get footprints according to endpoint ID
function getFootprintsList(req) {
  return new Promise(function (resolve, reject) {
    db.any('SELECT foot.subnet_num, foot.mask_num, foot.subnet_ip, foot.prefix from cdn_interface as cdn JOIN footprint as foot ON cdn.id = foot.endpoint_id where cdn.id = ($1)', [req])
      .then(function (result) {
        var interfaces = [];
        for (var i = 0; i < result.length; i++) {
          interfaces.push(result[i]);
        }
        resolve(interfaces);

      })
      .catch(function (err) {
        var obj = {
          status: 'Failed',
          data: err.message,
          message: "FAILED DURING RETRIEVING ALL FOOTPRINTS ON SPECIFIC ID: " + err.message
        }
        res.status(404)
          .json(obj);
      });
  });
}

//get own local interface ID = 1
function getOwnInterface() {
  return new Promise(function (resolve, reject) {
    db.any('SELECT * FROM cdn_interface WHERE id = 1')
      .then(function (result) {
        resolve(result);
      })
      .catch(function (err) {
        var obj = {
          status: 'Failed',
          data: err.message,
          message: "FAILED DURING RETRIEVING OWN INTERFACE: " + err.message
        }
        res.status(404)
          .json(obj);
      })
  });
};

module.exports = {
  db: db,
  getData: getData,
  getFootprints: getFootprints,
  deleteFootprints: deleteFootprints,
  addFootprints: addFootprints,
  addCdn: addCdn,
  deleteCDNinterface: deleteCDNinterface,
  registerOffer: registerOffer,
  notifyOffer: notifyOffer,
  acceptOffer: acceptOffer,
  markValidOffer: markValidOffer,
  getFootprintsList: getFootprintsList,
  getOwnInterface: getOwnInterface
};