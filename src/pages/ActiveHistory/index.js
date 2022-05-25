

import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import {
    getActiveHistoryReport
} from "../../store/actions/dailyYield"
import moment from 'moment';
import MaterialTable from 'material-table';

export const ActiveHistory = () => {
    const activeHistoryReport = useSelector(state => state?.dailyYield?.activeHistoryReport)
    const dispatch = useDispatch();
    const user = localStorage.getItem('user')
    const [dataState, setDateState] = useState([])

    const getAllData = () => {
        if (user) {
            let ress = JSON.parse(user);
            let uId = ress?.user_id;
            dispatch(getActiveHistoryReport(uId));
        }

    }
    useEffect(() => {
        getAllData()
    }, [])

    useEffect(() => {
        let arr = [];
        activeHistoryReport.forEach((item, index) => {
            arr.push(
                {
                    sNo: index + 1,
                    from_id: item?.Amount,
                    remark: item?.remark,
                    txn: item?.txn,
                    date: moment(item?.date).format('M/D/YYYY h:m:s A')
                }

            )
        })
        setDateState([...arr])
    }, [activeHistoryReport])
    console.log("state", activeHistoryReport)
    return (
        <>
            <div class="content-wrapper">
                <div class="grid grid-1">
                    <div class="section-heading">
                        <h2>Activate / Upgrade History</h2>
                    </div>
                    <MaterialTable
                        columns={[
                            { title: '#', field: 'sNo' },
                            { title: 'Package Amount', field: 'from_id' },
                            { title: 'Remark', field: 'remark' },
                            { title: 'Txn', field: 'txn' ,
                        
                           
                                render: rowData =><a style={{color:"#fbc50b",textDecoration:'none'}} target="_blank" href={`https://wyzthscan.org/transaction-detail/${rowData?.txn}`}> <span tyle={{width: 50, borderRadius: '50%'}}>View txn</span></a>
                              
                        },
                            { title: 'Date', field: 'date' }
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

