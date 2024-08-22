
import bcrypt from "bcryptjs";

import { prisma } from "./prisma.server";



export const createUser = async (user) => {
  const passwordHash = await bcrypt.hash(user.password, 10);
  const newUser = await prisma.user.create({
    data: {
      email: user.email,
      password: passwordHash,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });
  return { id: newUser.id, email: user.email };
};

export const getUser = async (userId: string) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
};

export const hitTimesheet = async (userId, action) => {
  console.log("action: " + action);
  switch (action) {
    case "entrada": {
      return prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          timeSheet: {
            push: {
              day:
                new Date().getDate().toString().padStart(2, "0") +
                "-" +
                (new Date().getMonth() + 1).toString().padStart(2, "0")+
                "-" +
                (new Date().getFullYear()),
              in: new Date(),
              outLunch: null,
              inLunch: null,
              out: null,
            },
          },
        },
      });
    }
    case "outLunch": {
      // const user = await getUser(userId);
      return prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          timeSheet: {
            updateMany: {
              where: {
                day:
                  new Date().getDate().toString().padStart(2, "0") +
                  "-" +
                  (new Date().getMonth() + 1).toString().padStart(2, "0")+
                "-" +
                (new Date().getFullYear()),
              },
              data: {
                outLunch: new Date(),
              },
            },
          },
        },
      });
    }
    case "inLunch": {
      return prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          timeSheet: {
            updateMany: {
              where: {
                day:
                  new Date().getDate().toString().padStart(2, "0") +
                  "-" +
                  (new Date().getMonth() + 1).toString().padStart(2, "0")+
                "-" +
                (new Date().getFullYear()),
              },
              data: {
                inLunch: new Date(),
              },
            },
          },
        },
      });
    }
    case "out": {
      return prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          timeSheet: {
            updateMany: {
              where: {
                day:
                  new Date().getDate().toString().padStart(2, "0") +
                  "-" +
                  (new Date().getMonth() + 1).toString().padStart(2, "0")+
                "-" +
                (new Date().getFullYear()),
              },
              data: {
                out: new Date(),
              },
            },
          },
        },
      });
    }
  }
};

export const getUsers = async () => {
    
  return prisma.user.findMany({
    where: {
      role: { not: 'admin' },
    },
    orderBy: {
      firstName: "asc",
    },
  });
};