import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getDownlineReport } from "../../store/actions/dailyYield";
import { API } from "../../store/actions/API";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Web3 from "web3";
import moment from "moment";
import {
  contractAddressToken,
  abiToken,
  contractAddress,
  abi,
} from "./constants";

export const Activate = () => {
  const downlineReport = useSelector(
    (state) => state?.dailyYield?.downlineReport
  );
  const dispatch = useDispatch();
  const user = localStorage.getItem("user");
  const dashboard = useSelector((state) => state?.dashboard);

  const [blnce, setBlnce] = useState(0);
  const [account, setAccount] = useState("");
  const [chainId, setChainId] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoadingTrans, setLoadingTrans] = useState(false);

  const [apiDate, setDate] = useState(true);
  const [pending, setPending] = useState(0);
  const [betaWallet, setBetaWallet] = useState(null);
  const [isLoading, setLoading] = useState(true);

  const [confirm, setConfirm] = useState([]);
  const [rate, setRate] = useState(0);

  const getLiveRate = async () => {
    try {
      const res = await API.get(`/live_rate`);
      setRate(res?.data.data[0].usdperunit);
    } catch (e) {
      console.log("error", e);
    }
  };
  const getBetaWallet = async () => {
    let ress = JSON.parse(user);
    let uId = ress?.user_id;
    try {
      const res = await API.get(`/get_betawallet?id=${uId}`);
      setBetaWallet(res?.data.data[0]);
      setLoading(false);
    } catch (e) {
      console.log("error", e);
      setLoading(false);
    }
  };
  const getLiveRate1 = async () => {
    let ress = JSON.parse(user);
    let uId = ress?.user_id;
    try {
      const res = await API.get(`/pending_date?id=${uId}`);
      setDate(res?.data.data[0].edate);
      let date1 = moment(res?.data.data[0].edate)
        .add(15, "minutes")
        .isBefore(moment());
      setDate(date1);
    } catch (e) {
      console.log("error", e);
    }
  };
  const getLiveRate2 = async () => {
    let ress = JSON.parse(user);
    let uId = ress?.user_id;
    try {
      const res = await API.get(`/pending_activation?id=${uId}`);
      setPending(res?.data.data[0]);
    } catch (e) {
      console.log("error", e);
    }
  };
  const getLiveRate3 = async () => {
    let ress = JSON.parse(user);
    let uId = ress?.user_id;
    try {
      const res = await API.get(`/confirm_payment?id=${uId}`);
      setConfirm(res?.data.data);
    } catch (e) {
      console.log("error", e);
    }
  };
  useEffect(() => {
    getBetaWallet();
    getLiveRate();
    getLiveRate1();
    getLiveRate2();
    getLiveRate3();
  }, []);
  const metamask = async () => {
    let isConnected = false;
    try {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        isConnected = true;
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
        isConnected = true;
      } else {
        isConnected = false;
      }
      if (isConnected === true) {
        const web3 = window.web3;
        let accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
        let chain = await web3.eth.getChainId();
        setChainId(chain);

        let contract = new web3.eth.Contract(abiToken, contractAddressToken);
        let data = await contract.methods.balanceOf(accounts[0]).call();
        let token = data / 1000000000000000000;
        setBlnce(token);
        console.log(token);

        window.ethereum.on("accountsChanged", async function (accounts) {
          setAccount(accounts[0]);
          let chain = await web3.eth.getChainId();
          setChainId(chain);

          const web3 = window.web3;
          let contract = new web3.eth.Contract(abiToken, contractAddressToken);
          let data = await contract.methods.balanceOf(accounts[0]).call();
          let token = data / 1000000000000000000;
          setBlnce(token);
        });
      }
    } catch (error) {
      console.log("error message", error?.message);
    }
  };
  useEffect(() => {
    metamask();
  }, []);

  async function handleActivation() {
    try {
      setLoadingTrans(true);

      let address = dashboard?.walletAddress; //Login User Address
      let uid = dashboard?.userId; //Login User Id
      let usdamt = amount; //Package USD Amount
      let token = blnce; //Package ULE Value
      let packid = usdamt;
      // let package = 1;

      let mainadd = account;

      if (parseInt(blnce) < parseInt(parseInt(amount) / rate)) {
        alert("Wallet balance insufficient!!!");
        setLoadingTrans(false);
        
        return;
      }

      if (parseInt(usdamt) < 100) {
        alert("Enter Minimum package amount 100 USD!!!");
        setLoadingTrans(false);
        return;
      }

      if (parseInt(parseInt(usdamt) % 100) != 0) {
        alert("Enter package amount in multiple of 100 USD!!!");
        setLoadingTrans(false);
        return;
      }

      if (parseInt(usdamt) > 10000) {
        alert("Maximum package amount is 10000 USD");
        setLoadingTrans(false);
        return false;
      }

      if (mainadd == undefined) {
        alert("Please connect wallet!!!");
        setLoadingTrans(false);
        return;
      }
      if (address.toUpperCase() != mainadd.toUpperCase()) {
        alert("Wallet address and login miss match");
        setLoadingTrans(false);
        return;
      }
      if (packid == "0" || packid == "") {
        alert("Please Enter correct package amount!!!");
                setLoadingTrans(false);
        return;
      }

      let value = amount / rate;
      const web3 = window.web3;

      let tokenAmount = web3.utils.toWei(value.toString());
      console.log("tokenAmount", tokenAmount);
      let contract = new web3.eth.Contract(abi, contractAddress);
      let tokencontract = new web3.eth.Contract(abiToken, contractAddressToken);
      await tokencontract.methods
        .approve(contractAddress, tokenAmount.toString())
        .send({ from: account });

      contract.methods
        .sell(tokenAmount.toString())
        .send({
          from: account,
        })
        .on("transactionHash", async (hash) => {
          if (hash != "") {
            try {
              const res = await API.post(`/activation`, {
                uid: uid,
                transaction: hash,
                amount: amount,
                addreslist: account,
                useraddress: account,
                amountlist: value,
                tokenamount: amount / rate,
              });
              console.log(res);
              if (res?.data?.success) {
                toast.success("Successfully subscribed to Activation ! ");
                setLoadingTrans(false);

              } else {
                setLoadingTrans(false);

                toast.error("Something went wrong ! ");
              }

              setTimeout(() => {
                getLiveRate1();
              }, 250);
            } catch (e) {
              console.log("error", e);
              setLoadingTrans(false);
              toast.error("Something went wrong ! ");
            }
          }
        });
    } catch (error) {
      console.log("error", error);
      setLoadingTrans(false);

    }
  }
  const getLastTransaction = async () => {
    try {
      let ress = JSON.parse(user);
      let uId = ress?.user_id;
      const res = await API.get(`/verify_last_update_time?id=${uId}`);
      return res?.data?.data ? res?.data?.data : [];
    } catch (e) {
      return [];
    }
  };
  async function handleUpdation() {
    try {
      setLoadingTrans(true);
      setLoadingTrans(false);
      let maxWithdraw = await getLastTransaction();
      let address = dashboard?.walletAddress; //Login User Address
      let uid = dashboard?.userId; //Login User Id
      let usdamt = amount; //Package USD Amount
      let token = blnce; //Package ULE Value
      let packid = usdamt;
      // let package = 1;
      if (maxWithdraw.length > 0) {
        alert(
          "You can make upgrade after 2 hours from your previous Upgrade !"
        );
        setLoadingTrans(false);

        return;
      }
      let mainadd = account;
      if (parseInt(amount) < parseInt(betaWallet?.activatupgradeamnt_trading)) {
        alert(
          "Your Current Package amount should me more than or equal to Last Package"
        );
        setLoadingTrans(false);

        return;
      }
      if (parseInt(blnce) < parseInt(parseInt(amount) / rate)) {
        alert("Wallet balance insufficient!!!");
        setLoadingTrans(false);

        return;
      }

      if (parseInt(usdamt) < 100) {
        alert("Enter Minimum package amount 100 USD!!!");
        setLoadingTrans(false);

        return;
      }

      if (parseInt(parseInt(usdamt) % 100) != 0) {
        alert("Enter package amount in multiple of 100 USD!!!");
        setLoadingTrans(false);

        return;
      }

      if (parseInt(usdamt) > 10000) {
        alert("Maximum package amount is 10000 USD");
        setLoadingTrans(false);

        return false;
      }

      if (mainadd == undefined) {
        alert("Please connect wallet!!!");
        return;
      }
      if (address.toUpperCase() != mainadd.toUpperCase()) {
        setLoadingTrans(false);
        alert("Wallet address and login miss match");
        setLoadingTrans(false);

        return;
      }
      if (packid == "0" || packid == "") {
        alert("Please Enter correct package amount!!!");
        setLoadingTrans(false);
        return;
      }

      let value = amount / rate;
      const web3 = window.web3;

      let tokenAmount = web3.utils.toWei(value.toString());
      let contract = new web3.eth.Contract(abi, contractAddress);
      let tokencontract = new web3.eth.Contract(abiToken, contractAddressToken);
      await tokencontract.methods
        .approve(contractAddress, tokenAmount.toString())
        .send({ from: account });

      contract.methods
        .sell(tokenAmount.toString())
        .send({
          from: account,
        })
        .on("transactionHash", async (hash) => {
          console.log("upgradetransactionHash", hash);
          if (hash != "") {
            try {
              const res = await API.post(`/updation`, {
                uid: uid,
                transaction: hash,
                amount: amount,
                addreslist: account,
                useraddress: account,
                amountlist: value,
                tokenamount: amount / rate,
              });
              console.log(res);
              if (res?.data?.success) {
                toast.success("Successfully update subscription ! ");
                setLoadingTrans(false);
              } else {
                toast.error("Something went wrong ! ");
                setLoadingTrans(false);
              }

              setTimeout(() => {
                getLiveRate1();
              }, 250);
            } catch (e) {
              console.log("error", e);
              toast.error("Something went wrong ! ");
              setLoadingTrans(false);
            }
          }
        });
    } catch (error) {
      console.log("error", error);
      setLoadingTrans(false);
    }
  }
  return (
    <>
      {isLoading ? (
        <div className="">
          <div className="content-wrapper">
            <div
              className="w-100  d-flex justify-center"
              style={{ justifyContent: "center" }}
            >
              <div className="section-heading d-flex justify-center">
                <div className="loaders"></div>
              </div>
            </div>
          </div>
        </div>
      ) : betaWallet?.activatupgradeamnt_trading > 0 ? (
        <div className="content-wrapper">
          <div className="container body-content">
            <div className="row">
              <ToastContainer />

              <div className="col-md-3"></div>
              {betaWallet?.IsUpgradeStatus == 1 ? (
                <div className="col-md-6">
                  <div className="modal-dialog" role="document">
                    <h2>Your ID doesnt upgrade before 85% of earnings !!</h2>
                  </div>
                </div>
              ) : (
                <div className="col-md-6">
                  <div className="modal-dialog" role="document">
                    <div className="modal-content">
                      <div className="ule_logo">
                        <img src="assets/images/logo.png" />
                      </div>
                      <div className="row">
                        <div className="col-12">
                          <h3 className="text-center">Upgrade</h3>
                        </div>
                      </div>
                      <div
                        className="modal-header"
                        style={{
                          paddingBottom: "10px !important",
                          margin: "10px",
                        }}
                      >
                        <br></br>
                        <div className="avlbal row" style={{ padding: "20px" }}>
                          <h5
                            className="modal-title col-12 pb-4"
                            id="exampleModal3Label2"
                          >
                            Available ULE Token Balance
                            <span
                              id="tokenbalance"
                              style={{
                                paddingTop: "7px",
                                paddingBottom: "7px",
                              }}
                            >
                              {blnce} Token
                            </span>
                          </h5>
                          <h5
                            className="modal-title col-12 pb-4"
                            id="exampleModal3Label2"
                          >
                            Previous Package amount
                            <span
                              id="tokenbalance"
                              style={{
                                paddingTop: "7px",
                                paddingBottom: "7px",
                              }}
                            >
                              {betaWallet?.activatupgradeamnt_trading}
                            </span>
                          </h5>
                          <br />

                          <h5 className="modal-title">
                            Live Rate
                            <input
                              type="text"
                              className="input_width"
                              id="txtchangevalue"
                              style={{ color: "black" }}
                              placeholder={`1 ULE /  ${rate} USD`}
                              readonly=""
                            />
                          </h5>
                        </div>
                      </div>
                      <div className="modal-body">
                        <div className="popup_net">
                          <div className="set_meta">
                            <span className="metamaskConnection"> </span>
                          </div>
                          <div className="addNum">
                            <div className="trxnumber">
                              <div className="row">
                                <div className="col-12 col-md-12 -col-xl-8 p-3">
                                  <div className="row">
                                    <input
                                      type="number"
                                      value={amount}
                                      style={{ width: "100%" }}
                                      onChange={(e) =>
                                        setAmount(e.target.value)
                                      }
                                      className="form5"
                                      min="100"
                                      placeholder="Enter Package Amount in USD"
                                    />
                                  </div>
                                  <div className="row mt-3">
                                    <input
                                      type="number"
                                      value={amount / rate}
                                      disabled
                                      style={{ width: "100%" }}
                                      className="form5"
                                      min="100"
                                      placeholder="Enter Package Amount in USD"
                                    />
                                  </div>
                                </div>
                                <div
                                  className="col-12 col-md-6 col-xl-4 p-3"
                                  style={{
                                    display: "flex",
                                    alignItems: "flex-end",
                                  }}
                                >
                                  {apiDate && (
                                    <>
                                      {isLoadingTrans ? (
                                        <button
                                          className="btn btn-success"
                                          style={{ marginTop: "10px" }}
                                          id="btnother"
                                        >
                                          <div
                                            className="loaders"
                                            style={{
                                              height: "30px",
                                              width: "30px",
                                            }}
                                          ></div>
                                          Transaction is in progress
                                        </button>
                                      ) : (
                                        <button
                                          style={{ minHeight: "32px" }}
                                          onClick={handleUpdation}
                                        >
                                          <img
                                            src="assets/images/activateBlack.png"
                                            className="whImg"
                                          />
                                          <img
                                            src="assets/images/activateYello.png"
                                            className="yellowImg"
                                          />
                                          Upgrade
                                        </button>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="yeep_note">
                              <h2>Note:</h2>
                              <ul>
                                <li>
                                  Please ensure to connect Metamask wallet.
                                </li>
                                <li>
                                  Please get ref check of input value before
                                  select the pacakage amount.
                                </li>
                                <li>
                                  Min pacakage amount is 100 USD &amp; maximum
                                  is 10,000 USD.
                                </li>
                                <li>
                                  Refrence rate of ule token taken from
                                  www.wyzthswap.org
                                </li>
                              </ul>
                            </div>

                            <div className="yeep_footer">
                              <p>© 2022 | yeepule.network</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="content-wrapper">
          <div className="container body-content">
            <div className="row">
              <ToastContainer />

              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="ule_logo">
                      <img src="assets/images/logo.png" />
                    </div>
                    <div className="row">
                      <div className="col-12">
                        <h3 className="text-center">Activation</h3>
                      </div>
                    </div>
                    <div
                      className="modal-header"
                      style={{
                        paddingBottom: "10px !important",
                        margin: "10px",
                      }}
                    >
                      <br></br>
                      <div className="avlbal row" style={{ padding: "20px" }}>
                        <h5
                          className="modal-title col-12 pb-4"
                          id="exampleModal3Label2"
                        >
                          Available ULE Token Balance
                          <span
                            id="tokenbalance"
                            style={{ paddingTop: "7px", paddingBottom: "7px" }}
                          >
                            {blnce} Token
                          </span>
                        </h5>
                        <br />

                        <h5 className="modal-title">
                          Live Rate
                          <input
                            type="text"
                            className="input_width"
                            id="txtchangevalue"
                            style={{ color: "black" }}
                            placeholder={`1 ULE /  ${rate} USD`}
                            readonly=""
                          />
                        </h5>
                      </div>
                    </div>
                    <div className="modal-body">
                      <div className="popup_net">
                        <div className="set_meta">
                          <span className="metamaskConnection"> </span>
                        </div>
                        <div className="addNum">
                          <div className="trxnumber">
                            <div className="row">
                              <div className="col-12 col-md-12 -col-xl-8 p-3">
                                <div className="row">
                                  <input
                                    type="number"
                                    value={amount}
                                    style={{ width: "100%" }}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="form5"
                                    min="100"
                                    placeholder="Enter Package Amount in USD"
                                  />
                                </div>
                                <div className="row mt-3">
                                  <input
                                    type="number"
                                    value={amount / rate}
                                    disabled
                                    style={{ width: "100%" }}
                                    className="form5"
                                    min="100"
                                    placeholder="Enter Package Amount in USD"
                                  />
                                </div>
                              </div>
                              <div
                                className="col-12 col-md-6 col-xl-4 p-3"
                                style={{
                                  display: "flex",
                                  alignItems: "flex-end",
                                }}
                              >
                                {apiDate && (
                                  <>
                                    {isLoadingTrans ? (
                                      <button
                                        className="btn btn-success"
                                        style={{ marginTop: "10px" }}
                                        id="btnother"
                                      >
                                        <div
                                          className="loaders"
                                          style={{
                                            height: "30px",
                                            width: "30px",
                                          }}
                                        ></div>
                                        Transaction is in progress
                                      </button>
                                    ) : (
                                      <button
                                        style={{ minHeight: "32px" }}
                                        onClick={handleActivation}
                                      >
                                        <img
                                          src="assets/images/activateBlack.png"
                                          className="whImg"
                                        />
                                        <img
                                          src="assets/images/activateYello.png"
                                          className="yellowImg"
                                        />
                                        Activate
                                      </button>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="yeep_note">
                            <h2>Note:</h2>
                            <ul>
                              <li>Please ensure to connect Metamask wallet.</li>
                              <li>
                                Please get ref check of input value before
                                select the pacakage amount.
                              </li>
                              <li>
                                Min pacakage amount is 100 USD &amp; maximum is
                                10,000 USD.
                              </li>
                              <li>
                                Refrence rate of ule token taken from
                                www.wyzthswap.org
                              </li>
                            </ul>
                          </div>

                          <div className="yeep_footer">
                            <p>© 2022 | yeepule.network</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <link rel="stylesheet" type="text/css" href="assets/css/trading.css" />

      <br />
      <br />
      <div className="footer-section">
        Copyright © 2022 Yeepule. All Rights Reserved.
      </div>
    </>
  );
};
