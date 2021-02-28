import { createInterface } from 'readline';

import { exec, spawn } from 'child_process';
import { NoValues, YesValues } from '../models/node.models.js';

export async function askBoolean(question: string, defaultValue?: 'y' | 'n'): Promise<boolean> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const isYesDefault = YesValues.includes(defaultValue);
  const isNoDefault = NoValues.includes(defaultValue);

  const fullQuestion = `${question.trim()}: ${isYesDefault ? '[yes]' : 'yes'}/${isNoDefault ? '[no]' : 'no'}: `

  return new Promise<boolean>((resolve) => {
    rl.question(fullQuestion, async (answer) => {
      rl.close();
      answer = answer.trim().toLowerCase();

      const yes = answer ? YesValues.includes(answer) : isYesDefault;
      const no = answer ? NoValues.includes(answer) : isNoDefault;

      if (yes || no) {
        resolve(yes)
      } else {
        process.stdout.write('\nInvalid Response.\n');
        process.stdout.write('Answer either yes : (' + YesValues.join(', ')+') \n');
        process.stdout.write('Or no: (' + NoValues.join(', ') + ') \n\n');

        resolve(await askBoolean(question, defaultValue));
      }
    })
  });
}


export function execCmd(cmd: string, skipErrorOnOut?: boolean): Promise<string> {
  return new Promise<string>((resolve, reject) =>
    exec(cmd, { encoding: 'utf-8' }, (error, stdout, stderr) => {
      if (stdout && skipErrorOnOut) {
        resolve(stdout);
      }

      if (error) {
        reject(stderr || error);
      }

      resolve(stdout);
    })
  );
}

export function spawnCmd(cmd: string, args: string[]): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    spawn(cmd, args, { shell: true, stdio: 'inherit' }).on('exit', (code) => code ? reject(code): resolve(code));
  });
}
