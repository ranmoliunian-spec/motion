# motion

**一条「贴纸科普风」横屏视频的纯代码生成管线** —— Remotion（React）+ edge-tts + NumPy。
三条链各自独立、最后汇合，全部画面由组件拼装、全部音乐由代码合成，**零外部素材依赖**。

示例作品：**浙江金融职业学院 2 分钟宣传片**（16:9 / 1920×1080 / 30fps / 120.000 秒 / AAC 立体声）。

![10 场景总览](out/contact-sheet.png)

<p align="center">
  <a href="out/zfc-promo-120s.mp4">▶ 观看成片 out/zfc-promo-120s.mp4（20 MB）</a>
</p>

---

## 成片实测规格

| 项 | 值 |
| --- | --- |
| 时长 | **120.021 秒**（3600 帧 @30fps，精确卡死 2 分钟） |
| 画面 | H.264 High / 1920×1080 / 30fps / yuv420p / CRF 16 |
| 音频 | **AAC-LC / 48000Hz / 立体声（2 声道）/ 192kbps** |
| 体积 | 20.7 MB，整体码率 1.38 Mbps |
| 全片电平 | 均值 −23.3 dB，峰值 **−5.8 dB（无削波）** |

---

## 三条链

```
① 旁白   script/scenes.json ──► edge-tts ──► public/audio/s01…s10.mp3
                                                          │
② 音乐   NumPy 逐样本合成 ─────────────────► public/audio/bgm.wav
                                                          │
③ 时间轴 build_timeline.py（ffprobe 测真实时长）► src/timeline.json
                                                          │
                                          ┌───────────────┘
                                          ▼
                            Remotion 汇合：旁白落位 + 音乐躲让
                                          │
                                          ▼
                              out/zfc-promo.mp4（H.264 + AAC）
```

| 环节 | 工具 | 产出 |
| --- | --- | --- |
| 旁白 | Python + edge-tts（`zh-CN-XiaoxiaoNeural`，+8% 语速） | `s01.mp3 … s10.mp3`，一场景一段，总长 92.38s |
| 背景音乐 | Python + NumPy 逐音符样本合成 | `bgm.wav`（44.1kHz 立体声，124.8s） |
| 画面 | Remotion（React 组件） | 贴纸卡片 / 图标 / 箭头 / 进度条全部组件化 |
| 混音与成片 | Remotion（`<Audio>` + 音量曲线） | AAC 立体声 MP4 |

---

## 快速开始

```bash
# 0. 依赖：Node >= 18、Python >= 3.9、ffmpeg（提供 ffmpeg 与 ffprobe）
pip install -r requirements.txt
npm install

# 一键出片（旁白 → 音乐 → 时间轴 → 渲染）
./run-all.sh
```

也可以分步执行：

```bash
npm run voice      # 1. edge-tts 生成 10 段旁白 MP3
npm run bgm        # 2. NumPy 合成背景音乐 WAV
npm run timeline   # 3. 测量 MP3 真实时长 → src/timeline.json
npm run studio     #    预览（可选，Remotion Studio 可视化调试）
npm run render     # 4. 出片 → out/zfc-promo.mp4
npm run check      #    类型检查
```

**改文案只需动一个文件**：`script/scenes.json`。改完重跑 `./run-all.sh`，
旁白、时间轴、进度条、章节标签会全部自动跟上。

---

## 目录结构

```
script/
  scenes.json          文案 + 分镜元数据（唯一需要手改的内容源）
  tts.py               逐场景调用 edge-tts 生成 MP3（含失败重试）
  bgm.py               NumPy 逐样本合成背景音乐 → WAV
  build_timeline.py    ffprobe 测真实时长 → 排时间轴 → src/timeline.json
src/
  index.ts             registerRoot
  Root.tsx             Composition 定义（1920×1080 / 30fps / 3600 帧）
  Video.tsx            主合成：画面 Sequence + 旁白 Sequence + BGM 躲让曲线
  theme.ts             设计令牌（颜色 / 字体 / 硬投影 / 透明度混合）
  timeline.json        ← 由脚本生成，勿手改
  components/
    PopIn.tsx          动效原语：弹入 / 持续轻微旋转 / 漂浮
    Sticker.tsx        贴纸体系：卡片、描边文字、标签、胶带、统计块
    Icon.tsx           32 个粗描边扁平图标 + 图标徽章
    Arrow.tsx          手绘箭头 / 竖箭头 / 虚线轨迹
    Doodles.tsx        纸感底纹、闪烁星点、半调网点、飘带
    Illustration.tsx   5 组原创 SVG 插画（校园 / 增长 / 地球 / 流程 / 金融现场）
    SceneFrame.tsx     场景外壳（统一入出场语法）+ 全局转场扫切
    Chrome.tsx         顶部署名条 + 底部全局进度条
  scenes/Scenes.tsx    10 个场景（纯编排，无内联样式拼装）
docs/
  PROMPTS.md           提示词档案（含可复用模板）
  WORKFLOW.md          复现指南与设计拆解
  STORYBOARD.md        10 场景分镜表（含真实时长）
  storyboard/          每个场景的静帧图
public/audio/          旁白 MP3 ×10 + 合成背景音乐 WAV
out/                   成片与总览图
```

