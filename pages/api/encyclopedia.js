import { PrismaClient } from "@prisma/client";
let prisma = new PrismaClient();

export default async function handler(req, res) {
  const { method, body } = req;
  //포켓몬 데이터 뿌리기
  const getEncyclo = async () => {
    try {
      const encycloData = await prisma.poke_table.findMany();
      res.json(encycloData);
      return encycloData;
    } catch (err) {
      res.send(err);
    }
  };
  //보유중인 포켓몬 데이터 뽑아내기
  const update = async () => {
    try {
      const data = await prisma.have_poke.findUnique({
        where: {
          id: body.user.id,
        },
        select: {
          id: true,
          poke_id: true,
        },
      });
      res.json(data);
    } catch (err) {
      res.send(err);
    }
  };
  //구매한 포켓몬 추가
  const getPost = async () => {
    try {
      await prisma.have_poke.update({
        where: {
          id: body.id,
        },
        data: {
          poke_id: body.data,
        },
      });
      res.send("success");
    } catch (err) {
      res.send(err);
    }
  };
  switch (method) {
    case "GET":
      await getEncyclo();
      break;
    case "PUT":
      await update();
      break;
    case "POST":
      await getPost();
    default:
      return;
  }
}
