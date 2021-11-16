import bcrypt from 'bcrypt'

export function slugify (value: string): string {
  if (!value) {
    return ''
  }
  return value.toLowerCase().split(' ').join('-')
}

function * _range (min, max) {
  while (min <= max) {
    yield min
    min++
  }
}

/**
 * @param {object} opt
 * @param {number} [opt.perPage]
 */
export function mongoPaginate<T> (opt: any = {}): (params: any) => Promise<{ pageCount: number, count: any, results: any }> {
  const options = Object.assign({}, {
    perPage: 100
  }, opt)
  /**
   *
   * @param {object} params
   * @param {number} [params.perPage] - How much items to show per page
   * @param {number} [params.page] - The page number you want to access
   */
  return async function<T> (params: any): Promise<{results: T[], count: number, pageCount: number}> {
    let { perPage, page, then, ...queries } = params
    if (!then) {
      then = (mongoQuery) => mongoQuery
    }
    if (!perPage) {
      perPage = options.perPage
    }
    if (!page || page < 0) {
      page = 1
    }
    page = Number(page)
    perPage = Number(perPage)
    // @ts-ignore
    const mongoQuery = this.find(queries, null, { skip: perPage * (page - 1), limit: perPage })
    const results: T[] = await then(mongoQuery)
    // @ts-ignore
    const count = await this.countDocuments(queries)
    return { results, count, pageCount: Math.ceil(count / perPage) }
  }
}

export function range (min, max): Number[] {
  return Array.from(_range(min, max))
}

export function hash (password: string | number): Promise<string> {
  return bcrypt.hash(password, 12)
}

export function hashCompare (clear: string, hash: string): Promise<boolean> {
  return bcrypt.compare(clear, hash)
}

/**
 * @returns {string}
 * @param query
 */
export function toQueryString (query: {[key: string]: string}) {
  const keys = Object.keys(Object(query))
  return keys.length > 0
    ? '?' + keys.map(key => `${key}=${query[key]}`).join('&')
    : ''
}
