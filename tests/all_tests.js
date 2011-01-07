var TestIt, MockIt;
if (typeof window === 'undefined') {
  TestIt = require('../lib/test_it/src/test_it').TestIt;
  MockIt = require('../src/mock_it').MockIt;
  var element = {
    appendChild: function(){},
    getElementsByTagName: function(){ return []; }
  };
  document = {
    body: element,
    createElement: function(){
      return element;
    }
  };
}

var log,
    fakeTestItReporter = function(results){
      log = this.constructor.log = [];
      log.appendChild = log.push;
      this.reportContext(results);
      return results;
    };

fakeTestItReporter.prototype = new TestIt.DomReporter({});
fakeTestItReporter.prototype.constructor = fakeTestItReporter;
(function(){
  var results,
      mockedFunctionResponse,
      wasMockedFunction,
      origDocumentGetElementById = document.getElementById;
  TestIt('mocking', {
    'before all': function(){

      results = TestIt('tests', {
        'mock test': function(t){
          t.mock(document, 'getElementById', function(){
            return 'ok';
          });
          mockedFunctionResponse = document.getElementById('hi');
        },
        'not mock test': function(t){
          wasMockedFunction = document.getElementById;
        },
        'mock expectedCalls test': function(t){
          t.mock(document, 'getElementById', 1, function(){});
          document.getElementById();
          document.getElementById();
        }
      }, MockIt, fakeTestItReporter);

    },
    'should run mock function': function(t){
      t.assertEqual('ok', mockedFunctionResponse);
    },
    'should return mocked function to original state after each test': function(t){
      t.assertEqual(origDocumentGetElementById, wasMockedFunction);
    },
    'should fail if expectedCalls isn\'t met': function(t){
      t.assertEqual('fail', results['tests']['mock expectedCalls test'].result);
      t.assertEqual('expected "getElementById" to be called 1 times, but was called 2 times', results['tests']['mock expectedCalls test'].message);
    }
  }, MockIt);
})();

TestIt('MockIt', {
  'should only have "before each" and "after each"': function(t){
    var keys=[];
    for(var name in MockIt){
      keys.push(name);
    }
    t.assertEqual(2, keys.length);
    t.assert(MockIt['before each']);
    t.assert(MockIt['after each']);
  }
});
