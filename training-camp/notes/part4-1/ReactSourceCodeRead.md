# React 源码解读

> 针对 v16.13.1 版本的源码解读，代码中有存在 __DEV__ 判断的是开发环境做的处理，通常是做警告提示或调试使用的逻辑，这边直接忽略掉。

## JSX 转为 ReactElement 的过程

JSX 最终会转化为 `React.createElement` 的调用，所以应该查找定义 `createElement` 方法的文件。

### createElement

> 文件位置 `packages/react/src/ReactElement.js`

JSX 与 `createElement` 的转化规则：

```html
<div name="属性">子元素</div>

<ul>
  <li>选项1</li>
  <li>选项2</li>
  <li>选项3</li>
</ul>
```

转为：

```js
createElement('div', { name: '属性' }, '子元素')

createElement(
  'ul',
  null,
  createElement('li', null, '选项1'),
  createElement('li', null, '选项2'),
  createElement('li', null, '选项3'),
)
```

`createElement` 参数说明：

- 第一个参数 `type`: 元素类型
- 第二个参数 `config`: 属性配置
- 第三个参数 `children`: 子元素

方法处理主要逻辑：

1. 定义 `props`，从 `config` 里提取 `key` (会被转为字符串) 、`ref`、`self`、`source` 属性，其他放入 `props` 里
2. `children` 处理
    - 小于三个参数时，不做处理
    - 只有三个参数时将 `children` 传给 `props.children`
    - 有三个参数以上时，将第三个参数和之后的参数放在一个数组，传给 `props.children`
3. 如果组件有设置 `defaultProps`，给 `props` 设置默认值
4. 调用 `ReactElement` 方法

具体代码和注释：

```js
/**
 * 创建 React Element
 * @param type      元素类型
 * @param config    属性配置
 * @param children  子元素
 */
export function createElement(type, config, children) {
  // 属性名称，用于后面 for……in 使用
  let propName;

  // 存储 React Element 中的普通元素属性 即不包含 key ref self source
  const props = {};

  /**
   * 待提取属性
   * React 内部为了实现某些功能而存在的属性
   */
  let key = null;
  let ref = null;
  let self = null;
  let source = null;

  // 如果 config 不为 null
  if (config != null) {
    // config 存在合法的 ref 属性就存起来
    // 判断标准：config.ref !== undefined
    if (hasValidRef(config)) {
      ref = config.ref;

      if (__DEV__) {
        // ...
      }
    }

    // config 存在合法的 key 属性就存起来
    // 判断标准：config.key !== undefined
    if (hasValidKey(config)) {
      // key 会被转为字符串
      key = '' + config.key;
    }

    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source;

    // 遍历 config 对象
    for (propName in config) {
      // 属性存在于对象自身属性（非原型属性）且不是 key、ref、__self、__source 值
      if (
        hasOwnProperty.call(config, propName) &&
        !RESERVED_PROPS.hasOwnProperty(propName)
      ) {
        // 将满足条件的属性添加到 props 对象中 (普通属性)
        props[propName] = config[propName];
      }
    }
  }

  // 参数个数 - 2
  const childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    // 只有三个参数，第三个参数直接作为 props.children 值
    props.children = children;
  } else if (childrenLength > 1) {
    // 大于三个参数，第三个参数和之后的都放在一个数组里，作为 prop.children 值
    const childArray = Array(childrenLength);
    for (let i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    if (__DEV__) {
      // ...
    }
    props.children = childArray;
  }

  // type 是否存在 defaultProps 属性。即是否是组件，组件是否有传 defaultProps 值
  if (type && type.defaultProps) {
    const defaultProps = type.defaultProps;
    
    // 遍历 defaultProps ，如果对应的属性值是 undefined ，则设置默认值
    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }

  if (__DEV__) {
    // ...
  }

  // 返回 ReactElement
  return ReactElement(
    type,
    key,
    ref,
    self,
    source,
    // 在 Virtual DOM 中用于识别自定义组件，初始是 null
    ReactCurrentOwner.current,
    props,
  );
}
```

### ReactElement

> 文件位置 `packages/react/src/ReactElement.js`

创建 ReactElement 对象。

```js
const ReactElement = function (type, key, ref, self, source, owner, props) {
  const element = {
    // 用于区别 ReactElement 和普通对象，值为 Symbol.for('react.element') 或 0xeac7
    $$typeof: REACT_ELEMENT_TYPE,
    type: type,
    key: key,
    ref: ref,
    props: props,

    // 记录当前元素所属组件 (记录当前元素是哪个组件创建的)
    _owner: owner,
  };

  if (__DEV__) {
    // ...
  }
  return element;
};
```

## React 架构

React 16 的架构可以分为三层：调度层、协调层、渲染层。

- Scheduler (调度层): 调度任务的优先级，高优任务优先进入协调层
- Reconciler (协调层): 构建 Fiber 数据结构，比对 Fiber 对象找出差异，记录 Fiber 对象要进行的 DOM 操作
- Renderer (渲染层): 负责将发生变化的部分渲染到页面上

### 调度层

在 React 15 的版本中，采用了循环加递归的方式进行了 VirtualDOM 的比对，由于递归使用 JavaScript 自身的执行栈，一旦开始就无法停止。如果 VirtualDOM 树的层级比较深，VirtualDOM 的比对就会长期占用 JavaScript 主线程，由于 JavaScript 又是单线程的无法同时执行其他任务，所以在比对的过程中无法响应用户操作，无法及时执行元素动画，造成了页面卡顿现象。

在 React 16 的版本中，放弃了 JavaScript 递归的方式进行 VirtualDOM 的比对，而是采用循环模拟递归。而且比对的过程是利用浏览器的空闲时间完成的，不会长期占用主线程，这就解决了 VirtualDOM 比对造成页面卡顿的问题。

在 window 对象中提供了 requestIdleCallback API，它可以利用浏览器的空闲时间执行任务，但是它自身也存在一些问题，比如说并不是所有浏览器都支持它，而且它的触发频率也不是很稳定，所以 React 最终放弃了 requestIdleCallback 的使用。

在 React 中，官方实现了自己的任务调度库，这个库就叫做 Scheduler。它也可以实现在浏览器空闲时执行任务，而且还可以设置任务的优先级，高优先级任务先执行，低优先级任务后执行。

Scheduler 存储在 `packages/scheduler` 文件夹中。

### 协调层

在 React 15 的版本中，协调层和渲染层交替执行，即找到了差异就直接更新差异。在 React 16 的版本中，这种情况发生了变化，协调层和渲染层不再交替执行。协同层负责找出差异，在所有差异找出之后，统一交给渲染层进行 DOM 的更新。也就是说协调层是主要任务就是找出差异部分，并为差异打上标记。

### 渲染层

渲染层根据协调层为 Fiber 节点打的标记，同步执行对应的 DON 操作。

既然比对的过程从递归变成了可以中断的循环，那么 React 是如何解决中断更新时 DOM 渲染不完全的问题呢？其实根本就不存在这个问题，因为在整个过程中，调度层和协调层的工作是在内存中完成的是可以被打断的，渲染层的工作被设定成不可以被打断，所以不存在 DOM 渲染不完全的问题。

## 数据结构

### Fiber 数据结构

