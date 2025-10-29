# Contributing to Advanced Cypress Testing Framework

Thank you for your interest in contributing to the Advanced Cypress Testing Framework! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Issues
- Use the GitHub issue tracker
- Provide detailed reproduction steps
- Include environment information (OS, Node.js version, etc.)
- Attach relevant logs and screenshots

### Suggesting Enhancements
- Use the GitHub issue tracker with "enhancement" label
- Describe the use case and expected behavior
- Provide examples if applicable

### Code Contributions
- Fork the repository
- Create a feature branch from `main`
- Make your changes
- Add tests for new functionality
- Update documentation
- Submit a pull request

## 🛠️ Development Setup

### Prerequisites
- Node.js v18 or higher
- npm or yarn
- Git

### Setup Steps
1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Setup environment: `npm run setup-env`
4. Run tests: `npm test`
5. Open Cypress: `npm run cypress:open`

### Development Workflow
1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Run linting: `npm run lint`
4. Run tests: `npm test`
5. Format code: `npm run format`
6. Commit changes: `git commit -m "Add: your feature description"`
7. Push to your fork: `git push origin feature/your-feature-name`
8. Create a pull request

## 📝 Code Standards

### TypeScript
- Use TypeScript for all new code
- Follow existing type definitions
- Add proper type annotations
- Use interfaces for complex objects

### Code Style
- Follow ESLint configuration
- Use Prettier for formatting
- Write descriptive variable and function names
- Add JSDoc comments for public APIs

### Testing
- Write tests for new functionality
- Use descriptive test names
- Follow existing test patterns
- Add appropriate test tags

### Documentation
- Update relevant documentation
- Add examples for new features
- Update README if needed
- Include JSDoc comments

## 🏗️ Project Structure

### Key Directories
- `cypress/e2e/` - Test files
- `cypress/support/` - Custom commands and utilities
- `cypress/pages/` - Page Object Model classes
- `cypress/fixtures/` - Test data
- `scripts/` - Build and utility scripts
- `docs/` - Documentation files

### File Naming
- Test files: `*.spec.ts`
- Page objects: `*Page.ts`
- Custom commands: `commands/*.ts`
- Utilities: `utils/*.ts`

## 🧪 Testing Guidelines

### Test Structure
```typescript
describe('Feature Name', () => {
  beforeEach(() => {
    // Setup
  });

  it('should do something specific', () => {
    // Test implementation
  });
});
```

### Test Tags
Use appropriate tags for test categorization:
- `@smoke` - Critical functionality
- `@regression` - Comprehensive tests
- `@api` - API tests
- `@ui` - UI tests
- `@visual` - Visual regression tests

### Custom Commands
When adding new custom commands:
1. Add to appropriate file in `cypress/support/commands/`
2. Add TypeScript declarations to `cypress/support/global.d.ts`
3. Add JSDoc comments
4. Write tests for the command

## 📚 Documentation

### Documentation Types
- **README.md** - Main project documentation
- **SETUP.md** - Installation and setup
- **EXAMPLES.md** - Usage examples
- **API.md** - API documentation
- **CONTRIBUTING.md** - This file

### Writing Documentation
- Use clear, concise language
- Include code examples
- Add screenshots when helpful
- Keep documentation up to date
- Use markdown formatting

## 🔍 Code Review Process

### Review Checklist
- [ ] Code follows project standards
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No breaking changes (or properly documented)
- [ ] Performance impact considered
- [ ] Security implications reviewed

### Review Guidelines
- Be constructive and respectful
- Focus on code quality and maintainability
- Ask questions if something is unclear
- Suggest improvements when appropriate
- Approve when ready for merge

## 🚀 Release Process

### Version Numbering
- **Major** (1.0.0) - Breaking changes
- **Minor** (1.1.0) - New features
- **Patch** (1.0.1) - Bug fixes

### Release Steps
1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create release tag
4. Update documentation
5. Announce release

## 🐛 Bug Reports

### Required Information
- Cypress version
- Node.js version
- Operating system
- Browser version
- Steps to reproduce
- Expected vs actual behavior
- Error messages and logs

### Bug Report Template
```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
- OS: [e.g. macOS, Windows, Linux]
- Node.js version: [e.g. 18.17.0]
- Cypress version: [e.g. 13.6.1]
- Browser: [e.g. Chrome, Firefox]

**Additional context**
Add any other context about the problem here.
```

## 💡 Feature Requests

### Feature Request Template
```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
A clear description of any alternative solutions.

**Additional context**
Add any other context or screenshots about the feature request.
```

## 📞 Support

### Getting Help
- Check existing documentation
- Search existing issues
- Create a new issue if needed
- Join community discussions

### Contact
- GitHub Issues: For bug reports and feature requests
- GitHub Discussions: For questions and community support
- Email: [Your contact email]

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Cypress team for the amazing testing framework
- Contributors who help improve this project
- Community members who provide feedback and suggestions

Thank you for contributing to the Advanced Cypress Testing Framework! 🚀
