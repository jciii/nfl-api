const teams = require('../teams')
const models = require('../models')

const getAllTeams = async (request, response) => {
  const teams = await models.teams.findAll()

  return response.send(teams)
}

const getTeamById = async (request, response) => {
  const { id } = request.params

  const matchingTeams = await models.teams.findOne({ where: { id } })

  return matchingTeams
    ? response.send(matchingTeams)
    : response.sendStatus(404)
}

const addTeam = (request, response) => {
  const {
    location, mascot, abbreviation, conference, division
  } = request.body

  const newTeam = {
    location, mascot, abbreviation, conference, division
  }

  if (!location || !mascot || !abbreviation || !conference || !division) {
    return response.status(400).send('Empty Field, Provide all')
  }


  teams.push(newTeam)


  return response.status(201).send(newTeam)
}


module.exports = { getAllTeams, getTeamById, addTeam }