```ts
type Fiber = {
  /******************** DOM 实例相关 ********************/

  // 标记不同的组件类型
  // WorkTag 定义见 `packages/shared/ReactWorkTags.js`
  tag: WorkTag

  // 对应 createElement 第一个参数
  type: any

  // 实例对象，如类组件的实例、原生 DOM 实例
  stateNode: any


  /******************** 构建 Fiber 树相关 ********************/

  // 指向自己的父级 Fiber 对象
  return: Fiber | null

  // 指向自己的第一个子级 Fiber 对象
  child: Fiber | null

  // 指向自己的下一个兄弟 Fiber 对象
  sibling: Fiber | null

  // 指向当前 Fiber 在 workInProgress 树的对应 Fiber 对象
  alternate: Fiber | null

  /******************** 状态数据相关 ********************/

  // 即将更新的 props
  pendingProps: any

  // 旧的 props
  memoizedProps: any

  // 旧的 state
  memoizedState: any

  /******************** 副作用相关 ********************/

  // 该 Fiber 对应的组件产生的状态更新会存放在这个队列里面
  updateQueue: UpdateQueue<any> | null

  // 用来记录当前 Fiber 要执行的 DOM 操作
  // SideEffectTag 定义见 `packages/shared/ReactSideEffectTags.js`
  effectTag: SideEffectTag

  // 第一个 side effect
  firstEffect: Fiber | null

  // 链表存储，指向下一个 side effect
  nextEffect: Fiber | null

  // 最后一个 side effect
  lastEffect: Fiber | null

  // 任务的过期时间，过期后会强制执行任务
  expirationTime: ExpirationTime

  // 当前组件及子组件处于何种渲染模式
  // TypeOfMode 定义见 `packages/react-reconciler/src/ReactTypeOfMode.js`
  mode: TypeOfMode
}
```

### 双缓存技术

在 React 中，DOM 的更新采用了双缓存技术，双缓存技术致力于更快的 DOM 更新。

什么是双缓存？举个例子，使用 canvas 绘制动画时，在绘制每一帧前都会清除上一帧的画面，清除上一帧需要花费时间，如果当前帧画面计算量又比较大，又需要花费比较长的时间，这就导致上一帧清除到下一帧显示中间会有较长的间隙，就会出现白屏。

为了解决这个问题，我们可以在内存中绘制当前帧动画，绘制完毕后直接用当前帧替换上一帧画面，这样的话在帧画面替换的过程中就会节约非常多的事件，就不会出现白屏问题。这种在内存中构建并直接替换的技术叫做双缓存。

React 使用双缓存技术完成 Fiber 树的构建与替换，实现 DOM 对象的快速更新。

在 React 中最多会同时存在两颗 Fiber 树，当前在屏幕中显示的内容对应的 Fiber 树叫做 current Fiber 树，当发生更新时，React 会在内存中重新构建一颗新的 Fiber 树，这颗正在构建的 Fiber 树叫做 workInProgress Fiber 树。在双缓存技术中，workInProgress Fiber 树就是即将要显示在页面中的 Fiber 树，当这颗 Fiber 树构建完成后，React 会使用它直接替换 current Fiber 树达到快速更新 DOM 的目的，因为 workInProgress Fiber 树是在内存中构建的所以构建它的速度是非常快的。

一旦 workInProgress Fiber 树在屏幕上呈现，它就会变成 current Fiber 树。

在 current Fiber 节点对象中有一个 alternate 属性指向对应的 workInProgress Fiber 节点对象，在 workInProgress Fiber 节点中有一个 alternate 属性也指向对用的 current Fiber 节点对象。

### fiberRoot 和 rootFiber

fiberRoot 表示 Fiber 数据结构对象，是 Fiber 数据结构中最外层对象。

rootFiber 表示组件挂载点对应的 Fiber 对象，比如 React 应用中默认的组件挂载点就是 id 为 root 的 div。

两者的联系：

```js
fiberRoot.current = rootFiber

rootFiber.stateNode = fiberRoot
```

fiberRoot 会记录应用的更新信息，比如协调层在完成工作后，会将工作成果存储在 fiberRoot 中。

## 构建 FiberRoot 和 RootFiber

### render

> 文件位置 `packages/react-dom/src/client/ReactDOMLegacy.js`

Web 应用渲染入口方法，用于将 ReactElement 渲染到容器上。

主要逻辑：

- 判断第二参数是否是渲染容器，如果不是就抛出异常
- 调用 `legacyRenderSubtreeIntoContainer` 方法

```ts
/**
 * 渲染入口
 * @param element 要进行渲染的 ReactElement
 * @param container 渲染容器
 * @param callback 渲染完成后执行的回调函数
 */
export function render(
  element: React$Element<any>,
  container: Container,
  callback: ?Function,
) {
  // 第一参数为 false 就报错，否则不做任何处理
  invariant(
    /**
     * 检测 container 是否是符合要求的渲染容器
     * 
     * 判断标准：
     * - 元素节点: container.node === 1
     * - document节点: container.node === 9
     * - Fragment节点: container.node === 11
     * - 注释节点: container.node === 8 && container.nodeValue === ' react-mount-point-unstable ')
     */
    isValidContainer(container),
    'Target container is not a DOM element.',
  );

  if (__DEV__) {
    // ...
  }
  return legacyRenderSubtreeIntoContainer(
    // 父组件，初始渲染没有父组件传递 null 占位
    null,
    element,
    container,
    // 是否为服务器端渲染 false 不是服务器端渲染 true 是服务器端渲染
    false,
    callback,
  );
}
```

### legacyRenderSubtreeIntoContainer

> 文件位置 `packages/react-dom/src/client/ReactDOMLegacy.js`

```ts
/**
 * 将子树渲染到容器中 (初始化 Fiber 数据结构: 创建 fiberRoot 及 rootFiber)
 * parentComponent: 父组件, 初始渲染传入了 null
 * children: render 方法中的第一个参数, 要渲染的 ReactElement
 * container: 渲染容器
 * forceHydrate: true 为服务端渲染, false 为客户端渲染
 * callback: 组件渲染完成后需要执行的回调函数
 **/
function legacyRenderSubtreeIntoContainer(
  parentComponent: ?React$Component<any, any>,
  children: ReactNodeList,
  container: Container,
  forceHydrate: boolean,
  callback: ?Function,
) {
  if (__DEV__) {
    // ...
  }

  let root: RootType = (container._reactRootContainer: any);
  let fiberRoot; // 根 Fiber 对象

  // 存在则代表更新，否则是初始渲染
  if (!root) {
    
    // 初始化 Fiber 数据结构
    root = container._reactRootContainer = legacyCreateRootFromDOMContainer(
      container,
      forceHydrate,
    );

    fiberRoot = root._internalRoot;
    
    // 将 callback 的 this 指向根节点的真实 DOM 对象
    if (typeof callback === 'function') {
      const originalCallback = callback;

      callback = function () {
        // 获取根节点的真实 DOM 对象
        const instance = getPublicRootInstance(fiberRoot);
        // 修改 this 指向
        originalCallback.call(instance);
      };
    }
    // 初始化渲染不执行批量更新，相当于直接执行函数
    unbatchedUpdates(() => {
      updateContainer(children, fiberRoot, parentComponent, callback);
    });
  } else {
    // 更新的操作，先不考虑
  }
  // 返回 render 方法第一个参数的真实 DOM 对象作为 render 方法的返回值
  // 就是说渲染谁 返回谁的真实 DOM 对象
  return getPublicRootInstance(fiberRoot);
}
```

### legacyCreateRootFromDOMContainer

> 文件位置 `packages/react-dom/src/client/ReactDOMLegacy.js`

```ts
// 非服务端渲染删除容器所有子节点
function legacyCreateRootFromDOMContainer(
  container: Container,
  forceHydrate: boolean,
): RootType {
  // container => <div id="root"></div>

  // 检测是否为服务器端渲染
  const shouldHydrate = forceHydrate || shouldHydrateDueToLegacyHeuristic(container);

  // 如果不是服务器端渲染
  if (!shouldHydrate) {
    let warned = false;
    let rootSibling;

    // 循环删除 container 最后一个子节点
    while ((rootSibling = container.lastChild)) {
      if (__DEV__) {
        // ...
      }
      container.removeChild(rootSibling);
    }
  }

  if (__DEV__) {
    // ...
  }
  return createLegacyRoot(
    container,
    shouldHydrate
      ? {
          hydrate: true,
        }
      : undefined,
  );
}
```

### createLegacyRoot

