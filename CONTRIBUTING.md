# 贡献指南

感谢您考虑为 react-zoom-map 做出贡献！以下是一些指导方针，以帮助您开始。

## 开发环境设置

1. Fork 本仓库
2. 克隆您的 fork 到本地机器
   ```bash
   git clone https://github.com/YOUR_USERNAME/react-zoom-map.git
   cd react-zoom-map
   ```
3. 安装依赖
   ```bash
   npm install
   ```
4. 创建一个新分支
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 开发流程

1. 进行您的更改
2. 确保代码符合项目的编码风格
3. 运行构建以确保一切正常
   ```bash
   npm run build
   ```
4. 提交您的更改
   ```bash
   git commit -m "描述您的更改"
   ```
5. 推送到您的 fork
   ```bash
   git push origin feature/your-feature-name
   ```
6. 创建一个 Pull Request

## 代码风格

- 使用 TypeScript 进行类型安全
- 遵循 React 最佳实践
- 保持组件简单且可重用
- 添加适当的注释和文档

## 测试

目前项目没有自动化测试。如果您添加新功能，请在 examples 目录中添加示例，以展示功能的工作方式。

## 提交 Pull Request

1. 确保您的 PR 描述清楚您所做的更改
2. 链接到任何相关的问题
3. 更新文档以反映您的更改
4. 确保 CI 检查通过

## 报告问题

如果您发现了 bug 或有功能请求，请使用 GitHub Issues 进行报告。请提供：

- 对问题的清晰描述
- 复现步骤（如果适用）
- 预期行为与实际行为
- 环境信息（浏览器、操作系统等）

## 许可证

通过贡献，您同意您的贡献将在 MIT 许可证下发布。