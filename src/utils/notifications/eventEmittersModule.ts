const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const addCollectionEmitter = new MyEmitter();
const addProductEmitter = new MyEmitter();
const updateProductEmitter = new MyEmitter();
const nodemailerEmitter = new MyEmitter();

//saving to db
const saveCollectionToDbEmitter = new MyEmitter();
const saveStatusToDbEmitter = new MyEmitter();
const saveProductToDbEmitter = new MyEmitter();

export {
  addCollectionEmitter,
  updateProductEmitter,
  addProductEmitter,
  nodemailerEmitter,
  saveCollectionToDbEmitter,
  saveStatusToDbEmitter,
  saveProductToDbEmitter,
};
