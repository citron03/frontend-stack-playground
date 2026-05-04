// 실행 환경: Node.js (macOS/Linux/Windows 공통)
import inquirer from 'inquirer';
import { $ } from 'zx';

const promptCommitMessage = async () => {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'type',
      message: '커밋 타입을 선택하세요:',
      choices: [
        { name: 'feat: 새로운 기능', value: 'feat' },
        { name: 'fix: 버그 수정', value: 'fix' },
        { name: 'docs: 문서 수정', value: 'docs' },
        { name: 'style: 코드 스타일 수정', value: 'style' },
        { name: 'refactor: 코드 리팩터링', value: 'refactor' },
        { name: 'test: 테스트 추가/수정', value: 'test' },
        { name: 'chore: 기타 변경사항', value: 'chore' },
      ],
    },
    {
      type: 'input',
      name: 'scope',
      message: '영향받는 범위(scope)를 입력하세요 (예: 컴포넌트 이름, 생략 가능):',
      validate: (input) => (input.length <= 10 ? true : '범위는 최대 10글자까지만 입력하세요.'),
    },
    {
      type: 'input',
      name: 'subject',
      message: '변경 사항의 요약을 입력하세요:',
      validate: (input) =>
        input.length > 0 && input.length <= 100
          ? true
          : '요약은 1글자 이상, 100글자 이하로 입력하세요.',
    },
  ]);
};

// main 실행
(async () => {
  const { type, scope, subject } = await promptCommitMessage();
  const scopeStr = scope ? `(${scope})` : '';
  const commitMessage = `${type}${scopeStr}: ${subject}`;

  console.log('\n📝 생성된 커밋 메시지:');
  console.log(`  ${commitMessage}\n`);

  const { confirmCommit } = await inquirer.prompt({
    type: 'confirm',
    name: 'confirmCommit',
    message: '이 메시지로 커밋하시겠습니까?',
  });

  if (confirmCommit) {
    await $`git commit -m ${commitMessage}`;
    console.log('🚀 커밋 완료!');
  } else {
    console.log('⚠️  커밋이 취소되었습니다.');
  }
})();
