#!/bin/sh
# Publishes from this machine every package whose version isn't on npm yet: for a new package's
# first version, which has to exist before it can trust the Release workflow. Give it a code
# from your authenticator: scripts/publish-by-hand.sh 123456
# Run it again with a new code if the code runs out partway; what's published is skipped.
set -eu
cd "$(dirname "$0")/.."
otp=${1:?Give a one-time code from your authenticator: scripts/publish-by-hand.sh 123456}
npm run build >/dev/null
for dir in packages/*/*/; do
  name=$(node -p "require('./${dir}package.json').name")
  version=$(node -p "require('./${dir}package.json').version")
  if npm view "$name@$version" version >/dev/null 2>&1; then
    echo "on npm already: $name@$version"
  else
    echo "publishing $name@$version"
    npm publish --workspace "$dir" --otp="$otp" --loglevel=warn
  fi
done
