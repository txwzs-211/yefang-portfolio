export const projects = [
  {
    id: 'refine',
    title: 'AI 图像精细化应用',
    tag: '产品化应用',
    meta: '多模型编排 · 产品级',
    tagline: '把卡通、Low-Poly、毛毡等任意风格原图稳定提升到写实级 / 次世代质感，构图零偏移。',
    tech: ['Nano Banana 2', 'GPT Image', '即梦 5 Pro', 'seedVR2'],
    flow: ['上传图片', '选择模式', '双链路精细化', '质量校验', '8K 高清放大'],
    detail: {
      role: '工作流设计 / 提示词工程 / 产品化封装',
      overview: '用户上传场景或角色图 → 选择模式 → 一键精细化 → 一键 8K 高清放大。全部参数封装在后端，用户侧零操作。',
      sections: [
        {
          h: '场景精细化 · 四种模式',
          cards: [
            { title: '单图 · 标准模式', desc: '构图、透视、元素位置全部保留，材质升级到电影级 CG 实拍质感。底层采用自研双链路网关，结构锁定与材质精细化拆成两条并行链路，避免多参考图争夺注意力导致构图漂移。' },
            { title: '单图 · 氛围模式', desc: '放开构图约束，以"电影布光导演"视角让模型自主设计光影，输出更具氛围感与故事性的版本。' },
            { title: '参考风格 · 标准模式', desc: '只迁移参考图的光影风格、色调与镜头质感，画面内容 100% 来自原图，不引入参考图任何元素。' },
            { title: '参考风格 · 低模模式', desc: '低模场景完全重塑为极致精细的次世代高精模型质感，AAA 级游戏画面质量。' },
          ]
        },
        {
          h: '角色精细化 · 两条链路',
          cards: [
            { title: '局部模式', desc: '单次 Nano Banana 2 生成，配合自研 AAA 级提示词工艺，专注材质增强、发丝与皮肤细节还原，UE5 Lumen / Nanite 渲染风格。' },
            { title: '全身模式', desc: '先裁切四分割 → 四张局部图分别超清精细化 → 以原图 + 局部超清图为参考合成融图，输出完整且高清的全身成图。' },
          ]
        }
      ],
      showcase: [
        {
          group: '场景精细化流程图',
          items: [
            { file: 'refine-flow-scene.webp', wide: true },
          ]
        },
        {
          group: '角色精细化流程图',
          items: [
            { file: 'refine-flow-char.webp', wide: true },
          ]
        },
        {
          group: '工具页面详情',
          items: [
            { file: 'refine-tool-ui.webp', wide: true },
          ]
        },
        {
          group: '效果展示',
          items: [
            { file: 'refine-result-scene.webp', wide: true },
            { file: 'refine-result-char.webp', wide: true },
          ]
        },
      ]
    }
  },
  {
    id: 'skill',
    title: '叙事类 AI 视频生成 Skill',
    tag: '工作流编排',
    meta: 'Agent Skill · v9 · 提示词工程',
    tagline: '把"一句话想法"自动编排成从剧本到成片的完整 AI 影视工作流。',
    tech: ['GPT Image', 'Seedance', 'L0–L5 节点体系', 'Agent Skill'],
    flow: ['输入理解', '剧本 & 资产', '分镜表', '视频生成', '音频 & 成片'],
    detail: {
      role: '工作流设计 / 系统架构 / 提示词工程',

      overview: '自主设计并迭代至 v9 的叙事类视频生成 Skill——一个自然语言工作流编排器。接收模糊想法、故事梗概、完整剧本、参考图等任意组合的输入，自动完成从创意到成片的全链路编排。',
      sections: [
        {
          h: '八阶段生产管线',
          pipeline: [
            { num: 'L0', title: '输入理解', desc: '分析输入类型与完整度' },
            { num: 'L1', title: '项目简案', desc: '世界观、角色、结构确认' },
            { num: 'L2', title: '剧本与资产', desc: '台词、场景、角色资产清单' },
            { num: 'L3', title: '分镜表', desc: '景别、运镜、时长配平' },
            { num: 'L4', title: '资产生成', desc: 'GPT Image 批量出图' },
            { num: 'L4+', title: '生成路线选择', desc: '提示词驱动 or 宫格分镜' },
            { num: 'L5', title: '视频 & 音频', desc: 'Seedance 生成 + 音色接入' },
            { num: 'L5+', title: '成片拼合', desc: '时间轴拼合 + 输出' },
          ]
        },
        {
          h: '四处确认门控（Gate A–D）',
          p: '在简案、剧本、分镜表三处做内容确认，在资产完成后由用户选择生成路线——提示词驱动模式（发挥模型潜能）或宫格分镜模式（构图强可控），可控性与工作量由用户自己权衡。'
        },
        {
          h: '核心设计原则',
          cards: [
            { title: '上游事实优先', desc: '任何阶段修改只重建受影响的下游节点，不做全链返工；已确认内容不会被后续阶段擅自推翻。' },
            { title: '最小失效机制', desc: '单节点失败不阻断整体流程，自动标记并提供局部重跑入口。' },
            { title: '提示词工艺沉淀', desc: '图像与视频各一份独立工艺文档，覆盖资产母版设计、景别-视野度数映射、切段算法、时长配平等生产级细节。' },
            { title: '多模型编排', desc: '资产默认 GPT Image，视频默认 Seedance，音频按宿主能力接入，不绑定单一平台。' },
          ]
        }
      ],
      showcase: [
        {
          group: '成片演示',
          splitLayout: true,        // 左视频右图片
          video: 'skill-demo.mp4',
          flowImg: 'skill-flow-full.webp',
        },
        {
          group: '人物 / 场景资产',
          items: [
            { file: 'skill-asset-char.webp', wide: true },
            { file: 'skill-asset-scene.webp', wide: true },
          ]
        },
      ]
    }
  },
  {
    id: 'extract',
    title: '角色元素提取',
    tag: 'ComfyUI 工作流',
    meta: 'GPT Image 2.5 · 资产拆解',
    tagline: '一键把角色立绘拆解为素体、发型、服装、甲片、配饰等独立部件图，直接服务资产复用与多角度生成。',
    tech: ['ComfyUI', 'GPT Image 2.5', '条件分流', '批量处理'],
    flow: ['原图输入', '特效检测', '条件分流', '分类提示词', '部件批量输出'],
    detail: {
      role: 'ComfyUI 工作流设计 / 提示词工程',

      overview: '基于 GPT Image 2.5 在 ComfyUI 画布中批量拆解，单角色可稳定拆出 8–11 个独立部件，灰底统一规格，可直接作为后续换装、多角度视图、3D 参考的输入资产。',
      sections: [
        {
          h: '工作流逻辑',
          cards: [
            { title: '有特效路径', desc: '先对原图去特效，走"分类提示词 → 角色效果图"主链路；同时单独生成特效提示词，输出特效效果图。特效与本体互不污染。' },
            { title: '无特效路径', desc: '直接分析 → 分类提示词 → 角色效果图，流程更短，出图更快。' },
          ]
        },
        {
          h: '产出能力',
          p: '单角色可稳定拆出 8–11 个独立部件，包括：素体、手臂、发型、服装整体、袖子、肩甲、腰甲、胸甲、裙体、鞋靴、头饰、项链、耳饰等，灰底统一规格。'
        }
      ],
      showcase: [
        {
          group: '角色元素提取流程图',
          items: [
            { file: 'extract-flow-new.webp', wide: true },
          ]
        },
        {
          group: '效果展示',
          items: [
            { file: 'extract-effect-1.webp', wide: true },
            { file: 'extract-effect-2.webp', wide: true },
            { file: 'extract-effect-3.webp', wide: true },
            { file: 'extract-effect-4.webp', wide: true },
          ]
        },
      ]
    }
  },
  {
    id: 'tools',
    title: '工具开发 · 效率与质量基建',
    tag: '工程工具',
    meta: 'Python / Gradio / 图像算法',
    tagline: '围绕 AI 图像管线自研的工程工具集——输入侧比例标准化、输出侧构图自动校正，外加音频能力产品化。',
    tech: ['Python', 'Gradio', 'Node.js', 'GPT-SoVITS', 'Fish S2'],
    flow: ['需求分析', '算法设计', '工程实现', '接口封装', '产品交付'],
    detail: {
      role: '工具设计 / 算法开发 / 产品原型',
      overview: '前两个工具是图像精细化管线的配套基建：补边解决输入侧（任意比例 → 可拆四格的标准比例），构图校正解决输出侧（AI 重绘后的构图偏移），合起来构成"输入标准化 → 精细化 → 输出校正"的完整工程闭环。',
      // tabs 替代原来的 sections，每个 tab 是一个独立工具
      tabs: [
        {
          id: 'align',
          label: '构图校正',
          tag: '精细化配套 · 输出侧',
          tagline: '跨风格构图自动校正——解决 AI 重绘后元素位置漂移问题，全自动无需人工标点。',
          cards: [
            { title: '解决的问题', desc: 'AI 彻底重绘后，风格材质变化是预期，但场景元素位置也偏移了——这是整体平移 + 旋转缩放 + 透视差 + 局部位移的叠加，上游提示词无法稳定约束。' },
            { title: '算法方案', desc: '在结构特征域（梯度/边缘图）做跨风格配准——画幅标准化 → 全局仿射 → 透视校正 → 受约束局部网格形变 → 受限光流精修；"弯曲守卫"保证建筑直线不被拉弯。' },
            { title: '量化效果', desc: '典型案例偏移量 14.3px → 0.8px；结构对齐得分 0.5575 → 0.7794（+0.2219）；95% 区域误差近乎重合。' },
            { title: '交付形态', desc: 'Gradio 可视化界面 + API + CLI，后台无感知接入工作流，七类回归用例全部通过。' },
          ],
          showcase: [
            { label: '工具界面总览', file: 'align-ui-1.webp', wide: true },
            { caption: '校正前', file: 'align-before.webp' },
            { caption: '校正后', file: 'align-after.webp' },
          ],
        },
        {
          id: 'pad',
          label: '比例补边',
          tag: '精细化配套 · 输入侧',
          tagline: '场景图标准比例补边——任意比例图片自动补成标准比例，原图逐像素不变，全程零操作。',
          cards: [
            { title: '解决的问题', desc: '用户上传任意比例图片，而精细化的"四格拆分"链路要求标准比例。后台自动识别并补成最接近的标准比例，支持 11 种常用比例，全程零用户操作。' },
            { title: '无感知六条保证', desc: '只在外侧补灰边、原图逐像素不变；JPEG 复用原图量化表避免二次压缩损失；保留 ICC 色彩描述；先按 EXIF 纠方向再取宽高；进出格式不突变；任何异常静默返回原图。' },
            { title: '交付形态', desc: 'Python 与 Node 双端实现，算法完全对齐并有机器校验；线上接入只需两个函数；附本地调试台（单图 / 批量 / 拆分验证）。' },
          ],
          showcase: [
            { label: '工具界面', file: 'pad-ui-1.webp', wide: true },
          ],
        },
        {
          id: 'audio',
          label: 'AI 音频工作台',
          tag: '能力整合原型',
          tagline: '把六种 AI 音频能力整合进一个清晰入口——用户路径压缩为四步，无需了解底层模型。',
          cards: [
            { title: '设计原则', desc: '相同用途的能力合并，仅保留一个清晰入口。用户路径压缩为四步——选任务 → 填文案 → 上传声音 → 试听下载。' },
            { title: '六大功能', desc: '快速配音（VoxCPM2）、声音克隆（VoxCPM2）、情绪配音（IndexTTS2）、双人对话（Fish S2）、已训练音色配音（GPT-SoVITS）、创建音色（GPT-SoVITS 后台训练任务）。' },
            { title: '交付物', desc: '深色玻璃拟态风格的可交互 HTML 高保真原型（功能切换、表单校验、情绪预设、状态反馈均可操作），用于需求评审与开发对齐。' },
          ],
          showcase: [
            { label: 'AI 音频工作台界面', file: 'audio-ui.webp', wide: true },
          ],
        },
      ],
      sections: [], // 保留兼容，实际用 tabs
    },
  }
];
