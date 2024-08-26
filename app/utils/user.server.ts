
import bcrypt from "bcryptjs";

import { prisma } from "./prisma.server";
import { redirect } from "@remix-run/node";



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


export const updateUser = async (user) => {
  
  
    if (user.password) {
    const passwordHash = await bcrypt.hash(user.password, 10);
    await prisma.user.update({
      where: {
        id: user.userId,
      },
      data: {
        email: user.email,
        password: passwordHash,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
    throw redirect("/admin");
  } else {
    await prisma.user.update({
      where: {
        id: user.userId,
      },
      data: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });

    throw redirect("/admin");
  }
};
export const deleteUser = async (user) => {
  await prisma.user.delete({
    where: {
      id: user.userId,
    },
  });
  throw redirect("/admin");
};

export const updateHit = async (values: any) => {
  
  return prisma.user.update({
    where: {
      id: values.userId,
    },
    data: {
      timeSheet: {
        updateMany: {
          where: {
            day: values.day,
          },
          data: {
            in: new Date(values.dt.substring(0, 11) + (values.in? values.in: '00:00') + ":00-03:00"),
            outLunch: new Date(values.dt.substring(0, 11) + (values.outLunch? values.out : '00:00') + ":00-03:00"),
            inLunch: new Date(values.dt.substring(0, 11) + (values.inLunch? values.inLunch: '00:00') + ":00-03:00"),
            out: new Date(values.dt.substring(0, 11) + (values.out? values.out : '00:00') + ":00-03:00"),
          },
        },
      },
    },
  });
};