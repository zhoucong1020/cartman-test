function mainCtrl($scope, $http, $timeout) {
  $scope.cases = cartman.cases;
  cartman.scope = $scope;

  var stepCount = 0;
  for (var i = 0; i < cartman.cases.length; i++) {
    stepCount += cartman.cases[i].steps.length;
  }
  $scope.stepCount = stepCount;
  $scope.runStepCount = 0;

  $scope.start = function() {
    $scope.runStepCount = 0;

    var run = function(nowCase, nowStep) {
      $timeout(function() {
        cartman.cases[nowCase].steps[nowStep].state = "success";
        try {
          cartman.cases[nowCase].steps[nowStep].execute();
        } catch (exception) {
          cartman.cases[nowCase].steps[nowStep].state = "danger";
          cartman.cases[nowCase].steps[nowStep].err = exception.stack;
        }
        $scope.runStepCount = $scope.runStepCount + 1;

        if (nowStep < cartman.cases[nowCase].steps.length - 1) {
          nowStep++;
        } else if (nowCase < cartman.cases.length - 1) {
          nowCase++;
          nowStep = 0;
        } else {
          return;
        }

        run(nowCase, nowStep);
      }, 0);
    };

    run(0, 0);
  };
}
