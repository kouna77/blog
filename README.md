# Blog MVC
using typescript on Nodejs with ExpressJS Framework and MongoDB as Database
`src/index.ts` is the entry point

## Resources
- User
- Post
- Comment

## Documentation ? We have tests instead
### User
```js
describe('User', () => {
  describe('index()', () => {
    it('should ban guest user', async () => {})
    it('should ban customer user', async () => {})
    it('should allow admin user and return all results', async () => {})
  })
})
```

## Changelog
@kouna77
- make sure all script works
- add user resource flow (add, edit, delete)

Then later
- convert comment.js, post.js, user.js to mongoDb matching usage with controller
git
