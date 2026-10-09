/* 已核验研究快照；事实、预测与教学模型分开维护。 */
window.MUSEUM_DATA = {
  "version": "2.0",
  "name": "智变 · 未来生产力展馆",
  "verifiedOn": "2026-10-07",
  "sectors": {
    "manufacturing": {
      "label": "智能装备 × 工艺优化",
      "title": "让生产线，从执行走向感知。",
      "description": "视觉识别发现异常，预测模型辅助维护，智能装备执行操作。AI 的价值在于把“看见问题”连接到“调整流程”。",
      "caseTitle": "产业背景 · 工业机器人",
      "caseText": "IFR 报告：2024 年全球新安装工业机器人约 54.2 万台，中国约 29.5 万台。它体现实体生产的自动化底座；工业机器人不等于 AI 机器人。",
      "sourceTitle": "IFR World Robotics 2025",
      "source": "https://ifr.org/ifr-press-releases/news/global-robot-demand-in-factories-doubles-over-10-years",
      "boundary": "需要稳定的数据采集、现场安全验证和工艺经验；不能仅凭安装量推断生产率提高。",
      "flow": [
        [
          "现场数据",
          "图像 · 传感器"
        ],
        [
          "AI 感知",
          "缺陷 · 异常识别"
        ],
        [
          "生产调整",
          "维护 · 质量复核"
        ]
      ],
      "visual": "factory",
      "name": "智能制造",
      "inputs": [
        "现场图像",
        "设备信号",
        "工艺参数"
      ],
      "abilities": [
        "视觉质检",
        "异常预测",
        "生产规划"
      ],
      "actions": [
        "质量复核",
        "维护决策",
        "工艺调整"
      ],
      "value": "生产稳定性",
      "explain": [
        "现场图像让缺陷有可分析的线索，传感器补充设备状态，工艺参数提供判断背景。",
        "AI 在图像与设备数据中寻找异常，提出预测和规划建议；结果需要与现场经验核对。",
        "质量人员、工程师与管理者验证结果并采取行动，让识别与生产调整衔接。"
      ],
      "outcome": "提高质量管理与维护的及时性，价值需要用真实生产数据验收。"
    },
    "health": {
      "label": "专业判断 × 智能辅助",
      "title": "让信息更可见，让判断更有依据。",
      "description": "AI 可在医学影像中提示可疑区域、整理临床信息，帮助专业人员聚焦重要线索。最终诊疗仍需要结合患者情况与专业判断。",
      "caseTitle": "应用证据 · AI 医疗器械清单",
      "caseText": "美国 FDA 发布部分获准在美国上市的 AI 医疗器械清单，展示 AI 已进入部分医疗器械场景。清单并不全面，获准上市不意味着适用于全部病种或取代医生。",
      "sourceTitle": "FDA AI-Enabled Medical Devices",
      "source": "https://www.fda.gov/medical-devices/artificial-intelligence-enabled-medical-devices/list-artificial-intelligence-enabled-medical-devices",
      "boundary": "涉及患者隐私、偏差评估和临床验证；本站影像图是抽象示意，不提供医疗诊断。",
      "flow": [
        [
          "医学信息",
          "影像 · 临床资料"
        ],
        [
          "AI 辅助",
          "提示 · 信息整理"
        ],
        [
          "专业复核",
          "医生 · 临床验证"
        ]
      ],
      "visual": "health",
      "name": "医疗健康",
      "inputs": [
        "医学影像",
        "临床资料",
        "患者背景"
      ],
      "abilities": [
        "影像提示",
        "信息整理",
        "风险识别"
      ],
      "actions": [
        "医生判断",
        "临床验证",
        "隐私保护"
      ],
      "value": "专业判断支持",
      "explain": [
        "不同患者、设备与病种的数据有差异，资料需要规范采集和权限管理。",
        "模型提示可疑区域、整理资料或识别风险线索，不能单凭输出确定诊疗。",
        "医生结合患者情况进行判断，机构对适用范围、偏差和隐私实施验证与治理。"
      ],
      "outcome": "帮助专业人员聚焦信息，同时保留临床责任与患者权利。"
    },
    "agriculture": {
      "label": "田间感知 × 精准管理",
      "title": "让每一次管理，都更了解土地。",
      "description": "田间图像、天气与土壤数据为病虫害识别和灌溉判断提供线索。与固定经验结合，AI 可帮助把管理从大范围操作转向精细决策。",
      "caseTitle": "场景参考 · 精准农业",
      "caseText": "FAO 将精准农业解释为影像、传感器、土壤数据、AI 与农机的融合。本图展示“采集—识别—管理”的可能路径，未声称某农场获得具体增产比例。",
      "sourceTitle": "FAO 精准农业概念介绍",
      "source": "https://www.fao.org/agrovoc/news/agrovoc-concept-week-precision-agriculture",
      "boundary": "依赖本地作物、气候与传感器数据，需要田间验证；同时关注小农户的技术可及性。",
      "flow": [
        [
          "田间感知",
          "图像 · 土壤 · 天气"
        ],
        [
          "AI 分析",
          "识别 · 预测"
        ],
        [
          "精准管理",
          "灌溉 · 人工确认"
        ]
      ],
      "visual": "agriculture",
      "name": "智慧农业",
      "inputs": [
        "田间图像",
        "土壤数据",
        "天气资料"
      ],
      "abilities": [
        "病害线索",
        "需水分析",
        "生长预测"
      ],
      "actions": [
        "田间核验",
        "精准灌溉",
        "种植管理"
      ],
      "value": "精细农业管理",
      "explain": [
        "传感器和图像反映田间差异；不同作物、气候与区域需要本地数据。",
        "视觉与预测模型提供病害、需水和生长线索，是否可靠要在田间验证。",
        "农户将线索与经验结合进行核验和管理，同时关注设备成本与技术可及性。"
      ],
      "outcome": "从统一操作走向精细管理，不能仅凭算法推出具体增产百分比。"
    },
    "science": {
      "label": "开放知识 × 科学探索",
      "title": "让未知，有更好的探索起点。",
      "description": "AI 从海量科学数据中寻找规律，提出可检验的候选方案。它扩大研究者能利用的知识空间，让探索从更充分的信息开始。",
      "caseTitle": "历史案例 · AlphaFold 数据库",
      "caseText": "2022 年，EMBL-EBI 宣布 AlphaFold 数据库开放超过 2 亿个蛋白质结构预测。预测结构是研究线索，不等同于实验确认，更不等于发现同等数量的新药。",
      "sourceTitle": "EMBL-EBI 2022 数据库公告",
      "source": "https://www.ebi.ac.uk/about/news/technology-and-innovation/alphafold-200-million/",
      "boundary": "预测存在置信度差异，关键结论必须实验检验；图中形状为概念图，并非真实蛋白结构。",
      "flow": [
        [
          "科学数据",
          "序列 · 文献"
        ],
        [
          "模型预测",
          "候选 · 结构线索"
        ],
        [
          "实验验证",
          "确认 · 新知识"
        ]
      ],
      "visual": "science",
      "name": "科学发现",
      "inputs": [
        "序列数据",
        "实验记录",
        "科学文献"
      ],
      "abilities": [
        "结构预测",
        "候选生成",
        "关联发现"
      ],
      "actions": [
        "实验检验",
        "置信度评估",
        "开放共享"
      ],
      "value": "扩展研究起点",
      "explain": [
        "序列、实验和文献成为可组合的知识基础，开放资源降低研究者获取信息的门槛。",
        "模型缩小搜索空间、提出候选结构和关联，但预测具有置信度差异。",
        "科学家设计实验、检查模型置信度并共享验证结果，让线索转化为新知识。"
      ],
      "outcome": "探索规模与可用知识扩展，预测本身仍不是科学结论。"
    },
    "education": {
      "label": "学习支持 × 教师指导",
      "title": "让学习帮助，更贴近每个问题。",
      "description": "生成式 AI 可辅助解释概念、提供练习思路与反馈草案。教师负责教学目标、内容审查与学习评价，学生保留独立思考。",
      "caseTitle": "治理参考 · UNESCO 教育指导",
      "caseText": "UNESCO 的生成式 AI 教育与研究指南关注以人为本、隐私保护和机构验证。这里展示教学支持机制，不把个性化直接等同于成绩提升。",
      "sourceTitle": "UNESCO 2023 教育与研究指南",
      "source": "https://www.unesco.org/en/articles/guidance-generative-ai-education-and-research",
      "boundary": "需验证内容准确性，保护学生数据，避免依赖与数字鸿沟；不能用模拟替代真实学习成效评估。",
      "flow": [
        [
          "学习任务",
          "问题 · 教学目标"
        ],
        [
          "AI 支持",
          "解释 · 反馈草案"
        ],
        [
          "教师指导",
          "审查 · 独立思考"
        ]
      ],
      "visual": "education",
      "name": "教育学习",
      "inputs": [
        "学习问题",
        "教材内容",
        "教学目标"
      ],
      "abilities": [
        "概念解释",
        "练习草案",
        "反馈建议"
      ],
      "actions": [
        "教师审查",
        "独立思考",
        "学习评价"
      ],
      "value": "学习支持与机会",
      "explain": [
        "围绕教学目标采集必要信息，保护学生数据，避免把更多采集视为更好的学习。",
        "AI 提供解释、练习和反馈草案，内容需要核查，不能将个性化直接视为效果提升。",
        "教师审查内容与设计评价，学生保留思考能力；技术可及性决定机会能否被共享。"
      ],
      "outcome": "扩大教学支持的可能性，学习效果需要真实评价与长期观察。"
    }
  },
  "sources": [
    {
      "id": "S01",
      "category": "concept",
      "title": "发展新质生产力是推动高质量发展的内在要求和重要着力点",
      "org": "工信部转载 求是",
      "year": "2024",
      "note": "概念依据：创新驱动、生产要素重组与全要素生产率。本站要素映射为教学分析。",
      "url": "https://www.miit.gov.cn/xwdt/szyw/art/2024/art_b5bd362c3f494afa9364887fafca498e.html"
    },
    {
      "id": "S02",
      "category": "case",
      "title": "AlphaFold 超过 2 亿个蛋白质结构预测",
      "org": "EMBL-EBI",
      "year": "2022",
      "note": "历史数据库开放案例。预测不等于实验确认，数量不是当前实时统计。",
      "url": "https://www.ebi.ac.uk/about/news/technology-and-innovation/alphafold-200-million/"
    },
    {
      "id": "S03",
      "category": "case",
      "title": "List of Artificial Intelligence-Enabled Medical Devices",
      "org": "美国 FDA",
      "year": "官方清单",
      "note": "部分获准在美国上市 AI 医疗器械的应用证据；清单并不全面，不报动态数量。",
      "url": "https://www.fda.gov/medical-devices/artificial-intelligence-enabled-medical-devices/list-artificial-intelligence-enabled-medical-devices"
    },
    {
      "id": "S04",
      "category": "case",
      "title": "Precision Agriculture 精准农业",
      "org": "联合国粮农组织 FAO",
      "year": "2026",
      "note": "影像、传感器、数据、AI 与农机融合的概念参考。本站未引用未经核验的增产幅度。",
      "url": "https://www.fao.org/agrovoc/news/agrovoc-concept-week-precision-agriculture"
    },
    {
      "id": "S05",
      "category": "concept",
      "title": "Guidance for Generative AI in Education and Research",
      "org": "UNESCO",
      "year": "2023",
      "note": "教育治理参考：以人为本、隐私保护、机构验证与教师参与。",
      "url": "https://www.unesco.org/en/articles/guidance-generative-ai-education-and-research"
    },
    {
      "id": "S06",
      "category": "concept",
      "title": "国务院关于深入实施 人工智能+ 行动的意见",
      "org": "中央网信办转载 国务院",
      "year": "2025",
      "note": "政策背景：科学技术、产业发展与民生等领域。政策目标不作为已发生的效果统计。",
      "url": "https://www.cac.gov.cn/2025-08/27/c_1758018277755538.htm"
    },
    {
      "category": "data",
      "title": "Stanford HAI — AI Index Report 2026, Chapter 4: Economy",
      "org": "Stanford HAI",
      "year": "2026",
      "note": "组织采用：AI 与生成式 AI；McKinsey 调查中，报告组织至少一个业务职能使用 AI / 定期使用生成式 AI 的受访者比例。",
      "url": "https://hai.stanford.edu/assets/files/ai_index_report_2026_chapter_4_economy.pdf",
      "id": "S07"
    },
    {
      "category": "data",
      "title": "IFR — World Robotics 2025: Global Robot Demand in Factories Doubles Over 10 Years",
      "org": "IFR",
      "year": "2025-09-25",
      "note": "实体生产的自动化底座；工业机器人年度新增安装量；五大市场。",
      "url": "https://ifr.org/ifr-press-releases/news/global-robot-demand-in-factories-doubles-over-10-years",
      "id": "S08"
    },
    {
      "category": "data",
      "title": "IEA — Energy and AI: Energy demand from AI",
      "org": "IEA",
      "year": "2025",
      "note": "数据中心用电：历史估计与未来情景；全球全部数据中心年用电，含常规服务器、AI相关加速服务器及存储、网络、制冷等。",
      "url": "https://www.iea.org/reports/energy-and-ai/energy-demand-from-ai",
      "id": "S09"
    },
    {
      "category": "data",
      "title": "Stanford HAI — AI Index 2025: State of AI in 10 Charts",
      "org": "Stanford HAI",
      "year": "2025",
      "note": "同等能力门槛下的推理价格下降；达到GPT-3.5相当MMLU表现（约64.8%）的最便宜可用模型查询价格。",
      "url": "https://hai.stanford.edu/news/ai-index-2025-state-of-ai-in-10-charts",
      "id": "S10"
    },
    {
      "category": "data",
      "title": "McKinsey — The state of AI in 2026: On the road to ROI",
      "org": "McKinsey",
      "year": "2026-08-25",
      "note": "AI 正从试点进入规模化，但大企业更快；2026原始在线调查：2026-05-04至06-08，1719名受访者、97国；按国家GDP贡献加权。前一年值采用该报告回溯比较。",
      "url": "https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai",
      "id": "S11"
    },
    {
      "category": "data",
      "title": "Brynjolfsson, Li, Raymond — Generative AI at Work, QJE",
      "org": "企业客服 原始研究",
      "year": "2025-02-04",
      "note": "每小时成功解决的问题数：+15%；5,172名客服",
      "url": "https://doi.org/10.1093/qje/qjae044",
      "id": "S12"
    },
    {
      "category": "data",
      "title": "Noy & Zhang — Experimental evidence on the productivity effects of generative artificial intelligence, Science",
      "org": "职业写作 原始研究",
      "year": "2023-07-14",
      "note": "完成写作任务的平均耗时：耗时−40%；453名受过大学教育的专业人士",
      "url": "https://doi.org/10.1126/science.adh2586",
      "id": "S13"
    },
    {
      "category": "data",
      "title": "Cui et al. — The Effects of Generative AI on High-Skilled Work: Evidence from Three Field Experiments with Software Developers, Management Science",
      "org": "企业软件开发 原始研究",
      "year": "2026-02-27",
      "note": "每周完成的任务数（以Pull Requests衡量）：完成任务数+26.08%；三家公司共4,867名开发者",
      "url": "https://doi.org/10.1287/mnsc.2025.00535",
      "id": "S14"
    },
    {
      "category": "data",
      "title": "METR — Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity",
      "org": "熟悉代码库的资深开源开发者 原始研究",
      "year": "2025-07-10",
      "note": "真实任务完成耗时：耗时+19%；16名资深开发者、246个任务",
      "url": "https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/",
      "id": "S15"
    },
    {
      "category": "technology",
      "title": "Apache ECharts 6.1.0",
      "org": "Apache Software Foundation",
      "year": "Apache-2.0",
      "note": "图表交互、地图、关系图与图片导出的开源图表库；本地随源码提供许可证。",
      "url": "https://github.com/apache/echarts",
      "id": "S16"
    },
    {
      "category": "technology",
      "title": "Three.js 0.186.1",
      "org": "Three.js contributors",
      "year": "MIT",
      "note": "原创三维产业之城使用的图形库；构建为本地经典脚本，运行无需网络。",
      "url": "https://github.com/mrdoob/three.js",
      "id": "S17"
    },
    {
      "category": "technology",
      "title": "Natural Earth 110m Countries",
      "org": "Natural Earth",
      "year": "Public domain",
      "note": "世界地图轮廓；仅呈现被报告收录的投资市场，未收录不填零。",
      "url": "https://www.naturalearthdata.com/about/terms-of-use/",
      "id": "S18"
    }
  ],
  "datasets": {
    "organizationAdoption": {
      "id": "organizationAdoption",
      "title": "组织采用：AI 与生成式 AI",
      "unit": "% 受访者",
      "classification": "survey_fact",
      "values": [
        {
          "year": 2023,
          "ai": 55,
          "genAI": 33
        },
        {
          "year": 2024,
          "ai": 78,
          "genAI": 71
        },
        {
          "year": 2025,
          "ai": 88,
          "genAI": 79
        }
      ],
      "sourceURL": "https://hai.stanford.edu/assets/files/ai_index_report_2026_chapter_4_economy.pdf",
      "sourceTitle": "Stanford HAI — AI Index Report 2026, Chapter 4: Economy",
      "year": "2023–2025",
      "reportYear": 2026,
      "page": 193,
      "figure": "4.3.1",
      "scope": "McKinsey 调查中，报告组织至少一个业务职能使用 AI / 定期使用生成式 AI 的受访者比例。",
      "limitations": [
        "受访者自报，非全球企业普查。",
        "使用至少一个职能不等于全企业规模化。",
        "生成式 AI 属于 AI，不能把两线相加。"
      ],
      "suggestedChart": "双折线与年份游标，悬浮同时展示两类数据。"
    },
    "regionalAdoption": {
      "id": "regionalAdoption",
      "title": "AI 采用的地区差异",
      "unit": "% 受访者",
      "classification": "survey_fact",
      "values": [
        {
          "region": "全球（全部地区）",
          "data": [
            {
              "year": 2023,
              "value": 55
            },
            {
              "year": 2024,
              "value": 78
            },
            {
              "year": 2025,
              "value": 88
            }
          ]
        },
        {
          "region": "亚太",
          "data": [
            {
              "year": 2023,
              "value": 58
            },
            {
              "year": 2024,
              "value": 72
            },
            {
              "year": 2025,
              "value": 82
            }
          ]
        },
        {
          "region": "欧洲",
          "data": [
            {
              "year": 2023,
              "value": 57
            },
            {
              "year": 2024,
              "value": 80
            },
            {
              "year": 2025,
              "value": 91
            }
          ]
        },
        {
          "region": "北美",
          "data": [
            {
              "year": 2023,
              "value": 61
            },
            {
              "year": 2024,
              "value": 82
            },
            {
              "year": 2025,
              "value": 90
            }
          ]
        },
        {
          "region": "大中华地区",
          "data": [
            {
              "year": 2023,
              "value": 48
            },
            {
              "year": 2024,
              "value": 75
            },
            {
              "year": 2025,
              "value": 88
            }
          ]
        },
        {
          "region": "发展中市场",
          "data": [
            {
              "year": 2023,
              "value": 49
            },
            {
              "year": 2024,
              "value": 77
            },
            {
              "year": 2025,
              "value": 88
            }
          ]
        }
      ],
      "sourceURL": "https://hai.stanford.edu/assets/files/ai_index_report_2026_chapter_4_economy.pdf",
      "sourceTitle": "Stanford HAI — AI Index Report 2026, Chapter 4: Economy",
      "year": "2023–2025",
      "reportYear": 2026,
      "page": 194,
      "figure": "4.3.2",
      "scope": "报告组织使用 AI 的受访者比例。大中华地区包括香港、台湾、澳门；发展中市场包括印度、中南美、MENA。",
      "limitations": [
        "地区为报告的调查分组，不是相互严格独立的国土分区。",
        "不能将大中华地区88%称为中国大陆全部企业普及率。",
        "跨年份样本构成可能改变。"
      ],
      "suggestedChart": "地区×年份热力图，附可切换的哑铃图；保持0–100色标。"
    },
    "privateInvestmentCountries2025": {
      "id": "privateInvestmentCountries2025",
      "title": "2025 年私人 AI 投资的地理分布",
      "unit": "十亿美元",
      "classification": "statistical_fact",
      "values": [
        {
          "country": "美国",
          "code": "US",
          "value": 285.88
        },
        {
          "country": "中国",
          "code": "CN",
          "value": 12.41
        },
        {
          "country": "英国",
          "code": "GB",
          "value": 5.9
        },
        {
          "country": "法国",
          "code": "FR",
          "value": 4.36
        },
        {
          "country": "加拿大",
          "code": "CA",
          "value": 4.28
        },
        {
          "country": "印度",
          "code": "IN",
          "value": 4.09
        },
        {
          "country": "德国",
          "code": "DE",
          "value": 3.89
        },
        {
          "country": "以色列",
          "code": "IL",
          "value": 3.58
        },
        {
          "country": "澳大利亚",
          "code": "AU",
          "value": 2.52
        },
        {
          "country": "沙特阿拉伯",
          "code": "SA",
          "value": 2.03
        },
        {
          "country": "新加坡",
          "code": "SG",
          "value": 1.82
        },
        {
          "country": "韩国",
          "code": "KR",
          "value": 1.78
        },
        {
          "country": "比利时",
          "code": "BE",
          "value": 1.2
        },
        {
          "country": "日本",
          "code": "JP",
          "value": 1.11
        },
        {
          "country": "瑞典",
          "code": "SE",
          "value": 0.97
        }
      ],
      "sourceURL": "https://hai.stanford.edu/assets/files/ai_index_report_2026_chapter_4_economy.pdf",
      "sourceTitle": "Stanford HAI — AI Index Report 2026, Chapter 4: Economy",
      "year": 2025,
      "reportYear": 2026,
      "page": 182,
      "figure": "4.2.8",
      "scope": "Quid 统计的私人融资事件，如风投和私募股权；关注2013年以来累计融资超过150万美元的AI/ML公司。列出报告图中15个市场。",
      "limitations": [
        "不是全部国家完整总量。",
        "不包括政府支持资金，特别可能低估中国 AI 资本投入。",
        "不等于科研总投入或算力资本开支。",
        "一十亿美元=10亿美元，中文换算切勿少/多一位。"
      ],
      "suggestedChart": "可排序国家条形图与地图符号；提供线性/对数切换，默认线性且说明美国占比集中。"
    },
    "globalInvestmentTrend": {
      "id": "globalInvestmentTrend",
      "title": "全球 AI 投资扩张：私人与总体企业投资",
      "unit": "十亿美元",
      "classification": "statistical_fact",
      "values": [
        {
          "year": 2020,
          "private": 73.79,
          "corporateTotal": 221.87
        },
        {
          "year": 2021,
          "private": 145.4,
          "corporateTotal": 360.73
        },
        {
          "year": 2022,
          "private": 113.01,
          "corporateTotal": 253.25
        },
        {
          "year": 2023,
          "private": 104.34,
          "corporateTotal": 201
        },
        {
          "year": 2024,
          "private": 151.48,
          "corporateTotal": 253.02
        },
        {
          "year": 2025,
          "private": 344.66,
          "corporateTotal": 581.69
        }
      ],
      "sourceURL": "https://hai.stanford.edu/assets/files/ai_index_report_2026_chapter_4_economy.pdf",
      "sourceTitle": "Stanford HAI — AI Index Report 2026, Chapter 4: Economy",
      "year": "2020–2025",
      "reportYear": 2026,
      "page": 178,
      "figure": "4.2.1",
      "scope": "Corporate total包括并购、少数股权投资、私人投资与公开发行；private是其中一个分项。",
      "limitations": [
        "总量和私人投资相互包含，不能相加。",
        "按2026报告修订口径统一历史值，不能与2025报告未修订数值混拼。",
        "私人投资不含部分政府支持资金。"
      ],
      "suggestedChart": "总量与私人分项双线图，或总量柱形图叠加私人部分；不自行推算其他三个分项。"
    },
    "privateFundingSizeEvents": {
      "id": "privateFundingSizeEvents",
      "title": "大额融资事件增加",
      "unit": "融资事件数",
      "classification": "statistical_fact",
      "values": [
        {
          "size": "超过10亿美元",
          "year2024": 15,
          "year2025": 28
        },
        {
          "size": "5亿–10亿美元",
          "year2024": 20,
          "year2025": 30
        },
        {
          "size": "1亿–5亿美元",
          "year2024": 146,
          "year2025": 286
        },
        {
          "size": "5000万–1亿美元",
          "year2024": 197,
          "year2025": 373
        },
        {
          "size": "低于5000万美元",
          "year2024": 2951,
          "year2025": 4464
        },
        {
          "size": "金额未披露",
          "year2024": 209,
          "year2025": 324
        }
      ],
      "totals": [
        {
          "year": 2024,
          "value": 3538
        },
        {
          "year": 2025,
          "value": 5505
        }
      ],
      "sourceURL": "https://hai.stanford.edu/assets/files/ai_index_report_2026_chapter_4_economy.pdf",
      "sourceTitle": "Stanford HAI — AI Index Report 2026, Chapter 4: Economy",
      "year": "2024–2025",
      "reportYear": 2026,
      "page": 181,
      "figure": "Table / Figure 4.2.6",
      "scope": "Quid 记录的私人 AI 融资事件按报告金额区间分组。",
      "limitations": [
        "事件数不是公司数，同一公司可有多次融资。",
        "各区间是报告分组，不要自行更改临界值口径。",
        "事件频率不等于融资金额占比。"
      ],
      "suggestedChart": "两年融资规模分组柱图，提供总数/分布比例切换；超过10亿美元单独重点卡。"
    },
    "robotInstallations2024": {
      "id": "robotInstallations2024",
      "title": "实体生产的自动化底座",
      "unit": "台 / 年",
      "classification": "statistical_fact",
      "values": [
        {
          "country": "中国",
          "value": 295000
        },
        {
          "country": "日本",
          "value": 44500
        },
        {
          "country": "美国",
          "value": 34200
        },
        {
          "country": "韩国",
          "value": 30600
        },
        {
          "country": "德国",
          "value": 26982
        }
      ],
      "globalTotal": 542000,
      "chinaSharePublished": 54,
      "sourceURL": "https://ifr.org/ifr-press-releases/news/global-robot-demand-in-factories-doubles-over-10-years",
      "sourceTitle": "IFR — World Robotics 2025: Global Robot Demand in Factories Doubles Over 10 Years",
      "year": 2024,
      "published": "2025-09-25",
      "scope": "工业机器人年度新增安装量；五大市场。",
      "limitations": [
        "工业机器人不等于采用 AI 的机器人。",
        "不是在役机器人总存量。",
        "发布机构对若干国家数值取整。",
        "安装量不能直接换算成产出增幅。"
      ],
      "suggestedChart": "国家排名柱形图；中国与全球其他地区的份额图须采用机构公布54%或注明计算近似。"
    },
    "dataCentreElectricity2025Vintage": {
      "id": "dataCentreElectricity2025Vintage",
      "title": "数据中心用电：历史估计与未来情景",
      "unit": "TWh / 年",
      "classification": "historical_estimate_and_forecast",
      "values": [
        {
          "year": 2024,
          "value": 415,
          "classification": "historical_estimate",
          "sharePercent": 1.5
        },
        {
          "year": 2030,
          "value": 945,
          "classification": "forecast",
          "scenario": "IEA 2025 Base Case",
          "shareDescription": "略低于全球用电量3%"
        }
      ],
      "sourceURL": "https://www.iea.org/reports/energy-and-ai/energy-demand-from-ai",
      "sourceTitle": "IEA — Energy and AI: Energy demand from AI",
      "year": "2024、2030",
      "reportYear": 2025,
      "published": "2025-04-10",
      "scope": "全球全部数据中心年用电，含常规服务器、AI相关加速服务器及存储、网络、制冷等。",
      "limitations": [
        "2030为2025报告基准情景预测，非已发生事实或2026最新版预测。",
        "不是 AI 专用用电量。",
        "2024亦是历史估计，不是精确普查值。",
        "不能直接据此推导AI碳排放。"
      ],
      "suggestedChart": "实心历史估计柱+斜纹预测柱；不插值添加2025–2029观测数据。"
    },
    "inferencePrice": {
      "id": "inferencePrice",
      "title": "同等能力门槛下的推理价格下降",
      "unit": "美元 / 百万 tokens",
      "classification": "benchmark_fact",
      "values": [
        {
          "date": "2022-11",
          "value": 20
        },
        {
          "date": "2024-10",
          "value": 0.07,
          "model": "Gemini-1.5-Flash-8B"
        }
      ],
      "sourceURL": "https://hai.stanford.edu/news/ai-index-2025-state-of-ai-in-10-charts",
      "sourceTitle": "Stanford HAI — AI Index 2025: State of AI in 10 Charts",
      "year": "2022–2024",
      "reportYear": 2025,
      "scope": "达到GPT-3.5相当MMLU表现（约64.8%）的最便宜可用模型查询价格。",
      "limitations": [
        "比较不同时间和模型，不是同一模型打折。",
        "特定基准相当，不是所有任务能力相同。",
        "不是训练成本。",
        "日期间隔约23个月，避免复述网页约18个月的错误。"
      ],
      "suggestedChart": "对数价格轴的端点对比；预算换算为教学计算并明确公式。"
    },
    "enterpriseScaling2026": {
      "id": "enterpriseScaling2026",
      "title": "AI 正从试点进入规模化，但大企业更快",
      "unit": "% 受访者",
      "classification": "survey_fact",
      "values": [
        {
          "metric": "全企业 AI 规模化",
          "year2025": 38,
          "year2026": 44
        },
        {
          "metric": "年营收超过10亿美元组织的AI智能体规模化",
          "year2025": 27,
          "year2026": 40
        },
        {
          "metric": "较小组织的AI智能体规模化",
          "year2025": 22,
          "year2026": 22
        }
      ],
      "sourceURL": "https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai",
      "sourceTitle": "McKinsey — The state of AI in 2026: On the road to ROI",
      "year": "2025–2026",
      "published": "2026-08-25",
      "scope": "2026原始在线调查：2026-05-04至06-08，1719名受访者、97国；按国家GDP贡献加权。前一年值采用该报告回溯比较。",
      "limitations": [
        "三行是不同问题与分组；不是同一个漏斗的阶段。",
        "受访者自报，非代表全球企业总体的严格普查。",
        "规模化不等于全面部署或已经产生盈利。"
      ],
      "suggestedChart": "三行哑铃图，清楚区分全部AI规模化与AI智能体规模化。"
    },
    "valueConversion2026": {
      "id": "valueConversion2026",
      "title": "个人感受到收益，组织价值仍需转化",
      "unit": "% 受访者",
      "classification": "survey_fact",
      "values": [
        {
          "metric": "称AI提高个人生产率",
          "value": 80
        },
        {
          "metric": "称AI帮助更好决策",
          "value": 50
        },
        {
          "metric": "将组织部分EBIT影响归因于AI",
          "value": 37
        },
        {
          "metric": "符合AI高绩效组织定义",
          "value": 6
        },
        {
          "metric": "称AI使用受运营成本约束",
          "value": 20
        }
      ],
      "sourceURL": "https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai",
      "sourceTitle": "McKinsey — The state of AI in 2026: On the road to ROI",
      "year": 2026,
      "published": "2026-08-25",
      "scope": "McKinsey 2026在线调查，1719名受访者、97国；高绩效定义为归因于AI的EBIT影响≥5%且描述AI价值为显著。",
      "limitations": [
        "80%是认为有改善的人数比例，不能写成生产率提高80%。",
        "各项问题和分母可能不同、群体可重叠；不能相加或构造转化漏斗。",
        "主观归因不是因果证明。"
      ],
      "suggestedChart": "分成个人体验/企业财务/成本约束三块小多图；每块显示原问句。"
    }
  },
  "studies": [
    {
      "id": "supportQJE",
      "task": "企业客服",
      "metric": "每小时成功解决的问题数",
      "effect": {
        "value": 15,
        "unit": "% 相对增加",
        "display": "+15%",
        "direction": "benefit",
        "metricType": "output_per_hour"
      },
      "sample": {
        "participants": 5172,
        "label": "5,172名客服"
      },
      "studyDesign": "一家财富500强软件企业分批引入AI助手的准实验分析；利用部署时间差与员工结果进行比较，非全样本随机分派。",
      "url": "https://doi.org/10.1093/qje/qjae044",
      "fullTextURL": "https://danielle.li/assets/docs/GenerativeAIatWork.pdf",
      "sourceTitle": "Brynjolfsson, Li, Raymond — Generative AI at Work, QJE",
      "publicationDate": "2025-02-04",
      "limitations": [
        "单企业、具体客服任务，不代表所有行业。",
        "员工经验与能力分组间效果不同。",
        "2023工作论文为14%、5179人，正式版为15%、5172人，不能混搭。"
      ]
    },
    {
      "id": "writingTime",
      "task": "职业写作",
      "metric": "完成写作任务的平均耗时",
      "effect": {
        "value": -40,
        "unit": "% 相对变化",
        "display": "耗时−40%",
        "direction": "benefit",
        "metricType": "time_per_task"
      },
      "sample": {
        "participants": 453,
        "label": "453名受过大学教育的专业人士"
      },
      "studyDesign": "预注册在线随机对照实验，按职业布置带激励的中等难度写作任务，随机允许部分参与者使用ChatGPT。",
      "url": "https://doi.org/10.1126/science.adh2586",
      "corroboratingURL": "https://news.mit.edu/2023/study-finds-chatgpt-boosts-worker-productivity-writing-0714",
      "sourceTitle": "Noy & Zhang — Experimental evidence on the productivity effects of generative artificial intelligence, Science",
      "publicationDate": "2023-07-14",
      "limitations": [
        "模拟的短时写作任务，不能外推整个职业工作时间。",
        "不包括完整组织流程中的事实核验等所有环节。",
        "早期MIT工作论文为444人、37%耗时减少；这里使用Science正式版453人、40%。",
        "耗时减少40%不是每小时产出提高40%。"
      ]
    },
    {
      "id": "writingQuality",
      "task": "职业写作",
      "metric": "独立评审者给出的输出质量评分",
      "effect": {
        "value": 18,
        "unit": "% 相对增加",
        "display": "质量评分+18%",
        "direction": "benefit",
        "metricType": "quality_score"
      },
      "sample": {
        "participants": 453,
        "label": "与writingTime同一实验，非另一个453人样本"
      },
      "studyDesign": "同一Noy–Zhang随机实验，由独立评审者评估任务作品。",
      "url": "https://doi.org/10.1126/science.adh2586",
      "corroboratingURL": "https://news.mit.edu/2023/study-finds-chatgpt-boosts-worker-productivity-writing-0714",
      "sourceTitle": "Noy & Zhang — Experimental evidence on the productivity effects of generative artificial intelligence, Science",
      "publicationDate": "2023-07-14",
      "limitations": [
        "任务作品评分不是职业整体绩效、事实准确率或收益。",
        "与耗时变化为不同指标，不能相加。",
        "不可把两项结果当成两个独立实验。"
      ]
    },
    {
      "id": "copilotOutput",
      "task": "企业软件开发",
      "metric": "每周完成的任务数（以Pull Requests衡量）",
      "effect": {
        "value": 26.08,
        "unit": "% 相对增加",
        "display": "完成任务数+26.08%",
        "direction": "benefit",
        "metricType": "output_per_week",
        "standardErrorPercent": 10.3
      },
      "sample": {
        "participants": 4867,
        "label": "三家公司共4,867名开发者"
      },
      "studyDesign": "Microsoft、Accenture与一家匿名财富100强企业的三个现场随机试验；以随机获得Copilot权限为工具变量，合并估计实际使用者效应。",
      "url": "https://doi.org/10.1287/mnsc.2025.00535",
      "preprintURL": "https://economics.mit.edu/sites/default/files/inline-files/draft_copilot_experiments.pdf",
      "sourceTitle": "Cui et al. — The Effects of Generative AI on High-Skilled Work: Evidence from Three Field Experiments with Software Developers, Management Science",
      "publicationDate": "2026-02-27",
      "preprintDate": "2025-02",
      "limitations": [
        "每个实验噪声较大、结果有差异；合并后才获得总体估计。",
        "26.08%是使用者的工具变量估计，不等于所有获分配权限员工的平均增加。",
        "Pull Requests数量不代表代码质量、任务难度或收入同比增加。",
        "旧代码补全助手实验，不代表2026多代理工具。",
        "标准误10.3个百分点，不是95%置信区间。"
      ]
    },
    {
      "id": "metrTime",
      "task": "熟悉代码库的资深开源开发者",
      "metric": "真实任务完成耗时",
      "effect": {
        "value": 19,
        "unit": "% 相对增加",
        "display": "耗时+19%",
        "direction": "cost",
        "metricType": "time_per_task",
        "confidenceIntervalPercent": [
          2,
          39
        ]
      },
      "sample": {
        "participants": 16,
        "tasks": 246,
        "label": "16名资深开发者、246个任务"
      },
      "studyDesign": "任务级随机对照实验；对参与者自己的成熟开源仓库中的真实任务随机允许或禁止AI；主要使用Cursor Pro和Claude3.5/3.7 Sonnet。",
      "url": "https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/",
      "updateURL": "https://metr.org/blog/2026-02-24-uplift-update/",
      "sourceTitle": "METR — Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity",
      "publicationDate": "2025-07-10",
      "studyPeriod": "2025年初（2026更新说明为2025-02至06的数据）",
      "limitations": [
        "小而特定的资深开发者样本、成熟熟悉仓库，不能概括全部编程工作。",
        "这是2025年初工具快照，不是当前所有工具。",
        "耗时+19%不能直接写成生产率−19%。",
        "2026-02-24续测因参与选择、报酬变化与并行代理计时问题被作者认为不可靠，不把续测点估计当确定结论。"
      ],
      "interpretation": "AI收益依赖任务、人员经验和工作流；核验成本有时可超过生成节约。"
    }
  ],
  "notes": [
    "AI Index 2026 于 2026-04-13 发布，经济统计大多对应 2025 年；年份与报告版次不可混淆。",
    "AI Index 官网经济摘要写生成式 AI 70%，但报告正文与图4.3.1均为79%；本数据按正文79%，已渲染核对。",
    "McKinsey 固定URL当前已更新为2026调查，不适合用作2025原文的唯一链接；2023–2025采用率链接到 AI Index 2026 的固定PDF。",
    "跨研究只比较方向和机制，不将时间、质量、工单数量、Pull Requests 混成统一生产率增幅，更不平均求综合值。",
    "写作耗时减少40%应写耗时−40%，不是效率提高40%；METR耗时+19%不是生产率−19%。",
    "所有已列数值有来源；未列年份留空，禁止插值补造真实观测。"
  ]
};
