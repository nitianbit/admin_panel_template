import { Service } from '../../types/services';
import { useServicestore } from '../../services/services';
import { useEffect, useState } from 'react';

interface ServiceDetailProps {
  ids: string[]
}

const ServiceDetail: React.FC<ServiceDetailProps> = ({ ids }) => {
  const [data, setData] = useState<Service[]>([]);
  const { detail } = useServicestore();

  const fetchDetails = async () => {
    try {
      const promises = ids.map(id => detail(id));
      const results = await Promise.all(promises);
      const services = results.map(result => result.data);
      setData(services);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (ids.length > 0) {
      fetchDetails();
    }
  }, [ids]);

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