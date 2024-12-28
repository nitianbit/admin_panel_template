import React, { useEffect, useState } from 'react'
import { useDoctorStore } from '../../services/doctors';
import { Doctor } from '../../types/doctors';

interface DoctorDetailProps {
  _id: string
}

const DoctorDetail: React.FC<DoctorDetailProps> = ({ _id }) => {
  const [data, setData] = useState<null | Doctor>(null);
  const { detail } = useDoctorStore();

  const fetchDetail = async () => {
    try {
      const data = await detail(_id);
      console.log(data);
      setData(data?.data)
    } catch (error) {

    }
  }


  useEffect(() => {
    if (_id) {
      fetchDetail()
    }
  }, [_id])

  return (
    <div>{data?.name??""}</div>
  )
}

export default DoctorDetail
