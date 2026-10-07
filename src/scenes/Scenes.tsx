import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, FONT, hexA} from '../theme';
import {Float, PopIn, Wiggle} from '../components/PopIn';
import {Chip, StickerCard, StickerText, Tape} from '../components/Sticker';
import {Icon, IconBadge, IconName} from '../components/Icon';
import {Arrow, ArrowDown} from '../components/Arrow';
import {SceneFrame} from '../components/SceneFrame';
import {CampusArt, FinanceArt, GlobeArt, GrowthArt} from '../components/Illustration';

/* ------------------------------------------------------------------ *
 *  布局常量：全片统一的栅格与安全区
 * ------------------------------------------------------------------ */
const SAFE_L = 128;
const SAFE_R = 1792;
const SAFE_W = SAFE_R - SAFE_L;
const TOP = 168;

type SceneProps = {accent: string; soft: string};

/** 场景小标题：一枚 kicker 徽标 + 一行主标题 */
const Title: React.FC<{
  kicker: string;
  main: string;
  size?: number;
  color?: string;
  delay?: number;
  kickerBg?: string;
}> = ({kicker, main, size = 112, color = C.white, delay = 2, kickerBg = C.ink}) => (
  <div>
    <PopIn from="top" delay={delay} distance={26}>
      <Chip bg={kickerBg} color={C.white} size={22} icon={<Icon name="spark4" size={20} color={C.yellow} sw={12} />}>
        {kicker}
      </Chip>
    </PopIn>
    <PopIn from="bottom" delay={delay + 6} distance={58} settleRotate={-0.7}>
      <div style={{marginTop: 20}}>
        <StickerText size={size} color={color}>
          {main}
        </StickerText>
      </div>
    </PopIn>
  </div>
);

/* ================================================================== *
 *  01 · 开场钩子
 * ================================================================== */
export const S1Hook: React.FC<SceneProps> = ({accent, soft}) => (
  <SceneFrame accent={accent} soft={soft} variant={0}>
    <div style={{position: 'absolute', left: SAFE_L, top: TOP - 6, width: 1000}}>
      <PopIn from="top" delay={0} distance={26}>
        <Chip bg={C.ink} color={C.white} size={21} icon={<Icon name="camera" size={20} color={C.yellow} sw={11} />}>
          浙江金融职业学院 · 招生宣传片
        </Chip>
      </PopIn>

      <PopIn from="bottom" delay={6} distance={74} settleRotate={-1.4}>
        <div style={{marginTop: 26}}>
          <StickerText size={146} style={{letterSpacing: '0.045em'}}>
            钱塘江畔
          </StickerText>
        </div>
      </PopIn>

      <PopIn from="bottom" delay={13} distance={62} settleRotate={1}>
        <div style={{marginTop: 2}}>
          <StickerText size={86} color={accent} stroke={5.2}>
            下沙大学城
          </StickerText>
        </div>
      </PopIn>

      <PopIn from="bottom" delay={21} distance={52}>
        <div style={{marginTop: 34, display: 'flex', gap: 18, flexWrap: 'wrap'}}>
          <Chip bg={C.yellow} size={29} rotate={-2.2}>
            被叫作「金融黄埔」
          </Chip>
          <Chip bg={C.white} size={29} rotate={2}>
            走出 5000+ 位行长
          </Chip>
        </div>
      </PopIn>

      <PopIn from="bottom" delay={30} distance={44}>
        <div style={{marginTop: 40, display: 'flex', alignItems: 'center', gap: 12}}>
          <Chip bg={C.teal} color={C.white} size={26} rotate={-1.4}>
            两分钟 · 看懂这所学校
          </Chip>
          <ArrowDown length={54} color={C.ink} thickness={7} delay={36} style={{transform: 'rotate(-90deg)'}} />
        </div>
      </PopIn>
    </div>

    {/* 右侧校园插画卡 */}
    <PopIn from="right" delay={10} distance={80} style={{position: 'absolute', left: 1090, top: 148}}>
      <div style={{position: 'relative'}}>
        <StickerCard rotate={3} pad="26px" radius={36} shadowSize={13}>
          <CampusArt w={600} accent={accent} />
        </StickerCard>
        <Tape color={C.yellow} width={210} height={50} rotate={-7} style={{left: 200, top: -26}} />
        <Tape color={C.teal} width={150} height={44} rotate={6} style={{left: 560, top: 330}} />

        {/* 漂浮贴纸 */}
        <Float amp={13} speed={0.04} style={{position: 'absolute', left: -78, top: 190}}>
          <Wiggle amount={4} phase={20}>
            <IconBadge name="coin" size={104} bg={C.yellow} color={C.ink} radius={26} />
          </Wiggle>
        </Float>
        <Float amp={17} speed={0.033} phase={40} style={{position: 'absolute', left: 566, top: -54}}>
          <Wiggle amount={5} phase={60} speed={0.07}>
            <IconBadge name="chart" size={96} bg={C.teal} color={C.white} radius={26} />
          </Wiggle>
        </Float>
        <Float amp={11} speed={0.045} phase={70} style={{position: 'absolute', left: -46, top: 350}}>
          <IconBadge name="bank" size={82} bg={C.blue} color={C.white} radius={22} />
        </Float>
      </div>
    </PopIn>
  </SceneFrame>
);

