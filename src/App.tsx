import React, { useState, useEffect, useRef } from "react";
import { 
  Shield, 
  Sparkles, 
  ShoppingBag, 
  BookOpen, 
  ChevronRight, 
  HelpCircle, 
  RotateCcw, 
  Heart, 
  Clock, 
  Coins, 
  User, 
  Compass, 
  AlertTriangle, 
  ArrowRight, 
  Play,
  CheckCircle,
  XCircle,
  Volume2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// ==========================================
// 1. データ定義とタイプ
// ==========================================

interface Item {
  id: string;
  name: string;
  realName: string;
  description: string;
  realDescription: string;
  isConsumable: boolean;
  price: number;
}

interface Stage {
  id: number;
  name: string;
  theme: string;
  situation: string;
  dangerLevel: number;
  tutorial?: boolean;
  steps: {
    prompt: string;
    correctCommand: string;
    choices: string[];
    hint: string;
  }[];
}

// アイテムデータ
const ITEMS: Record<string, Item> = {
  aed: {
    id: "aed",
    name: "古代の蘇生魔石",
    realName: "AED（自動体外式除細動器）",
    description: "心停止状態の者にショックを与え、正常な律動を取り戻す蘇生用魔道具。",
    realDescription: "【現実のAEDに相当】\n心臓が細かく震え、血液を送り出せなくなった「心室細動」の状態に対して電気ショックを与え、正常なリズムに戻すための道具です。電源を入れると、音声ガイダンスが次にすべき手順を教えてくれます。",
    isConsumable: false,
    price: 0
  },
  bandage: {
    id: "bandage",
    name: "エルフの癒やし布",
    realName: "三角巾 / 包帯",
    description: "骨折固定や直接圧迫止血など多用途に使用できる、伸縮性に優れた癒やしの布。",
    realDescription: "【現実の三角巾・包帯に相当】\n骨折した骨の固定、傷口の保護、直接圧迫止血など多用途に使用できる伸縮性のある布です。きつく縛りすぎないように巻き、結び目が傷口や患部に直接当たらないよう注意します。",
    isConsumable: true,
    price: 10
  },
  mouthpiece: {
    id: "mouthpiece",
    name: "息吹のベール",
    realName: "人工呼吸用マウスピース",
    description: "人工呼吸を行う際、術者と対象者の接触を防ぎ感染リスクを最小化する逆止弁付きシート。",
    realDescription: "【現実の人工呼吸用マスクに相当】\n傷病者に人工呼吸（息を吹き込む処置）を行う際、救護者が傷病者の唾液や血液に直接触れるのを防ぎ、感染リスクを最小にするための逆止弁付きシートです。",
    isConsumable: false,
    price: 0
  },
  splint: {
    id: "splint",
    name: "大樹の添え木",
    realName: "副木（シーネ）",
    description: "骨折の疑いがある部位を確実に固定し、移動時の悪化を防ぐための頑丈な添え木。",
    realDescription: "【現実の副木に相当】\n骨折の疑いがある部位を固定し、移動時などの痛みを和らげ、周囲の血管や神経の損傷を防ぐための板状の道具です。骨折した部位を挟む「上下の関節」まで届く十分な長さのものをあてて固定します。",
    isConsumable: false,
    price: 0
  },
  glove: {
    id: "glove",
    name: "風除けの皮手袋",
    realName: "使い捨て手袋",
    description: "他者の体液や血液に直接触れることを防ぎ、自身の安全を確保するための魔導手袋。",
    realDescription: "【現実の使い捨て手袋に相当】\n傷病者の血液や体液に直接触れて感染することを防ぐため、処置の前に必ず着用すべき保護具です。ビニール製やゴム製の手袋と同様の役割を果たします。",
    isConsumable: false,
    price: 0
  },
  holywater: {
    id: "holywater",
    name: "聖水の滴",
    realName: "消毒液 / 清潔な水",
    description: "熱を下げ、傷口を洗い清めるための聖なる水。",
    realDescription: "【現実の消毒液・清潔な水に相当】\n熱中症や火傷を冷ましたり、傷口に付着した異物をきれいに洗い流すための清潔な水（水道水）と同じ役割を果たします。",
    isConsumable: true,
    price: 10
  }
};

// ステージデータ
const STAGES: Stage[] = [
  {
    id: 0,
    name: "冒険者ギルドの訓練場",
    theme: "救急救命の基礎知識",
    situation: "ギルドの新兵訓練にて、教官のオーガが「仲間が倒れた際の対応手順」を訓練している。基本操作と意識・安全確認の重要性を学ぼう。",
    dangerLevel: 1,
    tutorial: true,
    steps: [
      {
        prompt: "訓練用の模擬人形で最初の救護手順をテストする。まず最初に何をすべきか？",
        correctCommand: "周囲の安全確認",
        choices: ["周囲の安全確認", "意識の確認", "大声で助けを呼ぶ", "息吹のベールで人工呼吸"],
        hint: "救護者自身の安全が最優先です。周囲に危険がないか確認しましょう。"
      },
      {
        prompt: "周囲の安全が確認できた。次に対象の状態を調べるための適切な行動は？",
        correctCommand: "意識の確認",
        choices: ["意識の確認", "呼吸の確認", "大声で助けを呼ぶ", "古代の蘇生魔石を使う"],
        hint: "相手の肩を優しく叩き、大声で声をかけて反応（意識）があるか確かめます。"
      },
      {
        prompt: "反応がない（意識がない）ことが判明した。ただちに取るべき行動は？",
        correctCommand: "応援要請",
        choices: ["応援要請", "呼吸の確認", "エルフの癒やし布で固定", "そのまま様子を見る"],
        hint: "一人では救助しきれません。周囲の一般市民や仲間に大声で協力を呼びかけましょう。"
      }
    ]
  },
  {
    id: 1,
    name: "市場で倒れたドワーフ",
    theme: "一次救命処置の基礎・意識呼吸確認",
    situation: "賑やかな王都の市場で、ドワーフの商人が突然胸を押さえてその場に倒れ込んだ。周囲の野次馬はパニック状態だ。適切な一時救護を行え！",
    dangerLevel: 2,
    steps: [
      {
        prompt: "大勢の人が行き交い、荷馬車が通る市場の真ん中。まず何を行うべきか？",
        correctCommand: "周囲の安全確認",
        choices: ["周囲の安全確認", "商人をその場で揺さぶる", "胸骨圧迫を開始する", "古代の蘇生魔石を貼る"],
        hint: "荷馬車などの二次災害を避けるため、まずは現場の安全確認が必要です。"
      },
      {
        prompt: "安全を確認し商人の側に駆け寄った。次に反応を確認する方法として正しいものは？",
        correctCommand: "意識の確認",
        choices: ["意識の確認", "胸骨圧迫を行う", "呼吸を確かめる", "冷たい水をかける"],
        hint: "肩を優しく叩きながら、大きな声で「大丈夫ですか！」と呼びかけます。"
      },
      {
        prompt: "商人からの返答や動きは一切ない。次にすべき極めて重要な行動は？",
        correctCommand: "応援要請",
        choices: ["応援要請", "自力で背負って運ぶ", "人工呼吸を始める", "諦めて立ち去る"],
        hint: "周囲の人を特定して「あなた、医療ギルド（救急車）を！」「あなた、古代の蘇生魔石（AED）を！」と具体的に指示して助けを求めます。"
      },
      {
        prompt: "応援を呼びかけ、誰かが蘇生魔石を探しに走ってくれた。魔石が来るまでの間、最初に行う観察は？",
        correctCommand: "呼吸の確認",
        choices: ["呼吸の確認", "脈拍を1分間測る", "全身の骨折を調べる", "衣服をすべて脱がせる"],
        hint: "胸やお腹の上下の動きを10秒以内で見て、普段通りの呼吸があるか確認します。"
      }
    ]
  },
  {
    id: 2,
    name: "炭鉱での落盤事故",
    theme: "骨折と固定",
    situation: "崩落が発生した鉱山から、足をガレキに挟まれた炭鉱夫が救出された。右足が不自然な方向に曲がり、激痛を訴えている。適切な固定を行え！",
    dangerLevel: 3,
    steps: [
      {
        prompt: "炭鉱夫は激しい痛みを訴え、足が曲がっている。最初に行うべき行動は？",
        correctCommand: "周囲の安全確認",
        choices: ["周囲の安全確認", "曲がった足を力任せに引っ張って伸ばす", "すぐにその場から自立させて歩かせる", "エルフの癒やし布でそのまま縛る"],
        hint: "落盤現場では二次崩落の危険があります。まずは周囲の安全を確認すること。"
      },
      {
        prompt: "安全を確認した。炭鉱夫の骨折疑い箇所に対して使用すべき最初の魔道具（副木）は？",
        correctCommand: "大樹の添え木",
        choices: ["大樹の添え木", "古代の蘇生魔石", "息吹のベール", "聖水の滴"],
        hint: "骨折箇所の変形や動揺を防ぐため、シーネに相当する「大樹の添え木」をあてます。"
      },
      {
        prompt: "添え木を当てる際、固定する範囲として正しいものは？",
        correctCommand: "関節を挟んで上下を固定",
        choices: ["関節を挟んで上下を固定", "骨折箇所だけをピンポイントで縛る", "体幹と足全体を一体化させる", "特に固定はせず添え木をそっと置くだけにする"],
        hint: "骨折箇所が動かないよう、その上下にある２つの関節（例：すねなら膝と足首）を含めて固定します。"
      },
      {
        prompt: "添え木のあてがい方が決まった。これをしっかりと固定して保持するために使用するアイテムは？",
        correctCommand: "エルフの癒やし布",
        choices: ["エルフの癒やし布", "息吹のベール", "風除けの皮手袋", "古代の蘇生魔石"],
        hint: "包帯や三角巾の役割を果たす「エルフの癒やし布」で、添え木を適度な強さで結びます。"
      }
    ]
  },
  {
    id: 3,
    name: "激震！崩れゆく神殿",
    theme: "地震発生時の身の守り方と災害避難",
    situation: "歴史ある地下神殿を探索中、突如として大地震が発生した。天井から石材や古い調度品が激しく落下し、神殿全体が激しく揺れている！",
    dangerLevel: 3,
    steps: [
      {
        prompt: "立っていることも困難な大揺れが始まった。その場ですぐに取るべき基本姿勢は？",
        correctCommand: "姿勢を低くし、頭を守る",
        choices: ["姿勢を低くし、頭を守る", "慌てて出口に向かって全力疾走する", "直立不動で壁に背中を押し付ける", "呪文を唱えて神に祈る"],
        hint: "落下物から身を守るため、「まず低く、頭を守り、動かない（ドロップ、カバー、ホールドオン）」を実践します。"
      },
      {
        prompt: "姿勢を低くした。周囲を見渡すといくつかの避難候補がある。どこに入るべきか？",
        correctCommand: "頑丈な石のテーブルの下",
        choices: ["頑丈な石のテーブルの下", "高い燭台や石像のすぐ隣", "出口の石扉の目の前", "何もない広い中央の床"],
        hint: "落下物から頭部と全身を覆い隠す、頑丈なテーブルなどの下に入り込みます。"
      },
      {
        prompt: "テーブルの下に滑り込んだ。揺れが続いている間の適切な行動は？",
        correctCommand: "揺れが収まるまで留まり頭部を保護",
        choices: ["揺れが収まるまで留まり頭部を保護", "揺れている最中に外の様子を見に這い出る", "荷物をまとめて別の安全そうな部屋へ走る", "テーブルの脚を蹴って強度を試す"],
        hint: "大きな揺れは通常1〜2分で落ち着きます。慌てて動かず、揺れが完全に収まるまで頭を保護して待ちます。"
      }
    ]
  },
  {
    id: 4,
    name: "酒場で喉を詰まらせた戦士",
    theme: "気道異物除去",
    situation: "ギルドの酒場で、大ぶりの魔獣肉を一口で丸呑みした戦士が、突然立ち上がって喉をかきむしり始めた。顔面は青ざめ、声も出せない状態だ！",
    dangerLevel: 3,
    steps: [
      {
        prompt: "戦士は喉を両手で掴み（チョークサイン）、呼吸ができなくなっている。まず行うべきは？",
        correctCommand: "異物が詰まっているか声がけ確認",
        choices: ["異物が詰まっているか声がけ確認", "喉の奥に指を突っ込んで掻き回す", "無理やりビールを喉へ流し込む", "背中を優しくなでる"],
        hint: "「喉が詰まったの？」と聞き、うなずくか、声が出せないチョークサインを確認したら、窒息と判断してすぐに除去を試みます。"
      },
      {
        prompt: "窒息と判断した。自力で吐き出せない様子。ただちに背後から行う最も基本的な除去手技は？",
        correctCommand: "背部叩打法（背中を強く叩く）",
        choices: ["背部叩打法（背中を強く叩く）", "人工呼吸を何度も行う", "お腹を上から強く圧迫して押し下げる", "その場でジャンプさせる"],
        hint: "手のひらの付け根（手根部）で、肩甲骨の間を力強く、何度も叩く「背部叩打法」を行います。"
      },
      {
        prompt: "背部叩打法を行ったが異物が出ない。次に、意識がある傷病者の腹部を圧迫する手技（妊婦や乳児以外）は？",
        correctCommand: "腹部突き上げ法（ハイムリック法）",
        choices: ["腹部突き上げ法（ハイムリック法）", "胸骨圧迫を行う", "口移しで空気を強く吸い出す", "喉元を強く握りつぶす"],
        hint: "背後から腕を回し、片方の握り拳をおへその少し上に当て、もう片方の手で握って素早く手前上方へ引き上げる「ハイムリック法」です。"
      }
    ]
  },
  {
    id: 5,
    name: "魔獣の爪による大怪我",
    theme: "直接圧迫止血と感染防止",
    situation: "街道を歩いていた旅人が、凶暴な魔獣に襲われて腕を深く切り裂かれた。傷口から真っ赤な血液が勢いよく流れ出ており、旅人の顔は蒼白だ！",
    dangerLevel: 3,
    steps: [
      {
        prompt: "血が流れる怪我人を発見した。救護を行う前に、自分を感染症のリスクから守るために着用すべき防具は？",
        correctCommand: "風除けの皮手袋",
        choices: ["風除けの皮手袋", "息吹のベール", "大樹の添え木", "古代の蘇生魔石"],
        hint: "他者の血液や体液に直接触れることを防ぐため、必ずビニール手袋や「皮手袋」を着用します。"
      },
      {
        prompt: "手袋を着用した。勢いよく出血している傷口に対する、最も基本的で最も効果的な一次止血法は？",
        correctCommand: "きれいな布で傷口を直接強く圧迫する",
        choices: ["きれいな布で傷口を直接強く圧迫する", "傷口のかなり上部を紐でガチガチに縛り上げる", "傷口に泥を塗りたくって穴を塞ぐ", "傷口を水で洗い流し続ける"],
        hint: "ガーゼや「きれいな布」を傷口に直接あて、上から手で強く持続的に圧迫する「直接圧迫止血法」が世界標準です。"
      },
      {
        prompt: "直接圧迫止血を数分行い、出血が弱まってきた。圧迫を継続したまま、傷口を固定保護するために使用するアイテムは？",
        correctCommand: "エルフの癒やし布",
        choices: ["エルフの癒やし布", "大樹の添え木", "聖水の滴", "息吹のベール"],
        hint: "止血用のあて布がズレないよう、「エルフの癒やし布（包帯・三角巾）」をしっかり巻き、固定します。"
      }
    ]
  },
  {
    id: 6,
    name: "炎のダンジョン",
    theme: "熱中症・やけどの対応",
    situation: "猛暑の火山ダンジョンから戻ってきた若者が、体温が異常に上昇し、意識が朦朧としてその場に崩れ落ちた。腕には熱風で負った火傷もある！",
    dangerLevel: 4,
    steps: [
      {
        prompt: "熱風が吹きすさぶダンジョンの入り口付近。まず傷病者をどこへ移動させるべきか？",
        correctCommand: "風通しの良い日陰や涼しい安全な場所",
        choices: ["風通しの良い日陰や涼しい安全な場所", "温泉が湧き出る暖かい洞窟の奥", "そのまま日差しが照りつける岩の上", "冷たい水に全身を沈める"],
        hint: "熱中症が疑われる場合、直射日光を避け、風通しの良い涼しい場所（日陰、クーラーの効いた室内など）へ退避させます。"
      },
      {
        prompt: "涼しい場所に移動させ、衣服を少し緩めた。体温を下げるために、特に集中的に冷やすべき体の部位は？",
        correctCommand: "首・脇の下・太ももの付け根",
        choices: ["首・脇の下・太ももの付け根", "手足の先と爪のあたり", "お腹の真ん中と腰回り", "頭頂部と両耳の裏"],
        hint: "太い血管が皮膚の近くを通っている「首（両側）、脇の下、太ももの付け根（股関節）」を効果的に冷やします。"
      },
      {
        prompt: "水分補給を試みたいが、若者は呼びかけに対してうつろで、うまく返事ができない。水を与えるべきか？",
        correctCommand: "意識が朦朧としている時は水分を与えない",
        choices: ["意識が朦朧としている時は水分を与えない", "無理やり喉に流し込んで飲ませる", "少しずつ口に含ませて放置する", "気合で飲み干すよう命じる"],
        hint: "意識障害がある（はっきり受け答えができない）場合、無理に水分を飲ませると、誤って気管に入り窒息する危険があります。"
      },
      {
        prompt: "腕に負った中程度の火傷（赤みと水ぶくれ）を発見した。これに対する最初の応急処置として使用すべきアイテムは？",
        correctCommand: "聖水の滴（きれいな冷水）で冷やす",
        choices: ["聖水の滴（きれいな冷水）で冷やす", "水ぶくれを針で全て破り中身を出す", "すぐに油や軟膏を塗りたくる", "乾いた布で強くこすって汚れを取る"],
        hint: "火傷は「すぐに、きれいな冷水（聖水の滴）」で15〜20分以上冷やすことが最優先です。水ぶくれは破ってはいけません。"
      }
    ]
  },
  {
    id: 7,
    name: "煙の立ち込める地下迷宮",
    theme: "火災時の避難行動と煙への備え",
    situation: "地下街の宿屋に滞在中、キッチン魔導具の暴走により突如火災が発生。通路には一瞬で黒く、息苦しい煙が立ち込め、視界が非常に悪い！",
    dangerLevel: 4,
    steps: [
      {
        prompt: "火災が発生し、天井近くまで煙が充満し始めている。通路を避難する際、取るべき正しい移動姿勢は？",
        correctCommand: "姿勢をできるだけ低く保って進む",
        choices: ["姿勢をできるだけ低く保って進む", "立ったまま全力でダッシュする", "寝転がって床を這い回る", "上を向いて大きく深呼吸しながら走る"],
        hint: "煙は熱で上部に溜まり、有毒ガスが含まれます。床付近の残存酸素を吸うため、姿勢を低くして移動します。"
      },
      {
        prompt: "煙の吸入を最小限に抑えるため、口と鼻を覆うのに最も適した避難行動は？",
        correctCommand: "濡らした布（ハンカチなど）を口鼻にあてる",
        choices: ["濡らした布（ハンカチなど）を口鼻にあてる", "素手で口を強く塞いで息を止める", "乾いた服の襟首を吸い込む", "特に対策はせず普通の呼吸で進む"],
        hint: "濡らしたハンカチや布をあてることで、煙に含まれる微粒子（煤）の吸入をある程度フィルターし軽減できます。"
      },
      {
        prompt: "地下から地上へ脱出する経路。どれを利用するのが最も安全で正しいか？",
        correctCommand: "非常階段（または通常の階段）を徒歩で進む",
        choices: ["非常階段（または通常の階段）を徒歩で進む", "魔導エレベーター（昇降機）を使う", "その場で救助を待って眠る", "煙の発生源である調理場を突き抜ける"],
        hint: "火災時は停電によりエレベーター（昇降機）内に閉じ込められるリスクが極めて高いため、必ず階段を使用します。"
      }
    ]
  }
];

// ==========================================
// 2. メイン React コンポーネント
// ==========================================

export default function App() {
  // --- 画面状態 ---
  // 'title' | 'map' | 'intro' | 'battle' | 'result'
  const [screen, setScreen] = useState<"title" | "map" | "intro" | "battle" | "result">("title");

  // --- プレイヤーデータ ---
  const [gold, setGold] = useState<number>(15); // 初期所持ゴールド
  const [level, setLevel] = useState<number>(1);
  const [exp, setExp] = useState<number>(0);
  
  // 成長ステータス（レベルアップにより自動上昇）
  // 1. 行動速度（敏捷性）: タイムリミットの初期値が増える (レベル1: 10, レベル2: 11, ...)
  // 2. 失敗回避（冷静さ）: 不適切行動時のペナルティ回避率 (レベル * 5%, 最大30%)
  // 3. 周囲の協力（カリスマ）: 特殊NPCの出現確率 (2% + レベル * 2%, 最大15%)
  
  // --- 所持品 ---
  // 消耗品のみ個数を管理。初期：癒やし布2、聖水の滴1。所持制限最大5個。
  const [inventory, setInventory] = useState<Record<string, number>>({
    bandage: 2,
    holywater: 1
  });

  // --- 選択中のステージ ---
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null);

  // --- バトル中の一時状態 ---
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [vital, setVital] = useState<number>(3); // 1〜5、初期値3、5でクリア、1のときに下回るとゲームオーバー
  const [timeLimit, setTimeLimit] = useState<number>(10); // 残り行動回数
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [selectedItemForUse, setSelectedItemForUse] = useState<string | null>(null);
  const [battleResult, setBattleResult] = useState<"success" | "failure" | null>(null);
  
  // 特別NPC（1戦闘で出現したか、および有効な効果）
  const [specialNpc, setSpecialNpc] = useState<"soldier" | "mage" | null>(null);
  const [soldierShieldActive, setSoldierShieldActive] = useState<boolean>(false);

  // 正しい行動の連続成功カウント (2回でバイタルが1段階回復)
  const [correctActionCount, setCorrectActionCount] = useState<number>(0);

  // --- UI制御（ポップアップ・説明） ---
  const [hoveredItem, setHoveredItem] = useState<Item | null>(null);
  const [showBook, setShowBook] = useState<boolean>(false);
  const [activeHint, setActiveHint] = useState<string | null>(null);

  // --- 開発用：自動テストなど HMR 対策 ---
  useEffect(() => {
    // HMR時にステートが崩れないようにリセット
  }, []);

  // --- プレイヤー能力の算出 ---
  const agility = level; // 行動速度（初期制限時間に影響：10 + レベル - 1）
  const coolMindChance = Math.min(0.3, level * 0.05); // 失敗回避確率（最大30%）
  const charismaChance = Math.min(0.15, 0.02 + level * 0.02); // NPC出現率（最大15%）

  // タイムリミットの初期最大値
  const getMaxTimeLimit = () => 10 + (level - 1);

  // --- ショップでの購入処理 ---
  const buyItem = (itemId: string) => {
    const item = ITEMS[itemId];
    if (!item) return;
    
    if (gold < item.price) {
      alert("ゴールドが足りません！");
      return;
    }
    
    const currentCount = inventory[itemId] || 0;
    if (currentCount >= 5) {
      alert("これ以上所持できません！（最大5個）");
      return;
    }

    setGold(prev => prev - item.price);
    setInventory(prev => ({
      ...prev,
      [itemId]: currentCount + 1
    }));
  };

  // --- バトル開始セットアップ ---
  const startStage = (stage: Stage) => {
    setSelectedStage(stage);
    setCurrentStepIndex(0);
    setVital(3);
    setCorrectActionCount(0); // リセット
    setTimeLimit(10 + (level - 1)); // 敏捷性によって増加
    setBattleLog(["状況の確認を行ってください。"]);
    setSelectedItemForUse(null);
    setSpecialNpc(null);
    setSoldierShieldActive(false);
    setBattleResult(null);
    setActiveHint(null);
    setScreen("intro");
  };

  // --- バトルの最終リザルト処理 ---
  const handleBattleEnd = (result: "success" | "failure") => {
    setBattleResult(result);
    setScreen("result");

    if (result === "success" && selectedStage) {
      // 報酬ゴールド：3〜7ゴールドの間（残ったバイタルや時間によって変動）
      const baseReward = 3;
      const extraVital = Math.max(0, vital - 3); // 最大2
      const extraTime = timeLimit > 5 ? 2 : (timeLimit > 2 ? 1 : 0); // 最大2
      const totalReward = Math.min(7, baseReward + extraVital + extraTime);
      
      setGold(prev => prev + totalReward);

      // 経験値：クリアで30〜50獲得
      const gainedExp = 30 + extraVital * 5 + extraTime * 5;
      const nextExp = exp + gainedExp;
      setExp(nextExp);

      // レベルアップ：100expごとに上昇
      if (nextExp >= 100) {
        setLevel(prev => prev + 1);
        setExp(nextExp - 100);
      }
    }
  };

  // --- コマンド実行（共通処理） ---
  const executeAction = (commandName: string) => {
    if (!selectedStage || battleResult) return;

    // 1. タイムリミット（行動回数）を1消費
    const nextTimeLimit = timeLimit - 1;
    setTimeLimit(nextTimeLimit);

    const step = selectedStage.steps[currentStepIndex];
    const isCorrect = step.correctCommand === commandName;

    // ログ用のバッファ
    let logs: string[] = [];
    let nextVital = vital;
    let nextCorrectActionCount = correctActionCount;
    let nextStepIndex = currentStepIndex;

    // 低確率で特殊NPCが登場（カリスマ判定）
    // すでにNPCが出ていない、かつ「応援要請」や「任意の行動」を選択した際に判定
    let currentSpecialNpc = specialNpc;
    let currentSoldierShieldActive = soldierShieldActive;

    if (!currentSpecialNpc && Math.random() < charismaChance) {
      const npcType = Math.random() < 0.5 ? "soldier" : "mage";
      currentSpecialNpc = npcType;
      setSpecialNpc(npcType);
      if (npcType === "soldier") {
        currentSoldierShieldActive = true;
        setSoldierShieldActive(true);
        logs.push("【特殊NPC：高名な兵士が登場！】不適切行動時のダメージを防ぐバリアを付与してくれた！");
      } else {
        nextVital = Math.min(5, nextVital + 1);
        logs.push("【特殊NPC：白魔導士が登場！】癒やしの光で、救助対象の容体を1段階回復してくれた！");
        if (nextVital !== vital) {
          logs.push("容体が良くなった");
        }
      }
    }

    if (isCorrect) {
      // 正しい行動
      logs.push("正しい行動を選んだ");
      nextCorrectActionCount += 1;

      if (nextCorrectActionCount >= 2) {
        nextVital = Math.min(5, nextVital + 1);
        if (nextVital !== vital) {
          logs.push("容体が良くなった");
        } else {
          logs.push("容体はすでに最大限安定しています");
        }
        nextCorrectActionCount = 0; // リセット
      } else {
        logs.push("正しい処置が継続中…（あと1回正しい行動をすると容体がさらに良くなります）");
      }

      // 次の手順へ進む
      nextStepIndex += 1;

    } else {
      // 不適切な行動
      logs.push("不適切な行動を選んだ");
      nextCorrectActionCount = 0; // 不適切な行動でリセット

      // 失敗回避システム（冷静さ判定）
      if (Math.random() < coolMindChance) {
        logs.push("「待て、この状況でこの対処はかえって危険だ…！」と気づき、踏みとどまった。（冷静さによりペナルティを回避！）");
      } else {
        // 失敗回避が発動しなかった場合、ペナルティ（バイタル減少）
        if (currentSoldierShieldActive) {
          currentSoldierShieldActive = false;
          setSoldierShieldActive(false);
          logs.push("兵士のバリアが身代わりになり、容体の悪化を防いだ！");
        } else {
          nextVital = nextVital - 1;
          logs.push("容体が悪化した");
        }
      }
    }

    // 状態更新
    setVital(nextVital);
    setCorrectActionCount(nextCorrectActionCount);
    setCurrentStepIndex(nextStepIndex);
    setBattleLog(prev => [...logs, ...prev]);
    setSelectedItemForUse(null);

    // クリア・ゲームオーバー判定
    // 1. バイタルが5に到達した、または全手順を完了した場合はクリア！
    if (nextVital >= 5 || nextStepIndex >= selectedStage.steps.length) {
      if (nextVital > 0) {
        handleBattleEnd("success");
        return;
      }
    }

    // 2. バイタルが0（極めて危険を下回る）になったら失敗
    if (nextVital <= 0) {
      handleBattleEnd("failure");
      return;
    }

    // 3. タイムリミット枯渇
    if (nextTimeLimit <= 0) {
      handleBattleEnd("failure");
      return;
    }
  };

  // --- アイテム使用 ---
  const useInventoryItem = (itemId: string) => {
    const item = ITEMS[itemId];
    if (!item) return;

    // 消耗品の場合は個数チェック
    if (item.isConsumable) {
      const count = inventory[itemId] || 0;
      if (count <= 0) {
        alert("アイテムを所持していません。ショップで購入してください。");
        return;
      }
      // 消費
      setInventory(prev => ({
        ...prev,
        [itemId]: count - 1
      }));
    }

    // アイテム名に適合するコマンドを実行
    executeAction(item.name);
  };

  return (
    <div id="app-root" className="w-full min-h-screen bg-slate-950 flex items-center justify-center p-4">
      
      {/* スマホ縦画面専用コンテナ */}
      <div 
        id="phone-frame" 
        className="w-full max-w-md h-[840px] bg-slate-900 border-4 border-slate-700 rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col font-sans text-slate-100 select-none"
      >
        {/* スマホのスピーカー（ノッチ部分） */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-slate-700 rounded-b-2xl z-50 flex items-center justify-center">
          <div className="w-16 h-1 bg-slate-900 rounded-full"></div>
        </div>

        {/* 共通ヘッダー：ステータスバー風 */}
        <div className="pt-8 px-6 pb-2 flex justify-between items-center bg-slate-900/95 border-b border-slate-800 text-xs text-slate-400 z-10">
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-sky-400" />
            <span>一般市民 Lv.{level}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Coins className="w-3.5 h-3.5 text-amber-500" />
              <span className="font-bold text-amber-400">{gold} G</span>
            </div>
          </div>
        </div>

        {/* メイン画面のレンダリング */}
        <div className="flex-1 overflow-y-auto relative flex flex-col">
          <AnimatePresence mode="wait">
            
            {/* ----------------------------------
                1. タイトル画面
               ---------------------------------- */}
            {screen === "title" && (
              <motion.div
                key="title"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center p-6 text-center"
              >
                {/* タイトル表示は不要のためロゴアートのみを表示 */}
                <div className="w-40 h-40 bg-gradient-to-tr from-sky-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-sky-500/20 mb-12">
                  <Heart className="w-20 h-20 text-white animate-pulse" />
                </div>

                <motion.button
                  id="btn-start"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setScreen("map")}
                  className="w-64 py-4 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 text-lg cursor-pointer"
                >
                  <Play className="w-5 h-5 fill-current" />
                  ゲームを開始する
                </motion.button>
              </motion.div>
            )}

            {/* ----------------------------------
                2. ステージ選択・ショップ・図鑑
               ---------------------------------- */}
            {screen === "map" && (
              <motion.div
                key="map"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex-1 flex flex-col p-6 gap-6"
              >
                {/* ギルドショップ */}
                <div id="guild-shop" className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-3">
                    <ShoppingBag className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-emerald-400">ギルドショップ（消耗品購入）</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.values(ITEMS).filter(i => i.isConsumable).map(item => (
                      <div 
                        key={item.id} 
                        className="bg-slate-800 border border-slate-700 rounded-xl p-3 flex flex-col justify-between"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-xs font-bold text-slate-200">{item.name}</span>
                          <span className="text-[10px] text-slate-400">所持: {inventory[item.id] || 0}/5</span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-amber-400 font-mono font-bold">{item.price} G</span>
                          <button
                            id={`btn-buy-${item.id}`}
                            onClick={() => buyItem(item.id)}
                            disabled={gold < item.price || (inventory[item.id] || 0) >= 5}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-[10px] font-bold rounded text-white cursor-pointer"
                          >
                            購入
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 成長ステータス確認 */}
                <div id="player-status" className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-sky-400" />
                      <h3 className="text-sm font-bold text-sky-400">冒険者ステータス</h3>
                    </div>
                    <span className="text-[10px] text-slate-400">次のLvまで: {exp}/100 EXP</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                      <div className="text-[10px] text-slate-400 mb-0.5">行動速度</div>
                      <div className="text-xs font-bold text-sky-400">+{agility - 1}</div>
                      <div className="text-[9px] text-slate-500">初期行動回数:{getMaxTimeLimit()}</div>
                    </div>
                    <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                      <div className="text-[10px] text-slate-400 mb-0.5">冷静さ</div>
                      <div className="text-xs font-bold text-violet-400">{Math.round(coolMindChance * 100)}%</div>
                      <div className="text-[9px] text-slate-500">失敗回避率</div>
                    </div>
                    <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                      <div className="text-[10px] text-slate-400 mb-0.5">カリスマ</div>
                      <div className="text-xs font-bold text-emerald-400">{Math.round(charismaChance * 100)}%</div>
                      <div className="text-[9px] text-slate-500">特殊NPC出現率</div>
                    </div>
                  </div>
                </div>

                {/* ステージ選択一覧 */}
                <div className="flex-1 flex flex-col min-h-0">
                  <h3 className="text-sm font-bold text-slate-400 mb-3 flex items-center gap-1.5">
                    <Compass className="w-4 h-4" />
                    クエストを選択する
                  </h3>
                  <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                    {STAGES.map(stage => (
                      <div
                        key={stage.id}
                        id={`stage-card-${stage.id}`}
                        onClick={() => startStage(stage)}
                        className="bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-slate-600 rounded-2xl p-4 transition-all duration-200 cursor-pointer flex justify-between items-center"
                      >
                        <div className="flex-1 pr-4">
                          <div className="flex items-center gap-2 mb-1.5">
                            {stage.tutorial && (
                              <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-400 text-[9px] font-bold rounded border border-amber-500/30">
                                チュートリアル
                              </span>
                            )}
                            <span className="text-[10px] text-slate-400 font-semibold">{stage.theme}</span>
                          </div>
                          <h4 className="font-bold text-slate-100 text-sm mb-1">{stage.name}</h4>
                          <p className="text-xs text-slate-400 line-clamp-1">{stage.situation}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-500 flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* 図鑑・戻るボタン等のフッターアクション */}
                <div className="flex gap-3">
                  <button
                    id="btn-open-book"
                    onClick={() => setShowBook(true)}
                    className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-bold text-slate-200 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" />
                    救命・災害対策図鑑
                  </button>
                </div>
              </motion.div>
            )}

            {/* ----------------------------------
                3. バトル前演出（シナリオ導入）
               ---------------------------------- */}
            {screen === "intro" && selectedStage && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="flex-1 flex flex-col justify-between p-6"
              >
                {/* 戻るボタン */}
                <div className="flex justify-start">
                  <button
                    id="btn-intro-back"
                    onClick={() => setScreen("map")}
                    className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 bg-slate-800 hover:bg-slate-750 border border-slate-700/50 px-3 py-1.5 rounded-xl cursor-pointer transition-all active:scale-95"
                  >
                    ← 戻る
                  </button>
                </div>

                <div className="space-y-6 my-auto text-center">
                  <div className="inline-block px-3 py-1 bg-sky-500/20 text-sky-400 text-xs font-bold rounded-full border border-sky-500/30">
                    {selectedStage.theme}
                  </div>
                  <h2 className="text-2xl font-bold text-slate-100">{selectedStage.name}</h2>
                  
                  <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 text-left text-sm leading-relaxed text-slate-300 shadow-inner">
                    {selectedStage.situation}
                  </div>
                </div>

                <button
                  id="btn-start-battle"
                  onClick={() => setScreen("battle")}
                  className="w-full py-4 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 text-base cursor-pointer"
                >
                  救護を開始する
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* ----------------------------------
                4. バトル画面（救護ミッション）
               ---------------------------------- */}
            {screen === "battle" && selectedStage && (
              <motion.div
                key="battle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col min-h-0"
              >
                {/* 戻るボタン付きヘッダー */}
                <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex justify-between items-center flex-shrink-0 z-20">
                  <button
                    id="btn-battle-back"
                    onClick={() => {
                      setScreen("map");
                    }}
                    className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 bg-slate-800 hover:bg-slate-750 border border-slate-700/50 px-2.5 py-1 rounded-xl cursor-pointer transition-all active:scale-95"
                  >
                    ← 中断して戻る
                  </button>
                  <span className="text-xs font-bold text-slate-400 truncate max-w-[150px]">
                    {selectedStage.name}
                  </span>
                </div>

                {/* 上部ステータス領域 */}
                <div className="p-4 bg-slate-850 border-b border-slate-800 space-y-3">
                  {/* 残り行動回数とバイタル */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Clock className="w-4 h-4 text-sky-400" />
                      <span>残り猶予: <strong className="text-sky-400 font-mono text-sm">{timeLimit}</strong> 手</span>
                    </div>
                    
                    {/* バイタル5段階表示 */}
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4 text-rose-500" />
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(v => (
                          <div
                            key={v}
                            className={`w-4 h-5 rounded-sm transition-all duration-300 ${
                              v <= vital
                                ? vital <= 2
                                  ? "bg-rose-500 shadow-sm shadow-rose-500/50"
                                  : "bg-emerald-500 shadow-sm shadow-emerald-500/50"
                                : "bg-slate-700"
                            }`}
                          ></div>
                        ))}
                      </div>
                      <span className="text-xs text-slate-400 ml-1">容体: {vital}/5</span>
                    </div>
                  </div>

                  {/* 視覚的バイタルUI (簡易心拍波形 & 酸素ゲージ) */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="bg-slate-900 rounded-lg p-2 border border-slate-800 flex flex-col justify-between h-14">
                      <span className="text-[9px] text-slate-500 font-semibold uppercase">簡易心拍波形</span>
                      <div className="h-6 flex items-end justify-center overflow-hidden">
                        <svg className="w-full h-full stroke-emerald-400 fill-none" viewBox="0 0 100 20">
                          <path 
                            d={vital <= 2 
                              ? "M 0 10 L 20 10 L 25 15 L 30 5 L 35 10 L 70 10 L 75 15 L 80 5 L 85 10 L 100 10" 
                              : "M 0 10 L 10 10 L 13 15 L 16 2 L 19 18 L 22 10 L 40 10 L 43 15 L 46 2 L 49 18 L 52 10 L 70 10 L 73 15 L 76 2 L 79 18 L 82 10 L 100 10"
                            } 
                            strokeWidth="1.5" 
                            className={vital <= 2 ? "animate-[pulse_1s_infinite]" : "animate-[pulse_0.6s_infinite]"}
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="bg-slate-900 rounded-lg p-2 border border-slate-800 flex flex-col justify-between h-14">
                      <span className="text-[9px] text-slate-500 font-semibold uppercase">酸素・呼吸インジケーター</span>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${
                            vital <= 2 ? "bg-rose-500" : "bg-emerald-500"
                          }`}
                          style={{ width: `${(vital / 5) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-[9px] text-right text-slate-400">
                        {vital >= 4 ? "呼吸状態: 安定" : (vital >= 2 ? "呼吸状態: 注意" : "呼吸状態: 重篤")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 中央 状況ビジュアル・メッセージ演出領域 */}
                <div className="flex-1 bg-slate-950 p-4 flex flex-col justify-between min-h-0">
                  
                  {/* 傷病者の状況描写 */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs space-y-2 relative">
                    <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>現在のフェーズ</span>
                    </div>
                    <p className="text-slate-200 leading-relaxed text-sm">
                      {selectedStage.steps[currentStepIndex]?.prompt || "適切な処置が進行しています。"}
                    </p>

                    {/* 特殊NPCの召喚中演出 */}
                    {specialNpc && (
                      <div className="absolute top-2 right-2 flex items-center gap-1 bg-indigo-950/80 border border-indigo-500/30 px-2 py-0.5 rounded-full text-[9px] font-bold text-indigo-300">
                        {specialNpc === "soldier" ? <Shield className="w-3 h-3 text-sky-400" /> : <Sparkles className="w-3 h-3 text-amber-400" />}
                        <span>{specialNpc === "soldier" ? "兵士同伴中" : "魔導士支援済"}</span>
                      </div>
                    )}
                  </div>

                  {/* ログエリア */}
                  <div className="flex-1 my-3 bg-slate-900/40 border border-slate-800/60 rounded-2xl p-3 overflow-y-auto space-y-2 font-mono text-[11px] leading-relaxed select-text">
                    {battleLog.map((log, idx) => (
                      <div 
                        key={idx} 
                        className={`border-l-2 pl-2 ${
                          log.includes("正しい") || log.includes("良くなった")
                            ? "border-emerald-500 text-emerald-400"
                            : log.includes("不適切") || log.includes("悪化した")
                            ? "border-rose-500 text-rose-400"
                            : log.includes("特殊")
                            ? "border-indigo-500 text-indigo-400"
                            : "border-slate-600 text-slate-300"
                        }`}
                      >
                        {log}
                      </div>
                    ))}
                  </div>

                  {/* ヒント機能（長押し説明への誘導） */}
                  <div className="flex justify-between items-center text-[10px] text-slate-500 px-1">
                    <span>※アイテムの長押しで現実の対応知識（AEDなど）を確認できます。</span>
                    <button 
                      onClick={() => setActiveHint(selectedStage.steps[currentStepIndex]?.hint || "ヒント情報がありません。")}
                      className="text-sky-400 hover:underline flex items-center gap-0.5 cursor-pointer font-bold"
                    >
                      <HelpCircle className="w-3 h-3" />
                      救護ヒント
                    </button>
                  </div>
                </div>

                {/* 下部 操作・コマンド領域 */}
                <div className="p-4 bg-slate-900 border-t border-slate-800 space-y-4">
                  {/* 特殊魔道具（アイテム）ショートカット */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase block">
                      所持魔道具（長押しで現実の対応知識を閲覧可能）
                    </span>
                    <div className="grid grid-cols-4 gap-2">
                      {Object.values(ITEMS).map(item => {
                        const isUnlocked = selectedStage.id >= 1 || stageAllowsItem(selectedStage.id, item.id);
                        const qty = item.isConsumable ? (inventory[item.id] || 0) : null;
                        
                        return (
                          <div
                            key={item.id}
                            className="relative"
                            onTouchStart={() => setHoveredItem(item)}
                            onTouchEnd={() => setHoveredItem(null)}
                            onMouseDown={() => setHoveredItem(item)}
                            onMouseUp={() => setHoveredItem(null)}
                            onMouseLeave={() => setHoveredItem(null)}
                          >
                            <button
                              id={`item-use-${item.id}`}
                              disabled={!isUnlocked || (item.isConsumable && (qty ?? 0) <= 0)}
                              onClick={() => useInventoryItem(item.id)}
                              className={`w-full py-2.5 rounded-xl border flex flex-col items-center justify-center transition-all ${
                                isUnlocked 
                                  ? (item.isConsumable && (qty ?? 0) <= 0) 
                                    ? "bg-slate-800 border-slate-800 opacity-40 cursor-not-allowed"
                                    : "bg-slate-800 border-slate-750 hover:bg-slate-750 hover:border-slate-650 cursor-pointer active:scale-95"
                                  : "bg-slate-950 border-slate-950 opacity-20 cursor-not-allowed"
                              }`}
                            >
                              <span className="text-[10px] font-bold text-slate-200 block truncate max-w-full px-1">
                                {item.name.replace("古代の", "").replace("エルフの", "").replace("風除けの", "")}
                              </span>
                              {qty !== null && (
                                <span className="text-[9px] text-slate-400 mt-0.5">({qty})</span>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 選択肢コマンド */}
                  <div className="space-y-2">
                    <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase block">
                      行動コマンドの選択
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedStage.steps[currentStepIndex]?.choices.map((choice, index) => (
                        <button
                          key={index}
                          id={`btn-command-${index}`}
                          onClick={() => executeAction(choice)}
                          className="py-2.5 px-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-slate-600 active:bg-slate-700 text-[11px] font-bold rounded-xl text-slate-100 transition-all text-center cursor-pointer flex items-center justify-center min-h-[54px] leading-tight whitespace-normal break-words"
                        >
                          {choice}
                        </button>
                      )) || (
                        <div className="col-span-2 text-center text-xs text-slate-500 py-3">
                          適切なコマンドはありません。アイテムなどを使用するか、救急ギルドの到着を待ちましょう。
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 長押しした際の情報ポップアップ（現実の対応知識） */}
                {hoveredItem && (
                  <div className="absolute inset-0 bg-slate-950/90 z-50 flex items-center justify-center p-6 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-700 rounded-3xl p-5 w-full max-w-xs space-y-4 shadow-2xl">
                      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                        <HelpCircle className="w-5 h-5 text-sky-400" />
                        <div>
                          <h4 className="text-sm font-bold text-slate-100">{hoveredItem.name}</h4>
                          <span className="text-[10px] text-slate-400 font-semibold">{hoveredItem.realName}</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {hoveredItem.realDescription}
                      </p>
                      <div className="text-[10px] text-slate-500 italic text-center pt-2">
                        （画面から指を離すと戻ります）
                      </div>
                    </div>
                  </div>
                )}

                {/* 救護ヒント ポップアップ */}
                {activeHint && (
                  <div className="absolute inset-0 bg-slate-950/90 z-50 flex items-center justify-center p-6 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-xs space-y-4 shadow-2xl">
                      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                        <HelpCircle className="w-5 h-5 text-sky-400" />
                        <div>
                          <h4 className="text-sm font-bold text-slate-100">救護の秘訣</h4>
                        </div>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {activeHint}
                      </p>
                      <button
                        id="btn-close-hint"
                        onClick={() => setActiveHint(null)}
                        className="w-full py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                      >
                        了解
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ----------------------------------
                5. リザルト画面
               ---------------------------------- */}
            {screen === "result" && selectedStage && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="flex-1 flex flex-col justify-between p-6 text-center"
              >
                <div className="space-y-6 my-auto">
                  {battleResult === "success" ? (
                    <>
                      <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/30 mx-auto mb-4">
                        <CheckCircle className="w-12 h-12 text-emerald-400" />
                      </div>
                      <h2 className="text-2xl font-bold text-emerald-400">救護成功！</h2>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        あなたの適切な判断と迅速な応急救護により、傷病者の命は救われ、無事に医療ギルドの専門医へ引き継がれました！
                      </p>

                      {/* 報酬等獲得 */}
                      <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 max-w-xs mx-auto space-y-3 text-left">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">クリア報酬</span>
                        <div className="flex justify-between items-center text-sm border-b border-slate-700 pb-2">
                          <span className="text-slate-300">ギルドコイン</span>
                          <span className="font-bold text-amber-400 flex items-center gap-1">
                            <Coins className="w-4 h-4" />
                            +{Math.min(7, 3 + Math.max(0, vital - 3) + (timeLimit > 5 ? 2 : (timeLimit > 2 ? 1 : 0)))} G
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-300">獲得経験値</span>
                          <span className="font-bold text-sky-400">
                            +{30 + Math.max(0, vital - 3) * 5 + (timeLimit > 5 ? 10 : (timeLimit > 2 ? 5 : 0))} EXP
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-20 h-20 bg-rose-500/20 rounded-full flex items-center justify-center border border-rose-500/30 mx-auto mb-4">
                        <XCircle className="w-12 h-12 text-rose-400" />
                      </div>
                      <h2 className="text-2xl font-bold text-rose-400">救護失敗…</h2>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        タイムリミットが尽きるか、不適切な処置が重なり容体が極度に悪化してしまいました。もう一度正しい手順を確認してみましょう。
                      </p>
                    </>
                  )}
                </div>

                <button
                  id="btn-return-map"
                  onClick={() => setScreen("map")}
                  className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold rounded-2xl border border-slate-700 flex items-center justify-center gap-2 cursor-pointer"
                >
                  ステージ選択に戻る
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* ----------------------------------
            図鑑（アーカイブ）モーダル
           ---------------------------------- */}
        <AnimatePresence>
          {showBook && (
            <motion.div
              key="book"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/95 z-50 flex flex-col p-6 overflow-hidden"
            >
              <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-sky-400" />
                  <h3 className="font-bold text-slate-100 text-base">救命・災害対策図鑑</h3>
                </div>
                <button
                  id="btn-close-book"
                  onClick={() => setShowBook(false)}
                  className="text-slate-400 hover:text-slate-200 text-xs font-bold px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg cursor-pointer"
                >
                  閉じる
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-6 pr-1 text-xs">
                {Object.values(ITEMS).map(item => (
                  <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
                    <div className="flex justify-between items-start border-b border-slate-800 pb-1.5">
                      <span className="font-bold text-slate-200 text-sm">{item.name}</span>
                      <span className="text-[10px] text-sky-400 font-semibold">{item.realName}</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      {item.realDescription}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

// 補助：特定のステージでアイテムが解放されているか
function stageAllowsItem(stageId: number, itemId: string): boolean {
  // チュートリアルでは特定のアイテムのみ、または制限
  if (stageId === 0) return false; 
  return true;
}
