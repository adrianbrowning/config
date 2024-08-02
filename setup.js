const fs = require('fs');
const path = require('path');

// Define file contents
const files = {
    'eslint.config.style.js': `
import { config as defaultConfig } from '@gingacodemonkey/config/styled'

/** @type {import("eslint").Linter.Config} */
export default [...defaultConfig]
`,
    '.husky/pre-commit': 'pnpm exec lint-staged\n',
    '.husky/commit-msg': `
pnpm exec commitlint --edit "$1";
FILE=$1
MESSAGE=$(cat $FILE)
TICKET=[$(git rev-parse --abbrev-ref HEAD | grep -Eo '^(\w+/)?(\w+[-_])?[0-9]+' | grep -Eo '(\w+[-])?[0-9]+' | tr "[:lower:]" "[:upper:]")]
if [[ $TICKET == "[]" || "$MESSAGE" == "$TICKET"* ]];then
  exit 0;
fi
# Strip leading '['
TICKET="\${TICKET#\\[}"
# Strip trailing ']'
TICKET="\${TICKET %\\]}"
echo $"$TICKET\\n\\n$MESSAGE" > $FILE
`,
    '.lintstagedrc': JSON.stringify({
        '*.{js,ts,tsx}': ['eslint --config eslint.config.style.js --fix --max-warnings=0 --cache']
    }, null, 2),
    'commitlint.config.js': `
export default {
  "extends": [ "@commitlint/config-conventional" ],
  "rules": {
    "subject-case": [ 2, "always", [ "sentence-case", "lower-case" ]],
  },
};
`
};

// Create files
for (const [file, content] of Object.entries(files)) {
    const filePath = path.join(process.cwd(), file);
    fs.writeFileSync(filePath, content.trim() + '\n', {encoding: 'utf8'});
}

// Install dependencies
const execSync = require('child_process').execSync;
execSync('pnpm i -D husky @commitlint/cli @commitlint/config-conventional lint-staged', {stdio: 'inherit'});
execSync('pnpm exec husky init', {stdio: 'inherit'});
