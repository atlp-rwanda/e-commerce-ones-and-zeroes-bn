const {expect} = require('chai');
const {spy} = require('sinon')
const proxyquire = require('proxyquire')
const {sequelize, Sequelize} = require('sequelize-test-helpers')

describe('src/database/user', ()=>{
  const {DataTypes} = Sequelize

  const UserFactory = proxyquire('src/database/user', {
    sequelize: Sequelize
  }
    
  )
  let User
})
function UserModel(sequalize: any, dataTypes: any) {
  throw new Error("Function not implemented.");
}

