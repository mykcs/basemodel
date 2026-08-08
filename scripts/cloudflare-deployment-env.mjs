export const stablePagesProductionUrl = (value) => {
  const url = new URL(value);
  const labels = url.hostname.split('.');

  // CF_PAGES_URL identifies the current deployment. A production deployment
  // may be exposed as <hash>.<project>.pages.dev while <project>.pages.dev is
  // the durable project alias. Strip only the deployment-specific label.
  if (
    labels.length >= 4 &&
    labels.at(-2) === 'pages' &&
    labels.at(-1) === 'dev'
  ) {
    url.hostname = labels.slice(1).join('.');
  }

  return url.origin;
};

export const resolveCloudflareSiteUrl = ({
  explicitSiteUrl,
  deploymentUrl,
  branch,
}) => {
  const isProduction = branch === 'main';

  // Preview identity must always follow the Preview deployment itself. This is
  // intentionally stronger than relying on dashboard env scoping, so an
  // accidentally global PUBLIC_SITE_URL cannot make Preview canonical/OG URLs
  // impersonate Production.
  if (!isProduction && deploymentUrl) {
    return deploymentUrl;
  }

  if (explicitSiteUrl) {
    return new URL(explicitSiteUrl).origin;
  }

  if (deploymentUrl) {
    return isProduction
      ? stablePagesProductionUrl(deploymentUrl)
      : deploymentUrl;
  }

  return null;
};

export const resolveSearchIndexing = ({ branch, configuredValue }) => {
  if (branch !== 'main') {
    return 'disabled';
  }

  return configuredValue || 'enabled';
};
