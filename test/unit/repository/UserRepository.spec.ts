import UserFactory from "@/factory/UserFactory";
import UserRepository from "@/repository/UserRepository";
import { hashCompare } from "../../../src/helper/app.helpers";
import { getDatabase } from "../../testCase";

describe.skip('UserRepository', () => {
  let database
  beforeAll(async () => {
    database = getDatabase()
    await database.connect()
  })

  afterAll(async () => {
    await database.stop()
  })


  describe('count(filter)', () => {
    it('should return 0 when there is no document', async () => {
      const filters = {}
      let count = await UserRepository.count(filters)
      expect(count).toBe(0)
    })
    it('should return all documents count when filter={}', async () => {
      await UserFactory.createMany({}, 10)
      const filters = {}
      const count = await UserRepository.count(filters)
      expect(count).toBe(10)
    })
    it('should return documents count matching filter', async () => {
      await UserFactory.createMany({ last_name: 'dia' }, 2)
      await UserFactory.createMany({ last_name: 'fall' }, 3)
      await UserFactory.createMany({}, 7)
      expect(await UserRepository.count({ last_name: 'dia' })).toBe(2)
      expect(await UserRepository.count({ last_name: 'fall' })).toBe(3)
    })
  })


  describe('add(payload)', () => {
    it('should create document and hash password', async () => {
      const payload = await UserFactory.make()
      const user = await UserRepository.add(payload)
      expect(user.password).not.toEqual(payload.password)
      expect(await hashCompare(payload.password, user.password)).toBe(true)
    })
  })
})
