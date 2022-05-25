import { useState } from "react";
import { SideMenu, Header } from "../index";
export const Layout = (props) => {
  const [hiddenSideMenu, setHidden] = useState(false);

  return (
    <div id="member-layout" class="page-container">
      <SideMenu hiddenSideMenu={hiddenSideMenu} setHidden={setHidden} />
      <div class="main-panel">
        <Header hiddenSideMenu={hiddenSideMenu} setHidden={setHidden} />
        {props.children}
      </div>
    </div>
  );
};
