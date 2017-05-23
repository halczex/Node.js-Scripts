var homedir = process.argv[2];

var fs = require('fs');
var path = require('path');

function getFiles(srcpath, shouldReturnDirectory) {
  return fs.readdirSync(srcpath).filter(function (file) {
    var isDirecotry = fs.lstatSync(path.join(srcpath, file)).isDirectory();
    return shouldReturnDirectory ? isDirecotry : !isDirecotry;
  });
}

function createTestFile(dir, name) {
  var filepath = path.join(dir, name);
  if(fs.existsSync(filepath)) {
    return;
  }
  fs.open(filepath, "wx", function (err, fd) {
    if (err) {
      return;
    }
    fs.close(fd, function (err) { });
  });
}

var createTestFiles = function (homedir) {
  var isFolder = true;

  // create test folder if it not exist
  var testFolderDir = path.join(homedir, '__tests__');

  // test folder file list
  var testFileList = [];

  if (fs.existsSync(testFolderDir)) {
    testFileList = getFiles(testFolderDir, !isFolder);
  }

  // get folder list
  var dirList = getFiles(homedir, isFolder);

  // get file list
  var fileList = getFiles(homedir, !isFolder);

  // create test files
  for (var i in fileList) {
    var extname = path.extname(fileList[i]);
    var basename = path.basename(fileList[i], extname);
    var testFileName = basename + '.spec' + extname;

    if (extname === '.jsx' || extname === '.js') {

      if (!fs.existsSync(testFolderDir)) {
        fs.mkdirSync(testFolderDir);
      }

    createTestFile(testFolderDir, testFileName);
    }
  }

  // recursive in each folder
  for (var i in dirList) {
    if (dirList[i] !== '__tests__') {
      createTestFiles(path.join(homedir, dirList[i]));
    }
  }
};

createTestFiles(homedir);
