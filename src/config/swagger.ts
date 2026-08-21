import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application } from "express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Movie Ticket Booking System API",
      version: "1.0.0",
      description:
        "REST API for managing movies, showtimes, seat bookings, and customers.",
    },
    servers: [
      {
        url: `https://movie-ticket-booking-api-production.up.railway.app/`,
        description: "Production server",
      },
      {
        url: `http://localhost:${process.env.PORT}`,
        description: "Local development server",
      },
    ],
    tags: [
      {
        name: "Auth",
        description: "Authentication and authorization endpoints",
      },
      {
        name: "Movies",
        description: "Movie management endpoints",
      },
      {
        name: "Showtimes",
        description: "Showtime management endpoints",
      },
      {
        name: "Bookings",
        description: "Movie ticket booking endpoints",
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
    },
    security: [{ bearerAuth: [] }],
  },

  apis: ["./src/modules/**/*.route.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Application) => {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
    }),
  );
};
