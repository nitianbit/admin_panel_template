
import React, { useEffect, useState } from 'react'
import { Doctor } from '../../types/doctors';
import { useCompanyStore } from '../../services/company';
import { useDepartmentStore } from '../../services/departments';
import { Department } from '../../types/departments';

interface DepartmentDetailProps {
    _id: string
}

const DepartmentDetail: React.FC<DepartmentDetailProps> = ({ _id }) => {
    const [data, setData] = useState<null | Department>(null);
    const { detail, allData, fetchGridAll } = useDepartmentStore();

    useEffect(() => {
        fetchGridAll({})
    }, [])

    useEffect(() => {
        if (_id && allData.length > 0) {
            fetchDetail();
        }
    }, [_id, allData])

    const fetchDetail = async () => {
        try {
            setData(allData.find((item: any) => item._id === _id) ?? null);
        } catch (error) {

        }
    }


    useEffect(() => {
        if (_id) {
            fetchDetail()
        }
    }, [_id])

    return (
        <div>{data?.name ?? "--"}</div>
    )
}

export default DepartmentDetail