/* ================================================================== *
 *  02 · 溯源
 * ================================================================== */
const OriginCard: React.FC<{
  year: string;
  name: string;
  desc: string;
  icon: IconName;
  bg: string;
  rotate: number;
  delay: number;
  active?: boolean;
}> = ({year, name, desc, icon, bg, rotate, delay, active = false}) => (
  <PopIn from="bottom" delay={delay} distance={70} settleRotate={rotate * 0.5}>
    <StickerCard rotate={rotate} pad="34px 38px 30px" radius={34} shadowSize={12} bg={active ? C.white : C.paperDeep}>
      <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
        <IconBadge name={icon} size={96} bg={bg} color={C.white} radius={26} />
        <div>
          <StickerText size={68} num strokeColor={C.ink} style={{color: C.ink}}>
            {year}
          </StickerText>
          <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.ink, marginTop: 6}}>{name}</div>
        </div>
      </div>
      <div
        style={{
          marginTop: 20,
          paddingTop: 18,
          borderTop: `4px dashed ${hexA(C.ink, 0.35)}`,
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 26,
          color: C.ink70,
          lineHeight: 1.4,
        }}
      >
        {desc}
      </div>
    </StickerCard>
  </PopIn>
);

export const S2Origin: React.FC<SceneProps> = ({accent, soft}) => {
  const frame = useCurrentFrame();
  const counter = Math.round(
    interpolate(frame, [46, 74], [0, 51], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
  );

  return (
    <SceneFrame accent={accent} soft={soft} variant={1}>
      <div style={{position: 'absolute', left: SAFE_L, top: TOP - 10}}>
        <Title kicker="溯源 · 1975" main="从一间银行学校开始" size={104} kickerBg={C.teal} />
      </div>

      <div style={{position: 'absolute', left: SAFE_L + 60, top: 400, display: 'flex', alignItems: 'center', gap: 26}}>
        <OriginCard
          year="1975"
          name="浙江银行学校"
          desc="新中国成立后金融人才培训的重要基地，为行业输送第一批专业力量。"
          icon="calendar"
          bg={C.orange}
          rotate={-2.2}
          delay={10}
        />
        <Arrow length={190} width={110} thickness={8} delay={26} curve={30} style={{marginTop: -20}} />
        <OriginCard
          year="2002"
          name="浙江金融职业学院"
          desc="经省政府批准、教育部备案正式建立，开启高职办学新阶段。"
          icon="graduation"
          bg={C.teal}
          rotate={1.8}
          delay={22}
          active
        />
      </div>

      {/* 底部 51 年横幅 */}
      <PopIn from="bottom" delay={38} distance={60} style={{position: 'absolute', left: SAFE_L, top: 730, width: SAFE_W}}>
        <StickerCard rotate={-0.6} pad="20px 46px" radius={28} shadowSize={11} bg={C.white}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div style={{display: 'flex', alignItems: 'baseline', gap: 18}}>
              <StickerText size={112} num strokeColor={C.ink} color={C.teal}>
                {counter}
              </StickerText>
              <span style={{fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.ink}}>年</span>
              <span style={{fontFamily: FONT, fontWeight: 700, fontSize: 30, color: C.ink70, marginLeft: 6}}>
                只做一件事 ——
              </span>
            </div>
            <span style={{fontFamily: FONT, fontWeight: 900, fontSize: 46, color: C.ink, letterSpacing: '0.02em'}}>
              为金融行业培养人
            </span>
          </div>
        </StickerCard>
      </PopIn>

      <div style={{position: 'absolute', right: 92, top: 200, opacity: 0.95}}>
        <Float amp={16} speed={0.036}>
          <IconBadge name="spark4" size={78} bg={C.yellow} color={C.ink} radius={24} />
        </Float>
      </div>
    </SceneFrame>
  );
};

/* ================================================================== *
 *  03 · 行长摇篮
 * ================================================================== */
export const S3President: React.FC<SceneProps> = ({accent, soft}) => (
  <SceneFrame accent={accent} soft={soft} variant={0}>
    <div style={{position: 'absolute', left: SAFE_L, top: TOP - 10}}>
      <Title kicker="办学成果 · 51 年" main="行长摇篮" size={112} kickerBg={C.orange} />
    </div>

    {/* 左：巨型数字 */}
    <div style={{position: 'absolute', left: SAFE_L + 20, top: 388}}>
      <PopIn from="left" delay={22} distance={60}>
        <Wiggle amount={0} scaleAmt={0.004}>
          <IconBadge name="crown" size={116} bg={C.yellow} color={C.ink} radius={30} />
        </Wiggle>
      </PopIn>
      <PopIn from="bottom" delay={26} distance={70}>
        <div style={{marginTop: 22}}>
          <StickerText size={196} num strokeColor={C.ink} color={C.orange}>
            5000+
          </StickerText>
        </div>
      </PopIn>
      <PopIn from="bottom" delay={34} distance={50}>
        <div style={{marginTop: 4}}>
          <span style={{fontFamily: FONT, fontWeight: 900, fontSize: 46, color: C.ink, letterSpacing: '0.02em'}}>
            各级各类行长
          </span>
        </div>
      </PopIn>
      <PopIn from="bottom" delay={42} distance={44}>
        <div style={{marginTop: 26, display: 'flex', gap: 16}}>
          <Chip bg={C.red} color={C.white} size={27} rotate={-2}>
            金融黄埔
          </Chip>
          <Chip bg={C.white} size={27} rotate={1.6}>
            校友遍布金融系统
          </Chip>
        </div>
      </PopIn>
    </div>

    {/* 右：人才总量卡 */}
    <PopIn from="right" delay={16} distance={80} style={{position: 'absolute', left: 940, top: 300}}>
      <StickerCard rotate={-1.6} pad="38px 40px" radius={36} shadowSize={13}>
        <div style={{display: 'flex', gap: 30, alignItems: 'center'}}>
          <div style={{width: 320}}>
            <IconBadge name="users" size={88} bg={C.teal} color={C.white} radius={26} />
            <div style={{marginTop: 16}}>
              <div style={{display: 'flex', alignItems: 'baseline', gap: 8}}>
                <StickerText size={112} num strokeColor={C.ink} color={C.teal}>
                  7万+
                </StickerText>
              </div>
              <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.ink, marginTop: 4}}>
                经济金融优秀人才
              </div>
              <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 23, color: C.ink45, marginTop: 10, lineHeight: 1.4}}>
                办学 51 年累计培养，多数成长为骨干与管理者。
              </div>
            </div>
          </div>
          <div style={{borderLeft: `4px dashed ${hexA(C.ink, 0.3)}`, paddingLeft: 26}}>
            <GrowthArt w={330} accent={C.teal} />
          </div>
        </div>
      </StickerCard>
    </PopIn>

    <Float amp={14} speed={0.038} style={{position: 'absolute', left: 92, top: 250}}>
      <IconBadge name="medal" size={80} bg={C.purple} color={C.white} radius={24} />
    </Float>
  </SceneFrame>
);

