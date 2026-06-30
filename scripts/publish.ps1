$ErrorActionPreference = "Stop"

& npm run publish -- @Args
exit $LASTEXITCODE
