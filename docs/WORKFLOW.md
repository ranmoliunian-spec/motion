# 复现与设计拆解 · Workflow

本文说明这套管线**怎么跑起来**、**每一层怎么实现的**、以及**踩过的坑**。

---

## 1. 环境与安装

| 依赖 | 版本（验证环境） | 用途 |
| --- | --- | --- |
| Node.js | 22.22.2（>= 18 即可） | Remotion 运行时 |
| Python | 3.13.12（>= 3.9 即可） | 声音链与音乐链 |
| ffmpeg / ffprobe | 8.1.1 | 测量 MP3 时长、校验成片规格与混音电平 |
| Remotion | 4.0.534 | 视频合成 |
| edge-tts | 7.2.8 | 旁白合成（免费，无需 API Key） |
| numpy | 2.5.3 | 背景音乐逐样本合成 |

```bash
pip install -r requirements.txt
npm install

./run-all.sh          # 一键：旁白 → 音乐 → 时间轴 → 渲染
```

分步：

```bash
npm run voice      # script/tts.py
npm run bgm        # script/bgm.py
npm run timeline   # script/build_timeline.py
npm run render     # remotion render
```

---

## 2. 三条链的实现

### 2.1 旁白链 · `script/tts.py`

- 读 `script/scenes.json`，取出 `meta.voice` / `rate` / `pitch`（当前 `zh-CN-XiaoxiaoNeural`，+8% 语速）
- **每个场景单独调用一次 edge-tts**，输出 `public/audio/{id}.mp3`
- 带 **4 次重试**：在线 TTS 偶发失败，重试前 `await asyncio.sleep(1.5)`
- 产物校验：文件大于 2KB 才算成功，否则重试
- 结果：10 段 MP3，旁白总长 **92.38 秒**

> 为什么一段一调用而不是拼成一大段：**每段独立才能按场景时间点精确落位**，
> 而且改某一场景文案时只需重生成那一段。

### 2.2 音乐链 · `script/bgm.py`

从零合成，**不采样、不用素材库**。

| 参数 | 值 |
| --- | --- |
| 采样率 | 44100 Hz |
| 速度 | 100 BPM（1 拍 0.6s / 1 小节 2.4s） |
| 长度 | 13 块 × 4 小节 = **124.8 秒** |
| 和声 | C–G–Am–F 循环（`PROG`），另有两套旋律动机 `MEL_A` / `MEL_B` |
| 琶音 | `ARP = [0,1,2,3,2,1]` |

**合成器（全部逐样本包络生成）**

| 函数 | 音色做法 |
| --- | --- |
| `pluck(freq, dur, amp)` | 三角波 + 指数衰减 → 弹拨感 |
| `bell(freq, dur, amp)` | FM（载波 + 调制）→ 钟琴 |
| `pad(freq, dur, amp)` | 多正弦叠加 + 缓入缓出 → 暖垫 |
| `bassnote(freq, dur, amp)` | 低频正弦 + 短包络 → 贝斯 |
| `kick / clap / shaker / rim` | 底鼓（音高下滑正弦）/ 拍手（噪声爆发）/ 沙锤（高通噪声）/ 边击 |

**编排分层**：`block_offset()` 按块号决定该块用哪套编排 ——
片头稀疏（给旁白让路）、中段加入鼓组、副歌段 `full` 全开。这正是解决
「片头音乐太轻」那次返工的关键改动。

**后期**：FFT 卷积混响（干湿混合 `0.86`）→ 立体声加宽（偏离中置 `×1.18`，中置不动）
→ `tanh` 软限幅（`np.tanh(x * 1.25) / 1.25`）→ 写 16-bit WAV。

### 2.3 时间轴链 · `script/build_timeline.py`

这是让整套系统「改文案不用改组件」的关键一步。

```
读 scenes.json
  → ffprobe 测每段 MP3 真实时长 d
  → audioFrames = round(d * 30)
  → minSlot = LEAD_FRAMES(12) + audioFrames + MIN_TAIL(10)
  → slack = 3600 - Σ minSlot
  → 余量按各段旁白时长加权分配（旁白长的多给收尾时间）
  → 末场景吸收取整误差，assert 总帧数 == 3600
  → 写出 src/timeline.json
```

输出被三处消费：

- `Video.tsx` —— 画面/旁白的 `<Sequence from>` 与时长
- `Video.tsx` —— 音乐躲让的时间区间
- `Chrome.tsx` —— 底部进度条分段、章节标签、场景内细进度

**所以增删场景不用动任何组件。** 运行时会打印一张排期表，可直接核对。

---

## 3. 混音标定方法

增益值不是拍脑袋定的。流程是：

1. 先生成 `bgm.wav`，用 `volumedetect` 测母版电平 → **mean −29.6 dB**
2. 测一段旁白 MP3 → **mean ≈ −19 dB**
3. 反推需要的衰减量，把 BGM 基准音量定为 `0.76`，躲让值 `0.40`

```ts
const MUSIC_BASE = 0.76;   // 纯音乐段 ≈ −32dB，比旁白低约 11dB：能听见但不抢话
const MUSIC_DUCK = 0.40;   // 旁白段 ≈ −38dB，比旁白低约 17dB：稳在下面
```

**躲让（ducking）逻辑**

- 压低区间：`[场景起点 + leadIn + 音频帧 − 6, 场景起点 + leadIn + 音频帧 + 8]`
- 区间两侧各 **10 帧线性斜坡**，避免音量突变产生「抽气感」
- 片头 24 帧淡入、片尾 70 帧淡出

**验收实测**：纯音乐间隙 −30 ~ −36 dB，旁白段 −22 dB，全片峰值 −5.8 dB（无削波）。

