# MockIt

Simple mocking for the TestIt framework.


## How do I use it?

    TestIt('new Dice(6).roll()', {
      'should return a random value for a 6-sided die': function(t){
        t.mock(Math, 'random', 1, function(){
          t.assert(arguments.length === 0, "Don't pass Math.random() arguments!");
          return 2/6 + .009352; // Math.random() will return this "random" number.
        });
        t.assertEqual(2, new Dice(6).roll());
      }
    }, MockIt);

And if you are testing in node.js remember to require it `var MockIt = require('./mock_it');` and you'll be good to go. In this example, when `Math.random()` is called it will call our function and return the staged value. `Math.random` will return to its original value after the test is done running.


## Arguments

t.mock(object, function name to mock, [optional number of expeced calls], function to be called);

### object, function name to mock

These are basically describing what it is you want to mock. If you want to mock `Math.random()`, then pass `t.mock(Math, 'random', ...`. If you want to mock a prototype's method, like `dice.roll()`, then pass `t.mock(Dice.prototype, 'random', ...`.

### optional number of expected calls

If you want to ensure your mocked function gets called, you can specify how many times it gets called. This is optional, so if you don't care if the mocked function is called, you can skip this: `t.mock(Math, 'random', function(){ returns 0.9; });`.

### function to be called

This is the function to be called instead of the original function. This function will get passed the same arguments that would have been passed to the original function, and what is returned from this function will get returned as though it were returned from the original function. Inside this function could be a good place to run assertions, if that works in your case.


## Gotchas

`t.mock` is only available in 'before each', 'after each', and test functions. 'before all', and 'after all' get no love yet.
