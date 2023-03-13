import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function handler(req, res) {
  const { method, body, query } = req;

  const dataGet = async () => {
    try {
      const listcheck = await prisma.favorite_table.findUnique({
        where: {
          id: Number(query.id),
        },
      });

      if (listcheck === null) {
        const createlist = await prisma.favorite_table.create({
          data: {
            id: Number(query.id),
            favorite_list: "",
          },
        });
        res.json(createlist);
      } else {
        res.json(listcheck);
      }
    } catch (err) {
      res.send(err);
    }
  };

  const dataPut = async () => {
    try {
      // like
      const favoritelistupdate = await prisma.favorite_table.update({
        where: {
          id: Number(body.id),
        },
        data: {
          favorite_list: body.data.toString(),
        },
      });

      const favoritecount = await prisma.list_table.findUnique({
        where: {
          id: Number(body.id),
        },
        select: {
          like_count: true,
        },
      });

      // like count
      let result;
      if (body.type === "up") {
        result = favoritecount.like_count + 1;
      } else if (body.type === "down") {
        result = favoritecount.like_count - 1;
      }
      const favoritecountupdate = await prisma.list_table.update({
        where: {
          id: body.id,
        },
        data: {
          like_count: result,
        },
      });
      res.json(favoritelistupdate);
    } catch (err) {
      res.send(err);
    }
  };

  switch (method) {
    case "GET":
      await dataGet();
      break;
    case "PUT":
      await dataPut();
      break;
    default:
      return;
  }
}

export default handler;