/* ================================================================== *
 *  04 · 国家级平台
 * ================================================================== */
const PlatformCard: React.FC<{
  icon: IconName;
  title: string;
  sub: string;
  points: string[];
  bg: string;
  rotate: number;
  delay: number;
}> = ({icon, title, sub, points, bg, rotate, delay}) => (
  <PopIn from="bottom" delay={delay} distance={72} settleRotate={rotate * 0.5}>
    <StickerCard rotate={rotate} pad="34px 36px" radius={34} shadowSize={12} style={{width: 490, height: 470}}>
      <IconBadge name={icon} size={104} bg={bg} color={C.white} radius={28} />
      <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 46, color: C.ink, marginTop: 20, letterSpacing: '0.01em'}}>
        {title}
      </div>
      <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 25, color: C.ink45, marginTop: 8, height: 105, overflow: 'hidden', lineHeight: 1.4}}>
        {sub}
      </div>
      <div style={{marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12}}>
        {points.map((p) => (
          <div key={p} style={{display: 'flex', alignItems: 'center', gap: 12}}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 9,
                background: C.yellow,
                border: `3.5px solid ${C.ink}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Icon name="check" size={18} color={C.ink} sw={15} />
            </div>
            <span style={{fontFamily: FONT, fontWeight: 800, fontSize: 24, color: C.ink70}}>{p}</span>
          </div>
        ))}
      </div>
    </StickerCard>
  </PopIn>
);

export const S4Platform: React.FC<SceneProps> = ({accent, soft}) => (
  <SceneFrame accent={accent} soft={soft} variant={0}>
    <div style={{position: 'absolute', left: SAFE_L, top: TOP - 10}}>
      <Title kicker="实力平台 · 国字号" main="三块国字号招牌" size={104} kickerBg={C.red} />
    </div>

    <div style={{position: 'absolute', left: SAFE_L, top: 372, display: 'flex', gap: 46}}>
      <PlatformCard
        icon="medal"
        title="国家示范校"
        sub="全国首批「国家示范性高等职业院校建设计划」立项建设院校"
        points={['教育部 · 财政部联合立项', '浙江省第一家优秀等级高职']}
        bg={C.red}
        rotate={-2}
        delay={8}
      />
      <PlatformCard
        icon="crown"
        title="双高校"
        sub="中国特色高水平高职学校和专业建设计划建设单位"
        points={['2 个中国特色高水平专业群', '国家优质专科高等职业院校']}
        bg={C.orange}
        rotate={1.4}
        delay={16}
      />
      <PlatformCard
        icon="shield"
        title="省重点"
        sub="浙江省重点建设高职院校，办学质量获省级持续支持"
        points={['全国职业教育先进集体', '全国毕业生就业典型经验高校']}
        bg={C.blue}
        rotate={-1.2}
        delay={24}
      />
    </div>

    <PopIn from="top" delay={40} distance={36} style={{position: 'absolute', right: 150, top: 210}}>
      <Float amp={12} speed={0.04}>
        <IconBadge name="target" size={86} bg={C.teal} color={C.white} radius={24} />
      </Float>
    </PopIn>
  </SceneFrame>
);

/* ================================================================== *
 *  05 · 专业布局
 * ================================================================== */
const MajorRow: React.FC<{icon: IconName; name: string; tag: string; bg: string; i: number}> = ({
  icon,
  name,
  tag,
  bg,
  i,
}) => (
  <PopIn from="right" delay={18 + i * 5} distance={60}>
    <StickerCard rotate={i % 2 ? 1.2 : -1.2} pad="18px 24px" radius={26} shadowSize={8} style={{width: 420, height: 132}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
        <IconBadge name={icon} size={78} bg={bg} color={C.white} radius={22} border={4} shadow={5} />
        <div>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 30, color: C.ink, lineHeight: 1.2}}>{name}</div>
          <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 20, color: C.ink45, marginTop: 6}}>{tag}</div>
        </div>
      </div>
    </StickerCard>
  </PopIn>
);

export const S5Majors: React.FC<SceneProps> = ({accent, soft}) => {
  const frame = useCurrentFrame();
  const count = Math.round(
    interpolate(frame, [10, 34], [0, 32], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
  );

  return (
    <SceneFrame accent={accent} soft={soft} variant={1}>
      <div style={{position: 'absolute', left: SAFE_L, top: TOP - 10, width: 700}}>
        <Title kicker="专业布局" main="专业跟着产业走" size={92} kickerBg={C.blue} />
      </div>

      <div style={{position: 'absolute', left: SAFE_L + 10, top: 420}}>
        <PopIn from="bottom" delay={14} distance={70}>
          <div style={{display: 'flex', alignItems: 'flex-end', gap: 18}}>
            <StickerText size={228} num strokeColor={C.ink} color={C.blue}>
              {count}
            </StickerText>
            <span style={{fontFamily: FONT, fontWeight: 900, fontSize: 52, color: C.ink, paddingBottom: 26}}>
              个招生专业
            </span>
          </div>
        </PopIn>
        <PopIn from="bottom" delay={24} distance={48}>
          <div style={{marginTop: 20, display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start'}}>
            <Chip bg={C.yellow} size={26} rotate={-1.6}>
              覆盖金融 · 会计 · 国贸 · 保险 · 财富管理
            </Chip>
            <Chip bg={C.white} size={26} rotate={1.2}>
              2 个中国特色高水平专业群
            </Chip>
            <div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 6}}>
              <Arrow length={150} width={70} thickness={7} delay={40} curve={22} />
              <span style={{fontFamily: FONT, fontWeight: 800, fontSize: 24, color: C.ink70}}>还有更多方向</span>
            </div>
          </div>
        </PopIn>
      </div>

      <div style={{position: 'absolute', left: 926, top: 336, display: 'flex', gap: 26}}>
        <div style={{display: 'flex', flexDirection: 'column', gap: 24}}>
          <MajorRow i={0} icon="wallet" name="金融服务与管理" tag="双高专业群核心专业" bg={C.blue} />
          <MajorRow i={1} icon="calculator" name="大数据与会计" tag="国家骨干专业" bg={C.teal} />
          <MajorRow i={2} icon="ship" name="国际经济与贸易" tag="双高专业群 · 中澳合作" bg={C.purple} />
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 24, paddingTop: 66}}>
          <MajorRow i={3} icon="umbrella" name="保险实务" tag="浙江省重点专业" bg={C.orange} />
          <MajorRow i={4} icon="chart" name="财富管理" tag="国家骨干专业" bg={C.red} />
          <PopIn from="right" delay={44} distance={60}>
            <StickerCard rotate={1.2} pad="18px 24px" radius={26} shadowSize={8} bg={C.yellow} style={{width: 420, height: 132}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
                <IconBadge name="star" size={78} bg={C.ink} color={C.yellow} radius={22} border={4} shadow={5} />
                <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 30, color: C.ink, lineHeight: 1.25}}>
                  32 个专业
                  <br />
                  总有一个适合你
                </div>
              </div>
            </StickerCard>
          </PopIn>
        </div>
      </div>
    </SceneFrame>
  );
};

/* ================================================================== *
 *  06 · 教学实力
 * ================================================================== */
const StrengthRow: React.FC<{
  n: string;
  unit: string;
  label: string;
  pct: number;
  color: string;
  delay: number;
}> = ({n, unit, label, pct, color, delay}) => {
  const frame = useCurrentFrame();
  const w = interpolate(frame - delay, [0, 26], [0, pct], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <PopIn from="left" delay={delay} distance={64}>
      <StickerCard rotate={0} pad="14px 32px" radius={28} shadowSize={9} style={{width: SAFE_W, height: 128}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 28, height: '100%'}}>
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 26,
              background: color,
              border: `5px solid ${C.ink}`,
              boxShadow: `6px 6px 0 ${C.ink}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <StickerText size={56} num strokeColor={C.ink} color={C.white}>
              {n}
            </StickerText>
          </div>
          <div style={{flex: 1}}>
            <div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'space-between'}}>
              <span style={{fontFamily: FONT, fontWeight: 900, fontSize: 37, color: C.ink, letterSpacing: '0.01em'}}>
                {label}
              </span>
              <span style={{fontFamily: FONT, fontWeight: 800, fontSize: 25, color: C.ink45}}>{unit}</span>
            </div>
            <div
              style={{
                marginTop: 12,
                height: 24,
                borderRadius: 999,
                background: hexA(C.ink, 0.09),
                border: `4px solid ${C.ink}`,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${w}%`,
                  height: '100%',
                  background: color,
                  backgroundImage: `repeating-linear-gradient(-55deg, ${hexA(C.white, 0.35)} 0 10px, transparent 10px 22px)`,
                }}
              />
            </div>
          </div>
        </div>
      </StickerCard>
    </PopIn>
  );
};

export const S6Strength: React.FC<SceneProps> = ({accent, soft}) => (
  <SceneFrame accent={accent} soft={soft} variant={0}>
    <div style={{position: 'absolute', left: SAFE_L, top: TOP - 14}}>
      <Title kicker="教学实力" main="2 · 7 · 10" size={104} kickerBg={C.teal} />
    </div>

    <div style={{position: 'absolute', left: SAFE_L, top: 400, display: 'flex', flexDirection: 'column', gap: 18}}>
      <StrengthRow n="2" unit="中国特色高水平专业群" label="金融服务与管理 · 国际经济与贸易" pct={22} color={C.blue} delay={8} />
      <StrengthRow n="7" unit="国家骨干专业" label="金融服务与管理 · 会计 · 国贸 · 保险 · 财富管理…" pct={62} color={C.teal} delay={16} />
      <StrengthRow n="10" unit="国家级教学成果奖" label="8 门国家级精品课程 · 多门国家级在线精品课" pct={92} color={C.orange} delay={24} />
    </div>

    <PopIn from="bottom" delay={40} distance={44} style={{position: 'absolute', left: SAFE_L, top: 838}}>
      <Chip bg={C.ink} color={C.white} size={26} icon={<Icon name="bulb" size={22} color={C.yellow} sw={11} />}>
        课堂连着岗位 · 教学连着实战
      </Chip>
    </PopIn>
  </SceneFrame>
);

/* ================================================================== *
 *  07 · 订单培养
 * ================================================================== */
const FlowNode: React.FC<{
  icon: IconName;
  x: number;
  value?: string;
  label: string;
  note?: string;
  bg: string;
  delay: number;
  rotate: number;
  width: number;
}> = ({icon, x, value, label, note, bg, delay, rotate, width}) => (
  <PopIn from="bottom" delay={delay} distance={70} style={{position: 'absolute', left: x, top: 400}}>
    <StickerCard rotate={rotate} pad="24px 26px" radius={30} shadowSize={11} style={{width, height: 300}}>
      <IconBadge name={icon} size={82} bg={bg} color={C.white} radius={24} border={4} shadow={5} />
      {value ? (
        <div style={{marginTop: 12}}>
          <StickerText size={62} num strokeColor={C.ink} color={bg}>
            {value}
          </StickerText>
        </div>
      ) : null}
      <div style={{fontFamily: FONT, fontWeight: 900, fontSize: value ? 30 : 32, color: C.ink, marginTop: value ? 2 : 34, lineHeight: 1.25, whiteSpace: 'nowrap'}}>
        {label}
      </div>
      {note ? (
        <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 21, color: C.ink45, marginTop: 8, lineHeight: 1.35}}>{note}</div>
      ) : null}
    </StickerCard>
  </PopIn>
);

export const S7Order: React.FC<SceneProps> = ({accent, soft}) => (
  <SceneFrame accent={accent} soft={soft} variant={1}>
    <div style={{position: 'absolute', left: SAFE_L, top: TOP - 12}}>
      <Title kicker="产教融合" main="订单培养 · 毕业即上岗" size={96} kickerBg={C.orange} />
    </div>

    {/* 节点之间的连接箭头 */}
    <Arrow length={80} width={90} thickness={7} curve={16} delay={16} style={{position: 'absolute', left: 662, top: 505}} />
    <Arrow length={80} width={90} thickness={7} curve={16} delay={26} style={{position: 'absolute', left: 1142, top: 505}} />

    <FlowNode icon="graduation" x={300} label="浙江金融职业学院" note="2004 年启动订单人才培养" bg={C.blue} delay={10} rotate={-2} width={360} />
    <FlowNode icon="bank" x={780} value="120+" label="家金融机构" note="银行 · 保险 · 证券 · 农信" bg={C.orange} delay={20} rotate={1.6} width={360} />
    <FlowNode icon="users" x={1260} value="16000+" label="名应用型人才" note="累计向订单单位输送" bg={C.teal} delay={30} rotate={-1.4} width={360} />

    <PopIn from="bottom" delay={44} distance={44} style={{position: 'absolute', left: SAFE_L, top: 800}}>
      <div style={{display: 'flex', gap: 18}}>
        <Chip bg={C.red} color={C.white} size={26} rotate={-1.6}>
          毕业与上岗，几乎零过渡
        </Chip>
        <Chip bg={C.white} size={26} rotate={1.4}>
          校企共育 · 定向成长
        </Chip>
      </div>
    </PopIn>
  </SceneFrame>
);

/* ================================================================== *
 *  08 · 国际化
 * ================================================================== */
export const S8Global: React.FC<SceneProps> = ({accent, soft}) => {
  const frame = useCurrentFrame();
  const fly = interpolate(frame, [26, 168], [0.02, 0.98], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  /** 三次贝塞尔求点 + 切线角，让飞机真正沿着虚线飞 */
  const P0 = [20, 250];
  const P1 = [150, 40];
  const P2 = [290, 240];
  const P3 = [400, 60];
  const bez = (t: number) => {
    const u = 1 - t;
    const x = u ** 3 * P0[0] + 3 * u ** 2 * t * P1[0] + 3 * u * t ** 2 * P2[0] + t ** 3 * P3[0];
    const y = u ** 3 * P0[1] + 3 * u ** 2 * t * P1[1] + 3 * u * t ** 2 * P2[1] + t ** 3 * P3[1];
    const dx = 3 * u ** 2 * (P1[0] - P0[0]) + 6 * u * t * (P2[0] - P1[0]) + 3 * t ** 2 * (P3[0] - P2[0]);
    const dy = 3 * u ** 2 * (P1[1] - P0[1]) + 6 * u * t * (P2[1] - P1[1]) + 3 * t ** 2 * (P3[1] - P2[1]);
    return {x, y, deg: (Math.atan2(dy, dx) * 180) / Math.PI};
  };
  const pt = bez(fly);

  return (
    <SceneFrame accent={accent} soft={soft} variant={0} sparkleColor={C.purple}>
      <div style={{position: 'absolute', left: SAFE_L, top: TOP - 12}}>
        <Title kicker="国际化 · 一带一路" main="走出国门" size={104} kickerBg={C.purple} />
      </div>

      <PopIn from="left" delay={12} distance={70} style={{position: 'absolute', left: 172, top: 396}}>
        <div style={{position: 'relative'}}>
          <GlobeArt w={440} accent={accent} rotate={frame * 0.12} />
          <div
            style={{
              position: 'absolute',
              left: -30,
              top: -26,
              background: C.ink,
              color: C.white,
              border: `4px solid ${C.ink}`,
              borderRadius: 14,
              padding: '8px 18px',
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: 26,
              transform: 'rotate(-6deg)',
            }}
          >
            Go Global
          </div>
        </div>
      </PopIn>

      {/* 飞行轨迹 + 飞机（放在标题右侧、卡片上方的空白区） */}
      <div style={{position: 'absolute', left: 560, top: 86, width: 420, height: 270}}>
        <svg width={420} height={270} viewBox="0 0 420 270" style={{position: 'absolute', inset: 0}}>
          <path
            d="M20 250 C 150 40, 290 240, 400 60"
            fill="none"
            stroke={hexA(C.ink, 0.5)}
            strokeWidth={6}
            strokeDasharray="20 18"
            strokeLinecap="round"
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            left: pt.x - 38,
            top: pt.y - 38,
            transform: `rotate(${pt.deg}deg)`,
          }}
        >
          <Icon name="plane" size={76} color={C.purple} sw={7} />
        </div>
      </div>

      {/* 右侧：三个支点 */}
      <div style={{position: 'absolute', left: 830, top: 400, display: 'flex', flexDirection: 'column', gap: 20}}>
        <PopIn from="right" delay={26} distance={70}>
          <StickerCard rotate={-1.2} pad="22px 30px" radius={28} shadowSize={10} style={{width: 940}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 14, justifyContent: 'space-between'}}>
              {[
                {t: '专业', d: '金融主干专业', c: C.blue},
                {t: '语言', d: '第二外语课程', c: C.teal},
                {t: '国别', d: '区域国别认知', c: C.orange},
              ].map((x, i) => (
                <React.Fragment key={x.t}>
                  <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
                    <div
                      style={{
                        width: 78,
                        height: 78,
                        borderRadius: 22,
                        background: x.c,
                        border: `5px solid ${C.ink}`,
                        boxShadow: `5px 5px 0 ${C.ink}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <StickerText size={36} color={C.white} strokeColor={C.ink}>
                        {x.t}
                      </StickerText>
                    </div>
                    <span style={{fontFamily: FONT, fontWeight: 800, fontSize: 22, color: C.ink70, width: 150, lineHeight: 1.3}}>
                      {x.d}
                    </span>
                  </div>
                  {i < 2 ? (
                    <StickerText size={46} color={C.yellow} strokeColor={C.ink}>
                      +
                    </StickerText>
                  ) : null}
                </React.Fragment>
              ))}
            </div>
          </StickerCard>
        </PopIn>

        <PopIn from="right" delay={36} distance={60}>
          <div style={{display: 'flex', gap: 16, flexWrap: 'wrap'}}>
            <Chip bg={C.purple} color={C.white} size={25} rotate={-1.4}>
              海外研修 · 文化交流
            </Chip>
            <Chip bg={C.white} size={25} rotate={1.2}>
              国际技能竞赛
            </Chip>
            <Chip bg={C.yellow} size={25} rotate={-1}>
              浙江职教方案出海
            </Chip>
          </div>
        </PopIn>
      </div>
    </SceneFrame>
  );
};

