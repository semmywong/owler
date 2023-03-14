# owler

JavaScript templates for node.js.

![GitHub package.json version](https://img.shields.io/github/package-json/v/semmywong/owler) ![GitHub last commit](https://img.shields.io/github/last-commit/semmywong/owler)

## Installation

you can use `npm install owler` or `yarn add owler`

## Example

```HTML
<!DOCTYPE html>
<html lang="en" data-color-mode="auto" data-light-theme="light" data-dark-theme="dark">

<head>
  <meta charset="utf-8" />
  <link rel="dns-prefetch" href="https://github.githubassets.com" />
  <script>
    const a = 'asdfasdfasdf';
    console.log(a);

    function testFunc() {
      console.log('testFunc');
    }
    testFunc();
  </script>
  <style>
    .test {
      color: #445566;
    }

    .test1 {
      color: #445566;
    }
  </style>
</head>

<body>
  <div>
    div content
    <span>span content</span>
    <br />
    <span o-text="name"></span>
    <p o-if="true">{{name}},{{age}}</p>
    <article>{{student}}</article>
    <o-include src="./include.html"></o-include>
    <o-include src="./include1.html" />
    <input />
    <div class="o-for-of" o-for="item of dataList">
      <span>{{item}}</span>
    </div>
    <div class="o-for-in" o-for="item in dataObject">
      <span o-text="item">{{item.a}}</span>
    </div>
  </div>
  <script>
    const a = 'asdfasdfasdf';
    console.log(a);

    function testFunc() {
      console.log('testFunc');
    }
    testFunc();
  </script>
  <style>
    .test {
      color: #445566;
    }

    .test1 {
      color: #445566;
    }
  </style>
</body>

</html>
```

## Usage

```JavaScript
const renderHTML = owler.render(html, {
  dataList: [1, 2, 3, 4, 5],
  dataObject: {
    a: 1,
    b: 2
  },
  name: 'semmy',
  age: 18,
  student: 'i am student',
  test: 'test',
});
```
