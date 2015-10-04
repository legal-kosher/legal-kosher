angular.module('legal-kosher.data', [
  'ui.router',
  'ui.bootstrap'
])

.config(function config( $stateProvider ) {
  $stateProvider.state('get', {
    url: "/get/:id",
    views: {
      "main": {
        controller: "DataCtrl",
        templateUrl: "data/data.tpl.html"
      }
    },
    data:{ pageTitle: 'Your repo' }
  })
})
.controller( 'DataCtrl', ['$scope', '$http', '$stateParams',function DataCtrl( $scope, $http, $stateParams ) {
  // This is simple a demo for UI Boostrap.
  
  $scope.newData;
  $scope.showEl = false;

  $http({
    method: 'GET',
    url: 'http://127.0.0.1:8008/get/' + $stateParams.id
  }).then(function successCallback(res){
    var dataObj = res.data[0].data;
    console.log(dataObj)
    $scope.newData = dataObj;
  }, function errorCallback(data) {
    console.log('U DUN FUGGED UP');
  });
  
}])

// .directive('showonhoverparent',
//     function() {
//       return {
//         restrict: 'EA',
//         controller: function($scope) {
//           $scope.showEl = {visible: false};

//         },
//         template: "<div class='span2' ng-show='showEl.visible'><span><a class='btn btn-danger' href='#'>MORE DATA GOES HERE</a></span></div>",
//         link : function($scope, element, attrs) {
//           element.parent().bind('mouseenter', function() {
//             $scope.showEl.visible = true;
//             $scope.$digest()
//             console.log($scope.showEl)
//           });
//           element.parent().bind('mouseleave', function() {
//             $scope.showEl.visible = false;
//             $scope.$digest()
//           });
//        }
//    };
// })
;
