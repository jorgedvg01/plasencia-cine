import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const worker = resolve(fileURLToPath(new URL('./integration-model.mjs', import.meta.url)));
const models = ['atlas', 'cronologia', 'reescritura'];
const modes = ['desktop', 'mobile', 'reduced'];
let failed = false;

for (const model of models) {
  for (const mode of modes) {
    const result = spawnSync(process.execPath, [worker, model, mode], { stdio: 'inherit' });
    if (result.status !== 0) failed = true;
  }
}

if (failed) process.exitCode = 1;
else console.log('INTEGRACIÓN DOM · 3 modelos × 8 capítulos × escritorio/móvil/reduced motion superados.');
