# Legislato Conventions

This NPM package automates the configuration of Conventional Commits and Changelogs for projects within Legislato, ensuring a consistent and efficient Git workflow across all repositories.

## Purpose

The main purpose of this package is to streamline the setup of essential tools for commit and release management, such as Husky, Commitlint, Commitizen, and Release-it. With a single command, you can configure your Legislato projects to adhere to standardized commit conventions and automatically generate changelogs.

## Installation

To use `legislato-conventions`, you have two options: using `npx` (recommended) or installing the package globally or locally.

### Using `npx` (Recommended)

`npx` allows you to execute the package without installing it directly into your project's `node_modules`. This is the recommended approach for most users.

1.  Open your terminal in the root directory of your project.
2.  Run the following command:

    ```bash
    npx @legislato/legislato-conventions
    ```

    `npx` will download the package (if not already cached) and execute it.

### Installing the Package (Optional)

If you prefer to install the package, you can do so globally or locally.

#### Global Installation

Installing the package globally allows you to run it from any directory.

1.  Open your terminal.
2.  Run the following command:

    ```bash
    npm install -g @legislato/legislato-conventions
    ```

3.  After installation, you can run the package from any directory:

    ```bash
    legislato-conventions
    ```

#### Local Installation

Installing the package locally adds it to your project's `node_modules` and `package.json`.

1.  Open your terminal in the root directory of your project.
2.  Run the following command:

    ```bash
    npm install --save-dev @legislato/legislato-conventions
    ```

3.  After installation, you can run the package using `npx` or by adding a script to your `package.json`:

    ```json
    "scripts": {
      "legislato-conventions": "legislato-conventions"
    }
    ```

    Then, you can run the package using:

    ```bash
    npm run legislato-conventions
    ```

> [!TIP]
> **Note:** Using `npx` is generally recommended as it keeps your project's dependencies clean and ensures you are always using the latest version of the package.

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
* `"release": "npm run build && dotenv release-it -- --verbose"`: Automates the release process with `release-it`.
* `'release:only-version': 'dotenv release-it -- --verbose --only-version'`: Automates the release process with `release-it`. This use a prompt only to determine the version, and automate the rest
* `"release:no-npm": "dotenv release-it -- --no-npm.publish"`: Automates the release process without publishing to NPM.
* `"release:changelog": "dotenv release-it -- --changelog"`: Print the changelog without releasing anything.
* `"release:version": "dotenv release-it -- --release-version"`: Print the next version without releasing anything.

## Updating Release Scripts

The `release` scripts in your `package.json` are configured to run `release-it` by default. If you want to run lint, test, or build scripts before running `release-it`, you can update the scripts as needed.

For example, if you have `lint`, `test`, and `build` scripts in your `package.json`, you can update the `release` script as follows:

```json
"scripts": {
  "prepare": "husky",
  "lint": "eslint . --ext .js,.ts",
  "test": "jest",
  "build": "tsc",
  "release": "npm run lint && npm run test && npm run build && dotenv release-it -- --verbose",
  "release:no-npm": "npm run lint && npm run test && dotenv release-it -- --no-npm.publish",
  "release:changelog": "npm run lint && npm run test && npm run build && dotenv release-it -- --changelog",
  "release:version": "npm run lint && npm run test && npm run build && dotenv release-it -- --release-version"
}
```

This will run the ```lint```, ```test```, and ```build``` scripts before running release-it. Adjust the scripts according to your project's needs.

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
