import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";

import { ZoneContextManager } from "@opentelemetry/context-zone";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { getWebAutoInstrumentations } from "@opentelemetry/auto-instrumentations-web";

const resource = resourceFromAttributes({
  [ATTR_SERVICE_NAME]: import.meta.env.VITE_OTEL_SERVICE_NAME,
});

const exporter = new OTLPTraceExporter({
  url: import.meta.env.VITE_OTEL_EXPORTER_ENDPOINT,
});

const provider = new WebTracerProvider({
  resource,
  spanProcessors: [
    new BatchSpanProcessor(exporter),
  ],
});

provider.register({
  contextManager: new ZoneContextManager(),
});

registerInstrumentations({
  tracerProvider: provider,

  instrumentations: [
    getWebAutoInstrumentations({
      "@opentelemetry/instrumentation-fetch": {
        propagateTraceHeaderCorsUrls: [
          /http:\/\/localhost:3000/,
        ],
      },

      "@opentelemetry/instrumentation-xml-http-request": {
        propagateTraceHeaderCorsUrls: [
          /http:\/\/localhost:3000/,
        ],
      },
    }),
  ],
});

console.log("OpenTelemetry Frontend wurde initialisiert");