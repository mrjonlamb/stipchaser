/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "stipchaser",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    // VPC for Aurora PostgreSQL
    const vpc = new sst.aws.Vpc("StipChaserVpc", {
      nat: "managed",
    });

    // Aurora PostgreSQL Cluster
    const database = new sst.aws.Postgres("StipChaserDB", {
      vpc,
    });

    // S3 Bucket for documents
    const documentsBucket = new sst.aws.Bucket("DocumentsBucket", {
      cors: {
        allowOrigins: ["*"],
        allowMethods: ["GET", "PUT", "POST", "DELETE"],
        allowHeaders: ["*"],
      },
    });

    // Create API Gateway with Lambda functions
    const api = new sst.aws.ApiGatewayV2("StipChaserApi", {
      cors: {
        allowOrigins: ["*"],
        allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowHeaders: ["*"],
      },
    });

    // Define API routes with Lambda functions
    api.route("GET /deals", {
      handler: "packages/functions/src/deals/list.handler",
      link: [database],
      vpc,
    });

    api.route("POST /deals", {
      handler: "packages/functions/src/deals/create.handler",
      link: [database],
      vpc,
    });

    api.route("GET /deals/{id}", {
      handler: "packages/functions/src/deals/get.handler",
      link: [database],
      vpc,
    });

    api.route("PUT /deals/{id}", {
      handler: "packages/functions/src/deals/update.handler",
      link: [database],
      vpc,
    });

    api.route("DELETE /deals/{id}", {
      handler: "packages/functions/src/deals/delete.handler",
      link: [database],
      vpc,
    });

    // Documents API routes
    api.route("GET /documents", {
      handler: "packages/functions/src/documents/list.handler",
      environment: {
        DOCUMENTS_BUCKET: documentsBucket.name,
      },
      link: [database, documentsBucket],
      vpc,
    });

    api.route("POST /documents", {
      handler: "packages/functions/src/documents/upload.handler",
      environment: {
        DOCUMENTS_BUCKET: documentsBucket.name,
      },
      link: [database, documentsBucket],
      vpc,
    });

    api.route("GET /documents/{id}", {
      handler: "packages/functions/src/documents/get.handler",
      environment: {
        DOCUMENTS_BUCKET: documentsBucket.name,
      },
      link: [database, documentsBucket],
      vpc,
    });

    api.route("DELETE /documents/{id}", {
      handler: "packages/functions/src/documents/delete.handler",
      environment: {
        DOCUMENTS_BUCKET: documentsBucket.name,
      },
      link: [database, documentsBucket],
      vpc,
    });

    // Conversations API routes
    api.route("GET /conversations", {
      handler: "packages/functions/src/conversations/list.handler",
      link: [database],
      vpc,
    });

    api.route("POST /conversations", {
      handler: "packages/functions/src/conversations/create.handler",
      link: [database],
      vpc,
    });

    api.route("GET /conversations/{id}/messages", {
      handler: "packages/functions/src/conversations/messages.handler",
      link: [database],
      vpc,
    });

    api.route("POST /conversations/{id}/messages", {
      handler: "packages/functions/src/conversations/send-message.handler",
      link: [database],
      vpc,
    });

    // Create the Next.js app
    const web = new sst.aws.Nextjs("StipChaserWeb", {
      environment: {
        NEXT_PUBLIC_API_URL: api.url,
      },
    });

    return {
      api: api.url,
      web: web.url,
      database: {
        host: database.host,
        port: database.port,
        database: database.database,
      },
    };
  },
});
