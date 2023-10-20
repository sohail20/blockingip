import { useEffect, useState } from 'react';
import Message from '../components/Message';

const Demo = () => {
  const [isBlocked, setIsBlocked] = useState(null);

  useEffect(() => {
    const checkBlockedStatus = async () => {
      try {
        const response = await fetch('/api/isBlocked');
        if (response.ok) {
          const data = await response.json();
          setIsBlocked(data.blocked);
        } else {
          setIsBlocked(true);
        }
      } catch (error) {
        setIsBlocked(true);
      }
    };

    checkBlockedStatus();
  }, []);

  return (
    <div>
      {isBlocked === true ? (
        <Message message="Your IP is blocked" isError={true} />
      ) : isBlocked === false ? (
        <Message message="Your IP is not blocked" isError={false} />
      ) : (
        <Message message="Checking IP status..." isError={false} />
      )}
    </div>
  );
};

export default Demo;
