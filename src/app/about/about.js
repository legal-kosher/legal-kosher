angular.module( 'legal-kosher.about', [
  'ui.router',
  'placeholders',
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

;
