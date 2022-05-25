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

export const Wallets = () => {
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

  useEffect(() => {
    getUserInfo();
  }, []);

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
      ) : (
        <>
          <ToastContainer />

          <div className="">
            <div className="content-wrapper">
              <div className="grid grid-1">
                <div className="">
                  <div className="section-heading">
                    <h2> Withdrawal Address</h2>
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
                            value={
                              userInfo?.EthAddress ? userInfo?.EthAddress : 0
                            }
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
                            value={
                              userInfo?.TronAddress ? userInfo?.TronAddress : 0
                            }
                            disabled={true}
                            className="form-control mb-20"
                            placeholder="Enter TRON Address"
                          />
                        </div>
                      </div>
                      <div className="row pt-4"></div>
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
      )}
    </>
  );
};
