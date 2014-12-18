/**
 * Created by lcf on 2014/12/4.
 */
function TestAllCrl($http, $scope) {
    $scope.groups = [];
    $scope.runStepCount = 10;
    $scope.stepCount = 0;
    $scope.testFiles =[];
    $http.get("/cartman_test_file").success(function(data){
        $scope.testFiles = data;
        $scope.$apply();
        if(data.length>0){
            cartman.executeFile($scope,data[0],init);
        }
    })
    $("#start").click(function(){
        var fileName = $("#testFile").val();
        cartman.executeFile($scope,fileName,init);
    });
}
$(function () {
     init();
})

function init() {
//    $(".collapse").collapse("show");
    var isToggle = false;
    $("button[name='group']").click(function () {
        $(".collapse").collapse("toggle");
//       isToggle =  changeStatus(isToggle,function(){
//           $("button[name='group']").text("全部展开")
//            $(".collapse").collapse("toggle");
//        },function(){
//           $("button[name='group']").text("全部收起")
//            $(".collapse").collapse("toggle");
//        })
    });
    var isOnlyDanger = false;
    $("button[name='success']").click(function () {
        isOnlyDanger = changeStatus(isOnlyDanger,function(){
            $("button[name='success']").text("隐藏成功")
            $("#accordion .panel-success").show();
        },function(){
            $("button[name='success']").text("显示成功")
            $("#accordion .panel-success").hide();
        })
    });
    var changeStatus = function (flag, trueFun,falseFun) {
        if (flag) {
            trueFun();
        } else {
            falseFun();
        }
        return !flag;
    }

    $(".a-ul").click(function(){
        $(".a-ul").parent().removeClass("active");
        $(".a-ul").next().removeClass("active");
        $(this).next().addClass("active");
        $(this).parent().addClass("active");
    });
    $(".a-ul").parent().removeClass("active");
    $(".a-ul").next().removeClass("active");

    $(".a-li").click(function(){
        $(".a-li").parent().removeClass("active");
        $(this).parent().addClass("active");
    });
    $(".a-li").parent().removeClass("active");
}


function combineData(data) {
    for (var i = 0; i < data.apis.length; i++) {
        var service = data.apis[i];
        service.id = createUUID();
        service.state = "default";
        for (var j = 0; j < service.operations.length; j++) {
            var operation = service.operations[j];
            operation.cases = [];
            operation.id = createUUID();
            operation.state = "default";
            testData.urls.forEach(function (url) {
                if (url.path == operation.path) {
                    operation.cases = url.cases;
                    for (var i = 0; i < operation.cases.length; i++) {
                        operation.cases[i].id = createUUID();
                        operation.cases[i].state = "default";
//                     getResult(operation.path,operation.method,operation.cases[i]);
                    }
                }
            });
        }
    }
}
function apply() {
    testScope.allApi.apis.forEach(function (service) {
        for (var i = 0; i < service.operations.length; i++) {
            var operation = service.operations[i];
            if (operation.cases.length > 0) {
                operation.state = cartman.status.SUCCESS;
                service.state = cartman.status.SUCCESS;
            }
            for (var j = 0; j < operation.cases.length; j++) {
                var cas = operation.cases[j];
                if (cas.state == cartman.status.DANGER) {
                    operation.state = cartman.status.DANGER;
                    service.state = cartman.status.DANGER;
                }
            }
        }
    });
    testScope.$apply();
}
function getResult(path, method, aCase) {
    //    testScope = $scope;
//    $scope.allApi = {};
//    var url = "/doc.json";
//    $http.get(url).success(function (data) {
//        refactorData(data);
//        combineData(data);
//
//        $scope.allApi = data;
//        testScope.allApi = data;
//        setTimeout(init,0);
//    });
//    setTimeout(init,0);
}
function refactorData(data) {
    for (var i = 0; i < data.apis.length; i++) {
        var service = data.apis[i];
        service.id = service.path;
        var operations = new Array();
        for (var j = 0; j < service.apis.length; j++) {
            var mapping = service.apis[j];
            for (var k = 0; k < mapping.operations.length; k++) {
                var operation = new Object();
                var tmp = mapping.operations[k];
                operation.id = operation.path;
                operation.path = mapping.path;
                operation.description = mapping.description;
                operation.method = tmp.method;
                operation.summary = tmp.summary;
                operation.notes = tmp.notes;
                operation.type = tmp.type;
                operation.nickname = tmp.nickname;
                operation.items = tmp.items;
                operation.parameters = tmp.parameters;
                operation.docResponseMessages = tmp.docResponseMessages;
                operations.push(operation);
            }
        }
        service.operations = operations;
    }
}