

import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import {
    getMyReferralReport
} from "../../store/actions/dailyYield"
import moment from 'moment';
import MaterialTable from 'material-table';

export const ReferralReport = () => {
    const refReport = useSelector(state => state?.dailyYield?.refReport)
    const dispatch = useDispatch();
    const user = localStorage.getItem('user')
    const [dataState, setDateState] = useState([])

    const getAllData = () => {
        if (user) {
            let ress = JSON.parse(user);
            let uId = ress?.user_id;
            dispatch(getMyReferralReport(uId));
        }

    }
    useEffect(() => {
        getAllData()
    }, [])

    useEffect(() => {
        let arr = [];
        refReport.forEach((item, index) => {
            arr.push(
                {
                    sNo: index + 1,
                    from_id: item?.sid,
                    package: item?.packagename,
                    remark: item?.accountnumber,
                    date: moment(item?.edate).format('M/D/YYYY h:m:s A'),
                    date2: moment(item?.top_update).format('M/D/YYYY h:m:s A'),
                    date2:moment(item?.top_update).format('M/D/YYYY h:m:s A')!='Invalid date'?moment(item?.top_update).format('M/D/YYYY h:m:s A'):'Inactive'
                }

            )
        })
        setDateState([...arr])
    }, [refReport])
    console.log("state", refReport)
    return (
        <>
            <div class="content-wrapper">
                <div class="grid grid-1">
                    <div class="section-heading">
                        <h2>My Referral</h2>
                    </div>
                    <MaterialTable
                        columns={[
                            { title: 'S.No', field: 'sNo' },
                            { title: 'User ID', field: 'from_id' },
                            { title: 'Package', field: 'package' },
                            { title: 'Date', field: 'date' },
                            { title: 'Account', field: 'remark' },
                            { title: 'Activation Date Time', field: 'date2' }
                        ]}
                        data={[...dataState]}
                        title=""
                        toolbar={false}
                    />

                </div>
            </div>
            <div class="clearfix"><br /></div>

            <br /><br />
            <div class="footer-section">Copyright © 2022 Yeepule. All Rights Reserved.</div>
            <link rel="stylesheet" type="text/css" href="assets/css/2.d34346ea.chunk.css" />
            <link rel="stylesheet" type="text/css" href="assets/css/main.f70df022.chunk.css" />

        </>);
}

