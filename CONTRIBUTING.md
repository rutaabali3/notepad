# Contributing Guidelines

Thank you for considering contributing to MyNotes. We welcome contributions from developers of all skill levels to help improve this browser-based, privacy-first notepad application.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Pull Requests](#pull-requests)
- [Development Workflow](#development-workflow)
- [Code Style Guidelines](#code-style-guidelines)
- [License](#license)

---

## Code of Conduct

When participating in this project, please maintain a respectful, welcoming, and collaborative environment for everyone. Treat all contributors and users with courtesy and respect.

---

## How Can I Contribute?

### Reporting Bugs

Before creating a bug report, please check existing issues to ensure it has not already been reported.

When filing a bug report, include as much detail as possible:
1. **Clear Title:** Use a clear and descriptive title.
2. **Steps to Reproduce:** Detail the exact steps taken to reproduce the issue.
3. **Expected vs Actual Behavior:** Explain what you expected to happen versus what actually occurred.
4. **Environment:** Specify your browser version, operating system, and device type.

### Suggesting Enhancements

If you have an idea for a new feature or improvement:
1. Check if the feature has already been requested or discussed.
2. Provide a clear description of the feature and why it would be beneficial.
3. Outline potential implementation details or mockups if applicable.

### Pull Requests

1. Fork the repository and create your branch from `main`.
2. Ensure your code follows the established coding standards.
3. Test your changes thoroughly in multiple web browsers (e.g., Chrome, Firefox, Safari, Edge).
4. Keep pull requests focused on a single feature or bug fix.
5. Provide a comprehensive description of the changes in your pull request.

---

## Development Workflow

1. **Clone your fork:**
   ```bash
   git clone https://github.com/your-username/mynotes.git
   cd mynotes
   ```

2. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes:**
   - Modify or add HTML, CSS, or JavaScript files.
   - Note that MyNotes uses client-side vanilla JavaScript without build steps or npm commands.

4. **Test locally:**
   - Open `index.html` directly in your browser.
   - Verify localStorage behavior, rich text formatting, dark mode theme toggle, and export/import functionality.

5. **Commit and push:**
   ```bash
   git add .
   git commit -m "Add descriptive summary of changes"
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request:**
   - Submit your pull request against the `main` branch with detailed release notes.

---

## Code Style Guidelines

- **HTML:**
  - Use semantic HTML5 tags where appropriate.
  - Maintain clean indentation (2 or 4 spaces).

- **CSS:**
  - Standardize styling in `css/style.css`.
  - Prefer modern CSS features, CSS variables, and flexbox/grid layout models.

- **JavaScript:**
  - Use standard modern JavaScript (ES6+).
  - Avoid global namespace pollution by structuring code into module scopes or dedicated utility files.
  - Comment complex functions and DOM manipulations clearly.

---

## License

By contributing to MyNotes, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).
