import React, { useContext, useEffect, useRef } from "react";
import Style from "@/styles/maincon.module.scss";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Statusgroup } from "@/context/StatusContext";

const Tutorial = () => {
  const { data: session } = useSession();
  const { tutostate, setTutostate } = useContext(Statusgroup);
  const nameRef = useRef();

  const repsel = (key) => {
    axios.put("/api/auth/signup", { type: "newbie", id: session.user.id, key: key });
    setTutostate(2);
  };
  const nickSubmit = () => {
    let name = nameRef.current.value;
    axios.put("/api/auth/signup", { id: session.user.id, name: name });
    location.replace("/");
  };

  if (tutostate == 1) {
    return (
      <>
        <article className={Style.tuto_first}>
          <p>스타팅 포켓몬을 선택해주세요</p>
          <div className={Style.tuto_wrap}>
            <figure className={Style.tuto_img_wrap} onClick={() => repsel(1)}>
              <img src="https://data1.pokemonkorea.co.kr/newdata/pokedex/full/000101.png"></img>
              <figcaption>이상해씨</figcaption>
            </figure>
            <figure className={Style.tuto_img_wrap} onClick={() => repsel(4)}>
              <img src="https://data1.pokemonkorea.co.kr/newdata/pokedex/full/000401.png"></img>
              <figcaption>파이리</figcaption>
            </figure>
            <figure className={Style.tuto_img_wrap} onClick={() => repsel(7)}>
              <img src="https://data1.pokemonkorea.co.kr/newdata/pokedex/full/000701.png"></img>
              <figcaption>꼬부기</figcaption>
            </figure>
          </div>
        </article>
      </>
    );
  } else if (tutostate == 2) {
    return (
      <div className={Style.tuto_second}>
        <p>당신의 닉네임을 입력해주세요</p>
        <form className={Style.tuto_second_form}>
          <p>
            <input ref={nameRef} type="text" name="name" placeholder="name" autoComplete="off" />
          </p>
          <p>
            <button type="button" onClick={nickSubmit}>
              확인
            </button>
          </p>
        </form>
      </div>
    );
  }
};

export default Tutorial;
