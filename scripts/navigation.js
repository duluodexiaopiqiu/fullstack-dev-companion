// 全栈开发伴侣 - 模块导航系统
// 提供阶段间跳转和模块选择功能

const navigation = {
  // 阶段定义
  stages: {
    '01-idea-clarification': {
      name: '想法澄清',
      description: '明确产品定位、目标用户、核心价值',
      modules: {
        'product-thinking': {
          name: '产品思维工具包',
          description: '需求分析、用户画像、竞品分析等产品思维工具',
          targetUsers: ['开发人员', '产品新手', '创业者']
        },
        'market-analysis': {
          name: '市场分析工具',
          description: '市场规模、用户痛点、商业模式分析工具',
          targetUsers: ['产品人员', '创业者', '市场人员']
        }
      }
    },
    '02-tech-selection': {
      name: '技术选型',
      description: '选择最适合的技术栈组合',
      modules: {
        'frontend-options': {
          name: '前端技术选项',
          description: 'Vue/React/Next.js、UI组件库、状态管理等前端技术选择',
          targetUsers: ['前端开发', '全栈开发', '技术负责人']
        },
        'ui-style-options': {
          name: 'UI风格与审美',
          description: '避免AI化烂大街风格，提供有审美的UI设计选择',
          targetUsers: ['前端开发', '产品人员', '设计人员', '创业者']
        },
        'backend-options': {
          name: '后端技术选项',
          description: 'Node.js/Python/Go、框架选择、API设计等后端技术选择',
          targetUsers: ['后端开发', '全栈开发', '技术负责人']
        },
        'database-options': {
          name: '数据库选项',
          description: 'MySQL/MongoDB/PostgreSQL、ORM选择等数据库技术',
          targetUsers: ['后端开发', 'DBA', '全栈开发']
        }
      }
    },
    '03-project-setup': {
      name: '项目搭建',
      description: '配置开发环境，创建项目结构',
      modules: {
        'env-configuration': {
          name: '环境配置',
          description: '开发工具安装、环境变量设置、依赖管理',
          targetUsers: ['所有开发人员', 'DevOps']
        },
        'project-templates': {
          name: '项目模板',
          description: '各技术栈的starter模板和项目结构',
          targetUsers: ['所有开发人员', '项目负责人']
        },
        'version-management': {
          name: '版本管理',
          description: 'Git工作流、分支策略、提交规范',
          targetUsers: ['所有开发人员', '团队负责人']
        }
      }
    },
    '04-development-guide': {
      name: '开发指导',
      description: '编写高质量代码，建立开发规范',
      modules: {
        'coding-best-practices': {
          name: '编码最佳实践',
          description: '代码结构、命名规范、错误处理等编码规范',
          targetUsers: ['所有开发人员', '代码审查员']
        },
        'testing-strategies': {
          name: '测试策略',
          description: '单元测试、集成测试、E2E测试等测试方法',
          targetUsers: ['测试工程师', '开发人员', '质量保证']
        },
        'debug-tools': {
          name: '调试工具',
          description: '浏览器DevTools、日志系统、性能分析等调试工具',
          targetUsers: ['所有开发人员', '运维人员']
        }
      }
    },
    '05-deployment': {
      name: '部署上线',
      description: '将应用部署到生产环境',
      modules: {
        'server-options': {
          name: '服务器选项',
          description: '云服务器、容器化、Serverless等部署方案',
          targetUsers: ['DevOps', '后端开发', '运维人员']
        },
        'domain-config': {
          name: '域名配置',
          description: '域名购买、DNS设置、SSL证书等域名相关配置',
          targetUsers: ['产品人员', '运维人员', '创业者']
        },
        'monitoring-tools': {
          name: '监控工具',
          description: '错误监控、性能监控、用户行为分析等监控方案',
          targetUsers: ['运维人员', '产品人员', '开发人员']
        }
      }
    },
    '06-maintenance': {
      name: '维护优化',
      description: '持续改进应用质量和性能',
      modules: {
        'performance-optimization': {
          name: '性能优化',
          description: '加载速度、内存管理、数据库优化等性能提升方法',
          targetUsers: ['前端开发', '后端开发', '运维人员']
        },
        'security-checklist': {
          name: '安全检查',
          description: '安全漏洞扫描、数据加密、权限控制等安全措施',
          targetUsers: ['安全工程师', '开发人员', '运维人员']
        },
        'scaling-strategies': {
          name: '扩展策略',
          description: '水平扩展、垂直扩展、微服务架构等扩展方案',
          targetUsers: ['架构师', '技术负责人', 'DevOps']
        }
      }
    }
  },

  // 用户类型定义
  userTypes: {
    'developer': {
      name: '开发人员',
      description: '专注于技术实现，需要产品思维补充',
      recommendedStages: ['01-idea-clarification', '04-development-guide', '06-maintenance']
    },
    'product-manager': {
      name: '产品人员',
      description: '专注于产品设计，需要技术实现了解',
      recommendedStages: ['02-tech-selection', '03-project-setup', '05-deployment']
    },
    'beginner': {
      name: '开发新手',
      description: '需要从零开始的完整指导',
      recommendedStages: ['01-idea-clarification', '02-tech-selection', '03-project-setup', '04-development-guide']
    },
    'entrepreneur': {
      name: '创业者',
      description: '需要从想法到上线的全流程',
      recommendedStages: ['01-idea-clarification', '02-tech-selection', '05-deployment']
    },
    'fullstack': {
      name: '全栈开发',
      description: '需要前后端完整技术栈指导',
      recommendedStages: ['02-tech-selection', '03-project-setup', '04-development-guide', '05-deployment']
    }
  },

  // 导航函数
  getStageInfo(stageId) {
    return this.stages[stageId] || null;
  },

  getModuleInfo(stageId, moduleId) {
    const stage = this.stages[stageId];
    return stage ? stage.modules[moduleId] || null : null;
  },

  getUserRecommendations(userType) {
    const user = this.userTypes[userType];
    if (!user) return [];
    
    return user.recommendedStages.map(stageId => ({
      stageId,
      ...this.stages[stageId],
      recommendedModules: Object.keys(this.stages[stageId].modules)
        .filter(moduleId => 
          this.stages[stageId].modules[moduleId].targetUsers.includes(user.name)
        )
    }));
  },

  getAllStages() {
    return Object.keys(this.stages).map(stageId => ({
      id: stageId,
      ...this.stages[stageId]
    }));
  },

  // 根据项目类型推荐路径
  getProjectPath(projectType) {
    const paths = {
      'ecommerce': {
        name: '电商网站开发路径',
        stages: [
          { stage: '01-idea-clarification', focus: 'product-thinking' },
          { stage: '02-tech-selection', focus: 'frontend-options,backend-options,database-options' },
          { stage: '03-project-setup', focus: 'project-templates' },
          { stage: '04-development-guide', focus: 'coding-best-practices' },
          { stage: '05-deployment', focus: 'server-options,domain-config' },
          { stage: '06-maintenance', focus: 'performance-optimization,security-checklist' }
        ]
      },
      'blog': {
        name: '个人博客开发路径',
        stages: [
          { stage: '01-idea-clarification', focus: 'market-analysis' },
          { stage: '02-tech-selection', focus: 'frontend-options' },
          { stage: '03-project-setup', focus: 'project-templates' },
          { stage: '05-deployment', focus: 'server-options' },
          { stage: '06-maintenance', focus: 'performance-optimization' }
        ]
      },
      'saas': {
        name: 'SaaS应用开发路径',
        stages: [
          { stage: '01-idea-clarification', focus: 'product-thinking,market-analysis' },
          { stage: '02-tech-selection', focus: 'frontend-options,backend-options,database-options' },
          { stage: '03-project-setup', focus: 'env-configuration,version-management' },
          { stage: '04-development-guide', focus: 'coding-best-practices,testing-strategies' },
          { stage: '05-deployment', focus: 'server-options,monitoring-tools' },
          { stage: '06-maintenance', focus: 'scaling-strategies,security-checklist' }
        ]
      },
      'static': {
        name: '静态页面开发路径',
        stages: [
          { stage: '01-idea-clarification', focus: 'product-thinking' },
          { stage: '02-tech-selection', focus: 'frontend-options' },
          { stage: '03-project-setup', focus: 'project-templates' },
          { stage: '05-deployment', focus: 'server-options' }
        ],
        specialNote: '注意：1-5个简单页面建议使用纯HTML/CSS/JavaScript，避免框架过度设计'
      }
    };
    
    return paths[projectType] || paths['ecommerce'];
  },

  // 生成导航菜单
  generateNavigationMenu(currentStage = null, currentModule = null) {
    let menu = '## 📍 全栈开发伴侣 - 导航菜单\n\n';
    
    if (currentStage && currentModule) {
      menu += `**当前位置**: ${this.stages[currentStage].name} > ${this.stages[currentStage].modules[currentModule].name}\n\n`;
    } else if (currentStage) {
      menu += `**当前位置**: ${this.stages[currentStage].name}\n\n`;
    }
    
    menu += '### 🏗️ 开发阶段\n';
    Object.keys(this.stages).forEach(stageId => {
      const stage = this.stages[stageId];
      menu += `\n**${stageId} - ${stage.name}**\n`;
      menu += `> ${stage.description}\n`;
      
      Object.keys(stage.modules).forEach(moduleId => {
        const module = stage.modules[moduleId];
        const isCurrent = (currentStage === stageId && currentModule === moduleId);
        menu += `  - ${isCurrent ? '📍 ' : '  '}${module.name}: ${module.description}\n`;
      });
    });
    
    menu += '\n### 👥 用户类型推荐\n';
    Object.keys(this.userTypes).forEach(userType => {
      const user = this.userTypes[userType];
      menu += `\n**${user.name}**\n`;
      menu += `> ${user.description}\n`;
      menu += `  推荐阶段: ${user.recommendedStages.map(s => this.stages[s].name).join(', ')}\n`;
    });
    
    menu += '\n### 🚀 快速开始\n';
    menu += '1. 告诉我您的身份（开发人员/产品人员/新手/创业者）\n';
    menu += '2. 描述您的项目想法\n';
    menu += '3. 我将为您推荐最适合的进入路径\n';
    
    return menu;
  }
};

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = navigation;
}

// 浏览器环境使用
if (typeof window !== 'undefined') {
  window.FullstackNavigation = navigation;
}