const app = document.querySelector("#app");
const copyInput = document.querySelector("#copy-input");
const exampleButtons = document.querySelectorAll(".example-button");
const checkButton = document.querySelector("#check-button");
const inputMessage = document.querySelector("#input-message");
const resultCard = document.querySelector("#result-card");
const resultScore = document.querySelector("#result-score");
const resultTag = document.querySelector("#result-tag");
const roastTitle = document.querySelector("#roast-title");
const problemList = document.querySelector("#problem-list");
const suggestionList = document.querySelector("#suggestion-list");
const rewriteText = document.querySelector("#rewrite-text");
const resetButton = document.querySelector("#reset-button");
const copyResultButton = document.querySelector("#copy-result-button");
const copyMessage = document.querySelector("#copy-message");
const feedbackToggleButton = document.querySelector("#feedback-toggle-button");
const feedbackForm = document.querySelector("#feedback-form");
const feedbackMessage = document.querySelector("#feedback-message");
const heroCard = document.querySelector(".hero-card");
const viewFeedbackButton = document.querySelector("#view-feedback-button");
const feedbackDashboard = document.querySelector("#feedback-dashboard");
const backToCheckerButton = document.querySelector("#back-to-checker-button");
const totalFeedbackCount = document.querySelector("#total-feedback-count");
const feedbackStatsGrid = document.querySelector("#feedback-stats-grid");
const feedbackList = document.querySelector("#feedback-list");

let currentResult = null;
let currentInputText = "";
const feedbackStorageKey = "humanTalkChecker.feedback";
const externalFeedbackUrl = "https://docs.qq.com/form/page/DRkFDUXdSeW1YaEJ0";
const statGroups = [
  {
    title: "结果准不准",
    key: "accuracy",
    options: ["很准", "一般", "不准"]
  },
  {
    title: "毒舌程度",
    key: "roastLevel",
    options: ["太温柔了", "刚好", "太毒舌了"]
  },
  {
    title: "人话急救包是否有用",
    key: "suggestionUsefulness",
    options: ["有用", "一般", "没用"]
  },
  {
    title: "是否愿意分享",
    key: "shareWillingness",
    options: ["愿意", "不愿意"]
  }
];

const clicheWords = [
  "赋能",
  "打造",
  "助力",
  "提升",
  "落地",
  "闭环",
  "抓手",
  "生态",
  "矩阵",
  "沉淀",
  "深耕",
  "链接",
  "价值",
  "维度",
  "颗粒度"
];

const abstractWords = [
  "战略",
  "体系",
  "能力",
  "机制",
  "路径",
  "方案",
  "认知",
  "效率",
  "模式",
  "场景",
  "需求",
  "资源",
  "体验",
  "协同",
  "增长",
  "技术",
  "发展",
  "方式",
  "变革",
  "综合",
  "平台",
  "赋能"
];

const concreteWords = ["我", "我们", "今天", "刚才", "因为", "所以", "但是", "具体", "比如"];
const firstPersonWords = ["我", "我们"];
const concreteDetailWords = [
  "今天",
  "刚才",
  "昨天",
  "明天",
  "这件事",
  "朋友",
  "同学",
  "老师",
  "我妈",
  "室友",
  "上午",
  "下午",
  "晚上",
  "比如",
  "因为",
  "但是",
  "累",
  "开心",
  "烦",
  "崩溃",
  "喜欢",
  "讨厌"
];
const aiPhrases = [
  "综上所述",
  "总而言之",
  "在当今社会",
  "随着时代的发展",
  "不可忽视的是",
  "正在深刻改变",
  "我们应当",
  "积极拥抱",
  "技术变革",
  "综合能力",
  "具有重要意义",
  "不断提升",
  "未来发展",
  "时代背景下",
  "赋予了新的可能",
  "提供了有力支撑",
  "高质量发展",
  "落地见效",
  "凝聚共识",
  "压实责任"
];
const aiPatterns = [/随着.+不断发展/, /推动.+发展/];
const officialeseWords = [
  "统一思想",
  "凝聚共识",
  "压实责任",
  "更高标准",
  "更实举措",
  "推动各项工作",
  "落地见效",
  "高质量发展",
  "新局面",
  "工作部署",
  "精准发力",
  "狠抓落实",
  "统筹推进",
  "久久为功",
  "形成合力",
  "提质增效"
];
const vagueInspirationalWords = ["生活", "赶路", "感受", "风景", "平凡", "日子", "属于自己", "光", "愿我们"];
const promoHypeWords = ["夸张", "方法", "状态", "不一样", "姐妹们", "一定要试试", "谁用谁知道", "真的不是"];
const shortNaturalWords = ["我", "今天", "真的", "服了", "累", "难用", "好烦", "崩溃", "无语", "开心", "喜欢", "讨厌", "想", "怎么"];
const exampleTexts = {
  朋友圈文案:
    "最近真的越来越觉得，生活不是为了赶路，而是为了感受路上的风景。愿我们都能在平凡的日子里，找到属于自己的光。",
  简历自我介绍:
    "本人具备良好的沟通能力和团队协作精神，能够快速适应不同工作环境，具有较强的学习能力和责任心，希望在贵公司平台中不断提升自我价值。",
  AI生成文:
    "随着人工智能技术的不断发展，AI 正在深刻改变我们的学习、工作和生活方式。我们应当积极拥抱技术变革，提升自身综合能力。",
  领导发言:
    "我们要进一步统一思想、凝聚共识、压实责任，以更高标准、更实举措推动各项工作落地见效，形成高质量发展新局面。",
  小红书文案: "真的不是我夸张，这个方法我用了之后整个人状态都不一样了！姐妹们一定要试试，谁用谁知道！"
};

