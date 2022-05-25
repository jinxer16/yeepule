import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getWalletAddress,
  getAllParticipants,
} from "../../store/actions/dashboard";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { API } from "../../store/actions/API";
import zIndex from "@mui/material/styles/zIndex";

export const SideMenu = ({ hiddenSideMenu, setHidden }) => {
  const dashboard = useSelector((state) => state?.dashboard);
  const dispatch = useDispatch();
  const user = localStorage.getItem("user");
  const [copied, setCopied] = useState(false);
  const getAllData = () => {
    if (user) {
      let ress = JSON.parse(user);
      let uId = ress?.user_id;
      dispatch(getWalletAddress(uId));
      dispatch(getAllParticipants(uId));
    }
  };

  const [betaWallet, setBetaWallet] = useState(null);

  const getBetaWallet = async () => {
    let ress = JSON.parse(user);
    let uId = ress?.user_id;
    try {
      const res = await API.get(`/get_betawallet?id=${uId}`);
      setBetaWallet(res?.data.data[0]);
    } catch (e) {
      console.log("error", e);
    }
  };
  useEffect(() => {
    getAllData();
    getBetaWallet();
  }, []);
  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 1500);
    }
  }, [copied]);

  return (
    <>
      <div
        className="left-panel left-panel2"
        style={
          hiddenSideMenu
            ? { zIndex: 9999, display: "inline" }
            : { zIndex: 0, display: "inline" }
        }
      >
        <div className="close-panel" onClick={() => setHidden(!hiddenSideMenu)}>
          <i className="fa fa-times close_button" aria-hidden="true"></i>
        </div>
        <div className="wdg-divider"></div>
        <div className="wdg-logo">
          <a href="/dashboard">
            <img
              src="assets/images/logo.png"
              style={{ width: "100px", marginTop: "60px" }}
            />
          </a>
        </div>
        <div className="wdg-divider"></div>
        <div>
          <div className="wdg-avatar"></div>
          <div className="wdg-user">
            <input
              type="hidden"
              id="HiddenField1UserAccount"
              value="TL8p3KVhZj6Gu59zh8bF6WregzGFpJSgL9"
            />
            <span className="user-label">Member ID:</span>
            {/* <a
              href={`https://wyzthscan.org/address/${dashboard?.walletAddress}`}
              target={"_blank"}
            > */}
              <span className="user-id" id="" style={{ color: "#fbc50b" }}>
                {dashboard?.userId ? dashboard?.userId : 0}{" "}
              </span>
            {/* </a> */}
          </div>
        </div>
        <div className="wdg-divider"></div>
        <div className="wdg-stats">
          <div className="stats-box-icon text-center">
            <i className="fa fa-users"></i>
          </div>
          <div className="stats-box">
            <div className="stats-value">
              {dashboard?.allParticipants?.all_participants
                ? dashboard?.allParticipants?.all_participants
                : 0}
            </div>
            <div className="stats-label">All participants:</div>
          </div>

          <div className="stats-box">
            <div className="stats-value">
              {dashboard?.allParticipants?.participants_joined_last_24_hours
                ? dashboard?.allParticipants?.participants_joined_last_24_hours
                : 0}
            </div>
            <div className="stats-label">Joined in 24 hour:</div>
          </div>
          <div className="stats-box">
            <div className="stats-value">
              {betaWallet?.ParticipantEarnedULE ?? "0"}
            </div>

            <div className="stats-label">Participants have earned ULE:</div>
          </div>
          <div className="stats-box">
            <div className="stats-value">
              {betaWallet?.ParticipantEarnedUSD ?? 0}
            </div>

            <div className="stats-label">Participants have earned USD:</div>
          </div>
        </div>

        <div className="wdg-divider"></div>
        <div className="wdg-links">
          <div className="wdg-label">Affiliate Link:</div>
          {dashboard?.userId && (
            <div className="wdg-box bxset primary">
              <input
                type="text"
                className="wdg-input-box"
                id="myInput1"
                value={`https://yeepule.network/registration?referrallink=${dashboard?.userId}`}
              />

              <div className="fast-msg-box"></div>
            </div>
          )}
          <div className="wdg-actions">
            <CopyToClipboard
              text={`https://yeepule.network/registration?referrallink=${dashboard?.userId}`}
              onCopy={() => setCopied(true)}
            >
              <button type="button">
                <i className="fa fa-clipboard"></i>
                <span>Copy</span>
              </button>
            </CopyToClipboard>
          </div>
          {copied ? (
            <span style={{ color: "red" }}>Link is Copied.</span>
          ) : null}
        </div>

        <div className="wdg-links">
          <div className="wdg-label">Wallet Address:</div>
          <div className="wdg-box bxset primary">
            <a
              href={`https://wyzthscan.org/address/${dashboard?.walletAddress}`}
              target={"_blank"}
            >
              <input
                type="text"
                onClick={() =>
                  `window.open('https://wyzthscan.org/address/${dashboard?.walletAddress}','_blank')`
                }
                className="wdg-input-box cursorset"
                id="myInput1"
                value={dashboard?.walletAddress}
              />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