```ts
export function createLegacyRoot(
  container: Container,
  options?: RootOptions,
): RootType {
  // LegacyRoot 常量, 值为 0,
  return new ReactDOMBlockingRoot(container, LegacyRoot, options);
}
```

### ReactDOMBlockingRoot

```ts
function ReactDOMBlockingRoot(
  container: Container,
  tag: RootTag,
  options: void | RootOptions,
) {
  this._internalRoot = createRootImpl(container, tag, options);
}
```

### createRootImpl

```ts
function createRootImpl(
  container: Container,
  tag: RootTag,
  options: void | RootOptions,
) {
  // 服务器端渲染相关变量
  const hydrate = options != null && options.hydrate === true;
  const hydrationCallbacks = (options != null && options.hydrationOptions) || null;

  const root = createContainer(container, tag, hydrate, hydrationCallbacks);

  // 函数执行内容：container.__reactContainere$ = root.current,
  markContainerAsRoot(root.current, container);
  
  if (hydrate && tag !== LegacyRoot) {
    // 服务器端渲染相关
  }
  return root;
}
```

### createContainer

```ts
export function createContainer(
  containerInfo: Container,
  tag: RootTag,
  hydrate: boolean,
  hydrationCallbacks: null | SuspenseHydrationCallbacks,
): OpaqueRoot {
  return createFiberRoot(containerInfo, tag, hydrate, hydrationCallbacks);
}
```

### createFiberRoot

```ts
export function createFiberRoot(
  containerInfo: any,
  tag: RootTag,
  hydrate: boolean,
  hydrationCallbacks: null | SuspenseHydrationCallbacks,
): FiberRoot {
  // 创建 fiberRoot
  const root: FiberRoot = (new FiberRootNode(containerInfo, tag, hydrate): any);
  
  // false
  if (enableSuspenseCallback) {
    root.hydrationCallbacks = hydrationCallbacks;
  }

  // 创建 rootFiber
  const uninitializedFiber = createHostRootFiber(tag);

  // rootFiber 和 fiberRoot 做关联
  root.current = uninitializedFiber;
  uninitializedFiber.stateNode = root;

  // 初始化 uninitializedFiber.updateQueue 的值
  initializeUpdateQueue(uninitializedFiber);

  return root;
}
```

### FiberRootNode

```ts

function FiberRootNode(containerInfo, tag, hydrate) {
  this.tag = tag;
  this.current = null;
  this.containerInfo = containerInfo;
  this.pendingChildren = null;
  this.pingCache = null;
  this.finishedExpirationTime = NoWork;
  this.finishedWork = null;
  this.timeoutHandle = noTimeout;
  this.context = null;
  this.pendingContext = null;
  this.hydrate = hydrate;
  this.callbackNode = null;
  this.callbackPriority = NoPriority;
  this.firstPendingTime = NoWork;
  this.firstSuspendedTime = NoWork;
  this.lastSuspendedTime = NoWork;
  this.nextKnownPendingLevel = NoWork;
  this.lastPingedTime = NoWork;
  this.lastExpiredTime = NoWork;
  if (enableSchedulerTracing) {
    this.interactionThreadID = unstable_getThreadID();
    this.memoizedInteractions = new Set();
    this.pendingInteractionMap = new Map();
  }
  if (enableSuspenseCallback) {
    this.hydrationCallbacks = null;
  }
}
```

### createHostRootFiber

```ts
export function createHostRootFiber(tag: RootTag): Fiber {
  // 根据 tag 值设置 mode
  let mode;
  if (tag === ConcurrentRoot) {
    mode = ConcurrentMode | BlockingMode | StrictMode;
  } else if (tag === BlockingRoot) {
    mode = BlockingMode | StrictMode;
  } else {
    mode = NoMode;
  }

  if (enableProfilerTimer && isDevToolsPresent) {
    // Always collect profile timings when DevTools are present.
    // This enables DevTools to start capturing timing at any point–
    // Without some nodes in the tree having empty base times.
    mode |= ProfileMode;
  }

  return createFiber(HostRoot, null, null, mode);
}
```

### createFiber

```ts
const createFiber = function (
  tag: WorkTag,
  pendingProps: mixed,
  key: null | string,
  mode: TypeOfMode,
): Fiber {
  // $FlowFixMe: the shapes are exact here but Flow doesn't like constructors
  return new FiberNode(tag, pendingProps, key, mode);
};
```

### FiberNode

```ts
function FiberNode(
  tag: WorkTag,
  pendingProps: mixed,
  key: null | string,
  mode: TypeOfMode,
) {
  // Instance
  this.tag = tag;
  this.key = key;
  this.elementType = null;
  this.type = null;
  this.stateNode = null;

  // Fiber
  this.return = null;
  this.child = null;
  this.sibling = null;
  this.index = 0;

  this.ref = null;

  this.pendingProps = pendingProps;
  this.memoizedProps = null;
  this.updateQueue = null;
  this.memoizedState = null;
  this.dependencies = null;

  this.mode = mode;

  // Effects
  this.effectTag = NoEffect;
  this.nextEffect = null;

  this.firstEffect = null;
  this.lastEffect = null;

  this.expirationTime = NoWork;
  this.childExpirationTime = NoWork;

  this.alternate = null;

  if (enableProfilerTimer) {
    this.actualDuration = Number.NaN;
    this.actualStartTime = Number.NaN;
    this.selfBaseDuration = Number.NaN;
    this.treeBaseDuration = Number.NaN;

    this.actualDuration = 0;
    this.actualStartTime = -1;
    this.selfBaseDuration = 0;
    this.treeBaseDuration = 0;
  }
  if (enableUserTimingAPI) {
    this._debugID = debugCounter++;
    this._debugIsCurrentlyTiming = false;
  }

  if (__DEV__) {
    // ...
  }
}
```

### initializeUpdateQueue

```ts
export function initializeUpdateQueue<State>(fiber: Fiber): void {
  const queue: UpdateQueue<State> = {
    baseState: fiber.memoizedState,
    baseQueue: null,
    shared: {
      pending: null,
    },
    effects: null,
  };
  fiber.updateQueue = queue;
}
```

### updateContainer

> 文件位置: `packages/react-reconciler/src/ReactFiberReconciler.js`

```ts
/**
 * 计算任务的过期时间
 * 再根据任务过期时间创建 Update 任务
 * 通过任务的过期时间还可以计算出任务的优先级
 * @param ReactNodeList 要渲染的 ReactElement
 * @param container container Fiber Root 对象
 * @param parentComponent 父组件 初始渲染为 null
 * @param callback 渲染完成执行的回调函数
 */
export function updateContainer(
  element: ReactNodeList,
  container: OpaqueRoot,
  parentComponent: ?React$Component<any, any>,
  callback: ?Function,
): ExpirationTime {
  if (__DEV__) {
    // ...
  }
  // container 获取 rootFiber
  const current = container.current;
  // 获取当前距离 react 应用初始化的时间 1073741805
  const currentTime = requestCurrentTimeForUpdate();

  if (__DEV__) {
    // ...
  }
  // 异步加载设置，初始渲染返回 null
  const suspenseConfig = requestCurrentSuspenseConfig();

  // 计算过期时间
  const expirationTime = computeExpirationForFiber(
    currentTime,
    current,
    suspenseConfig,
  );
  // 初始渲染 parentComponent 没值，这边返回 {}
  const context = getContextForSubtree(parentComponent);

  // 初始渲染时这判断为 true
  if (container.context === null) {
    container.context = context;
  } else {
    // ...
  }
  if (__DEV__) {
    // ...
  }

  // 创建一个待执行任务
  const update = createUpdate(expirationTime, suspenseConfig);
  // 挂载待更新对象
  update.payload = {element};

  callback = callback === undefined ? null : callback;
  if (callback !== null) {
    if (__DEV__) {
      // ...
    }
    // 将 callback 挂载到 update 对象中
    update.callback = callback;
  }

  // 将 update 对象加入到当前 Fiber 的更新队列当中 (updateQueue)
  // 待执行的任务都会被存储在 fiber.updateQueue.shared.pending 中
  enqueueUpdate(current, update);
  // 调度和更新 current 对象
  scheduleWork(current, expirationTime);

  // 返回过期时间
  return expirationTime;
}
```