/* ================================================================== *
 *  09 · 校园现场
 * ================================================================== */
const CampusCard: React.FC<{
  icon: IconName;
  title: string;
  sub: string;
  bg: string;
  rotate: number;
  delay: number;
  art: React.ReactNode;
}> = ({icon, title, sub, bg, rotate, delay, art}) => (
  <PopIn from="bottom" delay={delay} distance={74} settleRotate={rotate * 0.5}>
    <StickerCard rotate={rotate} pad="26px 26px 28px" radius={34} shadowSize={12} style={{width: 508, height: 452}}>
      <div
        style={{
          height: 236,
          borderRadius: 24,
          background: hexA(bg, 0.14),
          border: `4px dashed ${hexA(C.ink, 0.45)}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {art}
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 20}}>
        <IconBadge name={icon} size={68} bg={bg} color={C.white} radius={20} border={4} shadow={5} />
        <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 36, color: C.ink}}>{title}</div>
      </div>
      <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 23, color: C.ink45, marginTop: 12, lineHeight: 1.4}}>{sub}</div>
    </StickerCard>
  </PopIn>
);

export const S9Campus: React.FC<SceneProps> = ({accent, soft}) => (
  <SceneFrame accent={accent} soft={soft} variant={0}>
    <div style={{position: 'absolute', left: SAFE_L, top: TOP - 12}}>
      <Title kicker="真实场景" main="把金融现场搬进校园" size={92} kickerBg={C.blue} />
    </div>

    <div style={{position: 'absolute', left: 176, top: 372, display: 'flex', gap: 44}}>
      <CampusCard
        icon="museum"
        title="货币金融博览馆"
        sub="省内首家货币金融主题博览馆，把货币史变成看得见的课堂。"
        bg={C.orange}
        rotate={-1.8}
        delay={10}
        art={
          <div style={{position: 'relative'}}>
            <Icon name="coin" size={148} color={C.orange} sw={6} />
            <div style={{position: 'absolute', right: -46, top: -12}}>
              <Icon name="spark4" size={42} color={C.yellow} sw={9} />
            </div>
          </div>
        }
      />
      <CampusCard
        icon="chart"
        title="金苑华尔街"
        sub="模拟真实交易环境，行情、下单、风控一次跑通。"
        bg={C.blue}
        rotate={1.4}
        delay={18}
        art={<FinanceArt w={400} accent={C.blue} />}
      />
      <CampusCard
        icon="bank"
        title="模拟银行"
        sub="柜台、信贷、理财全流程实训，毕业前先当一次柜员。"
        bg={C.teal}
        rotate={-1.2}
        delay={26}
        art={
          <div style={{position: 'relative'}}>
            <Icon name="bank" size={148} color={C.teal} sw={6} />
            <div style={{position: 'absolute', right: -44, top: -8}}>
              <Icon name="idcard" size={40} color={C.yellow} sw={9} />
            </div>
          </div>
        }
      />
    </div>

    <PopIn from="bottom" delay={42} distance={44} style={{position: 'absolute', left: SAFE_L, top: 848}}>
      <div style={{display: 'flex', gap: 18}}>
        <Chip bg={C.ink} color={C.white} size={26} icon={<Icon name="pin" size={20} color={C.yellow} sw={11} />}>
          杭州 · 绍兴 两个校区
        </Chip>
        <Chip bg={C.white} size={26} rotate={1.4}>
          学生发展中心 · 技能训练中心
        </Chip>
      </div>
    </PopIn>
  </SceneFrame>
);

/* ================================================================== *
 *  10 · 收尾号召
 * ================================================================== */
export const S10Cta: React.FC<SceneProps> = ({accent, soft}) => (
  <SceneFrame accent={accent} soft={soft} variant={1} sparkleColor={C.yellow}>
    <div style={{position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center'}}>
      <PopIn from="top" delay={4} distance={40}>
        <Chip bg={C.red} color={C.white} size={26} icon={<Icon name="spark4" size={22} color={C.yellow} sw={12} />}>
          欢迎报考
        </Chip>
      </PopIn>
      <PopIn from="bottom" delay={10} distance={66} settleRotate={-0.8}>
        <div style={{marginTop: 22}}>
          <StickerText size={118}>我们，在这里等你</StickerText>
        </div>
      </PopIn>
    </div>

    <PopIn from="bottom" delay={22} distance={72} style={{position: 'absolute', left: 470, top: 402}}>
      <StickerCard rotate={-1.2} pad="34px 54px" radius={38} shadowSize={14}>
        <div style={{display: 'flex', alignItems: 'center', gap: 34}}>
          <IconBadge name="bank" size={134} bg={C.red} color={C.white} radius={32} border={6} shadow={7} />
          <div style={{textAlign: 'left'}}>
            <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 84, color: C.ink, letterSpacing: '0.02em', lineHeight: 1.1}}>
              浙江金融职业学院
            </div>
            <div
              style={{
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: 22,
                color: C.ink45,
                letterSpacing: '0.26em',
                marginTop: 8,
              }}
            >
              ZHEJIANG FINANCIAL COLLEGE
            </div>
          </div>
        </div>
      </StickerCard>
    </PopIn>

    <div style={{position: 'absolute', left: 176, top: 650, display: 'flex', gap: 30, alignItems: 'stretch'}}>
      <PopIn from="left" delay={40} distance={64}>
        <StickerCard rotate={-1.6} pad="18px 34px" radius={28} shadowSize={10} bg={C.red} style={{height: 184}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 22, height: '100%'}}>
            <div>
              <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 26, color: hexA(C.white, 0.85), letterSpacing: '0.1em'}}>
                招生代码
              </div>
              <StickerText size={96} num strokeColor={C.ink} style={{color: C.white}}>
                0050
              </StickerText>
            </div>
            <div style={{width: 4, height: 96, background: hexA(C.white, 0.5)}} />
            <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 27, color: C.white, lineHeight: 1.45}}>
              浙江省招生代码
              <br />
              以省教育考试院公布为准
            </div>
          </div>
        </StickerCard>
      </PopIn>

      <PopIn from="bottom" delay={48} distance={60}>
        <StickerCard rotate={1.2} pad="20px 34px" radius={28} shadowSize={10} bg={C.white} style={{height: 184, width: 560}}>
          <div style={{display: 'flex', flexDirection: 'column', gap: 14, justifyContent: 'center', height: '100%'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
              <Icon name="pin" size={30} color={C.red} sw={8} />
              <span style={{fontFamily: FONT, fontWeight: 800, fontSize: 27, color: C.ink}}>
                杭州市钱塘区学源街 118 号
              </span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
              <Icon name="phone" size={30} color={C.blue} sw={8} />
              <span style={{fontFamily: FONT, fontWeight: 800, fontSize: 27, color: C.ink}}>
                招生咨询 0571-86739200
              </span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
              <Icon name="globe" size={30} color={C.teal} sw={8} />
              <span style={{fontFamily: FONT, fontWeight: 800, fontSize: 27, color: C.ink}}>
                招生网 zsb.zfc.edu.cn
              </span>
            </div>
          </div>
        </StickerCard>
      </PopIn>

      <PopIn from="right" delay={56} distance={64}>
        <StickerCard rotate={-2} pad="18px" radius={28} shadowSize={10} bg={C.yellow} style={{height: 184}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 18, height: '100%'}}>
            <Icon name="qr" size={104} color={C.ink} sw={6} />
            <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 28, color: C.ink, lineHeight: 1.35, maxWidth: 200}}>
              扫码关注
              <br />
              招生公众号
            </div>
          </div>
        </StickerCard>
      </PopIn>
    </div>

    <PopIn from="top" delay={64} distance={40} style={{position: 'absolute', left: 0, right: 0, top: 866, textAlign: 'center'}}>
      <span style={{fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.ink45, letterSpacing: '0.14em'}}>
        尚德 · 精业 · 爱生 &nbsp;|&nbsp; 诚信 · 明理 · 笃行
      </span>
    </PopIn>
  </SceneFrame>
);
