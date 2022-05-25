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

export const Widthdraw = () => {
  const downlineReport = useSelector(
    (state) => state?.dailyYield?.downlineReport
  );
  const dashboard = useSelector((state) => state?.dashboard);

  const dispatch = useDispatch();
  const user = localStorage.getItem("user");
  const [depositeAmount, setDepositeAmount] = useState(null);

  window.troni = {};
  let CONTRACT_ADDRESS = "TPc5bJdDn359X6AvhU36ZSd8CsJi5VBTf9";
  let privateKey =
    "eff29765d34cc1c58bd3dbfa8d72c6d389f4d2e44221ea5bde9e3b81fd44d533";
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
  async function Ethereum() {
    try {
      console.log("initial");
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
        const fullNode = new HttpProvider("https://api.shasta.trongrid.io");
        const solidityNode = new HttpProvider("https://api.shasta.trongrid.io");
        const eventServer = "https://api.shasta.trongrid.io/";
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
    let maxWithdraw = await getMaxWithdraw();
    let lastTransaction = await getLastTransaction();
    console.log(maxWithdraw, lastTransaction);

    if (depositeAmount < 10) {
      alert("Withdraw Request can be made on Minimum 10 USD !");
      return;
    }
    if (depositeAmount > 500) {
      alert("Withdraw Request can be made on Maximum 500 USD !");
      return;
    }
    if (lastTransaction.length > 0) {
      alert("Your next exchange will be after 60 minutes..");
      return;
    }
    if (depositeAmount + maxWithdraw > 500) {
      alert("Withdrawal request will be made on Maximum 500 USD in one Day !");
      return;
    }
    // verify_last_transaction
    // verify_max_withdraw
    if (accountAddress && accountAddress !== "") {
      const ethers = window.tronWeb.utils.ethersUtils;
      // let tronGrid = new TronGrid(window?.tronWeb);
      let signingKey = new ethers.SigningKey("0x" + privateKey);
      nonce = parseInt(nonce + Math.random() * 10);
      let extra = Math.random() * 100 + 1; // Additional randomness
      nonce = nonce + extra;
      let message = (nonce + depositeAmount + new Date()).toString(); // Random unique message
      let messageBytes = ethers.toUtf8Bytes(message);
      let messageDigest = ethers.keccak256(messageBytes);
      let signature = signingKey.signDigest(messageDigest);
      // let addresscontract="TW6zd5dJfKaw3GKGLB2Kb8ss3PnWDnfx4r"
      // let winnerLength = await window.troni.signatureAddress().call();

      let contract = await window?.tronWeb?.contract().at(CONTRACT_ADDRESS);
      contract
        .userTRXWithdraw(
          depositeAmount.toString(10),
          parseInt(nonce),
          [messageDigest, signature.r, signature.s],
          signature.v
        )
        .send()
        .then(async (output) => {
          console.log("- Output:", output, "\n");
          let ress = JSON.parse(user);
          let uId = ress?.user_id;
          try {
            const res = await API.post(`/save_withdraw`, {
              uid: uId,
              txn: output.toString(),
              amount: depositeAmount,
              useraddress: accountAddress,
              tokenamount: depositeAmount * 1000000,
            });
          } catch (e) {
            console.log("error", e);

            toast.error("Something went Wrong !");
          }
          toast.success("Transaction is complete");
        })
        .catch((e) => {
          toast.error(e.message);
        });
      // console.log(getDate, numberOfTokens);
    } else {
      toast.error("TronLink is not connected");
    }
  };

  return (
    <>
      <ToastContainer />

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
                      value={rate ? depositeAmount / rate : 0}
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
                    <button
                      className="btn btn-success"
                      style={{ marginTop: "10px" }}
                      id="btnother"
                      onClick={() => DrawTicket()}
                    >
                      {" "}
                      Withdrawal{" "}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="clearfix">
        <br />
      </div>

      <br />
      <br />
      <div className="footer-section">
        Copyright © 2022 Yeepule. All Rights Reserved.
      </div>
    </>
  );
};
