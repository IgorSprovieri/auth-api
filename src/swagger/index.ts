import type { Application } from "express";
import swaggerUi from "swagger-ui-express";

const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Auth API",
    version: "1.0.0",
    description:
      "Authentication API built with Node.js, Express, MongoDB and Redis",
  },
  servers: [
    {
      url: "http://localhost:{port}",
      variables: {
        port: {
          default: "3333",
        },
      },
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      Error: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "user@example.com",
          },
          password: {
            type: "string",
            format: "password",
            example: "secret123",
          },
        },
      },
      LoginResponse: {
        type: "object",
        properties: {
          user: {
            type: "object",
            properties: {
              name: { type: "string", example: "John Doe" },
              email: { type: "string", example: "user@example.com" },
            },
          },
          token: {
            type: "string",
            example: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
          },
        },
      },
      UserResponse: {
        type: "object",
        properties: {
          name: { type: "string", example: "John Doe" },
          email: { type: "string", example: "user@example.com" },
        },
      },
      HealthResponse: {
        type: "object",
        properties: {
          status: { type: "string", example: "healthy" },
          mongoDB: { type: "string", example: "connected" },
          redisDB: { type: "string", example: "connected" },
          uptime: { type: "number", example: 42.5 },
        },
      },
      JwkResponse: {
        type: "object",
        properties: {
          kty: { type: "string", example: "RSA" },
          n: { type: "string" },
          e: { type: "string", example: "AQAB" },
        },
      },
    },
  },
  paths: {
    "/login": {
      post: {
        tags: ["Auth"],
        summary: "Authenticate user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Login successful",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginResponse" },
              },
            },
          },
          "401": {
            description: "Invalid credentials",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "429": {
            description: "Account temporarily locked",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Check API and database health",
        responses: {
          "200": {
            description: "All services healthy",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/HealthResponse" },
              },
            },
          },
          "503": {
            description: "One or more databases disconnected",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/.well-known/jwks.json": {
      get: {
        tags: ["Auth"],
        summary: "Get public JWT key (JWK)",
        responses: {
          "200": {
            description: "Public key in JWK format",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/JwkResponse" },
              },
            },
          },
        },
      },
    },
    "/user": {
      get: {
        tags: ["User"],
        summary: "Get authenticated user profile",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "User profile",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserResponse" },
              },
            },
          },
          "401": {
            description: "Missing token",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "403": {
            description: "Invalid token",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "404": {
            description: "User not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
  },
};

export function setupSwagger(app: Application, port: number) {
  const spec = {
    ...swaggerSpec,
    servers: [{ url: `http://localhost:${port}` }],
  };

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(spec));

  return `http://localhost:${port}/docs`;
}
