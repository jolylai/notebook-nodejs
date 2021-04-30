---
title: 缓冲器 Buffer
group:
  title: IO 处理
---

## 前言

Buffer 被引入用以帮助开发者处理二进制数据，在此生态系统中传统上只处理字符串而不是二进制数据。

Buffer 与流紧密相连。 当流处理器接收数据的速度快于其消化的速度时，则会将数据放入 buffer 中。

## 字符集

字符集就是一套已经定义了确切数字代表每个字符的规则。 现在有很多不同类型的字符集, 常见的有 Unicode 和 ASCII.JavaScript 语言采用 Unicode 字符集.

## 创建 buffer

```js
const buf = Buffer.alloc(1024);
//或
const buf = Buffer.allocUnsafe(1024);
```

虽然 alloc 和 allocUnsafe 均分配指定大小的 Buffer（以字节为单位），但是 alloc 创建的 Buffer 会被使用零进行初始化，而 allocUnsafe 创建的 Buffer 不会被初始化。 这意味着，尽管 allocUnsafe 比 alloc 要快得多，但是分配的内存片段可能包含可能敏感的旧数据。

当 Buffer 内存被读取时，如果内存中存在较旧的数据，则可以被访问或泄漏。 这就是真正使 allocUnsafe 不安全的原因，在使用它时必须格外小心。
