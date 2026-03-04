import React, { useEffect, useState } from 'react'
 import { Doctor } from '../../types/doctors';
import { useCompanyStore } from '../../services/company';

interface CompanyDetailProps {
  _id: string
}

const CompanyDetail: React.FC<CompanyDetailProps> = ({ _id }) => {
  const [data, setData] = useState<null | Doctor>(null);
  const { detail } = useCompanyStore();

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
    <div>{data?.name??"--"}</div>
  )
}

export default CompanyDetail
