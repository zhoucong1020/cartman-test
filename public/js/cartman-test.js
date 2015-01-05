var cartman = (function () {
    var STATUS = {
        SUCCESS: 'success',
        DEFAULT: 'default',
        DANGER: 'danger'
    };
    var currentGroup = 0, currentUrl = 0, currentCase = -1;
    var _groups = [];
    var _$scope = {};

    var init = function ($scope, groups) {
        _$scope = $scope;
        _$scope.runStepCount = 0;
        _$scope.stepCount = 0;
        _groups = groups;
        var count = 0;
        currentGroup = -1; currentUrl = 0; currentCase = -1;
        _groups.forEach(function (group) {
            group.state = STATUS.DEFAULT;
            group.id = createUUID();
            for (var i = 0; i < group.urls.length; i++) {
                var url = group.urls[i];
                url.state = STATUS.DEFAULT;
                url.id = createUUID();
                for (var j = 0; j < url.cases.length; j++) {
                    var cas = url.cases[j];
                    cas.state = STATUS.DEFAULT;
                    cas.id = createUUID();
                    count++;
                }
            }
        });
        _$scope.runStepCount = count;
//        executeNext();
//        _groups.forEach(function(group){
//            executeGroup(group);
//        })

    };
    var executeGroup = function (group) {
        if (group.state != STATUS.DEFAULT) {
            return;
        }
        var state = STATUS.SUCCESS;
        group.dependencies.forEach(function (g) {
            if (getGroupState(g.name,group) != STATUS.SUCCESS) {
                state = STATUS.DANGER;
                return;
            }
        });
        if (state == STATUS.SUCCESS) {
            group.urls.forEach(function (url) {
                executeUrl(url, group);
            });
        }
    };
    var getGroupState = function (groupName,currentG) {
        var state = STATUS.DEFAULT;
        var isExist = false;
        _groups.forEach(function (group) {
            if (group.name == groupName) {
                isExist = true;
                state = group.state;
            }
        });
        if(!isExist){
            alert(groupName + " that "+ currentG.name+" depend on is not present");
        }
        return state;
    };
    var getUrlState = function (group, uName,currentU) {
        var state = STATUS.DEFAULT;
        var isExist = false;
        group.urls.forEach(function (url) {
            if (url.name == uName) {
                isExist = true;
                state = url.state;
            }
        });
        if(!isExist){
            alert(uName +" that "+currentU.name + " depend on is not present");
        }
        return state;
    };
    var executeUrl = function (url, group) {
        if (url.state != STATUS.DEFAULT) {
            return;
        }
        var st = STATUS.SUCCESS;
        url.dependencies.forEach(function (u) {
            if (getUrlState(group, u,url) != STATUS.SUCCESS) {
                st = STATUS.DANGER;
                return;
            }
        });
        if (st == STATUS.SUCCESS) {
            url.cases.forEach(function (cas) {
                executeCase(cas, url, group);
            });
        }
    };
    var executeCase = function (aCase, url, group) {
        if (aCase.state != STATUS.DEFAULT) {
            return;
        }
        $.ajax({
            url: url.path,
            type: url.method,
            data: aCase.params,
            success: function (data) {
                if (data == aCase.expectation) {
                    aCase.state = "success";
                } else {
                    aCase.state = "danger";
                    aCase.result = data;
                }
                applyUrl(url, group);
            },
            error: function (xhr) {
                aCase.state = "danger";
                aCase.result = xhr.responseText;
                applyUrl(url, group);
            }
        });
    };
    var applyUrl = function (url, group) {
        var i = 0;
        url.cases.forEach(function (cas) {
            if (cas.state == STATUS.DEFAULT) {
//                executeCase(cas,url,group);
            } else {
                if (cas.state == STATUS.DANGER) {
                    url.state = STATUS.DANGER;
                    return;
                }
                if (cas.state == STATUS.SUCCESS) {
                    i++
                }
            }
        });

        if (url.cases.length == i) {
            url.state = STATUS.SUCCESS;
        }
        applyGroup(group);
    };
    var applyGroup = function (group) {
        var i = 0;
        group.urls.forEach(function (url) {
            if (url.state == STATUS.DEFAULT) {
//                executeUrl(url,group);
            } else {
                if (url.state == STATUS.DANGER) {
                    group.state = STATUS.DANGER;
                    return;
                }
                if (url.state == STATUS.SUCCESS) {
                    i++;
                }
            }
        });
        if (i == group.urls.length) {
            group.state = STATUS.SUCCESS;
        }
        apply();
    };
    var apply = function () {
        _$scope.$apply();
    };
    var calculateNext = function () {
        if(currentGroup == -1){
            return nextGroup();
        }
        if (currentCase < _groups[currentGroup].urls[currentUrl].cases.length - 1) {
            currentCase++;
        } else {
            return nextUrl();
        }
        return true;
    };
    var nextGroup = function () {
        if (currentGroup < _groups.length - 1) {
            currentCase = 0;
            currentUrl = -1;
            currentGroup++;
            var state = STATUS.SUCCESS;
            var group = _groups[currentGroup];
            if(group.dependencies!=undefined && group.dependencies instanceof Array && group.dependencies.length >0){
                group.dependencies.forEach(function (groupName) {
                    if (getGroupState(groupName,group) != STATUS.SUCCESS) {
                        state = STATUS.DANGER;
                        return;
                    }
                });
            }
            if (state == STATUS.SUCCESS) {
                return nextUrl();
            } else {
                return nextGroup();
            }
        } else {
            return false;
        }
    };
    var nextUrl = function () {
        if (currentUrl == _groups[currentGroup].urls.length - 1) {
            return nextGroup();
        }
        currentCase = 0;
        currentUrl++;
        var st = STATUS.SUCCESS;
        var group = _groups[currentGroup];
        var url = group.urls[currentUrl];
        if(url.dependencies!=undefined && url.dependencies instanceof Array && url.dependencies.length >0){
            url.dependencies.forEach(function (u) {
                if (getUrlState(group, u,url) != STATUS.SUCCESS) {
                    st = STATUS.DANGER;
                    return;
                }
            });
        }
        if (st == STATUS.SUCCESS) {
            return true;
        } else {
            return nextUrl();
        }
    };
    var executeNext = function () {
        if (!calculateNext()) {
            return false;
        }
        var group = _groups[currentGroup];
        var url = group.urls[currentUrl];
        var aCase = url.cases[currentCase];
        if (aCase.state != STATUS.DEFAULT) {
            return;
        }
        $.ajax({
            url: url.path,
            type: url.method,
            data: getJsonParam(aCase.params,url),
            success: function (data) {
                if (isEqual(data, aCase.expectation)) {
                    aCase.state = "success";
                } else {
                    aCase.state = "danger";
                }
                aCase.result = data;
                _$scope.stepCount++;
                if(url.success && url.success instanceof Function){
                    try {
                        url.success(data);
                    } catch (e) {
                        console.log(e)
                    }
                }
                applyUrl(url, group);
                executeNext();
            },
            error: function (xhr) {
                aCase.state = "danger";
                aCase.result = xhr.responseText;
                _$scope.stepCount++;
                if(url.fail && url.fail instanceof Function){
                    try {
                        url.fail(data);
                    } catch (e) {
                        console.log(e)
                    }
                }
                applyUrl(url, group);
                executeNext();
            }
        });
    };
    var isEqual = function (data, expectation) {
        if (data instanceof Object) {
            for (var key in data) {
                if (!isEqual(data[key], expectation[key])) {
                    return false;
                }
            }
        } else {
            return data == expectation;
        }
        return true;
    }
    var getJsonParam = function (params,url) {
        var str = "";
        for (var key in params) {
            if (str == "") {
                str += key + "=" + JSON.stringify(params[key]);
            } else {
                str += "&" + key + "=" + JSON.stringify(params[key]);
            }
        }
        if(url.authorities!=undefined && url.authorities instanceof Array && url.authorities.length >0){
            url.authorities.forEach(function(authority){
                for(var key in authority){
                    if (str == "") {
                        str += key + "=" + JSON.stringify(authority[key]);
                    } else {
                        str += "&" + key + "=" + JSON.stringify(authority[key]);
                    }
                }
            })
        }
        return str;
    };
    var createUUID = (function (uuidRegEx, uuidReplacer) {
        return function () {
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(uuidRegEx, uuidReplacer).toUpperCase();
        };

    })(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == "x" ? r : (r & 3 | 8);
        return v.toString(16);
    });

    var resetData = function($scope,data){
        init($scope,data);
        executeNext();
    };

    var executeFile = function($scope,fileName,fn){
        if(!fileName || fileName.trim().length == 0){
            resetData($scope,_cartman_test_data);
            $scope.groups = _cartman_test_data;
            setTimeout(fn,100);
            return;
        }
        $.getScript("test/"+fileName,function(){
            resetData($scope,_cartman_test_data);
            $scope.groups = _cartman_test_data;
          apply();
           setTimeout(fn,100);
        })
    };
    return {
        reset:resetData,
        init: init,
        status: STATUS,
        execute: executeNext,
        executeFile:executeFile
    };
})();






