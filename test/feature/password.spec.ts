import { mock } from "jest-mock-extended";
import { Container } from "typedi";
import PasswordRequestFactory from "../../src/factory/PasswordRequestFactory";
import UserFactory from "../../src/factory/UserFactory";
import PasswordRequestRepository from "../../src/repository/PasswordRequestRepository";
import AppApiResponse from "../../src/response/AppApiResponse";
import MailService from "../../src/service/MailService";
import { getDatabase, getServer } from "../testCase";
import moment = require("moment");

const supertest = require('supertest')

describe('password', () => {

  let database
  let app
  let request
  beforeAll(async () => {
    database = getDatabase()
    const server = getServer(database)
    app = await server.start()
    request = supertest.agent(app)
  })

  afterAll(async () => {
    await app.close()
  })

  afterEach(async () => {
    await database.truncate()
  })

  describe('POST /password/forgot', () => {
    test('when password is not set', async () => {
      const payload = {}
      const response = await request.post('/password/forgot')
        .send(payload)
        .expect(422)
      const apiResponse = AppApiResponse.from(response.body)
      expect(apiResponse.isSuccess()).toBe(false)
    })
    test('when account does not exists', async () => {
      const user = await UserFactory.make()
      const payload = {
        email: user.email
      }
      expect(await PasswordRequestRepository.count({ email: user.email })).toBe(0)
      const response = await request.post('/password/forgot')
        .send(payload)
        .expect(422)
      const apiResponse = AppApiResponse.from(response.body)
      expect(apiResponse.isSuccess()).toBe(false)
      expect(await PasswordRequestRepository.count({ email: user.email })).toBe(0)
    })
    test('when account exists', async () => {
      const mailServiceMock = mock<MailService>()
      Container.set(MailService, mailServiceMock)
      const user = await UserFactory.create()
      const payload = {
        email: user.email
      }
      expect(await PasswordRequestRepository.count({ email: user.email })).toBe(0)
      const response = await request.post('/password/forgot')
        .send(payload).expect(200)
      const apiResponse = AppApiResponse.from(response.body)
      expect(apiResponse.isSuccess()).toBe(true)
      expect(await PasswordRequestRepository.count({ user: user.id })).toBe(1)
      const passwordRequest = await PasswordRequestRepository.find({ user: user.id })
      expect(passwordRequest.user.toString()).toEqual(user.id)

      // date is in the future
      expect(moment(passwordRequest.expired_at).diff(new Date())).toBeGreaterThan(0)

      expect(mailServiceMock.passwordForgot).toBeCalledWith({
        user: user.toJSON(),
        clearToken: passwordRequest.token
      })

    })
    test('when password request already exists', async () => {
      const user = await UserFactory.create()
      const previousRequest = await PasswordRequestFactory.create({
        user: user.id
      })
      const payload = {
        email: user.email
      }
      expect(await PasswordRequestRepository.count({ user: user.id })).toBe(1)
      const response = await request.post('/password/forgot')
        .send(payload)
        .expect(200)
      const apiResponse = AppApiResponse.from(response.body)
      expect(apiResponse.isSuccess()).toBe(true)
      expect(await PasswordRequestRepository.count({ user: user.id })).toBe(1)
      const passwordRequest = await PasswordRequestRepository.find({ user: user.id })
      expect(passwordRequest.id).not.toEqual(previousRequest.id)
      expect(passwordRequest.user.toString()).toEqual(user.id)
      // date is in the future
      expect(moment(passwordRequest.expired_at).diff(new Date())).toBeGreaterThan(0)
    })
  })
})
