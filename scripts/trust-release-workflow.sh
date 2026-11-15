#!/bin/sh
# Lets the Release workflow publish every package: trusted publishing from GitHub Actions
# (tw050x/webframe, .github/workflows/release.yml), set on npm for each package. Run it in a
# terminal: the first package asks you to approve in the browser, where you can tick skipping
# two-factor for the next 5 minutes, so the rest go through. Run it again for a new package.
set -eu
cd "$(dirname "$0")/.."
for dir in packages/*/*/; do
  name=$(node -p "require('./${dir}package.json').name")
  echo "== $name"
  if npx -y npm@11 trust list "$name" 2>/dev/null | grep -q "release.yml"; then
    echo "trusts release.yml already"
  else
    npx -y npm@11 trust github "$name" --repository tw050x/webframe --file release.yml --allow-publish --yes
  fi
  sleep 2
done
