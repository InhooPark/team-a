import { Statusgroup } from "@/context/StatusContext";
import React, { createContext, useContext, useEffect, useLayoutEffect, useState } from "react";

export const ColorContext = createContext(null);

const ColorTheme = ({ children }) => {
  const { pokedata } = useContext(Statusgroup);
  const [color, setColor] = useState();

  const colorset = () => {
    if (pokedata !== undefined) {
      let type = pokedata.ko_type.split(",");
      if (type[0] === "불꽃" || type[0] === "에스퍼" || type[0] === "페어리") setColor("red");
      else if (type[0] === "물" || type[0] === "얼음" || type[0] === "비행" || type[0] === "강철") setColor("blue");
      else if (type[0] === "풀" || type[0] === "벌레") setColor("green");
      else if (type[0] === "노말" || type[0] === "전기") setColor("yellow");
      else if (type[0] === "격투" || type[0] === "땅" || type[0] === "바위") setColor("brown");
      else if (type[0] === "독" || type[0] === "고스트" || type[0] === "드래곤") setColor("purple");
    }
  };

  useEffect(() => {
    colorset();
  }, [pokedata]);

  return <ColorContext.Provider value={color}> {children}</ColorContext.Provider>;
};

export default ColorTheme;