const resultCopy = [
  {
    min: 80,
    tag: "人话大师型",
    variants: [
      {
        roastTitle: "这段话还真像人说的，AI 看了都得问一句：你怎么做到的？",
        problems: ["人味挺足，没有一开口就把 PPT 叫醒。", "信息有落点，读者不用开脑补模式。", "语气自然，像朋友说话，不像系统通知。"],
        suggestions: ["保持这种直说，别突然想不开去追求高级感。", "最有态度的那句可以放前面，截图更抓人。", "再补一个具体场景，就更有画面了。"],
        rewrite: "“这段话已经挺自然了，别过度包装，把最想说的重点提前就行。”"
      },
      {
        roastTitle: "还行，像人说的，不像 PPT 自己从硬盘里长出来的。",
        problems: ["套话含量低，读起来没有被格式化。", "句子有正常呼吸，不是一路踩油门。", "意思清楚，没让读者在词海里漂流。"],
        suggestions: ["继续少用大词，多留点日常感。", "把重点句压短一点，传播起来更利落。", "别为了显得成熟，把好好的句子写老了。"],
        rewrite: "“简单说，这段话基本不用大修，删一点尾巴，保留重点就很好。”"
      },
      {
        roastTitle: "这段话至少还有人在场，不是 AI 和 KPI 的双人舞。",
        problems: ["表达有真实语气，不像批量生产。", "具体信息够用，读者能接住。", "没有疯狂堆概念，算是保住了人话户口。"],
        suggestions: ["可以再加一点个人判断，别太客气。", "如果要发出去，第一句最好更有钩子。", "保留现在的自然感，别回头补一堆官话。"],
        rewrite: "“这段话已经能让人看懂，也能感觉到是谁在说，再加一点具体细节会更稳。”"
      },
      {
        roastTitle: "这段话挺会聊天的，属于发出去不会让人想点退出。",
        problems: ["语气顺，不像在背模板。", "句子没有硬凹高级，读起来比较轻松。", "意思集中，没有东拉西扯。"],
        suggestions: ["继续把话说白，别迷信复杂句。", "有趣的地方可以稍微放大一点。", "最后一句可以更干脆，别让好内容拖尾。"],
        rewrite: "“这段话可以更短一点，但方向是对的：直接、清楚、有点自己的语气。”"
      },
      {
        roastTitle: "这文案的人味浓度达标，建议直接保留，不用送去套话工厂返修。",
        problems: ["没有明显 AI 腔，读起来不端着。", "重点比较明确，没有把话说成雾。", "情绪和信息都在，不是空喊口号。"],
        suggestions: ["如果想更炸，可以加一个具体反差。", "少改大结构，主要修一下节奏。", "让第一眼看到的人马上知道你在说啥。"],
        rewrite: "“这段话已经挺像人话了，稍微压缩一下，会更适合传播。”"
      }
    ]
  },
  {
    min: 60,
    tag: "基本会说人话型",
    variants: [
      {
        roastTitle: "有点东西，但不多；像人说的，只是偶尔想升职。",
        problems: ["大意能懂，但有几句开始端起来了。", "具体内容有，记忆点还差一点。", "有些词看着很稳，其实没多大信息量。"],
        suggestions: ["少说“能力提升”，多说你到底做了啥。", "把最关键的一句提前，别让读者找线索。", "删掉一两个装成熟的词，马上年轻十岁。"],
        rewrite: "“这段话能用，但可以更直接：先讲具体事，再讲你的想法。”"
      },
      {
        roastTitle: "领导看了能懂，同学看了也不至于沉默，算是卡在中间。",
        problems: ["不是废话，但有一点汇报味。", "内容有方向，画面感还不够。", "语气偏安全，少了点真实反应。"],
        suggestions: ["别只说方向，讲一个具体例子。", "把“比较重要”换成“为什么重要”。", "语气可以松一点，没人要求句子穿正装。"],
        rewrite: "“说白了，这段话差一点具体感，补上发生了什么就会更像人说的。”"
      },
      {
        roastTitle: "这段话还行，像刚从模板里逃出来，还没完全自由。",
        problems: ["能看懂，但有些句子像标准答案。", "抽象词没有爆炸，但已经开始排队。", "读完知道你想表达，但不太记得细节。"],
        suggestions: ["把万能句删一点，留只有这件事才有的内容。", "少说“价值”，多说“对谁有用”。", "每句话尽量只办一件事，别一口气开三场会。"],
        rewrite: "“这段话可以更像聊天：说清楚对象、事情、结果，别把每句都写成总结。”"
      },
      {
        roastTitle: "这不是灾难现场，但也不是热评区爆款，还能再抢救一下。",
        problems: ["表达稳定，不过不够有梗。", "重点有点藏，读者得多看一眼。", "语气偏规矩，少了一点个人存在感。"],
        suggestions: ["把最想吐槽或最想强调的点拎出来。", "用短句替换长铺垫，别让句子跑马拉松。", "加一点真实情绪，别全程礼貌微笑。"],
        rewrite: "“这段话需要少一点铺垫，多一点重点，让人第一眼知道你在讲什么。”"
      },
      {
        roastTitle: "这段话像人话的精装修版，还不错，就是有点怕被老师挑错。",
        problems: ["用词比较稳，但稳得略保守。", "具体信息够一点，还能再加料。", "表达不差，只是少了点让人停下来的句子。"],
        suggestions: ["别每句都追求正确，偶尔要有态度。", "把抽象结论换成一个场景。", "删掉空泛修饰，内容会更有劲。"],
        rewrite: "“这段话基本能过，但想让人记住，就得多一点具体场景和真实态度。”"
      }
    ]
  },
  {
    min: 40,
    tag: "轻微套话型",
    variants: [
      {
        roastTitle: "这段话像被“高级感”三个字按进榨汁机，出来有点糊。",
        problems: ["词看着挺满，信息却不够硬。", "有些句子像哪里都能用，放这儿就不够贴。", "人味还在，但已经被套话挤到角落了。"],
        suggestions: ["少说“赋能提升”，多说你到底干了啥。", "删掉能套在任何文案里的万能句。", "补一个具体事件，比三个抽象词都管用。"],
        rewrite: "“别急着显高级，先把具体事情讲清楚，再决定要不要修饰。”"
      },
      {
        roastTitle: "这段话有点像简历模板在努力装朋友聊天。",
        problems: ["表达太泛，像复制到哪都不违和。", "关键词不少，但真正能记住的少。", "语气比较端，像在给自己写评语。"],
        suggestions: ["把“能力强”换成“做过什么”。", "别只写优点，写一个具体表现。", "少用万能形容词，多给读者一点证据。"],
        rewrite: "“简单说，用具体经历替代自我表扬，这段话会立刻可信很多。”"
      },
      {
        roastTitle: "每个字都认识，连起来有点像在参加无效培训。",
        problems: ["句子有点满，读起来不够轻松。", "抽象词占位太多，具体画面不足。", "有一些正确废话，听着对，但没留下东西。"],
        suggestions: ["一句话只讲一个重点，别塞满。", "把“方向正确”的话换成“具体怎么做”。", "遇到大词先问：能不能举例？不能就删。"],
        rewrite: "“这段话要少一点概念，多一点事情本身，读者才不会迷路。”"
      },
      {
        roastTitle: "这段文字已经在套话边缘试探，再往前一步就要进会议室了。",
        problems: ["人话还在，但被正式语气盖住了。", "内容有意思，只是外面套了一层塑封膜。", "有些表达像为了显得稳，结果显得虚。"],
        suggestions: ["先把话说成聊天版，再挑需要保留的正式词。", "少写“持续推进”，多写“下一步做什么”。", "保留一点个人语气，别把自己从文案里删掉。"],
        rewrite: "“把这段话松一松，留下具体动作和真实态度，就会自然很多。”"
      },
      {
        roastTitle: "这不是文案，这是 KPI 在小声说话，还没完全失控。",
        problems: ["目标感太强，真实感偏弱。", "有些句子像为了完成任务而存在。", "读者能懂，但不一定想继续看。"],
        suggestions: ["把任务话术翻译成人话。", "不要只说结果好，讲清楚哪里好。", "加一点具体对象，别让内容漂在空中。"],
        rewrite: "“这段话要从‘我要表现得专业’改成‘我要让别人听懂’。”"
      }
    ]
  },
  {
    min: 20,
    tag: "AI味过重型",
    variants: [
      {
        roastTitle: "AI 看了都想申请工伤：这段太像刚从生成按钮里热乎出炉的。",
        problems: ["句子太完整，完整到不像人临时说的。", "概念一层套一层，具体事情没露面。", "语气很端，像在给空气做说明书。"],
        suggestions: ["先删开头铺垫，别一上来就时代发展。", "少说“积极拥抱”，多说你准备怎么用。", "把一句大话拆成两句人话。"],
        rewrite: "“直接说发生了什么、你怎么看、下一步怎么做，别先铺三层地毯。”"
      },
      {
        roastTitle: "这段话 AI 味冲得像刚出锅，建议先开窗通风。",
        problems: ["表达太顺滑，顺滑到没有生活摩擦。", "正向词很多，但真实信息不多。", "读完像懂了，又像什么都没抓住。"],
        suggestions: ["把“深刻改变”换成一个具体变化。", "不要堆正确词，讲一个真实场景。", "加一点人的反应，比如困惑、担心、想法。"],
        rewrite: "“这段话可以先说一个具体例子，再讲它为什么重要。”"
      },
      {
        roastTitle: "这段文字像 AI 写完自己点了个赞，人类读者还在加载中。",
        problems: ["句式太规整，像自动排版出来的。", "抽象词密度偏高，画面感偏低。", "没有明显个人语气，像模板在营业。"],
        suggestions: ["少写“综合能力”，多写哪种能力。", "把宏大结论压成普通句子。", "别让每句话都像作文结尾。"],
        rewrite: "“把大词翻译成具体事，这段话就不会这么像自动生成了。”"
      },
      {
        roastTitle: "这不是文案，这是模型在努力证明自己上过班。",
        problems: ["看起来很正确，但缺少真实落点。", "句子在讲趋势，却没讲人和事。", "读者容易点头，但很难产生共鸣。"],
        suggestions: ["把趋势换成你观察到的一件事。", "少用宏大判断，多用具体感受。", "让句子有一点不完美，反而更像人。"],
        rewrite: "“别急着总结世界，先讲你看到的一个变化。”"
      },
      {
        roastTitle: "这段话已经不想说人话了，它想去当提示词。",
        problems: ["表达太模板化，像关键词拼装。", "有信息，但被套话包得太厚。", "语气没有起伏，读起来像匀速播放。"],
        suggestions: ["删掉最像模板的那一句。", "每段只保留一个核心意思。", "把“应该如何”改成“我会怎么做”。"],
        rewrite: "“这段话需要从模板模式切回聊天模式，先把具体意思说出来。”"
      }
    ]
  },
  {
    min: 0,
    tag: "领导废话型",
    variants: [
      {
        roastTitle: "这段话一看就是开会开出来的，椅子都听累了。",
        problems: ["官话太密，重点被压到看不见。", "听起来很有部署，其实没说清谁干啥。", "全是方向感，缺少具体动作。"],
        suggestions: ["少说“凝聚共识”，先说现在要解决什么。", "把“狠抓落实”翻译成具体安排。", "一句话里别塞三个口号，读者会掉线。"],
        rewrite: "“先讲问题，再讲谁负责做什么，最后讲什么时候看到结果。”"
      },
      {
        roastTitle: "领导看了点头，同学看了沉默，空气看了都想请假。",
        problems: ["每个词都很正式，但组合起来很空。", "读完感觉很忙，却不知道忙哪件事。", "没有具体人物、时间和结果。"],
        suggestions: ["把口号拆成任务。", "把“推动发展”换成“具体推进哪一步”。", "别让句子只负责响亮，不负责有用。"],
        rewrite: "“说清楚这件事谁来做、做什么、怎么判断做成了。”"
      },
      {
        roastTitle: "这段不是文案，是会议纪要在练腹肌，核心很用力但看不见。",
        problems: ["抽象词连续出现，读者很难抓重点。", "句子像在表态，不像在沟通。", "内容没有落到具体场景。"],
        suggestions: ["删掉一半口号，意思不会少。", "用一个具体结果替代一串漂亮词。", "把“形成合力”改成谁和谁怎么配合。"],
        rewrite: "“别只说要推进，讲清楚推进哪件事、由谁推进、推进到什么程度。”"
      },
      {
        roastTitle: "这段话已经不是不像人话，是在给空气安排年度重点工作。",
        problems: ["包装太厚，真实意思被埋住。", "正确词很多，有效信息很少。", "像公告，不像人和人之间说话。"],
        suggestions: ["先把所有宏大词删一轮。", "每句话都问：这句能不能执行？不能就改。", "少讲局面，多讲下一步。"],
        rewrite: "“把这段改成任务清单：现在有什么问题，下一步做什么，谁来负责。”"
      },
      {
        roastTitle: "读完感觉被格式化了一遍，脑子里只剩‘落实’两个字在回响。",
        problems: ["词很熟，意思很散。", "语气像动员会，缺少真实对象。", "没有具体结果，只有看起来很努力的姿态。"],
        suggestions: ["少写“高质量发展”，多写发展到哪一步。", "别只喊标准高，讲标准是什么。", "把“新局面”换成可见的变化。"],
        rewrite: "“这段话需要落地：具体目标是什么，怎么做，什么时候算完成。”"
      }
    ]
  }
];

