(function() {
  var testcase;
  var teststep;

  testcase = cartman.newCase();
  testcase.name = "用于测试系统登录功能的测试用例";

  teststep = testcase.newStep();
  teststep.name = "正确的用户名密码";
  teststep.execute = function() {
    this.xhr(
      "/authority.json/login",
      "POST",
      "staName=admin&staPassword=admin&samId=1&systemModule=OPERATION",
      function(data) {
        assert(data.username == "admin", "登录成功，但返回数据错误");
      },
      function() {
        assertError("登录失败");
      }
    );
  };

  teststep = testcase.newStep();
  teststep.name = "错误的用户名密码";
  teststep.execute = function() {
    this.xhr(
      "/login",
      "POST",
      "username=admin22&password=admin",
      function(data) {
        assertError("错误的用户名密码登录成功");
      },
      function(xhr, err, exp) {
        assert(xhr.status == 401, "错误的用户名密码登录失败，但返回状态错误");
      }
    );
  };

  testcase = cartman.newCase();
  testcase.name = "用于测试售票功能的测试用例";

  teststep = testcase.newStep();
  teststep.name = "正常售票-储值";
  teststep.execute = function() {
  };

  teststep = testcase.newStep();
  teststep.name = "正常售票-计次";
  teststep.execute = function() {
  };

  teststep = testcase.newStep();
  teststep.name = "正常售票-计时";
  teststep.execute = function() {
  };
})();
