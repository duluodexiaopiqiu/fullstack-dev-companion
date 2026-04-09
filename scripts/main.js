#!/usr/bin/env node

// 全栈开发伴侣 - 主入口脚本
// 处理用户交互和模块调度

const navigation = require('./navigation.js');

// 工具函数
function printHeader() {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║                全栈开发伴侣 (Fullstack Development Companion)  ║
║                    模块化开发全流程指导工具                    ║
╚══════════════════════════════════════════════════════════════╝
`);
}

function printStageMenu() {
  console.log(navigation.generateNavigationMenu());
}

function getUserType() {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    console.log('\n👤 请选择您的身份：');
    Object.keys(navigation.userTypes).forEach((key, index) => {
      const user = navigation.userTypes[key];
      console.log(`${index + 1}. ${user.name} - ${user.description}`);
    });
    console.log('0. 显示完整导航菜单');

    readline.question('\n请输入编号: ', (answer) => {
      readline.close();
      
      const index = parseInt(answer);
      if (index === 0) {
        printStageMenu();
        resolve(null);
      } else if (index > 0 && index <= Object.keys(navigation.userTypes).length) {
        const userType = Object.keys(navigation.userTypes)[index - 1];
        resolve(userType);
      } else {
        console.log('❌ 无效的选择，请重新运行程序');
        resolve(null);
      }
    });
  });
}

function getProjectType() {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    console.log('\n🎯 请选择项目类型：');
    console.log('1. 电商网站 (商品展示、购物车、支付)');
    console.log('2. 个人博客 (技术分享、文章发布)');
    console.log('3. SaaS应用 (多租户、订阅制)');
    console.log('4. 静态页面/简单网站 (1-5个页面，产品介绍、活动页)');
    console.log('5. 企业后台管理系统 (数据管理、用户权限)');
    console.log('6. 移动应用 (React Native/Flutter)');
    console.log('7. 其他 (自定义描述)');

    readline.question('\n请输入编号: ', (answer) => {
      readline.close();
      
      const projectTypes = ['ecommerce', 'blog', 'saas', 'static', 'admin', 'mobile', 'custom'];
      const index = parseInt(answer);
      
      if (index > 0 && index <= projectTypes.length) {
        if (index === 7) {
          // 自定义项目类型
          const customRl = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
          });
          
          customRl.question('请简要描述您的项目: ', (description) => {
            customRl.close();
            resolve({ type: 'custom', description });
          });
        } else {
          resolve({ type: projectTypes[index - 1] });
        }
      } else {
        console.log('❌ 无效的选择，使用默认电商类型');
        resolve({ type: 'ecommerce' });
      }
    });
  });
}

function recommendPath(userType, projectType) {
  console.log('\n📋 为您推荐的开发路径：');
  console.log('='.repeat(60));
  
  // 获取用户推荐
  const userRecs = navigation.getUserRecommendations(userType);
  
  // 获取项目推荐
  const projectPath = navigation.getProjectPath(projectType.type);
  
  console.log(`👤 身份: ${navigation.userTypes[userType].name}`);
  console.log(`🎯 项目: ${projectType.type === 'custom' ? projectType.description : projectPath.name}`);
  
  // 静态页面的特殊提示
  if (projectType.type === 'static') {
    console.log('\n💡 特别提醒：对于1-5个简单页面，强烈建议使用纯HTML/CSS/JavaScript开发！');
    console.log('   优点：性能最优、部署最简单、学习成本最低、无框架依赖');
    console.log('   查看 templates/static-page-guide.md 获取完整指南');
  }
  
  console.log('');
  
  // 合并推荐
  const allStages = navigation.getAllStages();
  
  allStages.forEach(stage => {
    const isUserRecommended = userRecs.some(rec => rec.stageId === stage.id);
    const isProjectRecommended = projectPath.stages.some(s => s.stage === stage.id);
    
    if (isUserRecommended || isProjectRecommended) {
      console.log(`✅ ${stage.id} - ${stage.name}`);
      console.log(`   ${stage.description}`);
      
      // 推荐模块
      const projectStage = projectPath.stages.find(s => s.stage === stage.id);
      if (projectStage) {
        const focusModules = projectStage.focus.split(',');
        focusModules.forEach(moduleId => {
          const module = stage.modules[moduleId];
          if (module) {
            console.log(`   • ${module.name}: ${module.description}`);
          }
        });
      }
      
      console.log('');
    }
  });
  
  console.log('='.repeat(60));
  console.log('\n🚀 接下来您可以：');
  console.log('1. 按推荐路径开始开发');
  console.log('2. 进入特定阶段查看详细指导');
  console.log('3. 查看其他用户类型的推荐');
  console.log('4. 退出程序');
}

function interactiveMode() {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('\n💬 交互模式已启动，输入以下命令：');
  console.log('  menu - 显示导航菜单');
  console.log('  stages - 列出所有阶段');
  console.log('  users - 列出用户类型');
  console.log('  exit - 退出程序');
  console.log('  或直接输入阶段ID进入该阶段 (如: 01-idea-clarification)');

  function prompt() {
    readline.question('\n> ', async (command) => {
      switch (command.toLowerCase()) {
        case 'menu':
          printStageMenu();
          break;
          
        case 'stages':
          console.log('\n🏗️ 所有开发阶段：');
          navigation.getAllStages().forEach(stage => {
            console.log(`\n${stage.id} - ${stage.name}`);
            console.log(`  ${stage.description}`);
          });
          break;
          
        case 'users':
          console.log('\n👥 所有用户类型：');
          Object.keys(navigation.userTypes).forEach(key => {
            const user = navigation.userTypes[key];
            console.log(`\n${key} - ${user.name}`);
            console.log(`  ${user.description}`);
          });
          break;
          
        case 'exit':
          console.log('👋 感谢使用全栈开发伴侣，再见！');
          readline.close();
          return;
          
        default:
          // 检查是否是阶段ID
          if (navigation.stages[command]) {
            const stage = navigation.stages[command];
            console.log(`\n📁 进入阶段: ${stage.name}`);
            console.log(`  ${stage.description}`);
            console.log('\n可用模块：');
            Object.keys(stage.modules).forEach(moduleId => {
              const module = stage.modules[moduleId];
              console.log(`  • ${moduleId}: ${module.name}`);
              console.log(`    ${module.description}`);
            });
          } else {
            console.log('❓ 未知命令，请输入 menu、stages、users、exit 或阶段ID');
          }
      }
      
      prompt(); // 继续提示
    });
  }
  
  prompt();
}

// 主函数
async function main() {
  printHeader();
  
  const args = process.argv.slice(2);
  
  if (args.length > 0) {
    // 命令行参数模式
    switch (args[0]) {
      case 'menu':
        printStageMenu();
        break;
        
      case 'guide':
        const userType = await getUserType();
        if (userType) {
          const projectType = await getProjectType();
          recommendPath(userType, projectType);
        }
        break;
        
      case 'interactive':
        interactiveMode();
        break;
        
      default:
        console.log('可用命令:');
        console.log('  node main.js menu        - 显示导航菜单');
        console.log('  node main.js guide       - 引导式路径推荐');
        console.log('  node main.js interactive - 交互模式');
        break;
    }
  } else {
    // 默认引导模式
    console.log('欢迎使用全栈开发伴侣！\n');
    
    const userType = await getUserType();
    if (userType) {
      const projectType = await getProjectType();
      recommendPath(userType, projectType);
      
      // 询问是否进入交互模式
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      readline.question('\n是否进入交互模式？(y/n): ', (answer) => {
        readline.close();
        if (answer.toLowerCase() === 'y') {
          interactiveMode();
        } else {
          console.log('👋 感谢使用，如需帮助请再次运行本程序！');
        }
      });
    }
  }
}

// 运行主函数
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  navigation,
  main,
  interactiveMode
};