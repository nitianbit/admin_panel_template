import { Service } from '../../types/services';
import { useServicestore } from '../../services/services';
import { useEffect, useState } from 'react';

interface ServiceDetailProps {
  _id: string[]
}

const ServiceDetail: React.FC<ServiceDetailProps> = ({ _id }) => {
  const [data, setData] = useState<Service[]>([]);


  const { detail, allData, fetchGridAll } = useServicestore();
  
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
            const services = allData.filter((item: any) => _id.includes(item._id));
              setData(services ? services : []);
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
        data.map((service: Service) => <div key={service._id}>{service.name}</div>)
      ) : (
        "No Services Selected"
      )}
    </div>
  )
}

export default ServiceDetail;