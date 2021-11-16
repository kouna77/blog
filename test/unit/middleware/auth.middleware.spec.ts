import authMiddleware from '@/middleware/auth.middleware';
import { NextFunction, Request, Response } from "express";
import { mock } from 'jest-mock-extended'
import 'module-alias/register';
import UserFactory from "@/factory/UserFactory";
import { getDatabase } from "../../testCase";

describe.skip('auth.middleware', () => {
  let database
  beforeAll(async () => {
    database = getDatabase()
    await database.connect()
    console.log('mongo. connected')
  })

  afterAll(async () => {
    await database.close()
    console.log('mongo. close')
  })


  it('should throw 401 when no authorization header was sent', async () => {
    const request = mock<Request>()
    const response = mock<Response>()
    const next = mock<NextFunction>()
    delete request.headers.authorization
    try {
      await authMiddleware(request, response, next)
    } catch (error) {
      expect(error.status).toBe(401)
    }
  })

  it('should throw 401 when authorization header was sent but no user found', async () => {
    const request = mock<Request>()
    const response = mock<Response>()
    const next = mock<NextFunction>()
    request.headers.authorization = `Bearer ABC123`
    try {
      await authMiddleware(request, response, next)
    } catch (error) {
      expect(error.status).toBe(401)
    }
  })

  it('should not throw when user is found with that token and set user to request', async () => {
    const request = mock<Request>()
    const response = mock<Response>()
    const next = mock<NextFunction>()
    const user = await UserFactory.create()
    request.headers.authorization = `Bearer ${user.token}`
    await authMiddleware(request, response, next)
    expect(request).toHaveProperty('user')
    expect((request as any).user.id).toBe(user.id)
  })
})