---

## 设计要点

**所有画面都是代码**

- **动效原语**：`PopIn`（spring 过冲弹入）、`Wiggle`（持续轻微旋转 + 缩放呼吸）、`Float`（漂浮）
- **贴纸体系**：`StickerCard`（白底 + 粗墨边 + 硬投影 + 圆角）、`StickerText`（双层叠字描边，
  不依赖 `paint-order` 支持）、`Chip`、`Tape` 胶带、`Highlight`、`StatBlock`
- **图标库**：32 个粗描边扁平图标，全部路径手写，无图标库依赖
- **箭头**：手绘箭头用 `stroke-dashoffset` 画出「画出来」的过程
- **进度条**：底部全局进度条 = 分段轨道 + 斜纹填充 + 骑行标记 + 章节标签 + 场景内细进度
- **转场**：`SceneFrame` 统一入出场语法（推入 + 轻旋）+ `WipeOverlay` 斜纹色带扫切
- **插画**：5 组原创矢量图，无任何外部素材

**时间轴自动生成**

`build_timeline.py` 用 `ffprobe` 测量每段 MP3 的**真实时长**，按旁白长度加权分配场景 slot，
强制总帧数等于 3600，写出 `timeline.json`。进度条、署名条、转场全部读它 —— **增删场景不用改组件**。

**混音有依据，不靠感觉**

旁白开口时 BGM 从 `0.76` 压到 `0.40`（各带 10 帧斜坡），片头 24 帧淡入、片尾 70 帧淡出。
增益不是拍脑袋：先实测 BGM 母版 `mean -29.6dB`、旁白 `mean ≈ -19dB`，再反推得到基准值。
最终实测纯音乐间隙 −30 ~ −36dB、旁白段 −22dB，人声始终在前面。

**设计令牌集中**

所有颜色、投影、字体都在 `src/theme.ts`。风格调整只改一处，不在组件里散落魔法数字。

---

## 提示词档案

本项目从「一句话需求」到「成片」全过程的提示词已完整留档，含**可复用模板**与**迭代返工记录**：

➡️ **[docs/PROMPTS.md](docs/PROMPTS.md)**

原始需求只有一段话 —— 没有描述画面，只描述了**链路、汇合点、交付规格**：

```text
- 旁白：把每个场景的中文文案分别交给 edge-tts，生成 MP3，再按场景时间点放进视频。
- 背景音乐：用 Python 的 NumPy 按音符逐样本合成：导出 WAV。
- 混音：Remotion 把旁白和音乐合到视频里；最终视频音轨编码为 AAC 立体声。
用 Remotion（基于 React 的视频制作工具）把标题、贴纸卡片、图标、箭头和进度条做成组件；
场景切换、弹入、轻微旋转和缩放都由代码控制

做一个浙江金融职业学院的宣传片，然后时长在两分钟，做一个贴纸科普风的横屏16：9视频
```

---

## 关于示例数据

片中文案数据来自学校官网「学院简介」与《浙江日报》2026 高校报考指南（浙江招生代码 0050）。

- **官方发布口径**（可直接引用）：1975 年前身浙江银行学校、7 万余名经济金融人才 / 5000+ 各级行长、
  32 个招生专业、2 个中国特色高水平专业群 / 7 个国家骨干专业 / 10 项国家级教学成果奖、
  2004 年起 120+ 金融机构订单培养 / 16000+ 应用型人才、杭州绍兴两个校区。
- **建议二次确认**（来自官网较早版本介绍页与 2021 年报道）：货币金融博览馆 / 金苑华尔街 / 模拟银行、
  专业 + 语言 + 国别国际化培养模式。

示例成片仅用于技术方案演示，**不代表学校官方发布**。学校名称与办学数据权利归权利人所有，
二次使用请自行向权利人确认（详见 [LICENSE](LICENSE) 附注）。

---

## 环境

开发与验证环境：Node 22.22.2 · Python 3.13.12 · Remotion 4.0.534 · edge-tts 7.2.8 ·
numpy 2.5.3 · ffmpeg 8.1.1

> 提示：若渲染时报 `EEXIST ... node-brokered-fs-shim` 一类错误，说明运行环境的
> `NODE_OPTIONS` 被注入了文件系统代理。用 `env -u NODE_OPTIONS npx remotion render ...` 绕开即可。
> 细节见 [docs/WORKFLOW.md](docs/WORKFLOW.md)。

---

## License

[MIT](LICENSE) © 2026 ranmoliunian-spec

代码、提示词文档、合成音频按 MIT 开源；示例成片中的学校信息与标识权利归权利人所有。
