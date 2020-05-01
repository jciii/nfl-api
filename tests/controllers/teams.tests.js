/* eslint-disable max-len */
const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const models = require('../../models')
const {
  afterEach, before, beforeEach, describe, it
} = require('mocha')
const { teamList, singleTeam, postedTeam } = require('../mocks/teams')
const { getAllTeams, getTeamById, saveNewTeam } = require('../../controllers/teams')

chai.use(sinonChai)
const { expect } = chai

describe('Controllers-teams', () => {
  let sandbox
  let stubbedFindOne
  let stubbedSend
  let stubbedSendStatus
  let stubbedStatus
  let stubbedStatusSend
  let response

  before(() => {
    sandbox = sinon.createSandbox()

    stubbedFindOne = sandbox.stub(models.teams, 'findOne')

    stubbedSend = sandbox.stub()
    stubbedSendStatus = sandbox.stub()
    stubbedStatus = sandbox.stub()
    stubbedStatusSend = sandbox.stub()

    response = {
      send: stubbedSend,
      sendStatus: stubbedSendStatus,
      status: stubbedStatus,
    }
  })
  beforeEach(() => {
    stubbedStatus.returns({ send: stubbedStatusSend })
  })

  afterEach(() => {
    sandbox.reset()
  })

  describe('getAllTeams', () => {
    it('retrieves a list of all teams from the database and calls response.send() with the list',
      async () => {
        const stubbedFindAll = sinon.stub(models.teams, 'findAll').returns(teamList)

        await getAllTeams({}, response)
        expect(stubbedFindAll).to.have.callCount(1)
        expect(stubbedSend).to.have.been.calledWith(teamList)
      })
  })

  describe('getTeamById', () => {
    it('retrieves a specific team based on id given', async () => {
      stubbedFindOne.returns(singleTeam)
      const request = { params: { id: '3' } }

      await getTeamById(request, response)

      expect(stubbedFindOne).to.have.been.calledWith({ where: { id: '3' } })
      expect(stubbedSend).to.have.been.calledWith(singleTeam)
    })
    it('returns a 404 when no team is found', async () => {
      stubbedFindOne.returns(null)
      const request = { params: { id: 'not-found' } }

      await getTeamById(request, response)

      expect(stubbedFindOne).to.have.been.calledWith({ where: { id: 'not-found' } })
      expect(stubbedSendStatus).to.have.been.calledWith(404)
    })
    it('returns a 500 with an error message when the database call throws an error', async () => {
      stubbedFindOne.throws('ERROR!')
      const request = { params: { id: 'throw-error' } }

      await getTeamById(request, response)

      expect(stubbedFindOne).to.have.been.calledWith({ where: { id: 'throw-error' } })
      expect(stubbedStatus).to.have.been.calledWith(500)
      expect(stubbedStatusSend).to.have.been.calledWith('Unable to find Team, do it agian')
    })
  })

  describe('saveNewTeam', () => {
    it('accepts new team details and saves them as a new team in the database, returning the saved record with a 201 status', async () => {
      const request = { body: postedTeam }
      const stubbedCreate = sinon.stub(models.teams, 'create').returns(postedTeam)

      await saveNewTeam(request, response)

      expect(stubbedCreate).to.have.been.calledWith(postedTeam)
      expect(stubbedStatus).to.have.been.calledWith(201)
      expect(stubbedSend).to.have.been.calledWith(postedTeam)
    })
  })
})