if (app) {
  app.dataset.ready = "true";
}

function initializeViewState() {
  heroCard?.removeAttribute("hidden");
  resultCard?.setAttribute("hidden", "");
  feedbackForm?.setAttribute("hidden", "");
  feedbackDashboard?.setAttribute("hidden", "");
  feedbackDashboard?.classList.remove("is-visible");
  viewFeedbackButton?.setAttribute("hidden", "");
  feedbackToggleButton?.removeAttribute("hidden");

  if (inputMessage) {
    inputMessage.textContent = "";
  }

  if (copyMessage) {
    copyMessage.textContent = "";
  }

  if (feedbackMessage) {
    feedbackMessage.textContent = "";
  }
}

exampleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const exampleName = button.dataset.example;

    if (!copyInput || !exampleName || !exampleTexts[exampleName]) {
      return;
    }

    copyInput.value = exampleTexts[exampleName];
    resultCard?.setAttribute("hidden", "");

    if (inputMessage) {
      inputMessage.textContent = "";
    }

    copyInput.focus();
  });
});

function countMatches(text, words) {
  return words.reduce((total, word) => total + (text.includes(word) ? 1 : 0), 0);
}

function countPatternMatches(text, patterns) {
  return patterns.reduce((total, pattern) => total + (pattern.test(text) ? 1 : 0), 0);
}

