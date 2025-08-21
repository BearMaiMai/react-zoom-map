# React Zoom Map

[![npm version](https://img.shields.io/npm/v/react-zoom-map.svg)](https://www.npmjs.com/package/react-zoom-map)
[![license](https://img.shields.io/npm/l/react-zoom-map.svg)](https://github.com/BearMaiMai/react-zoom-map/blob/main/LICENSE)

基于react-zoom-pan-pinch的交互式地图组件，提供了图片缩放、平移和捏合功能的React组件。适用于需要在网页中展示可交互地图、图片或任何需要缩放平移功能的场景。

## 功能特点

- 支持图片的缩放、平移和捏合操作
- 自动适应视口大小，根据屏幕尺寸调整图片缩放比例
- 响应式设计，自动处理窗口大小变化
- 支持最小/最大缩放限制
- 提供填充模式切换（宽度填充或高度填充）
- 支持自定义背景图片
- 支持在地图上添加自定义内容

## 安装

```bash
npm install react-zoom-map
# 或
yarn add react-zoom-map
```

## 使用方法

### 基本用法

```jsx
import React from 'react';
import { ZoomPanPinch } from 'react-zoom-map';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ZoomPanPinch backgroundPic="/path/to/your/background/image.jpg">
        {/* 在这里添加您想要在地图上显示的内容 */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          自定义内容
        </div>
      </ZoomPanPinch>
    </div>
  );
}

export default App;
```

### 高级用法

```jsx
import React from 'react';
import { ZoomPanPinch, useControls, getMinScale } from 'react-zoom-map';

function App() {
  // 获取控制器
  const { zoomIn, zoomOut, resetTransform } = useControls();
  
  // 计算最小缩放比例
  const minScale = getMinScale(1920, 1080);
  
  return (
    <div>
      {/* 控制按钮 */}
      <div className="controls">
        <button onClick={() => zoomIn()}>放大</button>
        <button onClick={() => zoomOut()}>缩小</button>
        <button onClick={() => resetTransform()}>重置</button>
      </div>
      
      {/* 地图组件 */}
      <ZoomPanPinch 
        backgroundPic="/path/to/your/background/image.jpg"
        wrapperStyle={{ border: '1px solid #ccc' }}
        transformWrapper={{
          initialScale: minScale,
          minScale: minScale,
          maxScale: 5,
          limitToBounds: false,
          // 更多配置选项...
        }}
      >
        {/* 自定义内容 */}
      </ZoomPanPinch>
    </div>
  );
}

export default App;
```

## API参考

### ZoomPanPinch 组件

| 属性 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| backgroundPic | string | 是 | - | 背景图片的URL |
| children | ReactNode | 否 | - | 要在地图上显示的自定义内容 |
| wrapperStyle | React.CSSProperties | 否 | - | 应用于包装器的自定义样式 |
| transformWrapper | object | 否 | - | 传递给TransformWrapper组件的配置选项 |

### 导出的工具函数

#### getMinScale(imgWidth = 1920, imgHeight = 1080)

计算图片在视口中适应所需的最小缩放比例。

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| imgWidth | number | 否 | 1920 | 图片原始宽度 |
| imgHeight | number | 否 | 1080 | 图片原始高度 |

返回值: `number` - 最小缩放比例

#### useControls()

从react-zoom-pan-pinch导出的hook，用于获取控制缩放和平移的函数。

返回值: 包含以下方法的对象:
- `zoomIn()`: 放大
- `zoomOut()`: 缩小
- `resetTransform()`: 重置变换
- 更多方法请参考[react-zoom-pan-pinch文档](https://bettertyped.github.io/react-zoom-pan-pinch/?path=/story/docs-introduction--page)

#### KeepScale

从react-zoom-pan-pinch导出的组件，用于保持子元素的缩放比例。

## 浏览器兼容性

支持所有现代浏览器和IE11+。

## 依赖

- React 16.8.0+
- react-zoom-pan-pinch
- ahooks

## 贡献指南

欢迎对本项目进行贡献！请查看[贡献指南](CONTRIBUTING.md)了解详细信息。

## 许可证

MIT