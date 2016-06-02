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
            ['$scope','$rootScope','$cookieStore', '$window', '$location', 'AuthenticationService',
            function ($scope, $rootScope, $cookieStore, $window, $location, AuthenticationService) {

            $scope.select = function(setTab) {
                $scope.tab = setTab;
                $scope.navCollapsed = true;
            };

            $scope.isSelected = function (checkTab) {
                return ($scope.tab === checkTab);
            };

            $scope.toOMS = function () {

                var username = '';

                $rootScope.globals = $cookieStore.get('globals') || {};
                if ($rootScope.globals.currentUser) {
                    username = $rootScope.globals.currentUser.username;
                }

                AuthenticationService.Key(username, function(res) {

                    if(res.response.dataSet[0].fields[0].value == undefined || res.response.dataSet[0].fields[0].value == null){
                        alert('Login !')

                    }else{
                        var sysKey = res.response.dataSet[0].fields[0].value;

                        //$scope.omsUrl = $sce.trustAsResourceUrl('https://sos.skcc.com?key='+sysKey);


                        $window.location.href = 'https://msos.skcc.com?key='+sysKey;
                        //$location.replace('https://sos.skcc.com?key='+sysKey);
                        //$scope.omsurl = 'https://sos.skcc.com?key='+sysKey;



                    }

                });

            };


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

                        if(res.response.dataSet[0].recordSet[0].record == undefined || res.response.dataSet[0].recordSet[0].record == null){
                            response.success = false;
                            response.message = 'ID또는Password가 다릅니다. ID는 사번이며 최초패스워드는 사번과 동일합니다. 패스워드를 변경하시려면 Hi-OMS PC버전의 로그인화면에서 비밀번호찾기를 통해 변경하시기 바랍니다.';
                        }else{
                            emp_id = res.response.dataSet[0].recordSet[0].record[0].EMP_ID; //emp_id
                            eno = res.response.dataSet[0].recordSet[0].record[0].ENO; //사번
                            busi_unt_ornz_nm = res.response.dataSet[0].recordSet[0].record[0].BUSI_UNT_ORNZ_NM; //팀
                            name = res.response.dataSet[0].recordSet[0].record[0].NAME; //성명
                            rsof_nm = res.response.dataSet[0].recordSet[0].record[0].RSOF_NM; //직책
                            busi_unt_nm = res.response.dataSet[0].recordSet[0].record[0].BUSI_UNT_NM; //사업단위
                            pos_nm = res.response.dataSet[0].recordSet[0].record[0].POS_NM; //직위

                            $rootScope.name = name;
                            $rootScope.emp_id = emp_id;
                            $rootScope.loginName = true;

                        }

                        if(response.success) {
                            AuthenticationService.SetCredentials($scope.username, $scope.password);
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
                    $scope.omses = response.data;
                }
            );

            $scope.getImage = function () {
                    omsFactory.getImage($scope.empId, function(res) {
                    $scope.image = "data:image/gif;base64,"+res.response.dataSet[0].fields[0].EMP_IMGE;

                });
            };



                                }])

        .controller('SystemController', ['$scope', 'systemFactory', function($scope, systemFactory) {

            $scope.systems = {};
            systemFactory.getSystem()
            .then(
                function(response){
                    $scope.systems = response.data;
                }
            );



                                }]);
