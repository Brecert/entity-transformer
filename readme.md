# Entity-Transformer

makes it (slightly) easier to transform a specific entity format from one format to another.

`js.test.js` has a test that shows how it works in more detail.

## Format

```
type Entity {
  type: string
  offset: usize
  length: usize
  children?: Entity
  ...data: T
}
```