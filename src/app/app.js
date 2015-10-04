angular.module( 'legal-kosher', [
  'templates-app',
  'templates-common',
  'legal-kosher.home',
  'legal-kosher.about',
  'legal-kosher.settings',
  'legal-kosher.data',
  'ui.router'
])

.config( function myAppConfig ( $stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise( '/home' );
})

.run( function run () {
})

.controller( 'AppCtrl', function AppCtrl ( $scope, $location ) {
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ( angular.isDefined( toState.data.pageTitle ) ) {
      $scope.pageTitle = toState.data.pageTitle + ' | legal-kosher' ;
    }
  });
})

;