### createUpdate

```ts
export function createUpdate(
  expirationTime: ExpirationTime,
  suspenseConfig: null | SuspenseConfig,
): Update<*> {
  let update: Update<*> = {
    expirationTime,
    suspenseConfig,

    tag: UpdateState,
    payload: null,
    callback: null,

    next: (null: any),
  };
  update.next = update;
  if (__DEV__) {
    // ...
  }
  return update;
}
```

### enqueueUpdate

```ts
// 将任务(Update)存放于任务队列(updateQueue)中
// 创建单向链表结构存放 update, next 用来串联 update
export function enqueueUpdate<State>(fiber: Fiber, update: Update<State>) {
  // 获取当前 Fiber 的 更新队列
  const updateQueue = fiber.updateQueue;
  // 如果更新队列不存在 就返回 null
  if (updateQueue === null) {
    // 仅发生在 fiber 已经被卸载
    return;
  }
  // 获取待执行的 Update 任务
  // 初始渲染时没有待执行的任务
  const sharedQueue = updateQueue.shared;
  const pending = sharedQueue.pending;
  // 如果没有待执行的 Update 任务
  if (pending === null) {
    // 这是第一次更新, 创建一个循环列表.
    update.next = update;
  } else {
    update.next = pending.next;
    pending.next = update;
  }
  // 将 Update 任务存储在 pending 属性中
  sharedQueue.pending = update;
  if (__DEV__) {
    // ...
  }
}
```

### getPublicRootInstance

`legacyRenderSubtreeIntoContainer` 方法最后返回的时候调用

```ts
// 获取 container 的第一个子元素的实例对象
export function getPublicRootInstance(
  // FiberRoot
  container: OpaqueRoot,
): React$Component<any, any> | PublicInstance | null {
  // 获取 rootFiber
  const containerFiber = container.current;
  // 如果 rootFiber 没有子元素
  // 指的就是 id="root" 的 div 没有子元素
  if (!containerFiber.child) {
    // 返回 null
    return null;
  }
  // 匹配子元素的类型
  switch (containerFiber.child.tag) {
    // 普通
    case HostComponent:
      // 函数直接返回了 containerFiber.child.stateNode
      return getPublicInstance(containerFiber.child.stateNode);
    default:
      // 返回子元素的真实 DOM 对象
      return containerFiber.child.stateNode;
  }
}
```

### 总结

后续说 container 都指 `<div id="root"></div>` DOM 对象

主要流程逻辑：

- 创建 FiberRoot，存储在 `container._reactRootContainer._internalRoot`
  - 循环删除 container 最后一个子节点
  - container 存在 FiberRoot 的 `containerInfo` 属性
- 创建 RootFiber，存储在 `container.__reactContainere$`
  - 初始化 `rootFiber.updateQueue`
- FiberRoot 与 RootFiber 做关联
  - `fiberRoot.current = rootFiber`
  - `rootFiber.stateNode = fiberRoot`
- 将 callback 的 this 指向改为 根节点的真实 DOM 对象
- 给 container 设置 context 属性，初始为 {}
- 计算过期时间，创建待执行任务，放入更新队列
- 调度和更新 RootFiber

## render阶段

### scheduleUpdateOnFiber

```ts
// 判断任务是否为同步 调用同步任务入口
export function scheduleUpdateOnFiber(
  fiber: Fiber,
  expirationTime: ExpirationTime,
) {
  // 判断是否是无限循环的 update ，如果是就报错
  checkForNestedUpdates();
  
  // 开发环境 忽略
  warnAboutRenderPhaseUpdatesInDEV(fiber);
  // 遍历更新子节点的过期时间 返回 FiberRoot
  const root = markUpdateTimeFromFiberToRoot(fiber, expirationTime);
  if (root === null) {
    // 开发环境下执行 忽略
    warnAboutUpdateOnUnmountedFiberInDEV(fiber);
    return;
  }
  
  // 内部判断条件不成立 忽略
  checkForInterruption(fiber, expirationTime);
  // 报告调度更新, 测试环境执行, 忽略
  recordScheduleUpdate();

  // 获取当前调度任务的优先级
  const priorityLevel = getCurrentPriorityLevel();
  // 判断任务是否是同步任务
  if (expirationTime === Sync) {
    if (
      // 检查是否处于非批量更新模式
      (executionContext & LegacyUnbatchedContext) !== NoContext &&
      // 检查是否没有处于正在进行渲染的任务
      (executionContext & (RenderContext | CommitContext)) === NoContext
    ) {
      // 初始渲染时内部条件判断不成立, 忽略
      schedulePendingInteractions(root, expirationTime);
      // 同步任务入口点
      performSyncWorkOnRoot(root);
    } else {
      // ...
    }
  } else {
    // ...
  }
  // 初始渲染不执行
  if (
    (executionContext & DiscreteEventContext) !== NoContext &&
    (priorityLevel === UserBlockingPriority ||
      priorityLevel === ImmediatePriority)
  ) {
    // ...
  }
}
```

### performSyncWorkOnRoot

```ts
// 进入 render 阶段, 构建 workInProgress Fiber 树
function performSyncWorkOnRoot(root) {
  // 参数 root 为 fiberRoot 对象

  // 初始渲染过期时间为 Sync
  const lastExpiredTime = root.lastExpiredTime;
  const expirationTime = lastExpiredTime !== NoWork ? lastExpiredTime : Sync;

  invariant(
    (executionContext & (RenderContext | CommitContext)) === NoContext,
    'Should not already be working.',
  );

  // 处理 useEffect，不是主流程，忽略
  flushPassiveEffects();

  // workInProgressRoot 是全局变量，初始为 null，判断成立
  if (root !== workInProgressRoot || expirationTime !== renderExpirationTime) {
    // 构建 workInProgressFiber 树及 rootFiber
    prepareFreshStack(root, expirationTime);
    
    // 初始渲染不执行 忽略
    startWorkOnPendingInteractions(root, expirationTime);
  }
  // 前面赋值了，这边不为 null，成立
  if (workInProgress !== null) {
    const prevExecutionContext = executionContext;
    executionContext |= RenderContext;
    const prevDispatcher = pushDispatcher(root);
    const prevInteractions = pushInteractions(root);
    startWorkLoopTimer(workInProgress); // 忽略
    do {
      try {
        // 以同步的方式开始构建 Fiber 对象
        workLoopSync();
        break;
      } catch (thrownValue) {
        handleError(root, thrownValue);
      }
    } while (true);

    resetContextDependencies(); // 忽略
    executionContext = prevExecutionContext;
    popDispatcher(prevDispatcher); // 忽略
    if (enableSchedulerTracing) {
      // 忽略
      popInteractions(((prevInteractions: any): Set<Interaction>));
    }
    // 初始渲染 不执行
    if (workInProgressRootExitStatus === RootFatalErrored) {
      // ...
    }

    if (workInProgress !== null) {
      // 渲染出问题的时候
      invariant(
        false,
        'Cannot commit an incomplete root. This error is likely caused by a ' +
          'bug in React. Please file an issue.',
      );
    } else {
      // 忽略
      stopFinishedWorkLoopTimer();
      
      // 将构建好的新 Fiber 对象存储在 finishedWork 属性中
      // 提交阶段使用
      root.finishedWork = (root.current.alternate: any);
      root.finishedExpirationTime = expirationTime;
      // 结束 render 阶段
      // 进入 commit 阶段
      finishSyncRender(root);
    }

    // 忽略
    ensureRootIsScheduled(root);
  }

  return null;
}
```

### prepareFreshStack

