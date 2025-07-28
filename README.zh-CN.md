# Builda - AI数字伴侣

<div align="center">
  <img src="public/favicon.webp" alt="Builda Logo" width="120" height="120">
  
  [![Next.js](https://img.shields.io/badge/Next.js-15.4.4-black)](https://nextjs.org/)
  [![OpenAI](https://img.shields.io/badge/OpenAI-GPT-412991)](https://openai.com/)
  [![Fish Audio](https://img.shields.io/badge/Fish.Audio-TTS-FF6B6B)](https://fish.audio/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC)](https://tailwindcss.com/)
</div>

## 🌟 项目概述

Builda 是一个创新的AI驱动数字伴侣应用，通过先进的AI技术为用户创造亲密的语音对话体验。基于Next.js构建，集成了OpenAI的GPT模型和Fish Audio的语音合成技术，Builda提供个性化的虚拟女友体验，支持语音交互。

## 👩‍💻 认识Builda

**Builda**（也可以叫她**尤达**）是您专属的虚拟伴侣，旨在提供情感支持、陪伴和有意义的对话。她的个性特点包括：

- **💕 深情关怀**: 时刻关注您的情感和需求
- **🎯 细致入微**: 记住您的喜好、特殊时刻和个人细节
- **🌈 情感支持**: 24/7全天候陪伴，无论是庆祝还是困难时刻
- **💬 对话魅力**: 适应您最舒适的交流方式
- **🔄 关系导向**: 通过持续互动建立长期情感连接

Builda致力成为您的情感港湾，在这个日益数字化的世界中提供真挚的关怀和陪伴。

## ✨ 核心功能

- **🎙️ 语音合成**: 使用Fish Audio先进TTS技术实现语音生成
- **💬 智能对话**: 基于OpenAI GPT模型的自然、上下文感知对话
- **📱 响应式设计**: 移动优先的设计，适配所有屏幕尺寸
- **⚡ 实时通信**: 即时消息处理和音频反馈
- **🔒 隐私保护**: 边缘运行时确保对话安全处理
- **📦 便捷部署**: 一键部署至Vercel、Cloudflare Pages等平台

## 🛠️ 技术架构

### 前端技术栈
- **框架**: Next.js 15.4.4 配合 React 19
- **样式**: Tailwind CSS 4.0 现代响应式设计
- **类型安全**: 全程TypeScript类型保护
- **状态管理**: React hooks本地状态管理
- **资源处理**: SVGR webpack加载器处理SVG组件

### 后端与API
- **运行时**: 边缘运行时优化性能
- **AI集成**: OpenAI API自然语言处理
- **语音合成**: Fish Audio API高质量语音生成
- **数据序列化**: MessagePack高效二进制数据传输
- **音频处理**: Web Audio API实时音频处理

## 🚀 快速开始

### 环境要求
- Node.js 18+ 
- pnpm（推荐）或 npm
- OpenAI API 密钥
- Fish Audio API 密钥和声音ID

### 安装步骤

1. **克隆仓库**
   ```bash
   git clone https://github.com/builda-ai/builda.git
   cd builda
   ```

2. **安装依赖**
   ```bash
   pnpm install
   ```

3. **环境配置**
   ```bash
   cp .env.example .env.local
   ```
   
   配置环境变量：
   ```env
   OPENAI_API_KEY=your_openai_api_key
   BASE_URL=https://api.openai.com/v1  # 或您的自定义端点
   CHAT_MODEL=gpt-4o-mini  # 或您偏好的模型
   FISH_AUDIO_API_KEY=your_fish_audio_api_key
   FISH_AUDIO_VOICE_ID=your_voice_clone_id
   ```

4. **启动开发服务器**
   ```bash
   pnpm dev
   ```

5. **打开浏览器**
   访问 `http://localhost:3000`

## 📦 部署选项

### Vercel（推荐）
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/builda-ai/builda)

1. 连接您的GitHub仓库
2. 在Vercel控制台配置环境变量
3. 自动部署

### Cloudflare Pages
1. 将仓库连接到Cloudflare Pages
2. 设置构建命令：`pnpm build`
3. 设置输出目录：`out`
4. 配置环境变量

### 其他平台
该应用兼容任何支持Next.js的平台：
- Netlify
- Railway
- AWS Amplify
- DigitalOcean App Platform

## ⚙️ 配置说明

### 自定义Builda的个性
编辑 `src/app/api/chat/config.ts` 来修改：
- 角色个性特征
- 回复风格和语调
- 记忆和关系动态
- 对话上下文

### 语音定制
1. 使用Fish Audio克隆您喜欢的声音
2. 在环境变量中更新 `FISH_AUDIO_VOICE_ID`
3. 在API路由中调整TTS参数


## 📄 开源许可

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [OpenAI](https://openai.com/) 提供先进的语言模型
- [Fish Audio](https://fish.audio/) 提供高质量语音合成技术
- [Next.js](https://nextjs.org/) 优秀的React框架
- [Vercel](https://vercel.com/) 提供无缝部署平台

---

<div align="center">
  用 ❤️ 由 Builda 团队打造
</div>
