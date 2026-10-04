$env:OTEL_SERVICE_NAME="task-manager-backend"
$env:OTEL_TRACES_EXPORTER="otlp"
$env:OTEL_EXPORTER_OTLP_ENDPOINT="http://localhost:4318"
$env:NODE_OPTIONS="--require @opentelemetry/auto-instrumentations-node/register"

node server.js