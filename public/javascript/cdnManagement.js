var app = angular.module('cdnManagement', ['ngCookies', 'ngMessages']);

app.directive('strongSecret', function () {
    return {

        // limit usage to argument only
        restrict: 'A',

        // require NgModelController, i.e. require a controller of ngModel directive
        require: 'ngModel',

        // create linking function and pass in our NgModelController as a 4th argument
        link: function (scope, element, attr, ctrl) {
            // please note you can name your function & argument anything you like
            function customValidator(ngModelValue) {

                if (/\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/.test(ngModelValue)) {
                    ctrl.$setValidity('ipValidator', true);
                } else {
                    ctrl.$setValidity('ipValidator', false);
                }

                // we need to return our ngModelValue, to be displayed to the user(value of the input)
                return ngModelValue;
            }
            ctrl.$parsers.push(customValidator);
        }
    };
});

app.controller('MainController', ['$location', '$cookieStore', '$scope', '$http', '$window', '$timeout', function ($location, $cookieStore, $scope, $http, $window, $timeout) {

    $scope.formDataCdni = {};
    $scope.cdniData = {};

    $scope.formFootprintsData = {};
    $scope.footprintData = {};

    $scope.contentOriginsData = {};
    $scope.serviceEnginesData = {};
    $scope.deliveryServicesData = {};
    $scope.deliveryServicesAll = {};

    //show div when success insert of footprins
    $scope.successfullFootInsert = false;

    $scope.ownInterface = {};

    //setting set pristine test
    $scope.form = {};

    $scope.formCreateContent = {};
    $scope.formCreateDelSer = {};
    $scope.formAssignDelSer = {};

    //array for temporary store of content before editation
    $scope.modifyContentOrigin = {};
    //object to store information about actual editing content origins
    $scope.editingData = {};

    var deliveryServicesReceived = 0;
    var serviceEnginesReceived = 0;

    var loggedUser = $cookieStore.get('user');
    var socket = null;

    $scope.user = loggedUser[0].login;

    $scope.init = function () {
        // to get working assign to div ng-init="init()"

        var socket = io.connect('http://localhost:8080');
        /*$scope.join = function () {
            socket.emit('add-customer', $scope.currentCustomer);
        };

        socket.on('notification', function (data) {
            $scope.$apply(function () {
                $scope.newCustomers.push(data.customer);
            });
        });*/
    }

    $scope.logout = function () {
        $http.get('/logoutUser')
            .success(function (data) {
                console.log(data);
                window.location = '/'
            })
            .error(function (error) {
                console.log('Error: ' + error);
            });
    }

    $scope.createOffer = function (cdni) {
        var req = {
            //own interface is filled after received getData function
            sender: $scope.ownInterface,
            target: cdni
        }
        waitingDialog.show();
        $http.post('http://localhost:8080/cdniApi/initialOffer', req)
            .success(function (data) {
                console.log(data);
                $scope.cdniData = data.data;
                waitingDialog.hide();
            })
            .error(function (error) {
                waitingDialog.hide();
                console.log('Error: ' + error);
            });
    }

    $scope.acceptOffer = function (cdni) {
        var req = {
            //own interface is filled after received getData function
            sender: $scope.ownInterface,
            target: cdni
        }
        waitingDialog.show();
        $http.post('http://localhost:8080/cdniApi/initialAcceptOffer', req)
            .success(function (data) {
                console.log(data);
                $scope.cdniData = data.data;
                waitingDialog.hide();
            })
            .error(function (error) {
                waitingDialog.hide();
                console.log('Error: ' + error);
            });
    }

    $scope.syncCdni = function (cdni) {
        var req = {
            //own interface is filled after received getData function
            sender: $scope.ownInterface,
            target: cdni
        }
        waitingDialog.show();
        $http.post('http://localhost:8080/cdniApi/createLists', req)
            .success(function (data) {
                console.log(data);
                waitingDialog.hide();
                $window.alert(data.message);
                $window.location.reload();
            })
            .error(function (error) {
                waitingDialog.hide();
                console.log('Error: ' + error);
            });
    }

    $scope.deleteInterconnection = function (cdni) {
        var req = {
            //own interface is filled after received getData function
            sender: $scope.ownInterface,
            target: cdni
        }
        console.log(req.target.id);
        waitingDialog.show();
        $http.delete('http://localhost:8080/cdniApi/initialDeleteInterconnection/' + req.target.id)
            .success(function (data) {

                waitingDialog.hide();
                if (data === 'Received') {
                    $window.alert('Deletion finished');
                    $window.location.reload();
                }

            })
            .error(function (error) {
                waitingDialog.hide();
                console.log('Error: ' + error);
            });
    }

    //---------------------------------------------------------------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------------------------------------------------------------
    //CDN INTERFACE FUNCTIONS
    //---------------------------------------------------------------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------------------------------------------------------------
    //add CDN interface

    $scope.addCDN = function () {
        $scope.formDataCdni["offerStatus"] = "4";
        $http.post('/addCDN', $scope.formDataCdni)
            .success(function (data) {
                $scope.formDataCdni = {};
                $scope.cdniData = data.data;
                console.log(data);
            })
            .error(function (error) {
                $window.alert(error.message);
            });
    };

    //GET ALL CDN interfaces
    $http.get('/getData')
        .success(function (data) {
            console.log(data);
            $scope.cdniData = data.data;

            for (var i = 0; i < data.data.length; i++) {
                if (data.data[i].id === 1) {
                    $scope.ownInterface = data.data[i];
                }
            }
            $scope.getContentOrigins();
        })
        .error(function (error) {
            $window.alert(error.message);
        });

    //DELETE CDN
    $scope.deleteCDNinterface = function (cdnID) {
        $http.delete('/deleteCDNinterface/' + cdnID)
            .success(function (data) {
                $scope.cdniData = data;
                console.log(data);
                console.log(data);
            })
            .error(function (data) {
                $window.alert(error.message);
            });
    };
    //---------------------------------------------------------------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------------------------------------------------------------
    //FOOTPRINT FUNCTIONS
    //---------------------------------------------------------------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------------------------------------------------------------

    //GET ALL FOOTPRINTS

    $http.get('/getFootprints')
        .success(function (data) {
            console.log(data);
            var arr = [];
            for (var i = 0; i < data.data.length; i++) {

                arr.push(data.data[i]);

            }
            $scope.footprintData = arr;
        })
        .error(function (error) {
            $window.alert(error.message);
        });

    $scope.deleteFootprint = function (footId) {
        waitingDialog.show();
        $http.delete('/deleteFootprints/' + footId)
            .success(function (data) {
                waitingDialog.hide();
                $scope.footprintData = data;
                console.log(data);
            })
            .error(function (error) {
                $window.alert(error.message);
                waitingDialog.hide();
            });
    }


    //CREATE NEW FOOTPRINT
    $scope.addFootprint = function (isValid) {

        if (isValid) {
            $http.post('/addFootprints', $scope.formFootprintsData)
                .success(function (data) {
                    $scope.formFootprintsData = {};
                    $scope.form.addFoot.$setPristine();
                    $scope.footprintData = data.data;
                    $scope.afterInsertFootprint();
                    console.log(data);


                })
                .error(function (error) {
                    $window.alert(error.message);
                });
        }
    };

    $scope.afterInsertFootprint = function () {
        $scope.successfullFootInsert = true;
        $timeout(function () { $scope.successfullFootInsert = false; }, 3000);
    }

    //---------------------------------------------------------------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------------------------------------------------------------
    //CONTENT ORIGINS EDITATION
    //---------------------------------------------------------------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------------------------------------------------------------
    //GET ALL CONTENT ORIGINS
    $scope.getContentOrigins = function () {
        $http.get('/cdsmApi/getContentOrigins')
            .success(function (data) {
                $scope.contentOriginsData = data.data;
                arrContentOrigins = [];
            })
            .error(function (error) {
                console.log('Error: ' + error);
            });
    }

    //CREATE CONTENT ORIGIN
    $scope.createContentOrigin = function () {
        waitingDialog.show();
        $http.post('/cdsmApi/createContentOrigins', $scope.formCreateContent)
            .success(function (data) {
                console.log(data);
                $window.location.reload();
            })
            .error(function (error) {
                waitingDialog.hide();
                $window.alert(error.message);
            });
    };

    $scope.editingData = {};

    for (var i = 0, length = $scope.contentOriginsData.length; i < length; i++) {
        $scope.editingData[$scope.contentOriginsData[i].id] = false;
    }

    $scope.modify = function (tableData) {
        $scope.editingData[tableData.id] = true;
        $scope.modifyContentOrigin = angular.copy(tableData);
    };

    //UPDATE CONTENT ORIGIN
    $scope.updateContentOrigin = function (tableData) {
        $scope.editingData[tableData.id] = false;
        waitingDialog.show();
        $http.put('/cdsmApi/updateContentOrigins/' + tableData.id, tableData)
            .success(function (data) {
                $window.location.reload();
            })
            .error(function (error) {
                waitingDialog.hide();
                $window.alert(error.message);
            });
    };

    $scope.cancel = function (tableData) {
        $scope.editingData[tableData.id] = false;
        for (var i = 0; i < $scope.contentOriginsData.length; i++) {
            if ($scope.contentOriginsData[i].id === $scope.modifyContentOrigin.id) {
                $scope.contentOriginsData[i].name = $scope.modifyContentOrigin.name;
                $scope.contentOriginsData[i].originFqdn = $scope.modifyContentOrigin.originFqdn;
                $scope.contentOriginsData[i].rfqdn = $scope.modifyContentOrigin.rfqdn;
                $scope.modifyContentOrigin = {};
                return;
            }
        }
    }

    //DELETE CONTENT ORIGIN
    $scope.deleteContentOrigin = function (originID) {
        waitingDialog.show();
        $http.delete('/cdsmApi/deleteContentOrigins/' + originID)
            .success(function (data) {
                $window.location.reload();
            })
            .error(function (error) {
                waitingDialog.hide();
                $window.alert(error.message);
            });
    };

    //---------------------------------------------------------------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------------------------------------------------------------
    //DELIVERY SERVICES EDITATION
    //---------------------------------------------------------------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------------------------------------------------------------


    // call function to merge 2 requests , get delivery services and get service engines
    // loop through responses and find service engines for delivery services
    $scope.addSeName = function () {
        var arrDeliveryServices = [];
        for (var i = 0, length = $scope.deliveryServicesData.length; i < length; i++) {
            var foundSe = 0;
            for (var j = 0, length2 = $scope.serviceEnginesData.length; j < length2; j++) {

                console.log(j + 1);
                console.log($scope.serviceEnginesData.length);
                if ($scope.deliveryServicesData[i].seID === $scope.serviceEnginesData[j].id) {
                    foundSe = 1;
                    var deliveryService = {
                        name: $scope.deliveryServicesData[i].name,
                        originFqdn: $scope.deliveryServicesData[i].originFqdn,
                        rfqdn: $scope.deliveryServicesData[i].rfqdn,
                        id: $scope.deliveryServicesData[i].id,
                        originID: $scope.deliveryServicesData[i].originID,
                        seID: $scope.deliveryServicesData[i].seID,
                        seName: $scope.serviceEnginesData[j].name
                    }
                    console.log(deliveryService);
                    arrDeliveryServices.push(deliveryService);
                    break;
                }

                if ((j + 1 === $scope.serviceEnginesData.length)) {

                    var deliveryService = {
                        name: $scope.deliveryServicesData[i].name,
                        originFqdn: $scope.deliveryServicesData[i].originFqdn,
                        rfqdn: $scope.deliveryServicesData[i].rfqdn,
                        id: $scope.deliveryServicesData[i].id,
                        originID: $scope.deliveryServicesData[i].originID,
                        seID: null,
                        seName: "Unassigned"
                    }
                    console.log(deliveryService);
                    arrDeliveryServices.push(deliveryService);
                }
            }
        }
        $scope.deliveryServicesAll = arrDeliveryServices;
        serviceEnginesReceived = 0;
        deliveryServicesReceived = 0;
    };

    // GET ALL DELIVERY SERVICES
    $http.get('/cdsmApi/getDeliveryServices')
        .success(function (data) {

            $scope.deliveryServicesData = data.data;
            //this is check if response come first from get Service engines or get delivery services
            deliveryServicesReceived = 1;
            //if service engines was received then call addSeName FUNCTIONS
            if (serviceEnginesReceived == 1) {
                $scope.addSeName();
            }
            arrContentOrigins = [];
        })
        .error(function (error) {
            $window.alert(error.message);
        });

    //GET SERVICE ENGINES
    $http.get('/cdsmApi/getSE')
        .success(function (data) {
            $scope.serviceEnginesData = data.data;
            //this is check if response come first from get Service engines or get delivery services
            serviceEnginesReceived = 1;
            //if delivery services was received then call function
            if (deliveryServicesReceived == 1) {
                $scope.addSeName();
            }
        })
        .error(function (error) {
            $window.alert(error.message);
        });

    //CREATE DELIVERY SERVICE
    $scope.createDeliveryService = function () {
        waitingDialog.show();
        var origName = $scope.formCreateDelSer.contentOrigin;
        var originID = 0;
        // loop through contentOriginsData because in front end is showed only name, so we must find ID for name
        for (var i = 0, len = $scope.contentOriginsData.length; i < len; i++) {
            if ($scope.contentOriginsData[i].name === origName) {
                originID = $scope.contentOriginsData[i].id;
                break;
            }
        }

        var tempObj = {
            serName: $scope.formCreateDelSer.serName,
            idOrigin: originID
        }

        console.log(tempObj)
        $http.post('/cdsmApi/createDeliveryService', tempObj)
            .success(function (data) {
                $window.location.reload();
            })
            .error(function (error) {
                waitingDialog.hide();
                $window.alert(error.message);
            });
    };

    //DELETE DELIVERY SERVICE
    $scope.deleteDeliveryService = function (ID) {
        waitingDialog.show();
        $http.delete('/cdsmApi/deleteDeliveryService/' + ID)
            .success(function (data) {
                $window.location.reload();
            })
            .error(function (error) {
                waitingDialog.hide();
                $window.alert(error.message);
            });
    };

    //ASSIGN/UNASSIGN SERVICE ENGINE
    $scope.assignSE = function (delSer, swtch) {
        waitingDialog.show();
        // because in table there are 2 sources of data, from deliveryServicesAll and in dropdown serviceEnginesData, delivery service is passed through function and seName through scope
        var seName = $scope.formAssignDelSer.seName;
        var delSerID;
        var seID;
        //find IDs according to name 
        for (var i = 0, len = $scope.deliveryServicesAll.length; i < len; i++) {
            if ($scope.deliveryServicesAll[i].name === delSer) {
                delSerID = $scope.deliveryServicesAll[i].id;
                break;
            }
        }

        for (var i = 0, len = $scope.serviceEnginesData.length; i < len; i++) {
            if ($scope.serviceEnginesData[i].name === seName) {
                seID = $scope.serviceEnginesData[i].id;
                break;
            }
        }

        var tempObj = {
            delSerID: delSerID,
            seID: seID
        }

        console.log(delSerID + "   " + seID);
        if (swtch === 1) {
            $http.post('/cdsmApi/assignSE', tempObj)
                .success(function (data) {
                    $window.location.reload();
                })
                .error(function (error) {
                    $window.alert(error.message);
                });
        }
        else {
            $http.post('/cdsmApi/unAssignSE', tempObj)
                .success(function (data) {
                    $window.location.reload();
                })
                .error(function (error) {
                    $window.alert(error.message);
                });
        }

    };


    $scope.editingDataDelivery = {};

    for (var i = 0, length = $scope.deliveryServicesAll.length; i < length; i++) {
        $scope.editingDataDelivery[$scope.deliveryServicesAll[i].id] = false;
    }

    $scope.modifyDelivery = function (tableData) {
        $scope.editingDataDelivery[tableData.id] = true;
    };

    $scope.cancelDelivery = function (tableData) {
        $scope.editingDataDelivery[tableData.id] = false
    }
}]);

app.controller('TabController', ['$scope', function ($scope) {

    this.tab = 1;
    this.isSet = function (checkTab) {
        return this.tab === checkTab;
    };
    this.setTab = function (setTab) {
        this.tab = setTab;
    };

}]);
