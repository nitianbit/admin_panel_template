import React, { useEffect, useState } from 'react'
import { useDoctorStore } from '../../services/doctors';
import { Doctor } from '../../types/doctors';
import { Laboratory } from '../../types/laboratory';
import { useLaboratoryStore } from '../../services/laboratory';

interface LabDetailProps {
  _id: string
}

const LabDetail: React.FC<LabDetailProps> = ({ _id }) => {
  const [data, setData] = useState<null | Laboratory>(null);
  const { detail } = useLaboratoryStore();

  const fetchDetail = async () => {
    try {
      const data = await detail(_id);
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
    <div>{data?.name??"No Laboratory Selected"}</div>
  )
}

export default LabDetail