function clamp(number, min, max) {
  return Math.max(min, Math.min(max, number));
}

function stableNoise(text) {
  let hash = 0;
  const bucket = Math.floor(Date.now() / (1000 * 60 * 30));
  const source = `${text.trim()}-${bucket}`;

  for (let index = 0; index < source.length; index += 1) {
    hash = (hash * 31 + source.charCodeAt(index)) | 0;
  }

  return Math.abs(hash) % 5;
}

function splitSentences(text) {
  return text
    .split(/[。！？!?；;\n]+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function calculateShortTextScore(text, length, noise) {
  const clicheCount = countMatches(text, clicheWords);
  const officialeseCount = countMatches(text, officialeseWords);
  const aiPhraseCount = countMatches(text, aiPhrases) + countPatternMatches(text, aiPatterns);
  const abstractCount = countMatches(text, abstractWords);
  const concreteDetailCount = countMatches(text, concreteDetailWords);
  const shortNaturalCount = countMatches(text, shortNaturalWords);
  const hasQuestionOrExclamation = /[？！?!]/.test(text);
  const badSignalCount = clicheCount + officialeseCount * 2 + aiPhraseCount * 2 + abstractCount;

  let score = 68 + Math.min(shortNaturalCount * 6, 18) + (hasQuestionOrExclamation ? 4 : 0) + noise - 2;

  score -= clicheCount * 16;
  score -= officialeseCount * 18;
  score -= aiPhraseCount * 14;
  score -= abstractCount * 6;

  if (concreteDetailCount === 0 && shortNaturalCount === 0) {
    score -= 12;
  }

  if (badSignalCount >= 3) {
    score = Math.min(score, 32 + noise);
  } else if (badSignalCount >= 2) {
    score = Math.min(score, 45 + noise);
  }

  if (shortNaturalCount >= 2 && badSignalCount === 0) {
    score = Math.max(score, 72 + noise);
  }

  if (length <= 4) {
    score = clamp(score, 35, 82);
  }

  return clamp(Math.round(score), 12, 88);
}

function calculateHumanScore(text) {
  const compactText = text.replace(/\s/g, "");
  const length = compactText.length;
  const noise = stableNoise(text);

  if (length < 20) {
    return calculateShortTextScore(text, length, noise);
  }

  const sentences = splitSentences(text);
  const punctuationCount = (text.match(/[，。！？、；：,.!?;:]/g) || []).length;
  const clicheCount = countMatches(text, clicheWords);
  const abstractCount = countMatches(text, abstractWords);
  const concreteCount = countMatches(text, concreteWords);
  const concreteDetailCount = countMatches(text, concreteDetailWords);
  const firstPersonCount = countMatches(text, firstPersonWords);
  const aiPhraseCount = countMatches(text, aiPhrases) + countPatternMatches(text, aiPatterns);
  const officialeseCount = countMatches(text, officialeseWords);
  const vagueInspirationalCount = countMatches(text, vagueInspirationalWords);
  const promoHypeCount = countMatches(text, promoHypeWords);
  const averageSentenceLength = sentences.length ? length / sentences.length : length;
  const punctuationRatio = length ? punctuationCount / length : 0;
  const abstractDensity = length ? abstractCount / Math.max(length / 20, 1) : 0;
  const aiSignalCount = aiPhraseCount + clicheCount + officialeseCount;
  const naturalBonus = aiSignalCount >= 2 ? Math.min(concreteCount, 3) : Math.min(concreteCount * 2, 7);
  const badSignalCount = clicheCount + abstractCount + aiPhraseCount * 2 + officialeseCount * 2;

  let score = 90 + naturalBonus;

  score -= clicheCount * 7;
  score -= abstractCount * 4;
  score -= aiPhraseCount * 15;
  score -= officialeseCount * 9;
  score -= vagueInspirationalCount * 3;
  score -= promoHypeCount * 3;

  if (officialeseCount >= 5) {
    score -= 24;
  } else if (officialeseCount >= 3) {
    score -= 16;
  }

  if (abstractCount >= 6) {
    score -= 20;
  } else if (abstractCount >= 4) {
    score -= 12;
  }

  if (abstractDensity >= 2.4) {
    score -= 12;
  } else if (abstractDensity >= 1.7) {
    score -= 7;
  }

  if (averageSentenceLength > 45) {
    score -= 16;
  } else if (averageSentenceLength > 30) {
    score -= 9;
  }

  if (length > 60 && punctuationRatio < 0.04) {
    score -= 12;
  } else if (length > 30 && punctuationRatio < 0.06) {
    score -= 7;
  }

  if (concreteCount === 0) {
    score -= 10;
  }

  if (firstPersonCount === 0 && length > 24) {
    score -= 6;
  }

  if (concreteDetailCount === 0 && abstractCount >= 3) {
    score -= 14;
  } else if (concreteDetailCount <= 1 && abstractCount >= 5) {
    score -= 8;
  }

  if (officialeseCount >= 3 && concreteDetailCount === 0) {
    score -= 18;
  }

  if (vagueInspirationalCount >= 4 && concreteDetailCount <= 1) {
    score -= 8;
  }

  if (promoHypeCount >= 4) {
    score -= 10;
  } else if (promoHypeCount >= 2) {
    score -= 6;
  }

  if (length < 12) {
    score -= 10;
  }

  if (punctuationRatio >= 0.08 && length >= 18) {
    score += 2;
  }

  score += noise - 2;

  if (
    officialeseCount >= 3 ||
    badSignalCount >= 8 ||
    (aiPhraseCount >= 2 && abstractCount >= 4) ||
    (aiPhraseCount >= 1 && clicheCount >= 4)
  ) {
    const lowScore =
      46 -
      badSignalCount * 1.15 -
      aiPhraseCount * 3 -
      officialeseCount * 2.8 -
      Math.max(abstractCount - 4, 0) * 1.8 -
      (concreteDetailCount === 0 ? 5 : 0) -
      (averageSentenceLength > 35 ? 3 : 0) +
      noise;
    const minimumScore = officialeseCount >= 3 ? 12 : aiPhraseCount >= 4 && clicheCount <= 1 ? 28 : 10;
    const maximumScore = officialeseCount >= 3 ? 24 : 45;
    return clamp(Math.round(lowScore), minimumScore, maximumScore);
  }

  if (score > 96) {
    score = 94 + Math.min(noise, 2);
  }

  return clamp(Math.round(score), 0, 96);
}

function getResultByScore(score) {
  return resultCopy.find((result) => score >= result.min) || resultCopy[resultCopy.length - 1];
}

function getRandomVariant(variants) {
  return variants[Math.floor(Math.random() * variants.length)];
}

function getSavedFeedback() {
  try {
    const savedFeedback = JSON.parse(localStorage.getItem(feedbackStorageKey) || "[]");
    return Array.isArray(savedFeedback) ? savedFeedback : [];
  } catch {
    return [];
  }
}

function renderList(list, items) {
  if (!list) {
    return;
  }

  list.replaceChildren(
    ...items.map((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      return li;
    })
  );
}

function createStatGroup(title, options, feedbackItems, key) {
  const group = document.createElement("section");
  group.className = "dashboard-stat-group";

  const heading = document.createElement("h3");
  heading.textContent = title;
  group.append(heading);

  const list = document.createElement("div");
  list.className = "dashboard-stat-list";

  options.forEach((option) => {
    const row = document.createElement("div");
    row.className = "dashboard-stat-row";

    const label = document.createElement("span");
    label.textContent = option;

    const count = document.createElement("strong");
    count.textContent = feedbackItems.filter((item) => item[key] === option).length;

    row.append(label, count);
    list.append(row);
  });

  group.append(list);
  return group;
}

function formatFeedbackTime(value) {
  if (!value) {
    return "未知时间";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("zh-CN", { hour12: false });
}

function renderFeedbackDashboard() {
  const feedbackItems = getSavedFeedback();

  if (totalFeedbackCount) {
    totalFeedbackCount.textContent = feedbackItems.length;
  }

  feedbackStatsGrid?.replaceChildren(
    ...statGroups.map((group) => createStatGroup(group.title, group.options, feedbackItems, group.key))
  );

  if (!feedbackList) {
    return;
  }

  if (!feedbackItems.length) {
    const empty = document.createElement("p");
    empty.className = "feedback-empty";
    empty.textContent = "还没有本地反馈。先去测两句，再回来审问数据。";
    feedbackList.replaceChildren(empty);
    return;
  }

  feedbackList.replaceChildren(
    ...feedbackItems
      .slice()
      .reverse()
      .map((item) => {
        const card = document.createElement("article");
        card.className = "feedback-item";

        const meta = document.createElement("div");
        meta.className = "feedback-item-meta";

        const time = document.createElement("span");
        time.textContent = formatFeedbackTime(item.submittedAt);

        const score = document.createElement("strong");
        score.textContent = `${item.score ?? "-"}%`;

        const type = document.createElement("span");
        type.textContent = item.typeLabel || "未知类型";

        meta.append(time, score, type);

        const original = document.createElement("p");
        original.className = "feedback-item-text";
        original.textContent = `原始输入：${item.originalText || "未记录"}`;

        const comment = document.createElement("p");
        comment.className = "feedback-item-comment";
        comment.textContent = `文字反馈：${item.comment || "没有写，可能是无声的嫌弃。"}`;

        card.append(meta, original, comment);
        return card;
      })
  );
}

function renderResult(text) {
  const score = calculateHumanScore(text);
  const result = getResultByScore(score);
  const copy = getRandomVariant(result.variants);
  currentInputText = text;
  currentResult = {
    score,
    typeLabel: result.tag,
    roastTitle: copy.roastTitle
  };

  if (resultScore) {
    resultScore.textContent = `${score}%`;
  }

  if (resultTag) {
    resultTag.textContent = result.tag;
  }

  if (roastTitle) {
    roastTitle.textContent = copy.roastTitle;
  }

  renderList(problemList, copy.problems);
  renderList(suggestionList, copy.suggestions);

  if (text.replace(/\s/g, "").length < 20 && problemList) {
    const note = document.createElement("li");
    note.textContent = "文本较短，结果仅供参考，建议输入更完整的一段话。";
    problemList.append(note);
  }

  if (rewriteText) {
    rewriteText.textContent = copy.rewrite;
  }

  feedbackForm?.reset();
  feedbackForm?.setAttribute("hidden", "");
  feedbackToggleButton?.removeAttribute("hidden");

  if (feedbackMessage) {
    feedbackMessage.textContent = "";
  }
}

checkButton?.addEventListener("click", () => {
  const text = copyInput?.value.trim() || "";

  if (!text) {
    if (inputMessage) {
      inputMessage.textContent = "先说两句，不然我检测空气吗？";
    }
    resultCard?.setAttribute("hidden", "");
    copyInput?.focus();
    return;
  }

  if (inputMessage) {
    inputMessage.textContent = "";
  }

  renderResult(text);
  resultCard?.removeAttribute("hidden");
  resultCard?.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

resetButton?.addEventListener("click", () => {
  if (copyInput) {
    copyInput.value = "";
    copyInput.focus();
  }

  if (inputMessage) {
    inputMessage.textContent = "";
  }

  if (copyMessage) {
    copyMessage.textContent = "";
  }

  if (feedbackMessage) {
    feedbackMessage.textContent = "";
  }

  feedbackForm?.reset();
  feedbackForm?.setAttribute("hidden", "");
  feedbackToggleButton?.removeAttribute("hidden");

  currentInputText = "";
  currentResult = null;
  resultCard?.setAttribute("hidden", "");
});

copyResultButton?.addEventListener("click", async () => {
  if (!currentResult) {
    return;
  }

  const shareText = `我在《你会说人话吗》测出人话率 ${currentResult.score}%，类型是「${currentResult.typeLabel}」。
评价：${currentResult.roastTitle}
快去测测你的文案还像不像人话。`;

  try {
    await navigator.clipboard.writeText(shareText);

    if (copyMessage) {
      copyMessage.textContent = "已复制，快去发给朋友拷打一下。";
    }
  } catch {
    if (copyMessage) {
      copyMessage.textContent = "复制失败，可以手动截图分享。";
    }
  }
});

feedbackToggleButton?.addEventListener("click", () => {
  feedbackForm?.setAttribute("hidden", "");

  if (feedbackMessage) {
    feedbackMessage.textContent = "感谢吐槽，马上送你去骂产品经理。";
  }

  window.open(externalFeedbackUrl, "_blank", "noopener,noreferrer");
});

feedbackForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!currentResult) {
    return;
  }

  const formData = new FormData(feedbackForm);
  const feedback = {
    originalText: currentInputText,
    score: currentResult.score,
    typeLabel: currentResult.typeLabel,
    accuracy: formData.get("accuracy"),
    roastLevel: formData.get("roastLevel"),
    suggestionUsefulness: formData.get("suggestionUsefulness"),
    shareWillingness: formData.get("shareWillingness"),
    comment: String(formData.get("comment") || "").trim(),
    submittedAt: new Date().toISOString()
  };

  const savedFeedback = getSavedFeedback();
  savedFeedback.push(feedback);
  localStorage.setItem(feedbackStorageKey, JSON.stringify(savedFeedback));

  feedbackForm.reset();
  feedbackForm.setAttribute("hidden", "");
  feedbackToggleButton?.setAttribute("hidden", "");

  if (feedbackMessage) {
    feedbackMessage.textContent = "收到，产品经理已经开始挨骂了。";
  }
});

viewFeedbackButton?.addEventListener("click", () => {
  renderFeedbackDashboard();
  heroCard?.setAttribute("hidden", "");
  feedbackDashboard?.removeAttribute("hidden");
  feedbackDashboard?.classList.add("is-visible");
  feedbackDashboard?.scrollIntoView({ behavior: "smooth", block: "start" });
});

backToCheckerButton?.addEventListener("click", () => {
  feedbackDashboard?.setAttribute("hidden", "");
  feedbackDashboard?.classList.remove("is-visible");
  heroCard?.removeAttribute("hidden");
  heroCard?.scrollIntoView({ behavior: "smooth", block: "start" });
});

initializeViewState();
