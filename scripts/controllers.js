'use strict';
confusionApp
        .controller('MenuController', ['$scope','menuFactory', function($scope, menuFactory) {
            $scope.showDetails = false;
            $scope.message = "Loading ...";

            $scope.tab = 1;
            $scope.filtText = '';
            $scope.showDetails = false;

            $scope.dishes= {};
			menuFactory.getDishes()
			.then(
					function(response) {
						$scope.dishes = response.data;
					},
                    function(response) {
                        $scope.message = "Error: "+response.status + " " + response.statusText;
                    }
			);

             $scope.select = function(setTab) {
                $scope.tab = setTab;
                if (setTab === 2) {
                    $scope.filtText = "appetizer";
                }
                else if (setTab === 3) {
                    $scope.filtText = "mains";
                }
                else if (setTab === 4) {
                    $scope.filtText = "dessert";
                }
                else {
                    $scope.filtText = "";
                }
            };
            $scope.isSelected = function (checkTab) {
                return ($scope.tab === checkTab);
            };

            $scope.toggleDetails = function() {
                $scope.showDetails = !$scope.showDetails;
            };

        }])

        .controller('ContactController', ['$scope', function($scope) {
            $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
                        var channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];
                        $scope.channels = channels;
            $scope.invalidChannelSelection = false;
                                }])



        .controller('DishDetailController', ['$scope',  '$routeParams', 'menuFactory' , function($scope, $routeParams, menuFactory) {
            $scope.showDetails = true;

            $scope.dish = {};
            menuFactory.getDish(parseInt($routeParams.id,10))
            .then(
                function(response){
                    $scope.dish = response.data;
                    $scope.showDish=true;
                }
            );


                                }])



        .controller('FeedbackController', ['$scope', function($scope) {
            $scope.sendFeedback = function() {
                console.log($scope.feedback);
                if ($scope.feedback.agree && ($scope.feedback.mychannel == "")&& !$scope.feedback.mychannel) {
                     $scope.invalidChannelSelection = true;
                    console.log('incorrect');
                }
                else {
                    $scope.invalidChannelSelection = false;
                    $scope.feedback = {mychannel:"", firstName:"", lastName:"",
                                       agree:false, email:"" };
                    $scope.feedback.mychannel="";

                    $scope.feedbackForm.$setPristine();
                    console.log($scope.feedback);
                }
            };
        }])


        .controller('HomeController',
            ['$scope',
            function ($scope$interval) {

            }])


        .controller('LoginController',
            ['$scope', '$rootScope', '$location', 'AuthenticationService',
            function ($scope, $rootScope, $location, AuthenticationService) {
                // reset login status
                AuthenticationService.ClearCredentials();
                $rootScope.loginName = false;

                $scope.login = function () {
                    $scope.dataLoading = true;
                    AuthenticationService.Login($scope.username, $scope.password, function(res) {

                        //alert(response.id);
                        //alert(response.response.transaction[0].id);
                        //alert(response.response.dataSet[0].recordSet[0].record[0].ENO);

                        var response = { success: true };
                        var emp_id = ''; //emp_id
                        var eno = ''; //사번
                        var busi_unt_ornz_nm = ''; //팀
                        var name = ''; //성명
                        var rsof_nm = ''; //직책
                        var busi_unt_nm = ''; //사업단위
                        var pos_nm = ''; //직위
                        var token = ''; //Access 토큰
                        var retoken = ''; //Refresh 토큰


                        if(!res.LOGIN_SUCCESS){
                            response.success = false;
                            response.message = 'Username or password is incorrect';
                        }else{
                            emp_id = res.EMP_ID; //emp_id
                            eno = res.ENO; //사번
                            busi_unt_ornz_nm = res.BUSI_UNT_ORNZ_NM; //팀
                            name = res.NAME; //성명
                            rsof_nm = res.RSOF_NM; //직책
                            busi_unt_nm = res.BUSI_UNT_NM; //사업단위
                            pos_nm = res.POS_NM; //직위
                            token = res.TOKEN; //Access 토큰
                            retoken = res.RETOKEN; //Refresh 토큰

                            $rootScope.name = name;
                            $rootScope.emp_id = emp_id;
                            $rootScope.loginName = true;

                        }

                        if(response.success) {
                            AuthenticationService.SetCredentials($scope.username, $scope.password, token, retoken);
                            $location.path('/');
                        } else {
                            $scope.error = response.message;
                            $scope.dataLoading = false;
                        }
                    });
                };
            }])

        .controller('AboutusController',
            ['$scope','$location',
            function ($scope) {
                    $scope.isActive = function (setTabpanel) {
                        return ($scope.tabpanel === setTabpanel);

                    };
                    $scope.select = function(setTabpanel) {
                        $scope.tabpanel = setTabpanel;
                    };
            }])

        .controller('OmsController', ['$scope', 'omsFactory', function($scope, omsFactory) {

            $scope.omses = {};
            omsFactory.getOms()
            .then(
                function(response){
                    console.log("* 화면 OmsController respnose : ",response);
                    $scope.omses = response.data;
                }
            );

            $scope.getImage = function () {
                    omsFactory.getImage($scope.empId, function(res) {
                    $scope.image = "data:image/gif;base64,"+res.response.dataSet[0].fields[0].EMP_IMGE;

                });
            };



                                }]);
