# CI/CD Pipeline Documentation

## Overview
This document describes the Continuous Integration and Continuous Deployment (CI/CD) pipeline for the A/B Testing Platform.

## Pipeline Architecture

### Workflow Structure
The CI/CD pipeline is defined in `.github/workflows/ci-cd.yml` and consists of the following stages:

1. **Backend Tests** - Runs backend unit tests and linting
2. **Frontend Tests** - Runs frontend unit tests and linting
3. **Build** - Builds both applications
4. **Deploy** - Deploys to production (only on main branch)

## Stages

### 1. Backend Tests
**Trigger:** All pushes and pull requests to `main` and `develop` branches

**Steps:**
- Checkout code
- Setup Node.js v18
- Install dependencies (`npm ci`)
- Run backend tests (`npm run test:backend`)
- Run backend linter (`npm run lint --workspace=apps/backend`)

**Requirements:**
- All tests must pass
- No linting errors
- Code coverage threshold must be met (70%)

### 2. Frontend Tests
**Trigger:** All pushes and pull requests to `main` and `develop` branches

**Steps:**
- Checkout code
- Setup Node.js v18
- Install dependencies (`npm ci`)
- Run frontend tests (`npm run test:frontend`)
- Run frontend linter (`npm run lint --workspace=apps/frontend`)

**Requirements:**
- All tests must pass
- No linting errors

### 3. Build
**Trigger:** After successful completion of backend and frontend tests

**Steps:**
- Checkout code
- Setup Node.js v18
- Install dependencies
- Build backend application
- Build frontend application

**Artifacts:**
- Backend build (if applicable)
- Frontend build in `apps/frontend/dist/`

### 4. Deploy
**Trigger:** Successful build on `main` branch only

**Steps:**
- Checkout code
- Setup Node.js v18
- Install dependencies
- Build applications
- Deploy to production environment

**Note:** Deployment steps should be customized based on your hosting provider.

## Environment Variables

### Required for CI/CD
The following secrets should be configured in GitHub repository settings:

- `NODE_VERSION` - Node.js version (default: 18)
- Additional deployment-specific secrets as needed

## Branch Protection Rules

### Main Branch
- Require pull request reviews before merging
- Require status checks to pass before merging
- Require branches to be up to date before merging
- Include administrators in restrictions

### Develop Branch
- Require status checks to pass before merging
- Require branches to be up to date before merging

## Running CI/CD Locally

### Backend Tests
```bash
npm run test:backend
npm run lint --workspace=apps/backend
```

### Frontend Tests
```bash
npm run test:frontend
npm run lint --workspace=apps/frontend
```

### Build
```bash
npm run build:backend
npm run build:frontend
# or
npm run build
```

## Troubleshooting

### Tests Failing
1. Run tests locally: `npm test`
2. Check test logs in GitHub Actions
3. Verify environment variables are set correctly
4. Ensure all dependencies are installed

### Build Failing
1. Run build locally: `npm run build`
2. Check for TypeScript/ESLint errors
3. Verify all environment variables are available
4. Check node_modules are properly installed

### Deployment Failing
1. Verify deployment credentials
2. Check deployment service status
3. Review deployment logs
4. Ensure build artifacts are created correctly

## Best Practices

1. **Always run tests locally** before pushing
2. **Keep builds fast** - optimize dependencies and build steps
3. **Use caching** - Cache node_modules to speed up builds
4. **Monitor pipeline** - Review failed builds promptly
5. **Keep secrets secure** - Never commit secrets to repository
6. **Document changes** - Update this doc when modifying pipeline

## Performance Optimization

- **Dependency Caching:** npm cache is automatically used
- **Parallel Jobs:** Tests run in parallel for faster feedback
- **Conditional Deployment:** Only runs on main branch

## Monitoring and Alerts

- GitHub Actions provides built-in monitoring
- Failed builds trigger email notifications
- Consider integrating with Slack/Discord for team notifications

## Future Improvements

- [ ] Add integration tests
- [ ] Add end-to-end tests with Cypress
- [ ] Implement automated performance testing
- [ ] Add security scanning (npm audit, Snyk)
- [ ] Implement blue-green deployments
- [ ] Add rollback capabilities
- [ ] Set up staging environment
- [ ] Implement automated changelog generation

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Continuous Integration Best Practices](https://www.martinfowler.com/articles/continuousIntegration.html)

## Support

For CI/CD pipeline issues:
1. Check GitHub Actions logs
2. Review this documentation
3. Contact DevOps team
4. Create an issue in the repository
