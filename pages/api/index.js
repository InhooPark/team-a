//
import { PrismaClient } from "@prisma/client";
import { executeQuery } from "./db";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { method, body, query } = req;

  const dataGet = async () => {
    const test = await executeQuery("SELECT * FROM list_table ORDER BY id DESC", []);
    res.json(test);
  };
  const dataCreate = async () => {
    await prisma.list_table.create({
      data: {
        user_id: body.user_id,
        content: body.content,
      },
    });
    res.send("create");
    const creditAdd = await prisma.user_table.update({
      where: {
        id: Number(body.user_id),
      },
      data: {
        credit: body.credit + 5,
      },
    });
    res.send("creditAdd");
  };

  const dataPut = async () => {
    const follow = await prisma.list_table.findMany({
      where: {
        user_id: Number(body.id),
      },
      select: {
        id: true,
        user_id: true,
        content: true,
        date: true,
        like_count: true,
      },
    });
    res.json(follow);

    return follow;
  };
  switch (method) {
    case "GET":
      await dataGet();
      break; //데이터 조회
    case "POST":
      await dataCreate();
      break; //데이터 등록 및 전송
    case "PUT":
      await dataPut();
      break;
    default:
      return;
  }
}
