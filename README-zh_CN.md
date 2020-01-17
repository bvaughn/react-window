# react-window

> 高效渲染大数据列表和表格的react组件

React window基于仅渲染大数据中的部分数据（刚好填充满视窗）的方法，来帮助我们解决一些常见的的性能瓶颈问题：

1. 它减少了初始渲染和处理更新是的耗时
2. 减少内存占用，从而避免大量DOM节点引起的内存泄漏.

[![NPM registry](https://img.shields.io/npm/v/react-window.svg?style=for-the-badge)](https://yarnpkg.com/en/package/react-window) [![Travis](https://img.shields.io/badge/ci-travis-green.svg?style=for-the-badge)](https://travis-ci.org/bvaughn/react-window) [![NPM license](https://img.shields.io/badge/license-mit-red.svg?style=for-the-badge)](LICENSE.md)

## 安装

```bash
# Yarn
yarn add react-window

# NPM
npm install --save react-window
```

## 使用

Learn more at [react-window.now.sh](https://react-window.now.sh/):

## 相关库信息

* [`react-virtualized-auto-sizer`](https://npmjs.com/package/react-virtualized-auto-sizer): 高阶组件：动态适配可用的空间，并且支持传入width和height值到子组件
* [`react-window-infinite-loader`](https://npmjs.com/package/react-window-infinite-loader): 帮助大数据分组和根据视图滚动实时加载。也可以被用于UC华UN构建无限加载的列表中(e.g. Facebook or Twitter).
* [`react-vtree`](https://www.npmjs.com/package/react-vtree):
一个轻量灵活的解决大数据目录结构渲染的库（比如文件系统目录结构）

## 常见问题

### `react-window`和`react-virtualized`有何不同?
我几年前写了`react-virtualized`。当时，我对React和window的概念了解很浅。因此，我封装了一些API，但是后来我后悔了。原因之一是其中添加了太多没必要的特性和组件 。一旦你向开源项目添加些东西，删除它对用户是件很痛苦的事情

`react-window` 基于 `react-virtualized`完全重写. 我不用尝试解决那么多遗留问题或者支持那么多用例. 相反我聚焦在让包体积更小，运行效率更高的问题上来。我也花了很多心思在设计API和文档上来，让其对初学者更友好（当然window仍然是种高级用例）。

如果你的项目需要`react-window`提供的功能，我强烈建议用它替代`react-virtualized`. 然后如果需要一些仅`react-virtualized`提供的特性, 你有两个选择:

1. 继续使用 `react-virtualized`. (它仍广泛的应用于各种成功案例)
2. 创建一个封装了`react-window`基类的组件并且添加你需要的功能。你也可以发布这个组件到npm上 🙂

PS: 添加一个`react-virtualized`列表到一个CRA(create-react-app)项目中, gzip构建包增加了33.5kb. 同样的的添加一个`react-window`列表到CRA项目中，gzip构建包仅增加了2kb


### 一个列表或者网格结构可以100%填充页面的宽高么？

可以. 我推荐使用 [`react-virtualized-auto-sizer` 库](https://npmjs.com/package/react-virtualized-auto-sizer):

<img width="336" alt="screen shot 2019-03-07 at 7 29 08 pm" src="https://user-images.githubusercontent.com/29597/54005716-50f41880-410f-11e9-864f-a65bbdf49e07.png">

这是一个 [Sandbox上的例子](https://codesandbox.io/s/3vnx878jk5).

### 页面滚动的时候为什么会出现空白?

如果你的页面看起来像这样...

<img src="https://user-images.githubusercontent.com/29597/54005352-eb535c80-410d-11e9-80b2-d3d02db1f599.gif" width="302" height="152">

...那么你有可能是忘记`style`参数了! react-window这样的库基于绝对定位来展示 (通过一个内联样式), 所以不要忘记绑定到你渲染的DOM元素上!

<img width="257" alt="screen shot 2019-03-07 at 7 21 48 pm" src="https://user-images.githubusercontent.com/29597/54005433-45ecb880-410e-11e9-8721-420ff1a153da.png">

### 列表支持懒加载数据么?

支持，我推荐使用 [`react-window-infinite-loader` package](https://npmjs.com/package/react-window-infinite-loader):

<img width="368" alt="screen shot 2019-03-07 at 7 32 32 pm" src="https://user-images.githubusercontent.com/29597/54006733-653a1480-4113-11e9-907b-08ca5e27b3f9.png">

这是一个 [Sandbox上的例子](https://codesandbox.io/s/5wqo7z2np4).

### 可以绑定自定义属性和事件处理么?

可以, using the `outerElementType` prop.

<img width="412" alt="Screen Shot 2019-03-12 at 8 58 09 AM" src="https://user-images.githubusercontent.com/29597/54215333-f9ee9a80-44a4-11e9-9142-34c67026d950.png">

这是一个 [Sandbox上的例子](https://codesandbox.io/s/4zqx79nww0).

### 列表收尾可以添加padding么?

可以, 虽然需要一点点内联样式.

<img width="418" alt="Screen Shot 2019-06-02 at 8 38 18 PM" src="https://user-images.githubusercontent.com/29597/58774454-65ad4480-8576-11e9-8889-07044fd41393.png">

这是一个 [Sandbox上的例子](https://codesandbox.io/s/react-window-list-padding-dg0pq).

### 列表的元素间可以添加gutter或者padding么?

可以, 虽然需要一点点内联样式.

<img width="416" alt="Screen Shot 2019-03-26 at 6 33 56 PM" src="https://user-images.githubusercontent.com/29597/55043972-c14ad700-4ff5-11e9-9caa-2e9f4d85f96c.png">

这是一个 [Sandbox上的例子](https://codesandbox.io/s/2w8wmlm89p).

### 支持内部元素sticky处理么?

支持，不过需要一点代码修改. 这是一个 [Sandbox上的例子](https://codesandbox.io/s/0mk3qwpl4l).

## License

MIT © [bvaughn](https://github.com/bvaughn)
