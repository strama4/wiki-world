'use strict';
const faker = require('faker');

let wikis = [];


for (let i = 0; i < 11; i++) {
  wikis.push({
    title: faker.hacker.noun(),
    body: faker.hacker.phrase(),
    private: faker.random.boolean(),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: Math.floor(Math.random() * 10) + 1 // Will assign one of the 10 random users
  })                                           // we seeded to each wiki
}


module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Wikis', wikis, {});
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Wikis', null, {});
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
