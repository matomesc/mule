# mule

> json xhr client

## example

```javascript
mule
  .post('/foo/bar')
  .set('X-Api-Key', 'baz')
  .body({ name: 'mihai' })
  .end(function (res) {
    console.log(res.body)
    console.log(res.status)
  })
```