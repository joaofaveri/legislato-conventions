# Legislato Conventions

This NPM package automates the configuration of Conventional Commits and Changelogs for projects within Legislato, ensuring a consistent and efficient Git workflow across all repositories.

## Purpose

The main purpose of this package is to streamline the setup of essential tools for commit and release management, such as Husky, Commitlint, Commitizen, and Release-it. With a single command, you can configure your Legislato projects to adhere to standardized commit conventions and automatically generate changelogs.

## Installation

To install the package, execute the following command:

```bash
npx legislato-conventions
```

## Usage

After installation, the package will perform the following actions:

1.  Install the necessary dependencies (Husky, Commitlint, Commitizen, Release-it, etc.).
2.  Copy the configuration files to your project.
3.  Modify the `package.json` file to add the required scripts and configurations.

## Next Steps

After configuration, follow these steps:

1.  Create a `.env` file in your project root.
2.  Add the following line to the `.env` file:

    GITHUB_TOKEN=your_github_personal_access_token

    (Replace `your_github_personal_access_token` with your actual GitHub personal access token).
3.  This will allow `release-it` to automate releases on GitHub.

## Scripts Added to `package.json`

The package will add the following scripts to your `package.json`:

* `"prepare": "husky"`: Installs Husky to configure Git hooks.
* `"release": "npm run test && npm run build && dotenv release-it -- --verbose"`: Automates the release process with `release-it`.
* `"release:no-npm": "npm run test && dotenv release-it -- --no-npm.publish"`: Automates the release process without publishing to NPM.
* `"release:changelog": "npm run test && npm run build && dotenv release-it -- --changelog"`: Print the changelog without releasing anything.
* `"release:version": "npm run test && npm run build && dotenv release-it -- --release-version"`: Print the next version without releasing anything.

## Configuration Added to `package.json`

The package will add the following configuration to your `package.json`:

```json
"config": {
  "commitizen": {
    "path": "./node_modules/git-cz"
  }
}
```

## Contributing

Contributions are welcome! Feel free to open issues and pull requests.

## License

This package is distributed under the MIT license.
