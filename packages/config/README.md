# Config package

The shared TypeScript compiler configuration used by the server and TypeScript packages.

## Key files

- `tsconfig.base.json` contains the shared compiler options.
- `package.json` names the package as `@ludika/config`.

There is no runtime source, build script, or public JavaScript entry point here. When changing `tsconfig.base.json`, expect every package that extends it to type-check differently. Keep options compatible with both server and browser-facing packages. Do not delete or rename the file without updating every `extends` reference.

## Dependencies and commands

This package currently has no dependencies. If it needs one, run `bun add <package>` or `bun remove <package>` from this workspace:


    bun add <package>
    bun remove <package>

For catalog dependencies, add the version to the root `workspaces.catalog` and set `"<dependency>": "catalog:"` in this workspace's `package.json`, then run `bun install` from the repository root. For an internal package, a copyable example is `bun add @ludika/utils@workspace:*`.
