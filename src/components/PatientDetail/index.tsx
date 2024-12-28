import React, { useEffect, useState } from 'react'
import { usePatientStore } from '../../services/patient';
import { Patient } from '../../types/patient';

interface PatientDetailProps {
  _id: string
}

const PatientDetail: React.FC<PatientDetailProps> = ({ _id }) => {
  const [data, setData] = useState<Patient | null >(null);
  const { detail } = usePatientStore();

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

export default PatientDetail
