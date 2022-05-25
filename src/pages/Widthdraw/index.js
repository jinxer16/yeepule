import { useDispatch, useSelector } from "react-redux";
import React, { useState, useEffect, useRef } from "react";
import { getDownlineReport } from "../../store/actions/dailyYield";
import { getWalletAddress } from "../../store/actions/dashboard";
import { API } from "../../store/actions/API";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import axios from "axios";
import TronWeb from "tronweb";

// ye wala he
let privateKey =
  "cd8c28fa9cad44c18e95a184e1809a6ec85a4f88772477f632e46b3f1a8ca502";
const fullNode = "https://api.trongrid.io";
const solidityNode = "https://api.trongrid.io";
const eventServer = "https://api.trongrid.io";
// Enter Private key of your account

const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);

export const Widthdraw = () => {
  const downlineReport = useSelector(
    (state) => state?.dailyYield?.downlineReport
  );
  const dashboard = useSelector((state) => state?.dashboard);

  const dispatch = useDispatch();
  const user = localStorage.getItem("user");
  const [depositeAmount, setDepositeAmount] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [tronAdd, setTronAdd] = useState("");
  const [isLoading, setLoading] = useState(true);
  const [isLoadingTrans, setLoadingTrans] = useState(false);

  window.troni = {};

  let CONTRACT_ADDRESS = "TJky76sBRMvV8ybkL7mb1XionbM8PdGtcw";

  var nonce = 2; // some random number

  const [rate, setRate] = useState(0);
  const getLiveRate = async () => {
    try {
      const res = await API.get(`/live_rate`);
      setRate(res?.data.data[0].usdperunit);
    } catch (e) {
      console.log("error", e);
    }
  };
  const getUserInfo = async () => {
    try {
      let ress = JSON.parse(user);
      let uId = ress?.user_id;
      const res = await API.get(`/get_user_info?id=${uId}`);
      if (res?.data?.data?.length > 0) {
        setUserInfo(res?.data?.data[0]);
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log("error", e);
    }
  };

  const getAllData = () => {
    if (user) {
      let ress = JSON.parse(user);
      let uId = ress?.user_id;
      dispatch(getDownlineReport(uId));
      dispatch(getWalletAddress(uId));
    }
  };

  let mainAccount = "";

  var nonce = 2; // some random number
  const [accountAddress, setAccountAddress] = useState("");
  const [trxtBalance, setTrxBalance] = useState("0");
  console.log(trxtBalance);
  let windows;
  const handleWindow = async () => {
    if (window.tronWeb && window.tronWeb.ready) {
      windows = await window.tronWeb;
    }
  };
  useEffect(() => {
    setInterval(() => {
      handleWindow();
    }, 100);
  });
  async function Ethereum() {
    const windows = await window.tronWeb.utils.ethersUtils;
    console.log("winsdowa", windows);
    try {
      //TDVGM9a2BtqfHoG6XyGMR5mtrMAXijmmgk console.log("initial");
      mainAccount = await window?.tronWeb?.defaultAddress?.base58;
      console.log("main Account", mainAccount);

      if (mainAccount) {
        setAccountAddress(mainAccount);
        localStorage.setItem("mainAccount", mainAccount);
        console.log("mainAccount", mainAccount);
        setTimeout(() => {
          getBalanceOfAccount();
        }, 100);
      } else {
        const HttpProvider = TronWeb.providers.HttpProvider;
        const fullNode = new HttpProvider("https://api.trongrid.io");
        const solidityNode = new HttpProvider("https://api.trongrid.io");
        const eventServer = "https://api.trongrid.io/";
        const gettronWeb = new TronWeb(fullNode, solidityNode, eventServer);
        setTimeout(() => {
          // getData();
        }, 100);

        // toast.warning("Please login or install tron wallet!");
      }
    } catch (error) {
      toast.error(error.message);

      console.log("error", error.message);
    }
  }
  const getBlnce = async () => {
    try {
      let ress = JSON.parse(user);
      let uId = ress?.user_id;
      const res = await API.get(`/net_usd?id=${uId}`);
      setTrxBalance(
        res?.data?.data[0]?.netbal ? res?.data?.data[0]?.netbal : 0
      );
    } catch (e) {
      console.log("error", e);
    }
  };
  const getBalanceOfAccount = async () => {
    try {
      await window.tronWeb.trx.getBalance(mainAccount, function (err, res) {
        var blnc = parseInt(res) / 1000000;
        // setTrxBalance(blnc.toFixed(3));
      });
    } catch (e) {
      console.log("blnc", e);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      Ethereum();
    }, 2000);
    getUserInfo();
    getLiveRate();
    getBlnce();
  }, []);
  const getMaxWithdraw = async () => {
    try {
      let ress = JSON.parse(user);
      let uId = ress?.user_id;
      const res = await API.get(`/verify_max_withdraw?id=${uId}`);
      return res?.data?.data ? res?.data?.data : 0;
    } catch (e) {
      return 0;
    }
  };

  const addTronWalletAddress = async () => {
    if (tronAdd.length > 5) {
      try {
        let ress = JSON.parse(user);
        let uId = ress?.user_id;
        const res = await API.post(`/save_withdraw_address`, {
          user_id: uId,
          tron_address: tronAdd,
          eth_address: userInfo?.EthAddress ? userInfo?.EthAddress : "",
        });
        getUserInfo();
        toast.success("Wallet is Added Successfully !");
      } catch (e) {
        console.log("error", e);

        toast.error("Something went Wrong !");
      }
    } else {
      toast.error("Enter Valid Tron address!");
    }
  };
  const getLastTransaction = async () => {
    try {
      let ress = JSON.parse(user);
      let uId = ress?.user_id;
      const res = await API.get(`/verify_last_transaction?id=${uId}`);
      return res?.data?.data ? res?.data?.data : [];
    } catch (e) {
      return [];
    }
  };

  const DrawTicket = async () => {
    setLoadingTrans(true);
    let maxWithdraw = await getMaxWithdraw();
    let lastTransaction = await getLastTransaction();
    console.log("enter withdraw", depositeAmount);
    console.log(" trxtBalance", trxtBalance);
    if (depositeAmount > trxtBalance) {
      alert("Insufficiant Wallet Balance !");
      setLoadingTrans(false);
      return;
    }
    if (depositeAmount < 10) {
      alert("Withdraw Request can be made on Minimum 10 USD !");
      setLoadingTrans(false);
      return;
    }
    if (depositeAmount > 500) {
      alert("Withdraw Request can be made on Maximum 500 USD !");
      setLoadingTrans(false);

      return;
    }
    if (accountAddress === "") {
      alert("TronLink is not connected !");
      setLoadingTrans(false);

      return;
    }

    if (
      accountAddress === "" ||
      !userInfo?.TronAddress ||
      accountAddress !== userInfo?.TronAddress
    ) {
      alert("Wrong Tron address is Selected !");
      setLoadingTrans(false);

      return;
    }

    if (
      accountAddress === "" ||
      !userInfo?.TronAddress ||
      accountAddress !== userInfo?.TronAddress
    ) {
      alert("Wrong TronLink Account is connected !");
      setLoadingTrans(false);

      return;
    }
    if (lastTransaction.length > 0) {
      alert("Your next exchange will be after 60 minutes..");
      setLoadingTrans(false);

      return;
    }
    if (parseInt(depositeAmount) + parseInt(maxWithdraw) > 500) {
      alert("Withdrawal request will be made on Maximum 500 USD in one Day !");
      setLoadingTrans(false);

      return;
    }

    // verify_last_transaction
    // verify_max_withdraw
    if (accountAddress && accountAddress !== "") {
      console.log(tronWeb, "tronWeb");
      const ethers = tronWeb.utils.ethersUtils;
      // const ethers = window.tronWeb.utils.ethersUtils;
      // let tronGrid = new TronGrid(window?.tronWeb);
      console.log("enter if", privateKey);
      console.log("ethers", ethers);
      let signingKey;

      signingKey = new ethers.SigningKey("0x" + privateKey);

      // console.log("2nd if signingKey", signingKey);

      nonce = parseInt(nonce + Math.random() * 10);

      let extra = Math.random() * 100 + 1; // Additional randomness
      nonce = nonce + extra;
      let message = (nonce + depositeAmount + new Date()).toString(); // Random unique message
      let messageBytes = ethers.toUtf8Bytes(message);

      let messageDigest = ethers.keccak256(messageBytes);
      let signature = signingKey.signDigest(messageDigest);
      // let addresscontract="TW6zd5dJfKaw3GKGLB2Kb8ss3PnWDnfx4r"
      // let winnerLength = await window.troni.signatureAddress().call();
      let value1 = ((depositeAmount / rate) * 0.95 * 10 ** 18).toString();
      let actualValue = await windows.toBigNumber(value1);
      console.log("before contract windows", windows);
      console.log("before contract actualValue", actualValue);

      let contract;
      try {
        contract = await windows.contract().at(CONTRACT_ADDRESS);
        console.log("contract", contract);
      } catch (e) {
        alert(e);
      }
      contract
        .userTokenWithdraw(
          actualValue.toString(10),
          parseInt(nonce),
          [messageDigest, signature.r, signature.s],
          signature.v
        )
        .send()
        .then(async (output) => {
          let ress = JSON.parse(user);
          let uId = ress?.user_id;
          try {
            const res = await API.post(`/save_withdraw`, {
              uid: uId,
              txn: output.toString(),
              amount: depositeAmount,
              useraddress: accountAddress,
              tokenamount: rate
                ? (depositeAmount / rate) * 0.95
                : depositeAmount,
            });
            setLoadingTrans(false);

            toast.success("Transaction is complete");
          } catch (e) {
            console.log("error", e);
            setLoadingTrans(false);

            toast.error("Something went Wrong !");
          }
        })
        .catch((e) => {
          toast.error(e.message);
          setLoadingTrans(false);
        });
      // console.log(getDate, numberOfTokens);
    } else {
      setLoadingTrans(false);

      toast.error("TronLink is not connected");
    }
  };
  //console.log("userInfo", userInfo);
  return (
    <>
      {isLoading ? (
        <div className="spinner-grow text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      ) : (
        <>
          <ToastContainer />
          {!userInfo?.TronAddress ? (
            <div className="" ng-controller="myProfileAngularCtrl">
              <div className="content-wrapper">
                <div className="grid grid-1">
                  <div className="">
                    <div className="section-heading">
                      <h2>Enter Withdrawal Address</h2>
                    </div>
                    <div className="box box-default">
                      <div className="panel-body">
                        <br />
                        <div className="row">
                          <div className="col-md-2">
                            <label>Metamask Address</label>
                          </div>
                          <div className="col-md-5">
                            <input
                              type="text"
                              id="EthAddress"
                              name="EthAddress"
                              className="form-control mb-20"
                              value={userInfo?.EthAddress}
                              disabled={true}
                              placeholder="Enter ETH Address"
                            />
                          </div>
                        </div>
                        <br />
                        <div className="row">
                          <div className="col-md-2">
                            <label>TRON Address</label>
                          </div>
                          <div className="col-md-5">
                            <input
                              type="text"
                              id="TronAddress"
                              name="TronAddress"
                              value={tronAdd}
                              onChange={(e) => setTronAdd(e.target.value)}
                              className="form-control mb-20"
                              placeholder="Enter TRON Address"
                            />
                          </div>
                        </div>
                        <div className="row pt-4">
                          <div className="col-md-3 col-md-offset-2">
                            <div className="submit_bnt">
                              <button
                                onClick={addTronWalletAddress}
                                id="btnsub2"
                                className="btn"
                              >
                                Submit
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="content-wrapper">
              <div className="grid grid-1">
                <div className="">
                  <div className="section-heading">
                    <h2>Withdrawal</h2>
                  </div>

                  <div className="box box-default table-wrapper ">
                    <div className="panel-body">
                      {/* <span className="metamaskConnection" style={{color:"red"}}>Metamask is not connected..!..Wait...</span> */}
                      <br />
                      <br />
                      <br />
                      <div className="row">
                        <div className="col-md-2">
                          <label>Metamask Address</label>
                        </div>
                        <div className="col-md-3">
                          <input
                            type="text"
                            id="EthAddress"
                            name="EthAddress"
                            className="form-control mb-20"
                            value={userInfo?.EthAddress}
                            disabled={true}
                            placeholder="Enter ETH Address"
                          />
                        </div>
                      </div>
                      <div className="row mt-3 mb-3">
                        <div className="col-md-2">
                          <label>TRON Address</label>
                        </div>
                        <div className="col-md-3">
                          <input
                            type="text"
                            id="TronAddress"
                            name="TronAddress"
                            value={userInfo?.TronAddress}
                            disabled={true}
                            className="form-control mb-20"
                            placeholder="Enter TRON Address"
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-2">
                          <label>Wallet Net USD Value</label>
                        </div>
                        <div className="col-md-3">
                          <label className="form-control d-flex align-items-center">
                            {trxtBalance}
                          </label>
                        </div>
                      </div>

                      <br />

                      <div className="row">
                        <div className="col-md-2">
                          <label>Enter USD Amount </label>
                        </div>
                        <div className="col-md-3">
                          <input
                            type="text"
                            className="form-control mb-20 ng-pristine ng-untouched ng-valid ng-empty ng-valid-maxlength"
                            id="amount"
                            placeholder="Enter USD Amount"
                            value={depositeAmount}
                            onChange={(e) => setDepositeAmount(e.target.value)}
                            maxLength={10}
                          />
                        </div>
                      </div>

                      <div className="row mrset mt-5" id="withdrwaltokendiv">
                        <div className="col-md-2">
                          <label>Withdrawal Token </label>
                        </div>
                        <div className="col-md-3">
                          <input
                            type="text"
                            className="form-control ng-pristine ng-untouched ng-valid ng-empty"
                            value={rate ? (depositeAmount / rate) * 0.95 : 0}
                            placeholder="Withdrwal Token "
                            disabled={true}
                          />
                        </div>
                      </div>

                      <input
                        type="hidden"
                        id="address"
                        className="form-control ng-pristine ng-untouched ng-valid ng-empty"
                        value=""
                        autoComplete="off"
                      />
                      <input
                        type="hidden"
                        id="userid"
                        className="form-control ng-pristine ng-untouched ng-valid ng-empty"
                        value=""
                        autoComplete="off"
                      />
                      <input
                        type="hidden"
                        id="withdrawalvalidate"
                        className="form-control ng-pristine ng-untouched ng-valid ng-empty"
                        value=""
                        autoComplete="off"
                      />

                      <div className="row">
                        <div className="col-md-3 col-md-offset-2">
                          {isLoadingTrans ? (
                            <button
                              className="btn btn-success"
                              style={{ marginTop: "10px" }}
                              id="btnother"
                            >
                              <div
                                className="loaders"
                                style={{ height: "30px", width: "30px" }}
                              ></div>
                              Transaction is in progress
                            </button>
                          ) : (
                            <button
                              className="btn btn-success"
                              style={{ marginTop: "10px" }}
                              id="btnother"
                              onClick={() => DrawTicket()}
                            >
                              Withdrawal
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="clearfix">
            <br />
          </div>

          <br />
          <br />
          <div className="footer-section">
            Copyright © 2022 Yeepule. All Rights Reserved.
          </div>
        </>
      )}
    </>
  );
};
