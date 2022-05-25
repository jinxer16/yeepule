

import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import {
    getWidthdrawlReport
} from "../../store/actions/dailyYield"
import moment from 'moment';
import MaterialTable from 'material-table';

export const WidthdrawlReport = () => {
    const widthdrawlReport = useSelector(state => state?.dailyYield?.widthdrawlReport)
    const dispatch = useDispatch();
    const user = localStorage.getItem('user')
    const [dataState, setDateState] = useState([])

    const getAllData = () => {
        if (user) {
            let ress = JSON.parse(user);
            let uId = ress?.user_id;
            dispatch(getWidthdrawlReport(uId));
        }

    }
    useEffect(() => {
        getAllData()
    }, [])

    useEffect(() => {
        let arr = [];
        console.log(widthdrawlReport);
        widthdrawlReport.forEach((item, index) => {
            arr.push(
                {
                    sNo: index + 1,
                    from_id: item?.request_amount,
                    amount: item?.adminchargerate,
                    tokenvalue: item?.tokenvalue,
                    date: moment(item?.date).format('M/D/YYYY h:m:s A'),
                    txn:item?.txn?item?.txn:'-'
                }

            )
        })
        setDateState([...arr])
    }, [widthdrawlReport])
    

    return (
        <>
            <div class="content-wrapper">
                <div class="grid grid-1">
                    <div class="section-heading">
                        <h2>Withdrawal History</h2>
                    </div>
                    <MaterialTable
                        columns={[
                            { title: 'S.No', field: 'sNo' },
                            { title: 'Requested USD', field: 'from_id' },
                            { title: 'Service Charge', field: 'amount' },
                            { title: 'ULE Value', field: 'tokanvalue' },
                            { title: 'Txn', field: 'txn' },
                            { title: 'Paid Date', field: 'date' }
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

