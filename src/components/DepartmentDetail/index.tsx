
import React, { useEffect, useState } from 'react'
import { useDepartmentStore } from '../../services/departments';
import { Department } from '../../types/departments';

interface DepartmentDetailProps {
    _id: string
}

const DepartmentDetail: React.FC<DepartmentDetailProps> = ({ _id }) => {
    const [data, setData] = useState<Department[]>([]);
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
            const departments = allData.filter((item: any) => _id.includes(item._id));
            setData(departments ? departments : []);
        } catch (error) {

        }
    }


    useEffect(() => {
        if (_id) {
            fetchDetail()
        }
    }, [_id])

    return (
        <div>
            {data.length > 0 ? (
                data.map((service: Department) => <div key={service._id}>{service.name}</div>)
            ) : (
                "No Services Selected"
            )}
        </div>
    )
}

export default DepartmentDetail
