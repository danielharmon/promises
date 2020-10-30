/**
 * Using Promise.all, write a function, combineFirstLineOfManyFiles, that:
 *    1. Reads each file at the path in the `filePaths` array
 *    2. Plucks the first line of each file
 *    3. Joins each first line into a new file
 *      - The lines should be in the same order with respect to the input array
 *      - i.e. the second line in the new file should be the first line of `filePaths[1]`
 *    4. Writes the new file to the file located at `writePath`
 */
const { pluckFirstLineFromFileAsync } = require('../bare_minimum/promiseConstructor.js');
const { writeToFileAsync } = require('../bare_minimum/basicChaining.js');
const Promise = require('bluebird');

var combineFirstLineOfManyFiles = function(filePaths, writePath) {
  var arr = filePaths.map((file)=> pluckFirstLineFromFileAsync(file));
  // Map filePaths using pluckFirstLine(file)
  var promise = Promise.all(arr);
  //Promise.all(^^) => [firstlines...]
  //.then {writeFile([firstlines...].join('/n'))}
  return promise
    .then((firstLines) => {
      var file = firstLines.join('\n');
      writeToFileAsync(writePath, file);
    })
    .catch(err => console.log(err));                                  
};

// Export these functions so we can unit test them
module.exports = {
  combineFirstLineOfManyFiles: combineFirstLineOfManyFiles
};