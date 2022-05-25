import { useState } from "react";
import { useHistory } from "react-router-dom";
import "./index.css";
export const Header = ({ hiddenSideMenu, setHidden }) => {
  const [showMenu, setShowMenu] = useState(false);
  const history = useHistory();
  const handleLogout = () => {
    localStorage.setItem("isAuthenticated", false);
    localStorage.setItem("user", null);
    history.push("/login");
    window.location.reload();
  };
  return (
    <div class="top-bar-wrapper" data-menu="collapse">
      <div>
        <div class="left-menu-icon" onClick={() => setHidden(!hiddenSideMenu)}>
          <i
            class="fa fa-sliders"
            aria-hidden="true"
            style={{ color: "#f1c40f" }}
          ></i>
        </div>
      </div>
      <ul
        id="main-menu"
        class="menu-nav mob-navset"
        style={{ display: showMenu ? "inline" : "none" }}
      >
        <li class="tviconset">
          <a href="https://www.wyshopping.life/" target="_blank">
            <span>
              <img src="assets/images/WYshoping.png" />
            </span>
            Shopping
          </a>
        </li>

        <li class="sep"></li>
        <li class="tviconset">
          <a href="https://wygame.games/" target="_blank">
            <span>
              <img src="assets/images/WYgaming.png" />
            </span>
            Gaming
          </a>
        </li>
        <li class="sep"></li>
        <li class="tviconset">
          <a href="https://wybet.games/" target="_blank">
            <span>
              <img src="assets/images/wybet.png" />
            </span>
            Betting
          </a>
        </li>
        <li class="sep"></li>
        <li class="tviconset">
          <a href="https://wc.exchange/" target="_blank">
            <span>
              <img src="assets/images/wcx-exchange.png" />
            </span>
            Exchange
          </a>
        </li>
        <li class="sep"></li>
        <li class="tviconset">
          <a href="https://thecoinweekly.com/" target="_blank">
            <span>
              <img src="assets/images/wyz_news.png" />
            </span>
            Crypto News
          </a>
        </li>
        <li class="sep"></li>

        <li class="tviconset">
          <a href="/dashboard">
            <span>
              <img src="assets/images/homeIcon.png" />
            </span>
            Office
          </a>
        </li>
        <li class="sep"></li>
        <li data-submenu="true">
          <a>
            History &nbsp; <i class="fa fa-sort-desc" aria-hidden="true"></i>{" "}
          </a>
          <ul class="submenu">
            <li>
              <a href="/active-history">Activate/Upgrade History</a>
            </li>
            <li>
              <a href="/activate">Activate / Upgrade</a>
            </li>
            <li>
              <a href="/widthdrawl">Withdrawal</a>
            </li>
            <li>
              <a href="/wallet">Withdrawal Address </a>
            </li>
            <li>
              <a href="/widthdrawl-report">Widthrawal History</a>
            </li>
          </ul>
        </li>
        <li class="sep"></li>
        <li data-submenu="true">
          <a>
            My Team &nbsp; <i class="fa fa-sort-desc" aria-hidden="true"></i>{" "}
          </a>
          <ul class="submenu">
            <li>
              <a href="/my-team">My Team</a>
            </li>
            <li>
              <a href="/referral-report">My Referral</a>
            </li>
            <li>
              <a href="/level-details">Level Details</a>
            </li>
            <li>
              <a href="/downline-report">My Leg Downline</a>
            </li>
          </ul>
        </li>
        <li class="sep"></li>
        <li data-submenu="true">
          <a>
            Income &nbsp; <i class="fa fa-sort-desc" aria-hidden="true"></i>{" "}
          </a>
          <ul class="submenu">
            <li>
              <a href="/daily-yeild">Daily Yeild</a>
            </li>
            <li>
              <a href="/team-dy">Team DY</a>
            </li>
            <li>
              <a href="/bonus-dy">Bonus DY</a>
            </li>
            <li>
              <a href="/referral-earning">Referral Earning</a>
            </li>
            <li>
              <a href="/pools">Pool Income</a>
            </li>
          </ul>
        </li>
        <li class="sep"></li>
        <li>
          <a onClick={handleLogout}>Logout</a>
        </li>
      </ul>
      <ul id="main-menu" class="menu-nav mob-navset">
        <li class="tviconset">
          <a href="https://www.wyshopping.life/" target="_blank">
            <span>
              <img src="assets/images/WYshoping.png" />
            </span>
            Shopping
          </a>
        </li>

        <li class="sep"></li>
        <li class="tviconset">
          <a href="https://wygame.games/" target="_blank">
            <span>
              <img src="assets/images/WYgaming.png" />
            </span>
            Gaming
          </a>
        </li>
        <li class="sep"></li>
        <li class="tviconset">
          <a href="https://wybet.games/" target="_blank">
            <span>
              <img src="assets/images/wybet.png" />
            </span>
            Betting
          </a>
        </li>
        <li class="sep"></li>
        <li class="tviconset">
          <a href="https://wc.exchange/" target="_blank">
            <span>
              <img src="assets/images/wcx-exchange.png" />
            </span>
            Exchange
          </a>
        </li>
        <li class="sep"></li>
        <li class="tviconset">
          <a href="https://thecoinweekly.com/" target="_blank">
            <span>
              <img src="assets/images/wyz_news.png" />
            </span>
            Crypto News
          </a>
        </li>
        <li class="sep"></li>

        <li class="tviconset">
          <a href="/dashboard">
            <span>
              <img src="assets/images/homeIcon.png" />
            </span>
            Office
          </a>
        </li>
        <li class="sep"></li>
        <li data-submenu="true">
          <a>
            History &nbsp; <i class="fa fa-sort-desc" aria-hidden="true"></i>{" "}
          </a>
          <ul class="submenu">
            <li>
              <a href="/active-history">Activate/Upgrade History</a>
            </li>
            <li>
              <a href="/activate">Activate / Upgrade</a>
            </li>
            <li>
              <a href="/widthdrawl">Withdrawal</a>
            </li>
            <li>
              <a href="/wallet">Withdrawal Address </a>
            </li>
            <li>
              <a href="/widthdrawl-report">Widthrawal History</a>
            </li>
          </ul>
        </li>
        <li class="sep"></li>
        <li data-submenu="true">
          <a>
            My Team &nbsp; <i class="fa fa-sort-desc" aria-hidden="true"></i>{" "}
          </a>
          <ul class="submenu">
            <li>
              <a href="/my-team">My Team</a>
            </li>
            <li>
              <a href="/referral-report">My Referral</a>
            </li>
            <li>
              <a href="/level-details">Level Details</a>
            </li>
            <li>
              <a href="/downline-report">My Leg Downline</a>
            </li>
          </ul>
        </li>
        <li class="sep"></li>
        <li data-submenu="true">
          <a>
            Income &nbsp; <i class="fa fa-sort-desc" aria-hidden="true"></i>{" "}
          </a>
          <ul class="submenu">
            <li>
              <a href="/daily-yeild">Daily Yeild</a>
            </li>
            <li>
              <a href="/team-dy">Team DY</a>
            </li>
            <li>
              <a href="/bonus-dy">Bonus DY</a>
            </li>
            <li>
              <a href="/referral-earning">Referral Earning</a>
            </li>
            <li>
              <a href="/pools">Pool Income</a>
            </li>
          </ul>
        </li>
        <li class="sep"></li>
        <li>
          <a onClick={handleLogout}>Logout</a>
        </li>
      </ul>
      <div
        class="toggle-menu"
        onClick={() => setShowMenu(showMenu ? false : true)}
      >
        <span></span>
        <i class="fa fa-times close_button" aria-hidden="true"></i>
      </div>
    </div>
  );
};
