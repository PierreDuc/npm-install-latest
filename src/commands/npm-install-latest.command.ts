import { table, getBorderCharacters } from 'table';

import { askBoolean, execCmd, spawnCmd } from '../utilities/node.utilities.js';
import { OutdatedPackage } from '../models/node.models.js';

export async function npmInstallLatest(global?: boolean): Promise<void> {
  try {
    const json = await execCmd(`npm ${global ? '-g' : ''} --json outdated`, true);

    const packageObj: Record<string, OutdatedPackage> = JSON.parse(json);
    const packages = Object.entries(packageObj);

    if (!packages.length) {
      process.stdout.write('Congratulations, everything is up to date!\n');
    } else {
      const tableData = [
        [ 'Package', 'Current', 'Latest' ],
        ...packages.map(([ name, data ]) => [ name, data.current, data.latest ])
      ]

      process.stdout.write(table(
        tableData,
        {
          columns: {0:  {alignment: 'left'}, 1: { alignment: 'right' }, 2: { alignment: 'right' } },
          border: getBorderCharacters('void')
        }
      ));

      const proceed = await askBoolean(`There are ${packages.length} ${global ? 'global' : 'local'} package(s) out of date. Do you want to proceed?`, 'y');

      if (proceed) {
        await spawnCmd('npm', [
          'i',
          ...(global ? [ '-g' ] : []),
          ...packages.map(([ name, data ]) => `${name}@${data.latest}`)
        ]);

        process.stdout.write('Congratulations, everything is up to date!\n');
      }
    }
  } catch (e) {
    process.stderr.write('Something went wrong updating your packages')
    process.stderr.write(e.toString())
  }
}