> 反思：第一次交付时音乐比旁白低约 21 dB，笔记本/手机外放几乎听不见。
> 教训是**不要把「混完听着还行」当验收标准** —— 要在目标播放设备上、用实测电平说话。

---

## 4. 视觉系统拆解

```
theme.ts（设计令牌）
   ├─ 纸感底色 3 级 / 墨色 3 级 / 强调色 5 组（各带 soft 变体）
   ├─ 字体栈（中文：苹方 → 冬青 → 黑体 → 雅黑 → Noto Sans SC）
   ├─ hardShadow()  硬投影：无模糊、纯色偏移（贴纸风的核心）
   └─ stickerText() 描边文字生成器
        │
        ├─ PopIn.tsx    PopIn(spring 过冲) / Wiggle(旋转+缩放呼吸) / Float(漂浮)
        ├─ Sticker.tsx  StickerCard / StickerText / Chip / Tape / Highlight / StatBlock
        ├─ Icon.tsx     32 个手写路径图标 + IconBadge
        ├─ Arrow.tsx    手绘箭头（stroke-dashoffset 画出过程）/ ArrowDown
        ├─ Doodles.tsx  纸感底纹 / 闪烁星点 / 半调网点 / 飘带
        ├─ Illustration.tsx  5 组原创 SVG 插画
        ├─ SceneFrame.tsx    场景外壳（统一入出场语法）+ WipeOverlay 斜纹扫切
        └─ Chrome.tsx        顶部署名条 + 底部全局进度条
             │
             └─ scenes/Scenes.tsx  10 个场景（只做编排 + 传参）
```

**几条硬规矩**

- 组件里**不出现魔法数字色值**，一律走 `theme.ts`
- 场景文件里**不写内联的复杂样式拼装**，只摆放原子组件
- 贴纸文字用**双层叠字**（底层纯描边 + 上层纯填充），不依赖 `paint-order` 的浏览器支持
- **零外部素材**：无图标库、无插画素材、无音效包

---

## 5. 踩坑记录

首次渲染成片后，通过「抽 10 个场景关键帧目视复核 + `volumedetect` 测量电平」发现了 4 个必须修的问题：

| # | 问题 | 现象 | 根因 | 修法 |
| :-: | --- | --- | --- | --- |
| 1 | 贴纸数字全变成白色 | 51 / 5000+ / 7万+ / 32 全部显示为白色，失去强调色 | `StickerText` 组件没有接收 `style.color`，被组件内部默认的 `color: C.white` 覆盖 | 改成具名的 `color` 参数，5 处调用点逐一修正 |
| 2 | 卡片内容溢出边框 | S4 / S7 的文字压到卡片边框外 | 卡片高度按「预估文案长度」写死，实际渲染更高 | 调高卡片、收窄内容宽度 |
| 3 | S8 卡片右侧越界 + 飞机被挡住 | 抽帧右侧出画，飞行图标压在卡片下层 | 飞行轨迹与卡片布局区域重叠 | 重排三次贝塞尔曲线到标题右侧、卡片上方的留白区；同时把飞机定位从左上角锚点改为中心点对齐 |
| 4 | 背景音乐几乎听不见 | 纯音乐段 −43.5 dB，旁白段 −22 dB（差 21 dB） | 片头稀疏编排段只有暖垫，缺少中频支撑；且整体增益偏低 | 补贝斯 + 沙锤 + 钟琴到稀疏段，并重新标定 `MUSIC_BASE` / `MUSIC_DUCK` |

**另外两个与代码无关、但与执行环境相关的坑**（记录备查）：

| 现象 | 根因 | 解法 |
| --- | --- | --- |
| 前台长命令被中断 | 运行环境的进程管理策略 | 改用后台方式执行 |
| Remotion 渲染报 `EEXIST ... node-brokered-fs-shim` | 运行环境通过 `NODE_OPTIONS` 注入了文件系统代理 shim，它拦截了 webpack 的 `mkdtemp` → `mkdir` 序列 | `env -u NODE_OPTIONS CODEBUDDY_BROKERED_FS_HOOK_ENABLED=0 npx remotion render ...` |

> 第 2 条是特定运行环境的注入行为，普通本地开发不会遇到，仅作记录。

---

## 6. 换成你自己的主题

1. **改文案**：编辑 `script/scenes.json` —— `narration` 是旁白，`headline` / `sub` 是画面文字，
   `accent` 从 `theme.ts` 的 5 组强调色里挑
2. **改画面**：在 `src/scenes/Scenes.tsx` 里调整场景组件；新增场景需在
   `Video.tsx` 的 `SCENE_COMPONENTS` 注册同名 key
3. **改风格**：只动 `src/theme.ts`（换底色、换强调色、换投影强度），全片跟着变
4. **改音乐**：`script/bgm.py` 里的 `PROG`（和声进行）、`MEL_A/MEL_B`（旋律）、
   `block_offset()`（编排分层）
5. **改时长**：`script/build_timeline.py` 里的 `TARGET_S`
6. **改音色**：`script/scenes.json` 的 `meta.voice`（可用 `edge-tts --list-voices` 查看全部音色）

改完重跑 `./run-all.sh` 即可，时间轴与进度条自动跟上。

---

## 7. 交付前自检清单

- [ ] `npm run check` —— TypeScript 类型检查通过
- [ ] 抽每个场景的关键帧目视复核（本仓库用 `ffmpeg -ss <t> -frames:v 1`）
- [ ] `ffprobe` 校验：时长 / 分辨率 / 帧率 / 音频声道数与采样率
- [ ] `volumedetect` 校验：全片峰值是否削波、纯音乐段与旁白段的电平差是否合理
- [ ] 目标设备外放试听（笔记本喇叭、手机）—— 这一步不能省
