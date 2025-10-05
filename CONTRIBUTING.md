# Contributing to MyPhoto

Thank you for considering contributing to MyPhoto! This document provides guidelines and instructions for contributing.

## 🎯 Ways to Contribute

- 🐛 Report bugs
- 💡 Suggest new features
- 📝 Improve documentation
- 🔧 Submit pull requests
- ⭐ Star the project

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Description**: Clear description of the issue
2. **Steps to Reproduce**: Detailed steps to reproduce the bug
3. **Expected Behavior**: What you expected to happen
4. **Actual Behavior**: What actually happened
5. **Environment**: 
   - OS (Windows/macOS/Linux)
   - Node.js version
   - Browser (if relevant)
6. **Screenshots**: If applicable

## 💡 Feature Requests

When suggesting features:

1. **Use Case**: Explain why this feature would be useful
2. **Description**: Detailed description of the feature
3. **Examples**: Show examples or mockups if possible
4. **Alternatives**: Other solutions you've considered

## 🔧 Pull Requests

### Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/yourusername/myphoto.git
   cd myphoto
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Setup database:
   ```bash
   npx prisma db push
   npm run create-user
   ```

5. Start development server:
   ```bash
   npm run dev
   ```

### Development Process

1. **Create a branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**:
   - Write clean, readable code
   - Follow existing code style
   - Add comments for complex logic
   - Update documentation if needed

3. **Test your changes**:
   - Test all affected functionality
   - Ensure no existing features break
   - Test on different screen sizes (if UI changes)

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

   Use conventional commit messages:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting, etc.)
   - `refactor:` - Code refactoring
   - `test:` - Adding or updating tests
   - `chore:` - Maintenance tasks

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**:
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template
   - Submit!

### Pull Request Guidelines

- **Title**: Clear and descriptive
- **Description**: Explain what changes you made and why
- **Link Issues**: Reference related issues (e.g., "Fixes #123")
- **Screenshots**: Include screenshots for UI changes
- **Testing**: Describe how you tested the changes
- **Breaking Changes**: Clearly indicate any breaking changes

## 📝 Code Style

- Use TypeScript for type safety
- Follow existing code formatting
- Use meaningful variable names
- Keep functions small and focused
- Add JSDoc comments for complex functions
- Use async/await instead of callbacks

### Example:

```typescript
/**
 * Processes an image and extracts EXIF data
 * @param buffer - Image buffer
 * @param originalName - Original filename
 * @returns Processed image filename and metadata
 */
async function processImage(
  buffer: Buffer,
  originalName: string
): Promise<{ filename: string; metadata: ImageMetadata }> {
  // Implementation
}
```

## 🗂️ Project Structure

```
myphoto/
├── app/              # Next.js app directory (routes)
├── components/       # React components
├── lib/             # Utility functions
├── prisma/          # Database schema
└── public/          # Static files
```

## 🧪 Testing

Before submitting a PR:

1. Test core functionality:
   - Login/logout
   - Category creation
   - Photo upload
   - Photo viewing
   - Password protection

2. Test edge cases:
   - Large images
   - Special characters in names
   - Empty states
   - Error conditions

3. Test responsiveness:
   - Mobile devices
   - Tablets
   - Desktop

## 📚 Documentation

If you add new features:

1. Update README.md
2. Add comments in code
3. Update API documentation
4. Add examples if applicable

## 🔒 Security

If you discover a security vulnerability:

1. **DO NOT** open a public issue
2. Email the maintainers privately
3. Provide detailed information
4. Wait for confirmation before disclosure

## 🤔 Questions?

- Open a GitHub Discussion
- Open an issue for clarification
- Check existing issues and PRs

## 📜 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Provide constructive feedback
- Focus on the problem, not the person
- Assume good intentions

## ⚖️ License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to MyPhoto! 🎉
