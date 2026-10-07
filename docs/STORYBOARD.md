# 分镜表 · Storyboard

10 个场景，总时长 3600 帧 = 120.000 秒（@30fps）。时间码与时长均由 `script/build_timeline.py`
**按旁白 MP3 的真实时长自动分配**，不是手工排的。

| # | 场景 key | 起始 | 时长 | 旁白时长 | 主标题 | 画面构成 | 静帧 |
| :-: | --- | --- | --- | --- | --- | --- | :-: |
| 01 | `hook` | 00:00.000 | 7.567s | 5.592s | 钱塘江畔 | 左侧竖排大字 + 三枚信息 chip（下沙大学城 / 被叫作「金融黄埔」/ 走出 5000+ 位行长）+ 右侧校园插画卡 + 漂浮贴纸 | [图](storyboard/scene-01.png) |
| 02 | `origin` | 00:07.567 | 10.300s | 7.848s | 从一间银行学校开始 | 双里程碑时间卡（1975 浙江银行学校 / 2002 浙江金融职业学院）+ 底部 51 年横幅（数字滚动计数）+ 增长插画 | [图](storyboard/scene-02.png) |
| 03 | `president` | 00:17.867 | 13.333s | 10.344s | 行长摇篮 | 左侧巨型数字 **5000+**（各级各类行长）+ 右侧人才总量卡 **7万+**（含增长柱图，虚线分隔） | [图](storyboard/scene-03.png) |
| 04 | `platform` | 00:31.200 | 14.467s | 11.256s | 三块国字号招牌 | 三张并列资格卡：国家示范校 / 双高校 / 省重点，各含 2 条要点；顶部横向进度条 | [图](storyboard/scene-04.png) |
| 05 | `majors` | 00:45.667 | 11.800s | 9.072s | 专业跟着产业走 | 左侧巨型 **32** 计数（招生专业）+ 右侧 5 条专业清单（金融服务与管理 / 大数据与会计 / 国际经济与贸易 / 保险实务 / 财富管理），逐条弹入 | [图](storyboard/scene-05.png) |
| 06 | `strength` | 00:57.467 | 13.067s | 10.104s | 2 · 7 · 10 | 三行进度条：2 个双高专业群 / 7 个国家骨干专业 / 10 项国家级教学成果奖，斜纹填充动画 | [图](storyboard/scene-06.png) |
| 07 | `order` | 01:10.533 | 15.633s | 12.216s | 订单培养 · 毕业即上岗 | 三节点流程链 + 连接箭头：学校 → 120+ 家金融机构 → 16000+ 名应用型人才；底部结论卡 | [图](storyboard/scene-07.png) |
| 08 | `global` | 01:26.167 | 10.933s | 8.376s | 走出国门 | 地球经纬插画 + 虚线飞行轨迹（飞机沿三次贝塞尔曲线真实飞行，机头随切线转向）+ 专业/语言/国别三支点卡 + 三枚成果 chip | [图](storyboard/scene-08.png) |
| 09 | `campus` | 01:37.100 | 11.033s | 8.448s | 把金融现场搬进校园 | 三张实训场景卡（货币金融博览馆 / 金苑华尔街 / 模拟银行）+ 底部双校区信息条 | [图](storyboard/scene-09.png) |
| 10 | `cta` | 01:48.133 | 11.867s | 9.120s | 我们，在这里等你 | 居中收尾：欢迎报考 + 校名 + 招生代码 **0050** + 地址与咨询信息 + 二维码位 + 校训条 | [图](storyboard/scene-10.png) |

**总览**：[out/contact-sheet.png](../out/contact-sheet.png)（2×5 网格）

---

## 时序机制

每个场景的排布由 `src/timeline.json` 驱动，字段含义：

```jsonc
{
  "id": "s01",
  "key": "hook",            // 映射到 SCENE_COMPONENTS 里的组件
  "from": 0,                // 场景起始帧
  "durationInFrames": 227,  // 场景占用帧数
  "leadInFrames": 12,       // 旁白相对场景起点的延迟（先让画面立住再开口）
  "audioFrames": 168,       // 旁白 MP3 的真实帧长
  "accent": "#1E5BD6"       // 本场景强调色，决定卡片配色
}
```

- **画面**：`<Sequence from={from} durationInFrames>` 按序排布
- **旁白**：`<Sequence from={from + leadInFrames} durationInFrames={audioFrames}>`
- **音乐躲让**：以 `[from + leadInFrames - 6, from + leadInFrames + audioFrames + 8]` 为压低区间，两侧各 10 帧斜坡

只有 `script/scenes.json` 需要手写。`timeline.json` 是生成物，**不要手改**。

---

## 想加/删场景怎么做

1. 在 `script/scenes.json` 的 `scenes` 数组里增删一项（必须有 `id` / `key` / `narration` / `accent`）
2. 在 `src/scenes/Scenes.tsx` 写一个同名 key 的场景组件，并在 `src/Video.tsx` 的
   `SCENE_COMPONENTS` 里注册
3. 重跑 `./run-all.sh`

时长分配、旁白落位、底部进度条分段、章节标签**都会自动跟上**，不需要改 `Chrome.tsx`。

若新的总时长不等于 120 秒，改 `script/build_timeline.py` 里的总帧数目标即可
（当前是强制对齐 3600 帧）。
