import axios from "axios";
import React, { useContext, useEffect, useReducer, useRef, useState } from "react";
import Style from "@/styles/maincon.module.scss";
import { useSession } from "next-auth/react";
import { InfoUser } from "@/context/infoContext";
import { initScriptLoader } from "next/script";

const Encyclopedia = () => {
  const [pokeData, setPokeData] = useState();
  const { data: session } = useSession();
  //보유중인 포켓몬이
  const [userHave, setUserHave] = useState();
  //팝업창
  const [modalstate, setModalState] = useState(false);
  //who(유저 정보: who.id, who.credit, who.rep(대표이미지))
  const { who } = useContext(InfoUser);
  const currentKey = useRef();
  //포켓몬 id+1값
  const poke_key = useRef();
  const [status, setStatus] = useState(false);

  useEffect(() => {
    getEncyclopedia();
    havePokeGet();
  }, []);

  //보유중인 포켓몬(테이블명 : have_poke)에 id+poke_id  가져오기
  const havePokeGet = () => {
    axios.put(`/api/encyclopedia`, session).then(res => {
      //보유중인 poke_id
      let aa = (res.data.poke_id);
      //배열로 쪼개기
      let arr = aa.split(',');
      setUserHave(arr);
    });
  };
  const getEncyclopedia = () => {
    axios.get("/api/encyclopedia").then(res => {
      setPokeData(res.data);
    });
  };
  // pokemon 값에 따라 특정 캐릭터 구매 / 디테일 확인
  //pokemon.(id,credit, ko_name)
  const pokeBuy = (pokemon) => {
    currentKey.current = pokemon;
    
    if (userHave.includes(pokemon.id.toString())) {
      alert("이미 보유중인 포켓몬 입니다");
    } else {
      //팝업창 생성 후 구매하시겠습니까
      setModalState(!modalstate);
    }
  };
  //팝업창 yes,no
  const no = () => {
    setModalState(!modalstate);
  }
  const yes = () => {
    if(who.credit < currentKey.current.credit) {
      alert("구매하실 수 없습니다")
    } else {
      //배열에 선택한 poke_id에 push
      userHave.push(currentKey.current.id.toString())
      //aa를 배열로 만들어서 구매한 포켓몬 추가
      let aa;
      userHave.map((id,key)=>{
        if(key == 0 ){
          aa = id;
        }else{
          aa += ','+id;
        }
      })
      axios.post(`/api/encyclopedia`, {id: session.user.id, data: aa})
      //크레딧 관리
      let data = who.credit - currentKey.current.credit;
      axios.put(`/api/userencyl`, {id: session.user.id, data: data})
      location.reload();
    }
  }
  //모달창 닫기
  const modalClick = (e) => {
    if (e.target.id === "aa") {
      setModalState(!modalstate);
    }
  };
  const modalClick2 = (e) => {
    if (e.target.id === "aa") {
      setStatus(!status);
    }
  };

  const pokeDetail = (key) => {
    let data = key + 1;
    poke_key.current = key + 1;
    //user_table에 rep(대표 몬스터)
    // 디테일 부분은 속성 출력 / 추가로 chart.js - Radar Chart  이용해서 그래프 그려보기
    // 참고 : https://www.chartjs.org/docs/latest/charts/radar.html
    // 여기서 대표 캐릭터 설정하는게 좋을듯 대표포켓몬은 /api/auth/signup/ 으로 보내야함
    if (!userHave.includes(data.toString())) {
      alert('구매 먼저 해주세요')
    } else {
      setStatus(!status);
    }
  };
  const changeRep = () => {
    //poke_key (클릭한 포켓몬의 고유 번호)
    axios.put(`/api/auth/signup/`, {id: session.user.id, key: poke_key.current})
    location.reload()
  }
  if (userHave !== undefined) {
    return (
      <>
        <article className={Style.encyclopedia_container}>
          {pokeData && pokeData.map((pokemon, key) => {
            if (userHave.includes(pokemon.id.toString())) {
                return (
                  <figure className={`${Style.poke_card}`} key={pokemon.id}>
                    <div className={Style.card_img_wrap}>
                      <img src={pokemon.card_url}></img>
                    </div>
                    <figcaption className={Style.card_info_wrap}>
                      <p>
                        No.{pokemon.id} &nbsp;
                        {pokemon.ko_name}
                      </p>
                      <div className={Style.info_btn_wrap}>
                        {/* 보유한 포켓몬일 경우 구매하기 버튼을 disable 시켜도 좋을듯 */}
                        <button onClick={() => pokeBuy(pokemon)}>구매하기</button>
                        <button onClick={() => pokeDetail(key)}>상세정보</button>
                      </div>
                    </figcaption>
                  </figure>
                );
            } else {
                return (
                  <figure className={`${Style.poke_card} ${Style.have}`} key={pokemon.id}>
                    <div className={Style.card_img_wrap}>
                      <img src={pokemon.card_url}></img>
                    </div>
                    <figcaption className={Style.card_info_wrap}>
                      <p>
                        No.{pokemon.id} &nbsp;
                        {pokemon.ko_name}
                      </p>
                      <div className={Style.info_btn_wrap}>
                         {/* 보유한 포켓몬일 경우 구매하기 버튼을 disable 시켜도 좋을듯 */}
                        <button onClick={() => pokeBuy(pokemon)}>구매하기</button>
                        <button onClick={() => pokeDetail(key)}>상세정보</button>
                      </div>
                    </figcaption>
                  </figure>
                );
            }
          })}
          <div
            className={
              modalstate
                ? `${Style.sticky_tray} ${Style.on}`
                : Style.sticky_tray
            }
          >
            <div
              id="aa"
              className={Style.encyclopedia_modal}
              onClick={(e) => modalClick(e)}
            >
              <div>
                <p>포켓몬 이름: {currentKey.current&&currentKey.current.ko_name}</p>
                <p>보유중 크레딧: {who.credit}</p>
                <p>포켓몬 크레딧: {currentKey.current&&currentKey.current.credit}</p>
                <div>
                  <p>구매하시겠습니까?</p>
                  <button onClick={yes}>예</button>
                  <button onClick={no}>아니오</button>
                </div>
              </div>
            </div>
          </div>
          <div className={status ? `${Style.sticky_tray}  ${Style.on}`: `${Style.sticky_tray}`}>
            <div id="aa" className={Style.encyclopedia_modal} onClick={(e) => modalClick2(e)}>
              <div>
                <button onClick={() => changeRep()}>대표캐릭터 설정</button>
              </div>
            </div>
          </div>
        </article>
        
      </>
    );
  }
};

export default Encyclopedia;
