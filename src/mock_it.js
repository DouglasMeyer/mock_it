(function(global){

  var M = window.MockIt = {
    'before each': function(t){
      M.mocks = [];
      t.mock = function(object, functionName){
        var options = Array.prototype.slice.call(arguments, 2),
            mockFunction = options.pop(),
            expectedCalls = options.pop();
        var mock = {
          object: object, functionName: functionName,
          originalFunction: object[functionName],
          callCount: 0
        };
        if (expectedCalls){
          mock.expectedCalls = expectedCalls;
        }
        M.mocks.push(mock);
        object[functionName] = function(){
          mock.callCount += 1;
          return mockFunction.apply(this, arguments);
        };
      }
    },
    'after each': function(t){
      var mock;
      try {
        for(var i=0;mock=M.mocks[i];i++){
          if (mock.expectedCalls){
            t.assertEqual(mock.expectedCalls, mock.callCount,
              'expected "'+mock.functionName+'" to be called '+mock.expectedCalls+' times, but was called '+mock.callCount+' times');
          }
        }
      } finally {
        while(mock = M.mocks.pop()){
          mock.object[mock.functionName] = mock.originalFunction;
        }
      }
    }
  };

})(window);
