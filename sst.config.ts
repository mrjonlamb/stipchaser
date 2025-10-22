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
    // DynamoDB Tables (create these first)
    const dealsTable = new sst.aws.Dynamo("DealsTable", {
      fields: {
        id: "string",
        customerId: "string",
        status: "string",
        createdAt: "number",
      },
      primaryIndex: { hashKey: "id" },
      globalIndexes: {
        statusIndex: { hashKey: "status", rangeKey: "createdAt" },
        customerIndex: { hashKey: "customerId", rangeKey: "createdAt" },
      },
    });

    const documentsTable = new sst.aws.Dynamo("DocumentsTable", {
      fields: {
        id: "string",
        dealId: "string",
        uploadedAt: "number",
      },
      primaryIndex: { hashKey: "id" },
      globalIndexes: {
        dealIndex: { hashKey: "dealId", rangeKey: "uploadedAt" },
      },
    });

    const conversationsTable = new sst.aws.Dynamo("ConversationsTable", {
      fields: {
        id: "string",
        dealId: "string",
        updatedAt: "number",
      },
      primaryIndex: { hashKey: "id" },
      globalIndexes: {
        dealIndex: { hashKey: "dealId", rangeKey: "updatedAt" },
      },
    });

    const messagesTable = new sst.aws.Dynamo("MessagesTable", {
      fields: {
        id: "string",
        conversationId: "string",
        timestamp: "number",
      },
      primaryIndex: { hashKey: "id" },
      globalIndexes: {
        conversationIndex: { hashKey: "conversationId", rangeKey: "timestamp" },
      },
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
      environment: {
        DEALS_TABLE: dealsTable.name,
      },
      link: [dealsTable],
    });

    api.route("POST /deals", {
      handler: "packages/functions/src/deals/create.handler",
      environment: {
        DEALS_TABLE: dealsTable.name,
      },
      link: [dealsTable],
    });

    api.route("GET /deals/{id}", {
      handler: "packages/functions/src/deals/get.handler",
      environment: {
        DEALS_TABLE: dealsTable.name,
      },
      link: [dealsTable],
    });

    api.route("PUT /deals/{id}", {
      handler: "packages/functions/src/deals/update.handler",
      environment: {
        DEALS_TABLE: dealsTable.name,
      },
      link: [dealsTable],
    });

    api.route("DELETE /deals/{id}", {
      handler: "packages/functions/src/deals/delete.handler",
      environment: {
        DEALS_TABLE: dealsTable.name,
      },
      link: [dealsTable],
    });

    // Documents API routes
    api.route("GET /documents", {
      handler: "packages/functions/src/documents/list.handler",
      environment: {
        DOCUMENTS_TABLE: documentsTable.name,
        DOCUMENTS_BUCKET: documentsBucket.name,
      },
      link: [documentsTable, documentsBucket],
    });

    api.route("POST /documents", {
      handler: "packages/functions/src/documents/upload.handler",
      environment: {
        DOCUMENTS_TABLE: documentsTable.name,
        DOCUMENTS_BUCKET: documentsBucket.name,
      },
      link: [documentsTable, documentsBucket],
    });

    api.route("GET /documents/{id}", {
      handler: "packages/functions/src/documents/get.handler",
      environment: {
        DOCUMENTS_TABLE: documentsTable.name,
        DOCUMENTS_BUCKET: documentsBucket.name,
      },
      link: [documentsTable, documentsBucket],
    });

    api.route("DELETE /documents/{id}", {
      handler: "packages/functions/src/documents/delete.handler",
      environment: {
        DOCUMENTS_TABLE: documentsTable.name,
        DOCUMENTS_BUCKET: documentsBucket.name,
      },
      link: [documentsTable, documentsBucket],
    });

    // Messages API routes
    api.route("GET /conversations", {
      handler: "packages/functions/src/conversations/list.handler",
      environment: {
        CONVERSATIONS_TABLE: conversationsTable.name,
      },
      link: [conversationsTable],
    });

    api.route("POST /conversations", {
      handler: "packages/functions/src/conversations/create.handler",
      environment: {
        CONVERSATIONS_TABLE: conversationsTable.name,
      },
      link: [conversationsTable],
    });

    api.route("GET /conversations/{id}/messages", {
      handler: "packages/functions/src/conversations/messages.handler",
      environment: {
        CONVERSATIONS_TABLE: conversationsTable.name,
        MESSAGES_TABLE: messagesTable.name,
      },
      link: [conversationsTable, messagesTable],
    });

    api.route("POST /conversations/{id}/messages", {
      handler: "packages/functions/src/conversations/send-message.handler",
      environment: {
        CONVERSATIONS_TABLE: conversationsTable.name,
        MESSAGES_TABLE: messagesTable.name,
      },
      link: [conversationsTable, messagesTable],
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
    };
  },
});
