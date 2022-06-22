const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  // var id = counter.getNextUniqueId();
  // items[id] = text;
  // callback(null, { id, text });
  counter.getNextUniqueId((err, data) => {
    if (err) {
      console.log('Error creating file', err);
    } else {
      // let filePath = 'datastore/data';
      let filePath = (`${exports.dataDir}/${data}.txt`);
      console.log(filePath);
      fs.writeFile(filePath, text, (err) => {
        if (err) {
          console.log('Error writing new file', err);
        } else {
          callback(null, { id: data, text: text });
        }
      });
    }
  });
};

exports.readAll = (callback) => {

  let allFiles = [];
  let filePath = (`${exports.dataDir}`);
  let fileNames = [];

  fs.promises.readdir(filePath)
    .then((files) => {
      for (let file of files) {
        let name = file.slice(0, 5);
        fileNames.push(name);
        let temp = fs.promises.readFile(`${exports.dataDir}/${file}`, 'utf8');
        allFiles.push(temp);
      }
      Promise.all(allFiles)
        .then(todos => {
          let newArray = [];
          for (let i = 0; i < todos.length; i++) {
            let temp = { id: fileNames[i], text: todo};
            newArray.push(temp);
          }
          // console.log(todos);
          callback(null, newArray);
        })
        .catch(err => {
          console.log('err');
        });
    })
    .catch( err => {
      console.log('Error in read all', err);
    });



  // fs.readdir(filePath, (err, files) => {
  //   if (err) {
  //     console.log('Error reading files', err);
  //   } else {
  //     _.each(files, (file) => {
  //       let name = file.slice(0, 5);
  //       // read file
  //       fs.promises.readFile(`${exports.dataDir}/${file}`, 'utf8')
  //         .then((data) => {
  //           let temp = { id: name, text: data};
  //           allFiles.push(temp);
  //         })
  //         .catch((err) => {
  //           console.log('err');
  //         });

        // , (err, fileData) => {
        //   if (err) {
        //     callback(new Error(`Cant read file ${name}`));
        //   } else {
        //     let temp = { id: name, text: fileData};
        //     allFiles.push(temp);

        //   }
        // });
  //     });

  //     callback(null, allFiles);
  //   }
  // });
};

exports.readOne = (id, callback) => {

  let filePath = (`${exports.dataDir}/${id}.txt`);
  fs.readFile(filePath, 'utf8', (err, fileData) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id, text: fileData});
    }
  });
};

exports.update = (id, text, callback) => {

  let filePath = (`${exports.dataDir}/${id}.txt`);
  fs.readFile(filePath, 'utf8', (err, fileData) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(filePath, text, (err) => {
        if (err) {
          console.log('Error writing new file', err);
        } else {
          callback(null, { id: id, text: text });
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  let filePath = (`${exports.dataDir}/${id}.txt`);
  fs.unlink(filePath, (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback();
    }
  });

  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data'); // gives us datastore/data

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
