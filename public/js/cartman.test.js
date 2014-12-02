(function() {
  var cartman = (function() {
    var cases = [];

    var createUUID = (function(uuidRegEx, uuidReplacer) {
      return function() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(uuidRegEx, uuidReplacer).toUpperCase();
      };
    })(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0,
        v = c == "x" ? r : (r & 3 | 8);
      return v.toString(16);
    });

    return {
      cases: cases,

      newCase: function() {
        var tmp = cartman.TestCase.createNew();
        cases.push(tmp);
        return tmp;
      },

      TestCase: {　　　　
        createNew: function() {　　　　　　
          var testcase = {};
          testcase.id = createUUID();
          testcase.name = "case";
          testcase.state = "info";
          testcase.steps = [];
          testcase.newStep = function() {
            var tmp = cartman.TestStep.createNew();
            testcase.steps.push(tmp);
            return tmp;
          };

          return testcase;　　　　
        }　　
      },

      TestStep: {
        createNew: function() {
          var teststep = {};
          teststep.name = "step";
          teststep.state = "info";
          teststep.err = "";
          teststep.execute = function() {};
          teststep.xhr = function(path, data, succ, erro) {
            $.ajax({
              url: "/proxy?proxypath=" + path,
              data: data,
              success: function(data) {
                try {
                  succ(data);
                } catch (exception) {
                  teststep.state = "danger";
                  teststep.err = exception.stack;
                }
              },
              error: function(xhr, err, exp) {
                try {
                  erro(xhr, err, exp);
                } catch (exception) {
                  teststep.state = "danger";
                  teststep.err = exception.stack;
                }
              }
            });
          };

          return teststep;
        }
      }
    }
  })();
  window.cartman = cartman;
})(window);

assert = function(expression, err) {
  if (!expression) {
    throw new Error(err);
  }
}

assertError = function(err) {
  throw new Error(err);
}
