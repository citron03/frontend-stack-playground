// 실행 환경: Windows + Git Bash/PowerShell
import { $, chalk, echo } from 'zx';

async function commandExists(cmd) {
  try {
    await $`where ${cmd}`;
    return true;
  } catch {
    return false;
  }
}

function handleError(step, error) {
  console.error(chalk.red(`\n[ERROR] ${step} 실패: ${error.message}\n`));
  process.exit(1);
}

(async () => {
  try {
    echo(chalk.blue('\n[chocolatey 설치 확인 중...]'));
    if (await commandExists('choco')) {
      echo(chalk.green('chocolatey이 이미 설치되어 있습니다.'));
    } else {
      echo(chalk.yellow('chocolatey이 설치되어 있지 않습니다. 설치를 진행합니다...'));
      try {
        await $`Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))`;
        echo(chalk.green('chocolatey 설치 완료!'));
      } catch (error) {
        handleError('chocolatey 설치', error);
      }
    }

    // echo(chalk.blue("\n[Docker 설치 확인 중...]"));
    // if (await commandExists("docker")) {
    //     echo(chalk.green("Docker가 이미 설치되어 있습니다."));
    // } else {
    //     echo(chalk.yellow("Docker가 설치되어 있지 않습니다. 설치를 진행합니다..."));
    //     try {
    //         await $`choco install docker-desktop`;
    //         echo(chalk.green("Docker 설치 완료!"));
    //     } catch (error) {
    //         handleError("Docker 설치", error);
    //     }
    // }

    echo(chalk.cyan('\n모든 설치가 완료되었습니다!'));
  } catch (error) {
    handleError('스크립트 실행', error);
  }
})();
