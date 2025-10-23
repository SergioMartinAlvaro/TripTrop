# Contributing to TripTrop

Thank you for your interest in contributing to TripTrop! This document provides guidelines and instructions for contributing.

## Code of Conduct

Please be respectful and constructive in your interactions with other contributors.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in GitHub Issues
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, browser, versions)
   - Screenshots if applicable

### Suggesting Features

1. Open a GitHub Issue with the "enhancement" label
2. Describe the feature and its benefits
3. Provide examples or mockups if possible

### Code Contributions

#### Setup Development Environment

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/TripTrop.git`
3. Run the setup script: `./setup.sh`
4. Create a new branch: `git checkout -b feature/your-feature-name`

#### Development Workflow

1. Make your changes
2. Write/update tests
3. Ensure all tests pass
4. Update documentation if needed
5. Commit with clear messages
6. Push to your fork
7. Open a Pull Request

#### Code Style

**Python (Backend):**
- Follow PEP 8
- Use type hints
- Maximum line length: 100 characters
- Use docstrings for functions and classes

**JavaScript/React (Frontend):**
- Use ESLint configuration provided
- Prefer functional components with hooks
- Use meaningful variable names
- Maximum line length: 100 characters

#### Commit Messages

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- First line: brief summary (50 chars or less)
- Separate subject from body with blank line
- Reference issues and PRs in the body

Example:
```
Add flight search functionality

Implements basic flight search with date range and destination
filters. Integrates with mock API for testing.

Fixes #123
```

#### Pull Request Process

1. Update README.md with details of changes if needed
2. Update API documentation for any endpoint changes
3. Ensure Docker builds work: `docker-compose build`
4. The PR will be merged once approved by maintainers

### Testing

**Backend:**
```bash
cd backend
source venv/bin/activate
pytest
```

**Frontend:**
```bash
cd frontend
npm test
```

### Documentation

- Keep README.md up to date
- Document new API endpoints
- Add inline comments for complex logic
- Update configuration examples

## Project Structure

```
TripTrop/
├── backend/        # FastAPI backend
├── frontend/       # React frontend
├── docs/          # Documentation
└── scripts/       # Utility scripts
```

## Need Help?

- Open an issue with the "question" label
- Check existing documentation
- Review closed issues/PRs for similar problems

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
