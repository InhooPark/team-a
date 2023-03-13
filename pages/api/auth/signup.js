import { PrismaClient } from "@prisma/client";
import CryptoJS from "crypto-js";

const prisma = new PrismaClient();

async function handler(req, res) {
  const { method, body } = req;
  const postData = async () => {
    const user = await prisma.user_table.findUnique({
      where: {
        email: body.email,
      },
    });

    if (user) {
      res.status(422).json({ message: "중복 이메일", error: true });
    } else {
      let password = CryptoJS.AES.encrypt(body.password, process.env.NEXT_PUBLIC_SECRET_KEY).toString();

      const createUser = await prisma.user_table.create({
        data: {
          name: "",
          pro_img: "000",
          email: body.email,
          password: password,
          credit: 0,
          rep: 0,
        },
      });

      res.status(201).json({ message: "Create", error: false });
    }
  };

  const putData = async () => {
    // 신규 유저일 경우 처리
    if (body.type == "newbie") {
      const repCreate = await prisma.user_table.update({
        where: {
          id: body.id,
        },
        data: {
          rep: body.key,
        },
      });
      const haveCreate = await prisma.have_poke.create({
        data: {
          id: Number(body.id),
          poke_id: body.key.toString(),
        },
      });
    }
    // 신규유저가 아닐때의 처리
    else {
      console.log("aa");
      console.log(body);

      try {
        const userUpdate = await prisma.user_table.update({
          where: { id: body.id },
          data: {
            // 대표 포켓몬 변경까지만 여기서 패스워드같은 민감정보는 따로 해야할듯
            pro_img: body.pro_img,
            name: body.name,
            rep: body.key,
          },
        });
        res.json({ message: "success" });
      } catch (err) {
        res.send(err);
      }
    }
  };

  const deleteData = async () => {
    try {
      const userDelete = await prisma.user_table.delete({
        where: {
          id: Number(body),
        },
      });
    } catch (err) {
      res.send(err);
    }
  };

  switch (method) {
    case "POST":
      postData();
      break;
    case "PUT":
      putData();
      break;
    case "DELETE":
      deleteData();
      break;
    default:
      return;
  }
}

export default handler;