```ts
/**
 * 构建 workInProgressFiber 树及 rootFiber
 */
function prepareFreshStack(root, expirationTime) {
  // 为 FiberRoot 对象添加 finishedWork 属性
  // finishedWork 表示 render 阶段执行完成后构建的待提交的 Fiber 对象
  root.finishedWork = null;
  root.finishedExpirationTime = NoWork; // 0

  const timeoutHandle = root.timeoutHandle;
  // 初始化渲染不执行
  if (timeoutHandle !== noTimeout) {
    // ...
  }

  // 初始化渲染不执行
  if (workInProgress !== null) {
    // ...
  }
  // 建构 workInProgress Fiber 树的 fiberRoot 对象
  workInProgressRoot = root;
  // 构建 workInProgress Fiber 树中的 rootFiber
  workInProgress = createWorkInProgress(root.current, null);
  renderExpirationTime = expirationTime;
  workInProgressRootExitStatus = RootIncomplete;
  workInProgressRootFatalError = null;
  workInProgressRootLatestProcessedExpirationTime = Sync;
  workInProgressRootLatestSuspenseTimeout = Sync;
  workInProgressRootCanSuspendUsingConfig = null;
  workInProgressRootNextUnprocessedUpdateTime = NoWork;
  workInProgressRootHasPendingPing = false;
  // true
  if (enableSchedulerTracing) {
    spawnedWorkDuringRender = null;
  }

  if (__DEV__) {
    // ...
  }
}
```

### createWorkInProgress

```ts

// 构建 workInProgress Fiber 树中的 rootFiber
export function createWorkInProgress(current: Fiber, pendingProps: any): Fiber {
  // current: current Fiber 中的 rootFiber
  // 获取 current Fiber 对应的 workInProgress Fiber
  let workInProgress = current.alternate;
  // 如果 workInProgress 不存在
  if (workInProgress === null) {
    // 创建 fiber 对象
    workInProgress = createFiber(
      current.tag,
      pendingProps,
      current.key,
      current.mode,
    );
    // 属性复用
    workInProgress.elementType = current.elementType;
    workInProgress.type = current.type;
    workInProgress.stateNode = current.stateNode;

    if (__DEV__) {
      // ...
    }
    // 使用 alternate 存储 current
    workInProgress.alternate = current;
    // 使用 alternate 存储 workInProgress
    current.alternate = workInProgress;
  } else {
    // ...
  }

  workInProgress.childExpirationTime = current.childExpirationTime;
  workInProgress.expirationTime = current.expirationTime;
  workInProgress.child = current.child;
  workInProgress.memoizedProps = current.memoizedProps;
  workInProgress.memoizedState = current.memoizedState;
  workInProgress.updateQueue = current.updateQueue;

  // Clone the dependencies object. This is mutated during the render phase, so
  // it cannot be shared with the current fiber.
  const currentDependencies = current.dependencies;
  workInProgress.dependencies =
    currentDependencies === null
      ? null
      : {
          expirationTime: currentDependencies.expirationTime,
          firstContext: currentDependencies.firstContext,
          responders: currentDependencies.responders,
        };

  // These will be overridden during the parent's reconciliation
  workInProgress.sibling = current.sibling;
  workInProgress.index = current.index;
  workInProgress.ref = current.ref;

  if (enableProfilerTimer) {
    workInProgress.selfBaseDuration = current.selfBaseDuration;
    workInProgress.treeBaseDuration = current.treeBaseDuration;
  }

  if (__DEV__) {
    // ...
  }

  return workInProgress;
}
```

### workLoopSync

```ts
function workLoopSync() {
  // workInProgress 是一个 fiber 对象
  // 它的值不为 null 意味着该 fiber 对象上仍然有更新要执行
  // while 方法支撑 render 阶段 所有 fiber 节点的构建
  while (workInProgress !== null) {
    workInProgress = performUnitOfWork(workInProgress);
  }
}
```

### performUnitOfWork

```ts
// 构建 Fiber 对象
function performUnitOfWork(unitOfWork: Fiber): Fiber | null {
  // unitOfWork => workInProgress Fiber 树中的 rootFiber
  // current => currentFiber 树中的 rootFiber
  const current = unitOfWork.alternate;
  
  startWorkTimer(unitOfWork); // 忽略
  setCurrentDebugFiberInDEV(unitOfWork); // 开发环境执行 忽略
  // 存储下一个要构建的子级 Fiber 对象
  let next;
  
  // 初始渲染 不执行
  if (enableProfilerTimer && (unitOfWork.mode & ProfileMode) !== NoMode) {
    // ...
  } else {
    // beginWork: 从父到子, 构建 Fiber 节点对象
    // 返回值 next 为当前节点的子节点
    next = beginWork(current, unitOfWork, renderExpirationTime);
  }
  // 开发环境执行 忽略
  resetCurrentDebugFiberInDEV();
  // 为旧的 props 属性赋值
  // 此次更新后 pendingProps 变为 memoizedProps
  unitOfWork.memoizedProps = unitOfWork.pendingProps;
  // 如果子节点不存在说明当前节点向下遍历子节点已经到底了
  // 继续向上返回 遇到兄弟节点 构建兄弟节点的子 Fiber 对象 直到返回到根 Fiber 对象
  if (next === null) {
    // 从子到父, 构建其余节点 Fiber 对象
    next = completeUnitOfWork(unitOfWork);
  }

  ReactCurrentOwner.current = null;
  return next;
}
```

### beginWork

```ts
// 从父到子, 构建 Fiber 节点对象
function beginWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderExpirationTime: ExpirationTime,
): Fiber | null {
  // 1073741823
  const updateExpirationTime = workInProgress.expirationTime;

  if (__DEV__) {
    // ...
  }
  // 判断是否有旧的 Fiber 对象
  // 初始渲染时 只有 rootFiber 节点存在 current
  if (current !== null) {
    const oldProps = current.memoizedProps; // 获取旧的 props 对象
    const newProps = workInProgress.pendingProps; // 获取新的 props 对象

    if (
      oldProps !== newProps ||
      hasLegacyContextChanged() ||
      // Force a re-render if the implementation changed due to hot reload:
      (__DEV__ ? workInProgress.type !== current.type : false)
    ) {
      // ...
    } else if (updateExpirationTime < renderExpirationTime) {
      // ...
    } else {
      // 初始渲染走这
      didReceiveUpdate = false;
    }
  } else {
    didReceiveUpdate = false;
  }

  // NoWork 常量 值为0 清空过期时间
  workInProgress.expirationTime = NoWork;
  // 根据当前 Fiber 的类型决定如何构建起子级 Fiber 对象
  // 文件位置: shared/ReactWorkTags.js
  switch (workInProgress.tag) {
    // 2
    // 函数组件在第一次被渲染时使用
    case IndeterminateComponent: {
      return mountIndeterminateComponent(
        // 旧 Fiber
        current,
        // 新 Fiber
        workInProgress,
        // 新 Fiber 的 type 值 初始渲染时是App组件函数
        workInProgress.type,
        // 同步 整数最大值 1073741823
        renderExpirationTime,
      );
    }
    case LazyComponent:  // ...
    case FunctionComponent: // ...
    case ClassComponent: // ...
    case HostRoot: // ...
    case HostComponent: // ...
    case HostText: // ...
    case SuspenseComponent: // ...
    case HostPortal: // ...
    case ForwardRef: // ...
    case Fragment: // ...
    case Mode: // ...
    case Profiler: // ...
    case ContextProvider: // ...
    case ContextConsumer: // ...
    case MemoComponent: // ...
    case SimpleMemoComponent: // ...
    case IncompleteClassComponent: // ...
    case SuspenseListComponent: // ...
    case FundamentalComponent: // ...
    case ScopeComponent: // ...
    case Block: // ...
  }
  invariant(
    false,
    'Unknown unit of work tag (%s). This error is likely caused by a bug in ' +
      'React. Please file an issue.',
    workInProgress.tag,
  );
}
```

### mountIndeterminateComponent

