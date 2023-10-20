import { useState } from 'react';
import IpBlockForm from '../components/IpBlockForm';
import Message from '../components/Message';

export default function Home() {
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleBlockIp = async (ipAddress) => {
    try {
      // Send a POST request to your /api/blockIp route with the ipAddress
      const response = await fetch('/api/blockIp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ip_address: ipAddress }),
      });

      if (response.ok) {
        setMessage('IP blocked successfully');
        setIsError(false);
      } else {
        const data = await response.json();
        setMessage(data.error);
        setIsError(true);
      }
    } catch (error) {
      setMessage('An error occurred while blocking the IP.');
      setIsError(true);
    }
  };

  const handleUnblockIp = async (ipAddress) => {
    try {
      // Send a POST request to your /api/unblockIp route with the ipAddress
      const response = await fetch('/api/unblockIp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ip_address: ipAddress }),
      });

      if (response.ok) {
        setMessage('IP unblocked successfully');
        setIsError(false);
      } else {
        const data = await response.json();
        setMessage(data.error);
        setIsError(true);
      }
    } catch (error) {
      setMessage('An error occurred while unblocking the IP.');
      setIsError(true);
    }
  };

  return (
    <div>
      <IpBlockForm onBlockIp={handleBlockIp} onUnblockIp={handleUnblockIp} />
      <Message message={message} isError={isError} />
    </div>
  );
}
