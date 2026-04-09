// 测试导航系统
const navigation = require('./navigation.js');

console.log('=== 全栈开发伴侣导航系统测试 ===\n');

// 测试1：显示所有阶段
console.log('1. 所有开发阶段：');
navigation.getAllStages().forEach(stage => {
  console.log(`\n${stage.id} - ${stage.name}`);
  console.log(`  描述: ${stage.description}`);
  console.log(`  模块数: ${Object.keys(stage.modules).length}`);
});

// 测试2：显示用户类型推荐
console.log('\n\n2. 用户类型推荐：');
Object.keys(navigation.userTypes).forEach(userType => {
  const user = navigation.userTypes[userType];
  console.log(`\n${userType} - ${user.name}`);
  console.log(`  描述: ${user.description}`);
  const recs = navigation.getUserRecommendations(userType);
  console.log(`  推荐阶段: ${recs.length}个`);
});

// 测试3：测试项目路径推荐
console.log('\n\n3. 项目路径推荐：');
const projectTypes = ['ecommerce', 'blog', 'saas', 'static'];
projectTypes.forEach(type => {
  const path = navigation.getProjectPath(type);
  console.log(`\n${type} - ${path.name}`);
  console.log(`  阶段数: ${path.stages.length}`);
  if (path.specialNote) {
    console.log(`  特别提示: ${path.specialNote}`);
  }
});

// 测试4：生成导航菜单
console.log('\n\n4. 导航菜单示例：');
const menu = navigation.generateNavigationMenu('02-tech-selection', 'frontend-options');
console.log(menu.substring(0, 500) + '...'); // 只显示前500字符

// 测试5：模块信息获取
console.log('\n\n5. 模块信息测试：');
const stageInfo = navigation.getStageInfo('01-idea-clarification');
console.log(`阶段信息: ${stageInfo.name} - ${stageInfo.description}`);

const moduleInfo = navigation.getModuleInfo('01-idea-clarification', 'product-thinking');
console.log(`模块信息: ${moduleInfo.name} - ${moduleInfo.description}`);
console.log(`目标用户: ${moduleInfo.targetUsers.join(', ')}`);

console.log('\n=== 测试完成 ===');