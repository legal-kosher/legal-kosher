angular.module( 'legal-kosher.settings', [
  'ui.router',
  //'placeholders',
  'ui.bootstrap',
  'ngDragDrop'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'settings', {
    url: '/settings',
    views: {
      "main": {
        controller: 'SettingsCtrl',
        templateUrl: 'settings/settings.tpl.html'
      }
    },
    data:{ pageTitle: 'Settings' }
  });
})

.controller( 'SettingsCtrl', ['$scope', '$http', function SettingsCtrl( $scope, $http ) {
  
  $scope.settings = {
    approved: ["MIT", "Apache", "BSD"],
    notApproved: ["GPL", "AGPL"],
    waitingForApproval: ["Mozilla Public License"]
  };

  $scope.approved = $scope.settings.approved;
  $scope.notApproved = $scope.settings.notApproved;
  $scope.waitingForApproval = $scope.settings.waitingForApproval;



}])

;