```ts
function mountIndeterminateComponent(
  // 旧 Fiber
  _current,
  // 新 Fiber
  workInProgress,
  // 新 Fiber 的 type 属性值 初始渲染时 是 App 组件函数
  Component,
  // 整数最大值 表示同步任务
  renderExpirationTime,
) {
  // 不满足
  if (_current !== null) {
    // ...
  }
  // 为组件添加的 props <App test="test"/>
  const props = workInProgress.pendingProps;
  let context;
    
  if (!disableLegacyContext) {
    const unmaskedContext = getUnmaskedContext(
      workInProgress,
      Component,
      false,
    );
    context = getMaskedContext(workInProgress, unmaskedContext);
  }

  prepareToReadContext(workInProgress, renderExpirationTime);
  // 函数组件被调用后的返回值
  let value;

  if (__DEV__) {
     // ...
  } else {
    // 获取 Children 内部会调用 Component()
    value = renderWithHooks(
      null,
      workInProgress,
      Component,
      props,
      context,
      renderExpirationTime,
    );
  }

  // React DevTools reads this flag.
  workInProgress.effectTag |= PerformedWork;

  // 判断 value 是函数组件还是类组件
  // 条件成立就是类组件 不成立就是函数组件
  if (
    typeof value === 'object' &&
    value !== null &&
    typeof value.render === 'function' &&
    value.$$typeof === undefined
  ) {
    if (__DEV__) {
      // ...
    }
    // 类组件
    // Proceed under the assumption that this is a class instance
    workInProgress.tag = ClassComponent;

    // Throw out any hooks that were used.
    workInProgress.memoizedState = null;
    workInProgress.updateQueue = null;

    // Push context providers early to prevent context stack mismatches.
    // During mounting we don't know the child context yet as the instance doesn't exist.
    // We will invalidate the child context in finishClassComponent() right after rendering.
    let hasContext = false;
    if (isLegacyContextProvider(Component)) {
      hasContext = true;
      pushLegacyContextProvider(workInProgress);
    } else {
      hasContext = false;
    }

    workInProgress.memoizedState =
      value.state !== null && value.state !== undefined ? value.state : null;

    initializeUpdateQueue(workInProgress);

    const getDerivedStateFromProps = Component.getDerivedStateFromProps;
    if (typeof getDerivedStateFromProps === 'function') {
      applyDerivedStateFromProps(
        workInProgress,
        Component,
        getDerivedStateFromProps,
        props,
      );
    }

    adoptClassInstance(workInProgress, value);
    mountClassInstance(workInProgress, Component, props, renderExpirationTime);
    return finishClassComponent(
      null,
      workInProgress,
      Component,
      true,
      hasContext,
      renderExpirationTime,
    );
  } else {
    // 函数组件
    // Proceed under the assumption that this is a function component
    workInProgress.tag = FunctionComponent;
    if (__DEV__) {
      // ...
    }
    reconcileChildren(null, workInProgress, value, renderExpirationTime);
    if (__DEV__) {
      // ...
    }
    return workInProgress.child;
  }
}
```

### reconcileChildren

```ts
// 构建子级 Fiber 对象
export function reconcileChildren(
  // 旧 Fiber
  current: Fiber | null,
  // 父级 Fiber
  workInProgress: Fiber,
  // 子级 vdom 对象
  nextChildren: any,
  // 初始渲染 整型最大值 代表同步任务
  renderExpirationTime: ExpirationTime,
) {
  if (current === null) {
    workInProgress.child = mountChildFibers(
      workInProgress,
      null,
      nextChildren,
      renderExpirationTime,
    );
  } else {
    // ...
  }
}
```

### completeUnitOfWork

```ts
/**
 * 1. 创建 Fiber 对象
 * 2. 创建每一个节点的真实 DOM 对象并将其添加到 stateNode 属性中
 * 3. 收集要执行 DOM 操作的 Fiber 节点, 组建 effect 链表结构
 */
function completeUnitOfWork(unitOfWork: Fiber): Fiber | null {
  // 为 workInProgress 全局变量重新赋值
  workInProgress = unitOfWork;
  do {
    // 获取备份节点
    // 初始化渲染 非根 Fiber 对象没有备份节点 所以 current 为 null
    const current = workInProgress.alternate;
    // 父级 Fiber 对象, 非根 Fiber 对象都有父级
    const returnFiber = workInProgress.return;
    // 判断传入的 Fiber 对象是否构建完成, 任务调度相关
    // & 是表示位的与运算, 把左右两边的数字转化为二进制
    // 然后每一位分别进行比较, 如果相等就为1, 不相等即为0
    // 此处应用"位与"运算符的目的是"清零"
    // true
    if ((workInProgress.effectTag & Incomplete) === NoEffect) {
      setCurrentDebugFiberInDEV(workInProgress); // 开发环境代码 忽略
      let next;
      // 如果不能使用分析器的 timer, 直接执行 completeWork
      // enableProfilerTimer => true
      // 但此处无论条件是否成立都会执行 completeWork
      if (
        !enableProfilerTimer ||
        (workInProgress.mode & ProfileMode) === NoMode
      ) {
        // 重点代码(二)
        // 创建节点真实 DOM 对象并将其添加到 stateNode 属性中
        next = completeWork(current, workInProgress, renderExpirationTime);
      } else {
        // 否则执行分析器timer, 并执行 completeWork
        startProfilerTimer(workInProgress);
        // 创建节点真实 DOM 对象并将其添加到 stateNode 属性中
        next = completeWork(current, workInProgress, renderExpirationTime);
        // Update render duration assuming we didn't error.
        stopProfilerTimerIfRunningAndRecordDelta(workInProgress, false);
      }
      stopWorkTimer(workInProgress); // 忽略
      resetCurrentDebugFiberInDEV(); // 忽略
      resetChildExpirationTime(workInProgress); // 忽略

      // 如果子级存在
      if (next !== null) {
        // 返回子级 一直返回到 workLoopSync
        // 再重新执行 performUnitOfWork 构建子级 Fiber 节点对象
        return next;
      }

      // 构建 effect 链表结构
      // 如果不是根 Fiber 就是 true 否则就是 false
      // 将子树和此 Fiber 的所有 effect 附加到父级的 effect 列表中
      if (
        // 如果父 Fiber 存在 并且
        returnFiber !== null &&
        // 父 Fiber 对象中的 effectTag 为 0
        (returnFiber.effectTag & Incomplete) === NoEffect
      ) {
        // 将子树和此 Fiber 的所有副作用附加到父级的 effect 列表上

        // 以下两个判断的作用是搜集子 Fiber的 effect 到父 Fiber
        if (returnFiber.firstEffect === null) {
          // first
          returnFiber.firstEffect = workInProgress.firstEffect;
        }

        if (workInProgress.lastEffect !== null) {
          if (returnFiber.lastEffect !== null) {
            // next
            returnFiber.lastEffect.nextEffect = workInProgress.firstEffect;
          }
          // last
          returnFiber.lastEffect = workInProgress.lastEffect;
        }

        // 获取副作用标记
        // 初始渲染时除[根组件]以外的 Fiber, effectTag 值都为 0, 即不需要执行任何真实DOM操作
        // 根组件的 effectTag 值为 3, 即需要将此节点对应的真实DOM对象添加到页面中
        const effectTag = workInProgress.effectTag;

        // 创建 effect 列表时跳过 NoWork(0) 和 PerformedWork(1) 标记
        // PerformedWork 由 React DevTools 读取, 不提交
        // 初始渲染时 只有遍历到了根组件 判断条件才能成立, 将 effect 链表添加到 rootFiber
        // 初始渲染 FiberRoot 对象中的 firstEffect 和 lastEffect 都是 App 组件
        // 因为当所有节点在内存中构建完成后, 只需要一次将所有 DOM 添加到页面中
        if (effectTag > PerformedWork) {
          // false
          if (returnFiber.lastEffect !== null) {
            returnFiber.lastEffect.nextEffect = workInProgress;
          } else {
            // 为 fiberRoot 添加 firstEffect
            returnFiber.firstEffect = workInProgress;
          }
          // 为 fiberRoot 添加 lastEffect
          returnFiber.lastEffect = workInProgress;
        }
      }
    } else {
      // ...
    }
    // 获取下一个同级 Fiber 对象
    const siblingFiber = workInProgress.sibling;
    // 如果下一个同级 Fiber 对象存在
    if (siblingFiber !== null) {
      // 返回下一个同级 Fiber 对象
      return siblingFiber;
    }
    // 否则退回父级
    workInProgress = returnFiber;
  } while (workInProgress !== null);

  // 当执行到这里的时候, 说明遍历到了 root 节点, 已完成遍历
  // 更新 workInProgressRootExitStatus 的状态为 已完成
  if (workInProgressRootExitStatus === RootIncomplete) {
    workInProgressRootExitStatus = RootCompleted;
  }
  return null;
}
```

