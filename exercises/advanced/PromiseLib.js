// You should only use the `new Promise` constructor from bluebird
var Promise = require('bluebird');

/**
 * Return a function that wraps `nodeStyleFn`. When the returned function is invoked,
 * it will return a promise which will be resolved or rejected, depending on 
 * the execution of the now-wrapped `nodeStyleFn`
 *
 * In other words:
 *   - If `nodeStyleFn` succeeds, the promise should be resolved with its results
 *   - If nodeStyleFn fails, the promise should be rejected with the error
 *
 * Because the returned function returns a promise, it does and should not
 * expect a callback function as one of its arguments
 */

var promisify = function(nodeStyleFn) {
  return function(filepath) {
    return new Promise((resolve, reject) => {
      nodeStyleFn(filepath, (err, data) => {
        if (err) {
          reject(err); 
        } else {
          resolve(data); 
        }
      });
    });
  };
};


/**
 * Given an array which contains promises, return a promise that is
 * resolved if and when all the items in the array are resolved.
 *
 * The promise's resolve value should be an array that maps to the
 * respective positions in the original array of promises.
 *
 * If any promise in the array rejects, the returned promise
 * is rejected with the rejection reason.
 */

var all = function(arrayOfPromises) {
  // Return a promise **if all promises passed
  return new Promise((resolve, reject) => {
    let results = [];
    arrayOfPromises.forEach((promise, i) => {
      Promise.resolve(promise)
        .then(res => {
          results[i] = res;
          if (results.length === arrayOfPromises.length) {
            resolve(results);
          }
        })
        .catch(err => reject(err));
    });
  });
};


/**
 * Given an array of promises, return a promise that is resolved or rejected,
 * resolving with whatever the resolved value or rejection reason was from
 * the first to be resolved/rejected promise in the passed-in array
 */

var race = function(arrayOfPromises) {
  return new Promise((resolve, reject) => {
    arrayOfPromises.forEach((promise) => {
      Promise.resolve(promise)
        .then(res => {
          resolve(res);
        })
        .catch(err => reject(err));
    });
  });  
};

// Export these functions so we can unit test them
module.exports = {
  all: all,
  race: race,
  promisify: promisify
};
