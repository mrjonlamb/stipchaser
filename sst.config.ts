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

    // Aurora PostgreSQL Serverless v2 Cluster
    const database = new sst.aws.Aurora("StipChaserDB", {
      engine: "postgres",
      vpc,
      scaling: {
        min: "0.5 ACU",
        max: "1 ACU",
      },
      transform: {
        cluster: (args) => {
          // Enable Data API for RDS Query Editor
          args.enableHttpEndpoint = true;
        },
      },
    });

    // Cognito User Pool for Authentication
    const userPool = new sst.aws.CognitoUserPool("StipChaserUserPool", {
      usernames: ["email"],
      triggers: {
        preSignUp: "packages/functions/src/auth/pre-signup.handler",
      },
    });

    // User Pool Client using AWS provider
    const userPoolClient = new aws.cognito.UserPoolClient(
      "StipChaserUserPoolClient",
      {
        userPoolId: userPool.id,
        explicitAuthFlows: [
          "ALLOW_USER_SRP_AUTH",
          "ALLOW_USER_PASSWORD_AUTH",
          "ALLOW_REFRESH_TOKEN_AUTH",
        ],
      }
    );

    // User Groups using AWS provider
    const dealerManagerGroup = new aws.cognito.UserGroup("DealerManagerGroup", {
      userPoolId: userPool.id,
      name: "DealerManager",
      description: "Dealer Managers with full access",
    });

    const dealerStaffGroup = new aws.cognito.UserGroup("DealerStaffGroup", {
      userPoolId: userPool.id,
      name: "DealerStaff",
      description: "Dealer Staff with limited access",
    });

    const consumerGroup = new aws.cognito.UserGroup("ConsumerGroup", {
      userPoolId: userPool.id,
      name: "Consumer",
      description: "Consumers with portal access",
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
      link: [database, userPool],
      vpc,
      environment: {
        USER_POOL_ID: userPool.id,
      },
    });

    api.route("POST /deals", {
      handler: "packages/functions/src/deals/create.handler",
      link: [database, userPool],
      vpc,
      environment: {
        USER_POOL_ID: userPool.id,
      },
    });

    api.route("GET /deals/{id}", {
      handler: "packages/functions/src/deals/get.handler",
      link: [database, userPool],
      vpc,
      environment: {
        USER_POOL_ID: userPool.id,
      },
    });

    api.route("PUT /deals/{id}", {
      handler: "packages/functions/src/deals/update.handler",
      link: [database, userPool],
      vpc,
      environment: {
        USER_POOL_ID: userPool.id,
      },
    });

    api.route("DELETE /deals/{id}", {
      handler: "packages/functions/src/deals/delete.handler",
      link: [database, userPool],
      vpc,
      environment: {
        USER_POOL_ID: userPool.id,
      },
    });

    // Documents API routes
    api.route("GET /documents", {
      handler: "packages/functions/src/documents/list.handler",
      environment: {
        DOCUMENTS_BUCKET: documentsBucket.name,
        USER_POOL_ID: userPool.id,
      },
      link: [database, documentsBucket, userPool],
      vpc,
    });

    api.route("POST /documents", {
      handler: "packages/functions/src/documents/upload.handler",
      environment: {
        DOCUMENTS_BUCKET: documentsBucket.name,
        USER_POOL_ID: userPool.id,
      },
      link: [database, documentsBucket, userPool],
      vpc,
    });

    api.route("GET /documents/{id}", {
      handler: "packages/functions/src/documents/get.handler",
      environment: {
        DOCUMENTS_BUCKET: documentsBucket.name,
        USER_POOL_ID: userPool.id,
      },
      link: [database, documentsBucket, userPool],
      vpc,
    });

    api.route("DELETE /documents/{id}", {
      handler: "packages/functions/src/documents/delete.handler",
      environment: {
        DOCUMENTS_BUCKET: documentsBucket.name,
        USER_POOL_ID: userPool.id,
      },
      link: [database, documentsBucket, userPool],
      vpc,
    });

    // Conversations API routes
    api.route("GET /conversations", {
      handler: "packages/functions/src/conversations/list.handler",
      link: [database, userPool],
      vpc,
      environment: {
        USER_POOL_ID: userPool.id,
      },
    });

    api.route("POST /conversations", {
      handler: "packages/functions/src/conversations/create.handler",
      link: [database, userPool],
      vpc,
      environment: {
        USER_POOL_ID: userPool.id,
      },
    });

    api.route("GET /conversations/{id}/messages", {
      handler: "packages/functions/src/conversations/messages.handler",
      link: [database, userPool],
      vpc,
      environment: {
        USER_POOL_ID: userPool.id,
      },
    });

    api.route("POST /conversations/{id}/messages", {
      handler: "packages/functions/src/conversations/send-message.handler",
      link: [database, userPool],
      vpc,
      environment: {
        USER_POOL_ID: userPool.id,
      },
    });

    // User Management API routes
    api.route("POST /users/invite", {
      handler: "packages/functions/src/users/invite-user.handler",
      link: [database, userPool],
      vpc,
      environment: {
        USER_POOL_ID: userPool.id,
        USER_POOL_CLIENT_ID: userPoolClient.id,
      },
    });

    api.route("GET /users", {
      handler: "packages/functions/src/users/list-users.handler",
      link: [database, userPool],
      vpc,
      environment: {
        USER_POOL_ID: userPool.id,
      },
    });

    api.route("PUT /users/{id}", {
      handler: "packages/functions/src/users/update-user.handler",
      link: [database, userPool],
      vpc,
      environment: {
        USER_POOL_ID: userPool.id,
      },
    });

    api.route("DELETE /users/{id}", {
      handler: "packages/functions/src/users/delete-user.handler",
      link: [database, userPool],
      vpc,
      environment: {
        USER_POOL_ID: userPool.id,
      },
    });

    api.route("POST /users/accept-invitation", {
      handler: "packages/functions/src/users/accept-invitation.handler",
      link: [database, userPool],
      vpc,
      environment: {
        USER_POOL_ID: userPool.id,
      },
    });

    // Create the Next.js app
    const web = new sst.aws.Nextjs("StipChaserWeb", {
      environment: {
        NEXT_PUBLIC_API_URL: api.url,
        NEXT_PUBLIC_USER_POOL_ID: userPool.id,
        NEXT_PUBLIC_USER_POOL_CLIENT_ID: userPoolClient.id,
        NEXT_PUBLIC_AWS_REGION: "us-east-1",
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
      auth: {
        userPoolId: userPool.id,
        userPoolClientId: userPoolClient.id,
        region: "us-east-1",
      },
    };
  },
});
