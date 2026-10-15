const crudPaths = ({ path, id, tag, name, createSchema, updateSchema, deleteConflict = false }) => ({
  [`${path}`]: {
    get: {
      tags: [tag],
      summary: `List ${name}`,
      responses: { 200: { description: `${name} list` } },
    },
    post: {
      tags: [tag],
      summary: `Create ${name.slice(0, -1)}`,
      requestBody: {
        required: true,
        content: { "application/json": { schema: { $ref: `#/components/schemas/${createSchema}` } } },
      },
      responses: {
        201: { description: "Created" },
        400: { description: "Invalid request" },
      },
    },
  },
  [`${path}/{${id}}`]: {
    parameters: [{ name: id, in: "path", required: true, schema: { type: "string" } }],
    get: {
      tags: [tag],
      summary: `Get ${name.slice(0, -1)}`,
      responses: { 200: { description: "Found" }, 404: { description: "Not found" } },
    },
    put: {
      tags: [tag],
      summary: `Update ${name.slice(0, -1)}`,
      requestBody: {
        required: true,
        content: { "application/json": { schema: { $ref: `#/components/schemas/${updateSchema}` } } },
      },
      responses: { 200: { description: "Updated" }, 404: { description: "Not found" } },
    },
    delete: {
      tags: [tag],
      summary: `Delete ${name.slice(0, -1)}`,
      responses: {
        204: { description: "Deleted" },
        404: { description: "Not found" },
        ...(deleteConflict ? { 409: { description: "Conflict" } } : {}),
      },
    },
  },
});

export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Library API",
    version: "1.0.0",
    description: "API for managing library books, members, and book copies.",
  },
  servers: [{ url: "/" }],
  tags: [
    { name: "Books" },
    { name: "Members" },
    { name: "Book copies" },
  ],
  paths: {
    ...crudPaths({
      path: "/api/books",
      id: "isbn",
      tag: "Books",
      name: "Books",
      createSchema: "BookInput",
      updateSchema: "BookInput",
      deleteConflict: true,
    }),
    ...crudPaths({
      path: "/api/members",
      id: "id",
      tag: "Members",
      name: "Members",
      createSchema: "MemberInput",
      updateSchema: "MemberInput",
    }),
    ...crudPaths({
      path: "/api/book-copies",
      id: "barcode",
      tag: "Book copies",
      name: "Book copies",
      createSchema: "BookCopyInput",
      updateSchema: "BookCopyInput",
    }),
  },
  components: {
    schemas: {
      BookInput: {
        type: "object",
        required: ["isbn", "title", "author", "publisher", "category"],
        properties: {
          isbn: { type: "string", example: "978-0132350884" },
          title: { type: "string" },
          author: { type: "string" },
          publisher: { type: "string" },
          category: { type: "string" },
        },
      },
      MemberInput: {
        type: "object",
        required: ["name", "membershipNumber"],
        properties: {
          name: { type: "string" },
          membershipNumber: { type: "string" },
          isActive: { type: "boolean", default: true },
          note: { type: "string" },
        },
      },
      BookCopyInput: {
        type: "object",
        required: ["barcode", "book"],
        properties: {
          barcode: { type: "string" },
          book: { type: "string", description: "ObjectId of the book" },
          status: {
            type: "string",
            enum: ["new", "available", "underRepair", "lost", "outOfStock"],
            default: "new",
          },
        },
      },
    },
  },
};