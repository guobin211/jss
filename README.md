# jss

## jss language

```shell
// build interpreter
deno compile main.ts

// run interpreter
./jss ./main.jss
```

### example

```js
print("welcome to jss");

fn makeAdder (offset) {

  fn add (x, y)  {
    x + y + offset
  }

  add
}

const adder = makeAdder(1);

print(adder(10, 5))
```
