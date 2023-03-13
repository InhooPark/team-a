import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function handler(req, res) {
  const { method, body, query } = req;
  console.log("마이리스트")
  const getData = async () => {
    const mylist = await prisma.list_table.findMany({
      where: {
        user_id: Number(query.id),
      },
    });
    res.json(mylist);
  };

  switch (method) {
    case "GET":
      getData();
      break;
    default:
      return;
  }
}

export default handler;
