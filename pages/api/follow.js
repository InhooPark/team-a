import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function handler(req, res) {
  const { method, body, query } = req;
  console.log("팔로우.js")
  const getData = async () => {
    try {
      const favorite = await prisma.follow_table.findUnique({
        where: {
          id: Number(query.id),
        },
      });

      if (favorite === null) {
        const newFavorite = await prisma.follow_table.create({
          data: {
            id: Number(query.id),
            follow_list: "",
          },
        });
        res.json(newFavorite);
      } else {
        res.json(favorite);
      }
    } catch (err) {
      res.send(err);
    }
  };

  const postData = async () => {
    try {
      const updatefollowlist = await prisma.follow_table.update({
        where: {
          id: Number(body.id),
        },
        data: {
          follow_list: body.data.toString(),
        },
      });
      res.json(updatefollowlist);
    } catch (err) {
      res.send(err);
    }
  };

  switch (method) {
    case "GET":
      getData();
      break;
    case "POST":
      postData();
      break;
    default:
      return;
  }
}

export default handler;
