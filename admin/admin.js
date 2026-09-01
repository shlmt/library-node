import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import * as AdminJSMongoose from "@adminjs/mongoose";

import { Member } from "@/entities/member/member.model.js";
import { Book } from "@/entities/book/book.model.js";
import { BookCopy } from "@/entities/bookCopy/bookCopy.model.js";

AdminJS.registerAdapter({
  Resource: AdminJSMongoose.Resource,
  Database: AdminJSMongoose.Database,
});

export const createAdminRouter = async () => {
  const admin = new AdminJS({
    rootPath: "/admin",

    resources: [
      {
        resource: Member,
        options: {
          navigation: {
            name: "Library",
            icon: "User",
          },
        },
      },

      {
        resource: Book,
        options: {
          navigation: {
            name: "Library",
            icon: "Book",
          },
        },
      },

      {
        resource: BookCopy,
        options: {
          navigation: {
            name: "Library",
            icon: "BookOpen",
          },
        },
      },
    ],
  });

  return AdminJSExpress.buildAuthenticatedRouter(admin, {
    authenticate: async (email, password) => {
      if (
        email === process.env.ADMIN_EMAIL &&
        password === process.env.ADMIN_PASSWORD
      ) {
        return { email };
      }

      return null;
    },

    cookieName: "library-admin",
    cookiePassword: process.env.SESSION_SECRET,
  });
};
