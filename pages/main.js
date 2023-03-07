import { signOut, useSession } from "next-auth/react";
import React from "react";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import Maincontents from "@/components/Maincontents";
import Style from "@/styles/layout.module.scss";

const Main = () => {
  const { data: session, status } = useSession();

  const router = useRouter();
  if (status === "unauthenticated") {
    router.replace("/");
  } else if (status === "authenticated") {
    return (
      <Layout>
        <div className={Style.main_content_inner}>
          <Maincontents></Maincontents>
        </div>
        {/* 상태에 따라 표기하는게 달라져야함, 리스트일수도 개인정보일수도 상점/도감일수도 상점/도감일시 레이아웃도 변경되어야함*/}
      </Layout>
    );
  }
};

export default Main;
