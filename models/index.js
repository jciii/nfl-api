const Sequelize = require('sequelize')
const teamsModel = require('./teams')

const connection = new Sequelize('teams', 'teams', 'T34mZ', {
  host: 'localhost', dialect: 'mysql'
})

const teams = teamsModel(connection, Sequelize)

module.exports = { teams }
