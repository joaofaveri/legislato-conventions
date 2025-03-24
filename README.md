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

## Roadmap

Here are the planned enhancements and future directions for the `legislato-conventions` package:

### 1. Unit Testing

* Implement comprehensive unit tests to ensure the reliability and stability of the package.
* Utilize Jest for testing to cover all functionalities, including edge cases and error handling.

### 2. Package Manager Support

* Extend support to include other popular package managers such as Yarn and pnpm.
* Modify installation scripts to detect and adapt to the user's preferred package manager.

### 3. ESLint Configuration

* Integrate ESLint configuration to enforce coding standards and best practices.
* Provide a default ESLint setup that aligns with Legislato's coding guidelines.

### 4. Interactive Configuration

* Develop an interactive CLI mode to allow users to customize configurations during installation.
* Enable users to select which tools to install and configure based on their project's needs.

### 5. Enhanced Documentation

* Create detailed documentation that covers all aspects of the package, including usage examples and troubleshooting guides.
* Publish documentation on a dedicated website or platform for easy access and updates.

### 6. Support for Monorepos

* Extend support for monorepo setups, allowing for consistent configuration across multiple projects within a single repository.
* Investigate tools like Lerna or Nx to manage monorepo configurations effectively.

These enhancements aim to make `legislato-conventions` a more robust, versatile, and user-friendly tool for Legislato's development workflow. Contributions and suggestions from the community are highly welcomed to help shape the future of this package.

## Contributing

Contributions are welcome! Feel free to open issues and pull requests.

## License

This package is distributed under the MIT license.
