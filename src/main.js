const app = document.querySelector("#app");
const copyInput = document.querySelector("#copy-input");
const exampleButtons = document.querySelectorAll(".example-button");
const checkButton = document.querySelector("#check-button");
const inputMessage = document.querySelector("#input-message");
const resultCard = document.querySelector("#result-card");
const resultScore = document.querySelector("#result-score");
const resultTag = document.querySelector("#result-tag");
const resultVerdict = document.querySelector("#result-verdict");
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
        roastTitle: "这段话挺像真人说的，甚至有点不像被 KPI 追着写出来的。",
        problems: [
          "表达比较直接，没有把一句话包装成项目申报书。",
          "能看出具体语境，读者不用靠猜来补剧情。",
          "语气有一点真实判断，不像模板自动出厂。"
        ],
        suggestions: [
          "保持现在这种直说，别突然开始端着。",
          "想更有传播感，可以再加一个具体场景。",
          "重点句可以再短一点，让人一眼抓住。"
        ],
        rewrite: "“这段话已经挺清楚了，再补一个具体例子，会更像你真的经历过。”"
      },
      {
        roastTitle: "这段文字的人味还挺足，AI 看了都想报名语言康复班。",
        problems: [
          "信息表达比较自然，没有明显套话堆叠。",
          "句子之间有正常停顿，不像一路踩油门。",
          "内容有对象、有态度，不是空中撒概念。"
        ],
        suggestions: [
          "保留这种自然语气，别为了显得高级乱加词。",
          "把最有意思的一句放前面，截图传播更抓人。",
          "如果还想更强，可以加一个小反差或具体细节。"
        ],
        rewrite: "“这段话基本不用大修，把最想说的那句提前，再加个具体细节就够了。”"
      },
      {
        roastTitle: "这段话已经会走路了，不需要再穿西装打领带假装成熟。",
        problems: [
          "整体没有明显官话味，读起来比较顺。",
          "表达有真实落点，不是只会说正确废话。",
          "语气控制得不错，既不油也不装。"
        ],
        suggestions: [
          "继续减少无意义形容词，让句子更利落。",
          "保留一点个人判断，这正是人话的证据。",
          "结尾可以更干脆，别给好句子加尾巴。"
        ],
        rewrite: "“这段话已经够自然了，稍微压短一点，把重点留在最前面就更好。”"
      }
    ]
  },
  {
    min: 60,
    tag: "基本会说人话型",
    variants: [
      {
        roastTitle: "能看懂，也像人说的，就是偶尔露出一点会议室味。",
        problems: [
          "有些表达偏正式，但还没严重到需要抢救。",
          "具体信息有一点，不过还可以更扎实。",
          "部分句子略长，读起来需要换气。"
        ],
        suggestions: [
          "把最重要的一句话提前说。",
          "删掉一两个看起来很厉害但没信息量的词。",
          "多补一点真实场景，比如时间、人物、原因。"
        ],
        rewrite: "“说简单点，这段话已经能表达意思了，再少一点套话、多一点具体事，就更自然。”"
      },
      {
        roastTitle: "这段话大体像人话，但有几句已经把脚伸进汇报材料里了。",
        problems: [
          "整体意思能成立，但有些词在假装很专业。",
          "部分句子信息不够具体，读者只能点头但记不住。",
          "语气略端，像在努力证明自己很靠谱。"
        ],
        suggestions: [
          "把抽象词换成实际动作。",
          "用一个例子顶替三句解释。",
          "少一点“我很正式”，多一点“我真这么想”。"
        ],
        rewrite: "“这段话可以更直接：先说你遇到什么，再说你打算怎么做，别绕太多。”"
      },
      {
        roastTitle: "这段文字还行，属于老师不会打低分、同学不会转发的类型。",
        problems: [
          "表达稳定，但记忆点还不够强。",
          "有些句子比较安全，安全到有点无聊。",
          "具体细节偏少，少了点真实现场感。"
        ],
        suggestions: [
          "挑一句最有态度的话放到前面。",
          "把泛泛而谈改成具体的人、事、场景。",
          "删掉不影响理解的修饰词，让内容更有劲。"
        ],
        rewrite: "“简单说，你的意思是清楚的，但可以再具体一点，让别人知道你不是在背模板。”"
      }
    ]
  },
  {
    min: 40,
    tag: "轻微套话型",
    variants: [
      {
        roastTitle: "这段话像真人写的初稿，但被 PPT 熏过一遍。",
        problems: [
          "套话词开始冒头，信息密度被稀释了。",
          "抽象表达偏多，读者不太知道具体发生了什么。",
          "语气比较端正，缺少一点真实的人味。"
        ],
        suggestions: [
          "把“提升、打造、价值”这类词换成具体动作。",
          "每一句尽量回答一个问题：谁做了什么，为什么。",
          "保留一点日常语气，不用每句话都像汇报。"
        ],
        rewrite: "“说简单点，别急着包装，先把具体发生了什么、你想表达什么讲清楚。”"
      },
      {
        roastTitle: "这段话不是不能看，是看着像被简历模板摸了一把头。",
        problems: [
          "表达有点泛，像很多场合都能用。",
          "关键词不少，但真正有用的信息偏少。",
          "语气太稳了，稳到像没有本人在场。"
        ],
        suggestions: [
          "删掉可以套在任何人身上的句子。",
          "补一个只有你这段内容才有的细节。",
          "把“做得更好”改成“具体改了哪里”。"
        ],
        rewrite: "“简单说，把万能句删掉，留下具体经历和真实想法，这段话会立刻像你写的。”"
      },
      {
        roastTitle: "这段文字有点像刚学会职场表达，正在努力把人话藏起来。",
        problems: [
          "一些词听起来高级，但没有提供新信息。",
          "句子重点不够突出，读完容易只记得很努力。",
          "真实情绪偏少，像在交一份安全作业。"
        ],
        suggestions: [
          "先写大白话版本，再决定哪些词需要保留。",
          "每段只留一个重点，别让句子互相抢戏。",
          "加一点真实态度，哪怕只是“我觉得”。"
        ],
        rewrite: "“说白了，这段话要先把意思讲明白，再考虑好不好看，不要一上来就穿正装。”"
      }
    ]
  },
  {
    min: 20,
    tag: "AI味过重型",
    variants: [
      {
        roastTitle: "这段话看起来像是 AI 连夜替领导写的。",
        problems: [
          "句子太满，像是在完成任务，不像真实表达。",
          "抽象词太多，但具体信息太少。",
          "语气过于端正，缺少人的情绪和个性。"
        ],
        suggestions: [
          "少用“提升、赋能、打造、助力”这类套话。",
          "把抽象表达改成具体事件。",
          "保留一点真实语气，不要像模板生成。"
        ],
        rewrite: "“说简单点，这段话可以更直接一点，把你真正想表达的意思说出来，不用包装得太正式。”"
      },
      {
        roastTitle: "这段文字 AI 味有点冲，像刚从生成按钮旁边端出来的。",
        problems: [
          "表达过于完整，完整到不像临时起意的人说的。",
          "很多词负责撑场面，真正负责传递信息的少。",
          "缺少具体对象和真实细节，读起来很悬浮。"
        ],
        suggestions: [
          "先删掉最像模板的开头和结尾。",
          "把“我们要实现”改成“我/我们具体做了什么”。",
          "保留一点口语停顿，让文字别像机器匀速前进。"
        ],
        rewrite: "“别铺垫太多，直接说发生了什么、你怎么看、下一步想怎么做。”"
      },
      {
        roastTitle: "这段话像 AI 写完还自己鼓掌，问题是人类还没看懂。",
        problems: [
          "句子结构太规整，缺少自然表达的松弛感。",
          "概念密度高，但具体画面少。",
          "语气像正式通知，不像真实沟通。"
        ],
        suggestions: [
          "把长句拆开，一句只讲一个意思。",
          "用具体例子替换宏大概念。",
          "把结论说得更像人会说的话，而不是报告摘要。"
        ],
        rewrite: "“这段话可以改成：我想说的其实很简单，先把具体情况讲清楚，再说我希望怎么改。”"
      }
    ]
  },
  {
    min: 0,
    tag: "领导废话型",
    variants: [
      {
        roastTitle: "这段话的含人量偏低，像会议纪要和口号生了个孩子。",
        problems: [
          "套话和抽象词过多，读完很难抓住重点。",
          "标点和停顿不足，像一口气把墙上的标语念完。",
          "缺少具体对象、具体原因和真实表达。"
        ],
        suggestions: [
          "先删掉所有不影响意思的漂亮词。",
          "把长句拆成短句，每句只说一件事。",
          "补上具体例子，别只说方向和价值。"
        ],
        rewrite: "“说简单点，先别讲战略和价值，直接说你做了什么、遇到什么问题、希望别人怎么做。”"
      },
      {
        roastTitle: "这段话像在开会，但会议室里没有一个人敢问重点是什么。",
        problems: [
          "概念太多，具体信息几乎被埋住了。",
          "表达像口号集合，读完只剩一种很忙的感觉。",
          "缺少人的视角，像一段自动播放的汇报音频。"
        ],
        suggestions: [
          "先找出唯一重点，其他漂亮话先放旁边。",
          "把每个抽象词都翻译成一个具体动作。",
          "用普通人能复述的句子重写一遍。"
        ],
        rewrite: "“别先讲大方向，先说清楚：谁遇到了什么问题，你做了什么，现在需要什么。”"
      },
      {
        roastTitle: "这段文字已经不是不像人话，是像在给空气做战略部署。",
        problems: [
          "内容过度包装，真实意思被层层包住。",
          "大量词语听起来正确，但落不到具体事情上。",
          "语气太像公告，缺少沟通感。"
        ],
        suggestions: [
          "把所有听起来很宏大的词先删一轮。",
          "每句话都问自己：这句能不能举例？不能就改。",
          "用日常表达重写，不要害怕句子朴素。"
        ],
        rewrite: "“这段话可以先改成：我想解决一个具体问题，所以做了这件事，希望大家看完能知道下一步怎么做。”"
      }
    ]
  }
];

if (app) {
  app.dataset.ready = "true";
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

function calculateHumanScore(text) {
  const compactText = text.replace(/\s/g, "");
  const length = compactText.length;
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
  const noise = stableNoise(text);
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

  if (resultVerdict) {
    resultVerdict.textContent = copy.roastTitle;
  }

  renderList(problemList, copy.problems);
  renderList(suggestionList, copy.suggestions);

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
  feedbackForm?.removeAttribute("hidden");
  feedbackToggleButton.setAttribute("hidden", "");

  if (feedbackMessage) {
    feedbackMessage.textContent = "";
  }
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
  feedbackDashboard?.scrollIntoView({ behavior: "smooth", block: "start" });
});

backToCheckerButton?.addEventListener("click", () => {
  feedbackDashboard?.setAttribute("hidden", "");
  heroCard?.removeAttribute("hidden");
  heroCard?.scrollIntoView({ behavior: "smooth", block: "start" });
});