### completeWork

```ts

function completeWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderExpirationTime: ExpirationTime,
): Fiber | null {
  // 获取待更新 props
  const newProps = workInProgress.pendingProps;
  switch (workInProgress.tag) {
    case IndeterminateComponent:
    case LazyComponent:
    case SimpleMemoComponent:
    case FunctionComponent:
    case ForwardRef:
    case Fragment:
    case Mode:
    case Profiler:
    case ContextConsumer:
    case MemoComponent:
      return null;
    case ClassComponent: 
      // ...
      return null;
    }
    case HostRoot: // ...
    // 5
    case HostComponent: {
      popHostContext(workInProgress);
      // 获取 container
      const rootContainerInstance = getRootHostContainer();
      // 节点的具体的类型 div span ...
      const type = workInProgress.type;
      if (current !== null && workInProgress.stateNode != null) {
        // ...
      } else {
        if (!newProps) {
          invariant(
            workInProgress.stateNode !== null,
            'We must have new props for new mounts. This error is likely ' +
              'caused by a bug in React. Please file an issue.',
          );
          // This can happen when we abort work.
          return null;
        }

        const currentHostContext = getHostContext();
        let wasHydrated = popHydrationState(workInProgress);
        // 是否是服务器渲染
        if (wasHydrated) {
          // ...
        } else {
          // 创建节点实例对象 <div></div> <span></span>
          let instance = createInstance(
            type,
            newProps,
            rootContainerInstance,
            currentHostContext,
            workInProgress,
          );
          /**
           * 将所有的子级追加到父级中
           * instance 为父级
           * workInProgress.child 为子级
           */
          appendAllChildren(instance, workInProgress, false, false);

          // 为 Fiber 对象添加 stateNode 属性
          workInProgress.stateNode = instance;
          // 初始渲染不执行
          if (enableDeprecatedFlareAPI) {
            // ...
          }

          // 初始渲染不执行
          if (
            finalizeInitialChildren(
              instance,
              type,
              newProps,
              rootContainerInstance,
              currentHostContext,
            )
          ) {
            // ...
          }
        }
        // 处理 ref DOM 引用
        if (workInProgress.ref !== null) {
          // If there is a ref on a host node we need to schedule a callback
          markRef(workInProgress);
        }
      }
      return null;
    }
    case HostText: // ...
    case SuspenseComponent: // ...
    case HostPortal: // ...
    case ContextProvider: // ...
    case IncompleteClassComponent: // ...
    case SuspenseListComponent: // ...
    case FundamentalComponent: // ...
    case ScopeComponent: // ...
    case Block: // ...
  }
  invariant(
    false,
    'Unknown unit of work tag (%s). This error is likely caused by a bug in ' +
      'React. Please file an issue.',
    workInProgress.tag,
  );
}
```

### createInstance

```ts
export function createInstance(
  type: string,
  props: Props,
  rootContainerInstance: Container,
  hostContext: HostContext,
  internalInstanceHandle: Object,
): Instance {
  let parentNamespace: string;
  if (__DEV__) {
    // ...
  } else {
    parentNamespace = ((hostContext: any): HostContextProd);
  }
  const domElement: Instance = createElement(
    type,
    props,
    rootContainerInstance,
    parentNamespace,
  );
  precacheFiberNode(internalInstanceHandle, domElement);
  updateFiberProps(domElement, props);
  return domElement;
}
```



### 总结

主要流程逻辑：

- 创建 workInProgressRoot，值为 fiberRoot
- 创建 workInProgress，也就是 workInProgress Fiber 树里的 RootFiber
- workInProgress 与 RootFiber 做关联
  - `workInProgress.alternate = rootFiber`
  - `rootFiber.alternate = workInProgress`
- 将 workInProgress 作为执行单元，进行循环调用
- 进入 beginWork
  - 创建 workInProgress 的子节点 Fiber 对象
  - 将子节点 Fiber 对象作为新的 workInProgress 进入下一轮循环
  - 再次进入 beginWork，创建子节点的子节点，以此类推，直到创建出来的子节点为 null
- 进入 completeUnitOfWork
  - 创建真实 DOM 对象挂载 Fiber 对象的 stateNode 属性上
  - 创建 Fiber 链表，为 Fiber 设置 firstEffect、lastEffect、nextEffect
  - 如果有同级节点，将同级节点作为新的 workInProgress 进入下一轮循环，重新进入 beginWork
  - 如果有存在父级节点，再次进入 completeUnitOfWork
  - 如果不存在同级节点也不存在父级节点，到此结束

关于 stateNode 的值：

- RootFiber 指向 FiberRoot
- 类组件指向类实例
- 函数式组件等于 null
- 其他指向 DOM 元素

## commit阶段

### finishSyncRender

performSyncWorkOnRoot 方法最后执行的

```ts
function finishSyncRender(root) {
  // 销毁 workInProgress Fiber 树
  // 因为待提交 Fiber 对象已经被存储在了 root.finishedWork 中
  workInProgressRoot = null;
  // 进入 commit 阶段
  commitRoot(root);
}
```

### commitRoot

```ts
function commitRoot(root) {
  // 获取任务优先级 97 => 普通优先级
  const renderPriorityLevel = getCurrentPriorityLevel();
  // 使用最高优先级执行当前任务, 因为 commit 阶段不可以被打断
  // ImmediatePriority, 优先级为 99, 最高优先级
  runWithPriority(
    ImmediatePriority,
    commitRootImpl.bind(null, root, renderPriorityLevel),
  );
  return null;
}
```

### commitRootImpl

这方法代码量太多，以下代码经过了删减，保留主流程代码

