(function(global){

  var M = global.MockIt = {
    'before each': function(t){
      t.mocks = [];
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
        t.mocks.push(mock);
        object[functionName] = function(){
          mock.callCount += 1;
          return mockFunction.apply(this, arguments);
        };
      }
    },
    'after each': function(t){
      var mock;
      try {
        for(var i=0;mock=t.mocks[i];i++){
          if (mock.expectedCalls){
            t.assertEqual(mock.expectedCalls, mock.callCount,
              'expected "'+mock.functionName+'" to be called '+mock.expectedCalls+' times, but was called '+mock.callCount+' times');
          }
        }
      } finally {
        while(mock = t.mocks.pop()){
          mock.object[mock.functionName] = mock.originalFunction;
        }
      }
    }
  };

})(typeof window === 'undefined' ? exports : window);
