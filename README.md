# SSPanel-UIM 官方文档

[![Built with Docusaurus](https://img.shields.io/badge/Built%20with-Docusaurus-green?style=flat-square&logo=docusaurus)](https://docusaurus.io/)
[![Deploy to Cloudflare Pages](https://img.shields.io/badge/Deploy%20to-Cloudflare%20Pages-orange?style=flat-square&logo=cloudflare)](https://pages.cloudflare.com/)
[![License](https://img.shields.io/github/license/Anankke/sspanel-docs?style=flat-square)](LICENSE)

<a href="https://trendshift.io/repositories/1832" target="_blank"><img src="https://trendshift.io/api/badge/repositories/1832" alt="Anankke%2FSSPanel-Uim | Trendshift" style="width: 250px; height: 55px;" width="250" height="55"/></a>

SSPanel-UIM 的官方文档站点，提供完整的安装、配置和使用指南。

## 🌐 访问地址

- 主站：[https://docs.sspanel.io](https://docs.sspanel.io)

## 🚀 快速开始

### 环境要求

- Node.js 18.0 或更高版本
- npm 或 yarn 包管理器

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/Anankke/sspanel-docs.git
cd sspanel-docs

# 安装依赖
npm install

# 启动开发服务器
npm start
```

开发服务器将在 `http://localhost:3000` 启动。

### 构建

```bash
# 构建静态文件
npm run build
```

构建产物将生成在 `build` 目录中。

## 📁 项目结构

```
sspanel-docs/
├── docs/                 # 文档内容
│   ├── intro.md         # 文档首页
│   ├── installation/    # 安装指南
│   ├── configuration/   # 配置文档
│   └── ...
├── blog/                # 博客文章
├── src/                 # React 组件和自定义页面
├── static/              # 静态资源
├── docusaurus.config.js # Docusaurus 配置
└── sidebars.js          # 侧边栏配置
```

## 🤝 贡献指南

我们欢迎所有形式的贡献！无论是修复错别字、改进文档还是添加新内容。

### 贡献流程

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

### 文档编写规范

- 使用清晰、简洁的中文表达
- 提供可执行的命令示例
- 包含必要的错误处理说明
- 标注适用的软件版本
- 遵循 Markdown 语法规范

### 提交信息规范

- `docs:` 文档相关的更改
- `fix:` 修复错误
- `feat:` 新增功能或内容
- `chore:` 构建过程或辅助工具的变动

## 🛠️ 技术栈

- [Docusaurus 3](https://docusaurus.io/) - 静态站点生成器
- [React](https://reactjs.org/) - UI 框架
- [Cloudflare Pages](https://pages.cloudflare.com/) - 托管平台
- [Algolia DocSearch](https://docsearch.algolia.com/) - 搜索功能

## 📝 许可证

本项目采用 [MIT](LICENSE) 许可证。

## 🔗 相关链接

- [SSPanel-UIM 主项目](https://github.com/Anankke/SSPanel-UIM)
- [Telegram 频道](https://t.me/sspanel_Uim)
- [Telegram 交流群](https://t.me/SSUnion)

## 💖 致谢

感谢所有为 SSPanel-UIM 和文档做出贡献的开发者和社区成员。

---

<p align="center">
  Made with ❤️ by SSPanel-UIM Community
</p>