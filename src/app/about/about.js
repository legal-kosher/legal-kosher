angular.module('legal-kosher.about', [
  'ui.router',
  //'placeholders',
  'ui.bootstrap'
])


.config(function config( $stateProvider ) {
  $stateProvider.state( 'about', {
    url: '/about',
    views: {
      "main": {
        controller: 'AboutCtrl',
        templateUrl: 'about/about.tpl.html'
      }
    },
    data:{ pageTitle: 'What is It?' }
  });
})

// controller('ImagesCtrl', ['$scope', '$http', function ($scope, $http) {
.controller( 'AboutCtrl', ['$scope', '$http', function AboutCtrl( $scope, $http ) {
  // This is simple a demo for UI Boostrap.
  
  $scope.newData;
  $scope.showEl = false;

  $http({
    method: 'GET',
    url: 'http://127.0.0.1:8008/mySweetData'
  }).then(function successCallback(res) {
    var dataObj = JSON.parse(res.data.data)
    $scope.newData = dataObj;
  }, function errorCallback(res) {
    console.log('U DUN FUGGED UP');
  });

  
}])

.directive('showonhoverparent',
    function() {
      return {
        restrict: 'EA',
        controller: function($scope) {
          $scope.showEl = {visible: false};

        },
        template: "<div class='span2' ng-show='showEl.visible'><span><a class='btn btn-danger' href='#'>MORE DATA GOES HERE</a></span></div>",
        link : function($scope, element, attrs) {
          element.parent().bind('mouseenter', function() {
            $scope.showEl.visible = true;
            $scope.$digest()
            console.log($scope.showEl)
          });
          element.parent().bind('mouseleave', function() {
            $scope.showEl.visible = false;
            $scope.$digest()
          });
       }
   };
})
;

// return {
//         restrict: 'EA', //E = element, A = attribute, C = class, M = comment         
//         scope: {
//             //@ reads the attribute value, = provides two-way binding, & works with functions
//             title: '@'         },
//         template: '<div>{{ myVal }}</div>',
//         templateUrl: 'mytemplate.html',
//         controller: controllerFunction, //Embed a custom controller in the directive
//         link: function ($scope, element, attrs) { } //DOM manipulation
//     }
