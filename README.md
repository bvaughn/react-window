# react-window

> React components for efficiently rendering large lists and tabular data

React window works by only rendering *part* of a large data set (just enough to fill the viewport). This helps address some common performance bottlenecks:
1. It reduces the amount of work (and time) required to render the initial view and to process updates.
2. It reduces the memory footprint by avoiding over-allocation of DOM nodes.

[![NPM registry](https://img.shields.io/npm/v/react-window.svg?style=for-the-badge)](https://yarnpkg.com/en/package/react-window) [![Travis](https://img.shields.io/badge/ci-travis-green.svg?style=for-the-badge)](https://travis-ci.org/bvaughn/react-window) [![NPM license](https://img.shields.io/badge/license-mit-red.svg?style=for-the-badge)](LICENSE.md) [![OpenCollective](https://img.shields.io/opencollective/backers/react-window?logo=open-collective&style=for-the-badge)](#backers) [![OpenCollective](https://img.shields.io/opencollective/sponsors/react-window?logo=open-collective&style=for-the-badge)](#sponsors)

### Sponsors

The following wonderful companies have sponsored react-window:

<a href="https://opencollective.com/react-window/sponsor/0/website" target="_blank"><img src="https://opencollective.com/react-window/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/react-window/sponsor/1/website" target="_blank"><img src="https://opencollective.com/react-window/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/react-window/sponsor/2/website" target="_blank"><img src="https://opencollective.com/react-window/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/react-window/sponsor/3/website" target="_blank"><img src="https://opencollective.com/react-window/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/react-window/sponsor/4/website" target="_blank"><img src="https://opencollective.com/react-window/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/react-window/sponsor/5/website" target="_blank"><img src="https://opencollective.com/react-window/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/react-window/sponsor/6/website" target="_blank"><img src="https://opencollective.com/react-window/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/react-window/sponsor/7/website" target="_blank"><img src="https://opencollective.com/react-window/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/react-window/sponsor/8/website" target="_blank"><img src="https://opencollective.com/react-window/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/react-window/sponsor/9/website" target="_blank"><img src="https://opencollective.com/react-window/sponsor/9/avatar.svg"></a>
<a href="https://opencollective.com/react-window/sponsor/10/website" target="_blank"><img src="https://opencollective.com/react-window/sponsor/10/avatar.svg"></a>
<a href="https://opencollective.com/react-window/sponsor/11/website" target="_blank"><img src="https://opencollective.com/react-window/sponsor/11/avatar.svg"></a>
<a href="https://opencollective.com/react-window/sponsor/12/website" target="_blank"><img src="https://opencollective.com/react-window/sponsor/12/avatar.svg"></a>
<a href="https://opencollective.com/react-window/sponsor/13/website" target="_blank"><img src="https://opencollective.com/react-window/sponsor/13/avatar.svg"></a>
<a href="https://opencollective.com/react-window/sponsor/14/website" target="_blank"><img src="https://opencollective.com/react-window/sponsor/14/avatar.svg"></a>
<a href="https://opencollective.com/react-window/sponsor/15/website" target="_blank"><img src="https://opencollective.com/react-window/sponsor/15/avatar.svg"></a>
<a href="https://opencollective.com/react-window/sponsor/16/website" target="_blank"><img src="https://opencollective.com/react-window/sponsor/16/avatar.svg"></a>
<a href="https://opencollective.com/react-window/sponsor/17/website" target="_blank"><img src="https://opencollective.com/react-window/sponsor/17/avatar.svg"></a>
<a href="https://opencollective.com/react-window/sponsor/18/website" target="_blank"><img src="https://opencollective.com/react-window/sponsor/18/avatar.svg"></a>
<a href="https://opencollective.com/react-window/sponsor/19/website" target="_blank"><img src="https://opencollective.com/react-window/sponsor/19/avatar.svg"></a>
<a href="https://opencollective.com/react-window/sponsor/20/website" target="_blank"><img src="https://opencollective.com/react-window/sponsor/20/avatar.svg"></a>
<a href="https://opencollective.com/react-window/sponsor/21/website" target="_blank"><img src="https://opencollective.com/react-window/sponsor/21/avatar.svg"></a>
<a href="https://opencollective.com/react-window/sponsor/22/website" target="_blank"><img src="https://opencollective.com/react-window/sponsor/22/avatar.svg"></a>
<a href="https://opencollective.com/react-window/sponsor/23/website" target="_blank"><img src="https://opencollective.com/react-window/sponsor/23/avatar.svg"></a>
<a href="https://opencollective.com/react-window/sponsor/24/website" target="_blank"><img src="https://opencollective.com/react-window/sponsor/24/avatar.svg"></a>
<a href="https://opencollective.com/react-window/sponsor/25/website" target="_blank"><img src="https://opencollective.com/react-window/sponsor/25/avatar.svg"></a>
<a href="https://opencollective.com/react-window/sponsor/26/website" target="_blank"><img src="https://opencollective.com/react-window/sponsor/26/avatar.svg"></a>
<a href="https://opencollective.com/react-window/sponsor/27/website" target="_blank"><img src="https://opencollective.com/react-window/sponsor/27/avatar.svg"></a>
<a href="https://opencollective.com/react-window/sponsor/28/website" target="_blank"><img src="https://opencollective.com/react-window/sponsor/28/avatar.svg"></a>
<a href="https://opencollective.com/react-window/sponsor/29/website" target="_blank"><img src="https://opencollective.com/react-window/sponsor/29/avatar.svg"></a>

[Learn more about becoming a sponsor!](https://opencollective.com/react-window#sponsor)

<a href="https://opencollective.com/react-window/backer/0/website" target="_blank"><img src="https://opencollective.com/react-window/backer/0/avatar.svg"></a>
<a href="https://opencollective.com/react-window/backer/1/website" target="_blank"><img src="https://opencollective.com/react-window/backer/1/avatar.svg"></a>
<a href="https://opencollective.com/react-window/backer/2/website" target="_blank"><img src="https://opencollective.com/react-window/backer/2/avatar.svg"></a>
<a href="https://opencollective.com/react-window/backer/3/website" target="_blank"><img src="https://opencollective.com/react-window/backer/3/avatar.svg"></a>
<a href="https://opencollective.com/react-window/backer/4/website" target="_blank"><img src="https://opencollective.com/react-window/backer/4/avatar.svg"></a>
<a href="https://opencollective.com/react-window/backer/5/website" target="_blank"><img src="https://opencollective.com/react-window/backer/5/avatar.svg"></a>
<a href="https://opencollective.com/react-window/backer/6/website" target="_blank"><img src="https://opencollective.com/react-window/backer/6/avatar.svg"></a>
<a href="https://opencollective.com/react-window/backer/7/website" target="_blank"><img src="https://opencollective.com/react-window/backer/7/avatar.svg"></a>
<a href="https://opencollective.com/react-window/backer/8/website" target="_blank"><img src="https://opencollective.com/react-window/backer/8/avatar.svg"></a>
<a href="https://opencollective.com/react-window/backer/9/website" target="_blank"><img src="https://opencollective.com/react-window/backer/9/avatar.svg"></a>
<a href="https://opencollective.com/react-window/backer/10/website" target="_blank"><img src="https://opencollective.com/react-window/backer/10/avatar.svg"></a>
<a href="https://opencollective.com/react-window/backer/11/website" target="_blank"><img src="https://opencollective.com/react-window/backer/11/avatar.svg"></a>
<a href="https://opencollective.com/react-window/backer/12/website" target="_blank"><img src="https://opencollective.com/react-window/backer/12/avatar.svg"></a>
<a href="https://opencollective.com/react-window/backer/13/website" target="_blank"><img src="https://opencollective.com/react-window/backer/13/avatar.svg"></a>
<a href="https://opencollective.com/react-window/backer/14/website" target="_blank"><img src="https://opencollective.com/react-window/backer/14/avatar.svg"></a>
<a href="https://opencollective.com/react-window/backer/15/website" target="_blank"><img src="https://opencollective.com/react-window/backer/15/avatar.svg"></a>
<a href="https://opencollective.com/react-window/backer/16/website" target="_blank"><img src="https://opencollective.com/react-window/backer/16/avatar.svg"></a>
<a href="https://opencollective.com/react-window/backer/17/website" target="_blank"><img src="https://opencollective.com/react-window/backer/17/avatar.svg"></a>
<a href="https://opencollective.com/react-window/backer/18/website" target="_blank"><img src="https://opencollective.com/react-window/backer/18/avatar.svg"></a>
<a href="https://opencollective.com/react-window/backer/19/website" target="_blank"><img src="https://opencollective.com/react-window/backer/19/avatar.svg"></a>
<a href="https://opencollective.com/react-window/backer/20/website" target="_blank"><img src="https://opencollective.com/react-window/backer/20/avatar.svg"></a>
<a href="https://opencollective.com/react-window/backer/21/website" target="_blank"><img src="https://opencollective.com/react-window/backer/21/avatar.svg"></a>
<a href="https://opencollective.com/react-window/backer/22/website" target="_blank"><img src="https://opencollective.com/react-window/backer/22/avatar.svg"></a>
<a href="https://opencollective.com/react-window/backer/23/website" target="_blank"><img src="https://opencollective.com/react-window/backer/23/avatar.svg"></a>
<a href="https://opencollective.com/react-window/backer/24/website" target="_blank"><img src="https://opencollective.com/react-window/backer/24/avatar.svg"></a>
<a href="https://opencollective.com/react-window/backer/25/website" target="_blank"><img src="https://opencollective.com/react-window/backer/25/avatar.svg"></a>
<a href="https://opencollective.com/react-window/backer/26/website" target="_blank"><img src="https://opencollective.com/react-window/backer/26/avatar.svg"></a>
<a href="https://opencollective.com/react-window/backer/27/website" target="_blank"><img src="https://opencollective.com/react-window/backer/27/avatar.svg"></a>
<a href="https://opencollective.com/react-window/backer/28/website" target="_blank"><img src="https://opencollective.com/react-window/backer/28/avatar.svg"></a>
<a href="https://opencollective.com/react-window/backer/29/website" target="_blank"><img src="https://opencollective.com/react-window/backer/29/avatar.svg"></a>

## Install

```bash
# Yarn
yarn add react-window

# NPM
npm install --save react-window
```

## Usage

Learn more at [react-window.now.sh](https://react-window.now.sh/):

## Related libraries

* [`react-virtualized-auto-sizer`](https://npmjs.com/package/react-virtualized-auto-sizer): HOC that grows to fit all of the available space and passes the width and height values to its child.
* [`react-window-infinite-loader`](https://npmjs.com/package/react-window-infinite-loader): Helps break large data sets down into chunks that can be just-in-time loaded as they are scrolled into view. It can also be used to create infinite loading lists (e.g. Facebook or Twitter).
* [`react-vtree`](https://www.npmjs.com/package/react-vtree): Lightweight and flexible solution to render large tree structures (e.g., file system).

## Frequently asked questions

### How is `react-window` different from `react-virtualized`?
I wrote `react-virtualized` several years ago. At the time, I was new to both React and the concept of windowing. Because of this, I made a few API decisions that I later came to regret. One of these was adding too many non-essential features and components. Once you add something to an open source project, removing it is pretty painful for users.

`react-window` is a complete rewrite of `react-virtualized`. I didn't try to solve as many problems or support as many use cases. Instead I focused on making the package **smaller**<sup>1</sup> and **faster**. I also put a lot of thought into making the API (and documentation) as beginner-friendly as possible (with the caveat that windowing is still kind of an advanced use case).

If `react-window` provides the functionality your project needs, I would strongly recommend using it instead of `react-virtualized`. However if you need features that only `react-virtualized` provides, you have two options:

1. Use `react-virtualized`. (It's still widely used by a lot of successful projects!)
2. Create a component that decorates one of the `react-window` primitives and adds the functionality you need. You may even want to release this component to NPM (as its own, standalone package)! 🙂

<sup>1 - Adding a `react-virtualized` list to a CRA project increases the (gzipped) build size by ~33.5 KB. Adding a `react-window` list to a CRA project increases the (gzipped) build size by &lt;2 KB.</sup>

### Can a list or a grid fill 100% the width or height of a page?

Yes. I recommend using the [`react-virtualized-auto-sizer` package](https://npmjs.com/package/react-virtualized-auto-sizer):

<img width="336" alt="screen shot 2019-03-07 at 7 29 08 pm" src="https://user-images.githubusercontent.com/29597/54005716-50f41880-410f-11e9-864f-a65bbdf49e07.png">

Here's a [Code Sandbox demo](https://codesandbox.io/s/3vnx878jk5).

### Why is my list blank when I scroll?

If your list looks something like this...

<img src="https://user-images.githubusercontent.com/29597/54005352-eb535c80-410d-11e9-80b2-d3d02db1f599.gif" width="302" height="152">

...then you probably forgot to use the `style` parameter! Libraries like react-window work by absolutely positioning the list items (via an inline style), so don't forget to attach it to the DOM element you render!

<img width="257" alt="screen shot 2019-03-07 at 7 21 48 pm" src="https://user-images.githubusercontent.com/29597/54005433-45ecb880-410e-11e9-8721-420ff1a153da.png">

### Can I lazy load data for my list?

Yes. I recommend using the [`react-window-infinite-loader` package](https://npmjs.com/package/react-window-infinite-loader):

<img width="368" alt="screen shot 2019-03-07 at 7 32 32 pm" src="https://user-images.githubusercontent.com/29597/54006733-653a1480-4113-11e9-907b-08ca5e27b3f9.png">

Here's a [Code Sandbox demo](https://codesandbox.io/s/5wqo7z2np4).

### Can I attach custom properties or event handlers?

Yes, using the `outerElementType` prop.

<img width="412" alt="Screen Shot 2019-03-12 at 8 58 09 AM" src="https://user-images.githubusercontent.com/29597/54215333-f9ee9a80-44a4-11e9-9142-34c67026d950.png">

Here's a [Code Sandbox demo](https://codesandbox.io/s/4zqx79nww0).

### Can I add a header and a footer to the list?

Yes, you need to wrap the element in a block with a relative position
```js
const innerElementType = forwardRef((props, ref) => (
  <>
    <div>Header</div>
    <div style={{ position: "relative" }}>
      <div ref={ref} {...props} />
    </div>
    <div>Footer</div>
  </>
));
```

Here's a [Code Sandbox demo](https://codesandbox.io/s/react-window-list-padding-forked-d6199?file=/index.js).

### Can I add gutter or padding between items?

Yes, although it requires a bit of inline styling.

<img width="416" alt="Screen Shot 2019-03-26 at 6 33 56 PM" src="https://user-images.githubusercontent.com/29597/55043972-c14ad700-4ff5-11e9-9caa-2e9f4d85f96c.png">

Here's a [Code Sandbox demo](https://codesandbox.io/s/2w8wmlm89p).

### Does this library support "sticky" items?

Yes, although it requires a small amount of user code. Here's a [Code Sandbox demo](https://codesandbox.io/s/0mk3qwpl4l).

## License

MIT © [bvaughn](https://github.com/bvaughn)
