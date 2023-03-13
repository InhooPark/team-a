import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "@/styles/List.module.scss";
import { useSession } from "next-auth/react";
import { Statusgroup } from "@/context/StatusContext";
import axios from "axios";
import { InfoUser } from "@/context/infoContext";
import moment from "moment";

const Item = ({ obj, dataGet }) => {
  const { data: session } = useSession();
  const [infoMod, setInfoMod] = useState(false);
  const [followlist, setFollowlist] = useState([]);
  const [favoritelist, setFavoritelist] = useState([]);
  const [owner, setOwner] = useState();
  const { setPageStatus, setListUpdate, data, contentlist } = useContext(Statusgroup);
  const { who } = useContext(InfoUser);
  const dateAll = moment(obj.date).add(9, "hours").fromNow();
  const dateFollow = moment(obj.date).fromNow();

  const getContentOwner = () => {
    axios
      .get("/api/auth/who", {
        params: {
          type: "owner",
          id: obj.user_id,
        },
      })
      .then((res) => {
        setOwner(res.data);
      });
  };

  const getFollowList = () => {
    axios
      .get("/api/follow", {
        params: {
          id: session.user.id,
        },
      })
      .then((res) => {
        if (res.data.follow_list !== undefined) {
          setFollowlist(res.data.follow_list.split(","));
        } else {
          return;
        }
      });
  };

  const getFavoriteList = () => {
    axios
      .get("/api/like", {
        params: {
          id: obj.id,
        },
      })
      .then((res) => {
        if (res.data.favorite_list !== undefined) {
          setFavoritelist(res.data.favorite_list.split(","));
        } else {
          return;
        }
      });
  };

  const dataUpdate = (obj) => {
    setInfoMod(!infoMod);
    if (session.user.id == obj.user_id) {
      setListUpdate(obj);
      setPageStatus("UPDATE");
    } else {
      console.log("불일치");
    }
  };
  const dataDelete = async (obj) => {
    setInfoMod(!infoMod);
    if (session.user.id == obj.user_id) {
      await axios.delete(`/api/${obj.id}`);
      await axios.put("/api/credit", { id: session.user.id, credit: who.credit });
    } else {
      alert("본인이 아니에요");
    }

    dataGet();
  };

  const userFollow = (id, bool) => {
    if (!bool) {
      followlist.push(id);
      axios.post("/api/follow", { id: session.user.id, data: followlist });
      location.reload();
    } else {
      let aa = followlist.filter((obj) => obj != id);
      axios.post("/api/follow", { id: session.user.id, data: aa });
      location.reload();
    }
  };
  const infoModModal = () => {
    setInfoMod(!infoMod);
  };

  const heart = async () => {
    if (favoritelist.includes(session.user.id.toString())) {
      // 좋아요 취소
      const result = favoritelist.filter((obj) => obj !== session.user.id.toString());
      await axios.put("api/like", { type: "down", id: obj.id, data: result });
    } else {
      // 좋아요
      favoritelist.push(session.user.id.toString());
      const result = favoritelist.filter((obj) => obj !== "" && obj !== undefined && obj !== null);
      await axios.put("/api/like", { type: "up", id: obj.id, data: result });
    }
    // re-render 발생시켜야 하는데?
    getFavoriteList();
  };
  useEffect(() => {
    getFollowList();
    getFavoriteList();
  }, []);
  useEffect(() => {
    getContentOwner();
  }, [data]);

  if (owner !== undefined) {
    return (
      <>
        <li className={styles.detail_list} key={obj.id}>
          {/* 프로필로 이동 */}
          <div className={styles.profileInfo}>
            <div className={styles.profile_info_wrap}>
              <div className={styles.profile_img}>
                <img src={`/img/poke_profile_img/pokballpixel-${owner.pro_img}.png`}></img>
              </div>
              <p className={styles.user}>{owner.name}</p>
              <p className={styles.date}> {contentlist ? dateAll : dateFollow}</p>
            </div>
            <div className={styles.info_mod_wrap} onClick={infoModModal}>
              <svg width="4" height="20.5" viewBox="0 0 8 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M4 32.9853C6.20641 32.9853 8 34.7789 8 36.9853C8 39.1917 6.20641 40.9853 4 40.9853C1.79359 40.9853 0 39.1917 0 36.9853C0 34.7789 1.79359 32.9853 4 32.9853ZM4 16.9853C6.20641 16.9853 8 18.7789 8 20.9853C8 23.1917 6.20641 24.9853 4 24.9853C1.79359 24.9853 0 23.1917 0 20.9853C0 18.7789 1.79359 16.9853 4 16.9853ZM4 0.985352C6.20641 0.985352 8 2.77894 8 4.98535C8 7.19174 6.20641 8.98535 4 8.98535C1.79359 8.98535 0 7.19174 0 4.98535C0 2.77894 1.79359 0.985352 4 0.985352Z"
                  fill="#E36E6E"
                />
              </svg>
              {session.user.id !== obj.user_id ? (
                <div className={infoMod ? `${styles.info_mod_btn_wrap} ${styles.on}` : styles.info_mod_btn_wrap}>
                  <p className={styles.follow} onClick={() => userFollow(obj.user_id, followlist && followlist.includes(obj.user_id.toString()))}>
                    {followlist && followlist.includes(obj.user_id.toString()) ? "언팔로우" : "팔로우"}
                  </p>
                </div>
              ) : (
                <div className={infoMod ? `${styles.info_mod_btn_wrap} ${styles.on}` : styles.info_mod_btn_wrap}>
                  <p className={styles.update} onClick={() => dataUpdate(obj)}>
                    수정
                  </p>
                  <p className={styles.remove} onClick={() => dataDelete(obj)}>
                    삭제
                  </p>
                </div>
              )}
            </div>
          </div>
          <pre className={styles.detail}>{obj.content}</pre>
          <section className={styles.btn}>
            {favoritelist && favoritelist.includes(session.user.id.toString()) ? (
              <button className={styles.fillheart} onClick={(e) => heart(e)}></button>
            ) : (
              <button className={styles.heart} onClick={(e) => heart(e)}></button>
            )}
          </section>
        </li>
      </>
    );
  }
};

export default Item;
