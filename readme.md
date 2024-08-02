# `@gingacodemonkey/config`

This is a combination of the work by 
- Matt Pocock [@total-typescript/tsconfig](https://github.com/total-typescript/tsconfig)
- EpicWeb-Dev [@epicweb-dev/config][epicweb-dev/config]

This package makes those decisions even easier. Based on Matt Pococks' [TSConfig Cheat Sheet](https://www.totaltypescript.com/tsconfig-cheat-sheet).

## TSConfig

### Setup

1. Install:

```bash
npm install --save-dev @gingacodemonkey/config
```

2. Choose which `tsconfig.json` you need from the [list](#list-of-tsconfigs) below.

3. Add it to your `tsconfig.json`:

```jsonc
{
  // I'm building an app that runs in the DOM with an external bundler
  "extends": "@gingacodemonkey/config/bundler/dom/app"
}
```

### List of TSConfigs

The tricky thing about `tsconfig.json` is there is _not_ a single config file that can work for everyone. But, with two or three questions, we can get there:

#### Are You Using `tsc` To Turn Your `.ts` Files Into `.js` Files?

##### Yes

If yes, use this selection of configs:

```jsonc
{
  // My code runs in the DOM:
  "extends": "@gingacodemonkey/config/tsc/dom/app", // For an app
  "extends": "@gingacodemonkey/config/tsc/dom/library", // For a library
  "extends": "@gingacodemonkey/config/tsc/dom/library-monorepo", // For a library in a monorepo

  // My code _doesn't_ run in the DOM (for instance, in Node.js):
  "extends": "@gingacodemonkey/config/tsc/no-dom/app", // For an app
  "extends": "@gingacodemonkey/config/tsc/no-dom/library", // For a library
  "extends": "@gingacodemonkey/config/tsc/no-dom/library-monorepo" // For a library in a monorepo
}
```

##### No

If no, you're probably using an external bundler. Most frontend frameworks, like Vite, Remix, Astro, Nuxt, and others, will fall into this category. If so, use this selection of configs:

```jsonc
{
  // My code runs in the DOM:
  "extends": "@gingacodemonkey/config/bundler/dom/app", // For an app
  "extends": "@gingacodemonkey/config/bundler/dom/library", // For a library
  "extends": "@gingacodemonkey/config/bundler/dom/library-monorepo", // For a library in a monorepo

  // My code _doesn't_ run in the DOM (for instance, in Node.js):
  "extends": "@gingacodemonkey/config/bundler/no-dom/app", // For an app
  "extends": "@gingacodemonkey/config/bundler/no-dom/library", // For a library
  "extends": "@gingacodemonkey/config/bundler/no-dom/library-monorepo" // For a library in a monorepo
}
```

### Options Not Covered:

#### `jsx`

If your app has JSX, you can set the `jsx` option in your `tsconfig.json`:

```json
{
  "extends": "@gingacodemonkey/config/bundler/dom/app",
  "compilerOptions": {
    "jsx": "react-jsx"
  }
}
```

#### `outDir`

Mostly relevant for when you're transpiling with `tsc`. If you want to change the output directory of your compiled files, you can set the `outDir` option in your `tsconfig.json`:

```json
{
  "extends": "@gingacodemonkey/config/tsc/node/library",
  "compilerOptions": {
    "outDir": "dist"
  }
}
```

## ESLint

Create a `eslint.config.js` file in your project root with the following
content:

```js
import { config as defaultConfig } from '@gingacodemonkey/config/eslint'

/** @type {import("eslint").Linter.Config} */
export default [...defaultConfig]
```

<details>
  <summary>Customizing ESLint</summary>

Learn more from
[the Eslint docs here](https://eslint.org/docs/latest/extend/shareable-configs#overriding-settings-from-shareable-configs).

</details>

## ESLint Styling

There is a separate export, that you can use for styling.  
Create a `eslint.config.style.js` file in your project root with the following contents:

```js
import { config as defaultConfig } from '@gingacodemonkey/config/styled'

/** @type {import("eslint").Linter.Config} */
export default [...defaultConfig]
```

This is meant to be run with [Husky](https://www.npmjs.com/package/husky), [CommitLint](https://www.npmjs.com/package/@commitlint/cli) and [Lint-Staged](https://www.npmjs.com/package/lint-staged)

```shell
pnpm i -D husky @commitlint/cli @commitlint/config-conventional lint-staged
pnpm exec husky init
```

This will create the `.husky` folder at the root of your project.

### File creation

#### Husky pre-commit

Create the file `.husky/pre-commit` with the contents:
```shell
pnpm exec lint-staged
```

#### Husky commit-message

Create the file `.husky/commit-msg` with the contents:
```shell
pnpm exec commitlint --edit "$1";
FILE=$1
MESSAGE=$(cat $FILE)
TICKET=[$(git rev-parse --abbrev-ref HEAD | grep -Eo '^(\w+/)?(\w+[-_])?[0-9]+' | grep -Eo '(\w+[-])?[0-9]+' | tr "[:lower:]" "[:upper:]")]
if [[ $TICKET == "[]" || "$MESSAGE" == "$TICKET"* ]];then
  exit 0;
fi
# Strip leading '['
TICKET="${TICKET#\[}"
# Strip trailing ']'
TICKET="${TICKET%\]}"
echo $"$TICKET\n\n$MESSAGE" > $FILE
```

#### Lint Staged

Create the file `.lintstagedrc` with the contents:
```json
{
  "*.{js,ts,tsx}": ["eslint --config eslint.config.style.js --fix --max-warnings=0 --cache"]
}
```

#### Commit Lint

Create the file `commitlint.config.js` with the contents:
```js
export default {
  "extends": [ "@commitlint/config-conventional" ],
  "rules": {
    "subject-case": [ 2, "always", [ "sentence-case", "lower-case" ]],
  },
};
```
