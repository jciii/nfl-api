const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const models = require('../../models')
const { describe, it } = require('mocha')
const { teamList, singleTeam } = require('../mocks/teams')
const { getAllTeams, getTeamById, addTeam } = require('../../controllers/teams')

chai.use(sinonChai)
const { expect } = chai

describe('Controllers-teams', () => {
  describe('getAllTeams', () => {
    it('retrieves a list of all teams from the database and calls response.send() with the list',
      async () => {
        const stubbedFindAll = sinon.stub(models.teams, 'findAll').returns(teamList)
        const stubbedSend = sinon.stub()
        const response = { send: stubbedSend }

        await getAllTeams({}, response)
        expect(stubbedFindAll).to.have.callCount(1)
        expect(stubbedSend).to.have.been.calledWith(teamList)
      })
  })

  describe('getTeamById', () => {
    it('retrieves a specific team based on id given', async () => {
      const request = { params: { id: '3' } }
      const stubbedSend = sinon.stub()
      const response = { send: stubbedSend }
      const stubbedFindOne = sinon.stub(models.teams, 'findOne').returns(singleTeam)

      await getTeamById(request, response)

      expect(stubbedFindOne).to.have.been.calledWith({ where: { id: '3' } })
      expect(stubbedSend).to.have.been.calledWith(singleTeam)
    })
  })

  describe('addTeam', () => { })
})


