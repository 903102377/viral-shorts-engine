import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/fetch-inspiration?source=reddit&subreddit=jokes&limit=20&sort=top&time=all
 * GET /api/fetch-inspiration?source=curated  — 获取精选中文爆款段子
 * 
 * 从 Reddit 拉取已验证的爆款段子，或返回内置精选中文段子
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const source = url.searchParams.get('source') || 'curated';

    // =============================================
    // 精选中文爆款短剧/文案（已验证的高流量内容）
    // =============================================
    if (source === 'curated') {
      const category = url.searchParams.get('category') || 'all';
      let scripts = CURATED_ABSURD_SCRIPTS;
      if (category !== 'all') {
        scripts = scripts.filter(j => j.category === category);
      }
      return NextResponse.json({
        success: true,
        items: scripts.map(j => ({
          id: j.id,
          source: 'curated' as const,
          title: j.title,
          content: j.content,
          score: j.heat,
          category: j.category,
          addedAt: new Date().toISOString(),
        })),
        categories: [...new Set(CURATED_ABSURD_SCRIPTS.map(j => j.category))],
      });
    }

    // =============================================
    // Reddit 拉取（保留，但不翻译）
    // =============================================
    if (source === 'reddit') {
      const subreddit = url.searchParams.get('subreddit') || 'jokes';
      const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 100);
      const sort = url.searchParams.get('sort') || 'top';
      const time = url.searchParams.get('time') || 'all';
      const after = url.searchParams.get('after') || '';

      const ALLOWED_SUBS = ['jokes', 'dadjokes', 'TwoSentenceHorror', 'cleanjokes', 'Jokes', 'funny'];
      if (!ALLOWED_SUBS.includes(subreddit)) {
        return NextResponse.json({ error: `不支持的 subreddit: ${subreddit}` }, { status: 400 });
      }

      const redditUrl = `https://www.reddit.com/r/${subreddit}/${sort}.json?t=${time}&limit=${limit}${after ? `&after=${after}` : ''}`;
      console.log(`🌐 [Reddit] 拉取 r/${subreddit} ${sort} (t=${time}, limit=${limit})...`);

      const response = await fetch(redditUrl, {
        headers: { 'User-Agent': 'viral-shorts-engine/1.0 (by /u/shorts-bot)' },
      });

      if (!response.ok) {
        throw new Error(`Reddit API 返回 ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const posts = data?.data?.children || [];
      const afterToken = data?.data?.after || null;

      const items = posts
        .filter((post: any) => {
          const d = post.data;
          return d && d.selftext && d.selftext.trim() && !d.removed_by_category;
        })
        .map((post: any) => {
          const d = post.data;
          return {
            id: d.id,
            source: 'reddit' as const,
            title: d.title || '',
            content: d.selftext || '',
            score: d.score || 0,
            url: `https://reddit.com${d.permalink}`,
            addedAt: new Date(d.created_utc * 1000).toISOString(),
          };
        });

      console.log(`✅ [Reddit] 获取 ${items.length} 条有效段子`);
      return NextResponse.json({ success: true, items, after: afterToken, subreddit });
    }

    return NextResponse.json({ error: '不支持的来源，请使用 source=curated 或 source=reddit' }, { status: 400 });
  } catch (err: any) {
    console.error('Fetch inspiration error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// =============================================
// 精选中文爆款段子（怪诞现实主义、视听震撼、反转）
// 主打荒诞极致的视觉奇观与底层卑微情绪的巨大反差
// 绝对不要带有任何教育和说教意味
// =============================================

interface CuratedScript {
  id: string;
  title: string;
  content: string;
  category: string;
  heat: number;
}

const CURATED_ABSURD_SCRIPTS: CuratedScript[] = [
  // ==================== 职场荒诞类 ====================
  {
    id: 'absurd_001',
    title: '巨型哥斯拉猫的调休抱怨',
    content: '【视觉奇观】：进击的百米巨型橘猫一脚踩碎了CBD的一栋玻璃大厦，火光冲天，末日般的压迫感。路人四散奔逃，直升机在空中盘旋光束打在它脸上。\n【荒诞反差/动作】：橘猫烦躁地拍碎了一台直升机，像拍死一只蚊子，然后巨大的毛茸茸爪子捏起大厦顶部的避雷针挠了挠后背。\n【台词】：（微弱且疲惫的人类大叔音）"到底是谁发明的调休...我已经连踩了四个街区了，还是没有遇到一家发工资不打折的公司。"\n【转折/镜头】：它突然低头，巨大的金色竖瞳盯着镜头前的观众。\n【金句/结尾】：（死寂的废墟中）"所以...你那儿还招人吗？我吃得不多，一顿大概要吃两个董事长。"',
    category: '职场荒诞',
    heat: 880000,
  },
  {
    id: 'absurd_002',
    title: '时间暂停里的打工人',
    content: '【视觉奇观】：世界突然静止，雨滴悬停在半空。一只穿着西装的拉布拉多在马路上飞沙走石地超音速狂飙，周围的空气因摩擦产生音爆云。\n【荒诞反差】：在极致的超级英雄大片视觉下，拉布拉多满脸惊恐，领带乱飞。\n【台词】："这已经是老子这个月第三次激活超能力了！"\n【转折/镜头】：拉布拉多化作一道闪电冲进写字楼，猛地坐到工位上，按下了打卡机。打卡机发出冰冷的AI声音：“打卡成功：八点五十九分五十九秒，差一秒全勤奖扣光。”周围时间恢复流动，雨落下。\n【金句/结尾】：拉布拉多虚脱地吐着舌头瘫在椅子上，旁边同事端着咖啡走过来："哟，今天又来这么早啊？"',
    category: '职场荒诞',
    heat: 650000,
  },
  // ==================== 孤单/存在绝望类 ====================
  {
    id: 'absurd_003',
    title: '克苏鲁章鱼的悲惨相亲',
    content: '【视觉奇观】：一家充满粉红色气球的浪漫高级餐厅。坐在长桌一端的，是一只浑身长满触手、流淌着绿色粘液的几十米高外星主宰星人，它的触手几乎塞满了整个餐厅。\n【荒诞反差】：这样一个恐怖的灭世存在，此刻正用两根触手别扭地拿着刀叉切牛排，另外八十根触手在紧张地搓动，汗如雨下。\n【对白】：坐在对面的相亲对象（正常短毛猫）冷冷地说："你有车有房吗？"\n【转折/镜头】：克苏鲁章鱼吓得浑身颤抖，喷出了一大口黑色的防卫墨汁，把整个餐厅和对象全都淋成了纯黑色。\n【金句/结尾】：章鱼捂着脸一边狂奔逃出餐厅一边哭叫："地球太可怕了！我想回我的暗物质星云！我再也不要当大龄单身海鲜了！"',
    category: '情感怪诞',
    heat: 920000,
  },
  {
    id: 'absurd_004',
    title: '宇宙爆炸与晚饭',
    content: '【视觉奇观】：外太空视角，地球表面突然出现巨大的裂谷，炽郁的岩浆喷涌，半个月亮刚好坠落砸向地球，天空呈现末日般的血红色。这是一场无处可逃的星系大爆炸。\n【荒诞反差/镜头】：镜头急速拉近，无限放大穿过云层，来到一个破旧的出租屋阳台。一只长着人手的鸭子正淡定地坐在摇椅上，手持一瓶廉价啤酒，看着天上的陨石坠落。\n【对白】：手机突然响起，房东发来语音："小李，下个月房租涨五百啊。"\n【结尾/情绪爆发】：鸭子平静地举起啤酒瓶，对着马上要砸中他脑门的燃烧小行星碰了个杯，轻蔑一笑："你来得真是太准时了。干杯，毁灭吧。"',
    category: '情感怪诞',
    heat: 760000,
  }
];