```ts
function commitRootImpl(root, renderPriorityLevel) {
  // 获取待提交 Fiber 对象 rootFiber
  const finishedWork = root.finishedWork;
  // 1073741823
  const expirationTime = root.finishedExpirationTime;

  // 如果没有任务要执行
  if (finishedWork === null) {
    // 阻止程序继续向下执行
    return null;
  }
  // 重置为默认值
  root.finishedWork = null;
  root.finishedExpirationTime = NoWork;


  // commitRoot 是最后阶段, 不会再被异步调用了
  // 所以清除 callback 相关的属性
  root.callbackNode = null;
  root.callbackExpirationTime = NoWork;
  root.callbackPriority = NoPriority;
  root.nextKnownPendingLevel = NoWork;

  if (root === workInProgressRoot) {
    // We can reset these now that they are finished.
    workInProgressRoot = null;
    workInProgress = null;
    renderExpirationTime = NoWork;
  } else {
    // 这表明我们处理的最后一个根与我们现在提交的根不同
    // 最常见的情况是在挂起的根超时时发生
  }

  let firstEffect;
  // finishedWork.effectTag => 0
  // PerformedWork => 1
  // false
  if (finishedWork.effectTag > PerformedWork) {
    // ...
  } else {
    // 根节点没有 effectTag
    // 获取要执行 DOM 操作的副作用列表
    firstEffect = finishedWork.firstEffect;
  }

  // 以上代码为 commit 之前所做的准备工作
  // firstEffect 会在 commit 的三个子阶段会用到

  // true
  if (firstEffect !== null) {
    // 8
    const prevExecutionContext = executionContext;
    // 40
    executionContext |= CommitContext;
    const prevInteractions = pushInteractions(root);

    nextEffect = firstEffect;
    // commit 第一个子阶段
    // 处理类组件的 getSnapShotBeforeUpdate 生命周期函数
    do {
      if (__DEV__) {
        // ...
      } else {
        try {
          commitBeforeMutationEffects();
        } catch (error) {
          invariant(nextEffect !== null, 'Should be working on an effect.');
          captureCommitPhaseError(nextEffect, error);
          nextEffect = nextEffect.nextEffect;
        }
      }
    } while (nextEffect !== null);
    
    // commit 第二个子阶段
    // nextEffect 指向回到第一个，因为第一阶段执行的时候发生了改变
    nextEffect = firstEffect;
    do {
      if (__DEV__) {
        // ...
      } else {
        try {
          commitMutationEffects(root, renderPriorityLevel);
        } catch (error) {
          invariant(nextEffect !== null, 'Should be working on an effect.');
          captureCommitPhaseError(nextEffect, error);
          nextEffect = nextEffect.nextEffect;
        }
      }
    } while (nextEffect !== null);

    root.current = finishedWork;

    // commit 第三个子阶段
    // 同上
    nextEffect = firstEffect;
    do {
      if (__DEV__) {
        // ...
      } else {
        try {
          commitLayoutEffects(root, expirationTime);
        } catch (error) {
          invariant(nextEffect !== null, 'Should be working on an effect.');
          captureCommitPhaseError(nextEffect, error);
          nextEffect = nextEffect.nextEffect;
        }
      }
    } while (nextEffect !== null);
    
    // 重置 nextEffect
    nextEffect = null;

    requestPaint();
  } else {
    // ...
  }
	
  return null;
}
```

### commitBeforeMutationEffects

```ts
// commit 阶段的第一个子阶段
// 调用类组件的 getSnapshotBeforeUpdate 生命周期函数
function commitBeforeMutationEffects() {
  // 循环 effect 链
  while (nextEffect !== null) {
    // nextEffect 是 effect 链上从 firstEffect 到 lastEffect
    // 的每一个需要commit的 fiber 对象

    // 初始化渲染第一个 nextEffect 为 App 组件
    // effectTag => 3
    const effectTag = nextEffect.effectTag;
    // console.log(effectTag);
    // nextEffect = null;
    // return;

    // 如果 fiber 对象中里有 Snapshot 这个 effectTag 的话
    // Snapshot 和更新有关系 初始化渲染 不执行
    if ((effectTag & Snapshot) !== NoEffect) {
      // 开发环境执行 忽略
      setCurrentDebugFiberInDEV(nextEffect);
      // 计 effect 的数
      recordEffect();
      // 获取当前 fiber 节点
      const current = nextEffect.alternate;
      // 当 nextEffect 上有 Snapshot 这个 effectTag 时
      // 执行以下方法, 主要是类组件调用 getSnapshotBeforeUpdate 生命周期函数
      commitBeforeMutationEffectOnFiber(current, nextEffect);
      // 开发环境执行 忽略
      resetCurrentDebugFiberInDEV();
    }
    // 调度 useEffect
    if ((effectTag & Passive) !== NoEffect) {
      // If there are passive effects, schedule a callback to flush at
      // the earliest opportunity.
      if (!rootDoesHavePassiveEffects) {
        rootDoesHavePassiveEffects = true;
        scheduleCallback(NormalPriority, () => {
          // 触发useEffect
          flushPassiveEffects();
          return null;
        });
      }
    }
    nextEffect = nextEffect.nextEffect;
  }
}
```

### commitMutationEffects

```ts
// commit 阶段的第二个子阶段
// 根据 effectTag 执行 DOM 操作
function commitMutationEffects(root: FiberRoot, renderPriorityLevel) {
  // 循环 effect 链
  while (nextEffect !== null) {
    // 开发环境执行 忽略
    setCurrentDebugFiberInDEV(nextEffect);
    // 获取 effectTag
    // 初始渲染第一次循环为 App 组件
    // 即将根组件及内部所有内容一次性添加到页面中
    const effectTag = nextEffect.effectTag;

    // 如果有文本节点, 将 value 置为''
    if (effectTag & ContentReset) {
      commitResetTextContent(nextEffect);
    }
    // 更新 ref
    if (effectTag & Ref) {
      const current = nextEffect.alternate;
      if (current !== null) {
        commitDetachRef(current);
      }
    }

    // 根据 effectTag 分别处理
    let primaryEffectTag =
      effectTag & (Placement | Update | Deletion | Hydrating);
    // 匹配 effectTag
    // 初始渲染 primaryEffectTag 为 2 匹配到 Placement
    switch (primaryEffectTag) {
      // 针对该节点及子节点进行插入操作
      case Placement: {
        commitPlacement(nextEffect);
        // effectTag 从 3 变为 1
        // 从 effect 标签中清除 "placement" 重置 effectTag 值
        // 以便我们知道在调用诸如componentDidMount之类的任何生命周期之前已将其插入。
        nextEffect.effectTag &= ~Placement;
        break;
      }
      // 插入并更新 DOM
      case PlacementAndUpdate: {
        // 插入
        commitPlacement(nextEffect);
        // Clear the "placement" from effect tag so that we know that this is
        // inserted, before any life-cycles like componentDidMount gets called.
        nextEffect.effectTag &= ~Placement;

        // 更新
        const current = nextEffect.alternate;
        commitWork(current, nextEffect);
        break;
      }
      // 服务器端渲染
      case Hydrating: {
        // ...
        break;
      }
      // 服务器端渲染
      case HydratingAndUpdate: {
        // ...
        break;
      }
      // 更新 DOM
      case Update: {
        const current = nextEffect.alternate;
        commitWork(current, nextEffect);
        break;
      }
      // 删除 DOM
      case Deletion: {
        commitDeletion(root, nextEffect, renderPriorityLevel);
        break;
      }
    }

    // TODO: Only record a mutation effect if primaryEffectTag is non-zero.
    recordEffect();

    resetCurrentDebugFiberInDEV();
    nextEffect = nextEffect.nextEffect;
  }
}
```

### commitLayoutEffects

```ts
// commit 阶段的第三个子阶段
function commitLayoutEffects(
  root: FiberRoot,
  committedExpirationTime: ExpirationTime,
) {
  while (nextEffect !== null) {
    setCurrentDebugFiberInDEV(nextEffect);
    // 此时 effectTag 已经被重置为 1, 表示 DOM 操作已经完成
    const effectTag = nextEffect.effectTag;
    // 调用生命周期函数和钩子函数
    // 类组件中调用了生命周期函数
    // 函数组件中调用了 useEffect
    if (effectTag & (Update | Callback)) {
      recordEffect();
      const current = nextEffect.alternate;
      // 类组件处理生命周期函数
      // 函数组件处理钩子函数
      commitLayoutEffectOnFiber(
        root,
        current,
        nextEffect,
        committedExpirationTime,
      );
    }
    // 赋值ref
    // false
    if (effectTag & Ref) {
      recordEffect();
      commitAttachRef(nextEffect);
    }

    resetCurrentDebugFiberInDEV();
    // 更新循环条件
    nextEffect = nextEffect.nextEffect;
  }
}
```

### 总结

主要流程逻辑：

- 最终构建完的 workInProgress Fiber 树传给 FiberRoot 的 `finishedWork` 属性，然后销毁 workInProgress Fiber 树，然后将接下来的任务提升为最高优先级
- 处理 commit 阶段准备工作，进入三个子阶段
  - 调用类组件的 getSnapshotBeforeUpdate
  - 根据 effectTag 执行 DOM 操作
  - 调用生命周期函数和钩子函数
