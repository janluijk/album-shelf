#!/bin/bash
set -e

if [ "$CLAUDE_CODE_REMOTE" != "true" ]; then
  exit 0
fi

npm install

echo "Web session ready: dependencies installed. Lint, typecheck, unit tests and build all run without a database (use dummy DATABASE_URL/AUTH_SECRET for build). There is no DATABASE_URL here unless set in the cloud environment settings."
