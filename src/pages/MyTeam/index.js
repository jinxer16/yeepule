

import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import {
    getTeamReport
} from "../../store/actions/dailyYield"
import moment from 'moment';
import MaterialTable from 'material-table';

export const MyTeam = () => {
    const downlineReport = useSelector(state => state?.dailyYield?.teamReport)
    const dispatch = useDispatch();
    const user = localStorage.getItem('user')
    const [dataState, setDateState] = useState([])

    const getAllData = () => {
        if (user) {
            let ress = JSON.parse(user);
            let uId = ress?.user_id;
            dispatch(getTeamReport(uId));
        }

    }
    useEffect(() => {
        getAllData()
    }, [])

    useEffect(() => {
        let arr = [];
        downlineReport.forEach((item, index) => {
            arr.push(
                {
                    sNo: index + 1,
                    from_id: item?.uid,
                    pkg_amount: item?.package,
                    date: moment(item?.top_update).format('M/D/YYYY h:m:s A'),
                    date:moment(item?.top_update).format('M/D/YYYY h:m:s A')!='Invalid date'?moment(item?.top_update).format('M/D/YYYY h:m:s A'):'Inactive'
                }

            )
        })
        setDateState([...arr])
    }, [downlineReport])
    
    return (
        <>
            <div class="content-wrapper">
                <div class="grid grid-1">
                    <div class="section-heading">
                        <h2>Level Details</h2>
                    </div>
                    <MaterialTable
                        columns={[
                            { title: 'S.No', field: 'sNo' },
                            { title: 'From ID', field: 'from_id' },
                            { title: 'Package Amount', field: 'pkg_amount' },
                            { title: 'Date', field: 'date' },
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

