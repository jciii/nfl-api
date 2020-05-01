const models = require('../models')

const getAllTeams = async (request, response) => {
  const teams = await models.teams.findAll()

  return response.send(teams)
}

const getTeamById = async (request, response) => {
  try {
    const { id } = request.params

    const matchingTeams = await models.teams.findOne({ where: { id } })

    return matchingTeams
      ? response.send(matchingTeams)
      : response.sendStatus(404)
  } catch (error) {
    return response.status(500).send('Unable to find Team, do it agian')
  }
}
const saveNewTeam = async (request, response) => {
  const {
    location, mascot, abbreviation, conference, division
  } = request.body

  if (!location || !mascot || !abbreviation || !conference || !division) {
    return response
      .status(400)
      .send('The following fields are required: location, mascot, abbreviation, conference, division')
  }

  const newTeam = await models.teams.create({
    abbreviation, conference, division, location, mascot
  })

  return response.status(201).send(newTeam)
}

module.exports = { getAllTeams, getTeamById, saveNewTeam }
