import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Message from '../components/Message';

const router = useRouter();

export default function Home() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (user === null && user === "") {
      const min = 100;
      const max = 999;
      const random3DigitNumber = Math.floor(Math.random() * (max - min + 1)) + min;
      localStorage.setItem("user", "user" + random3DigitNumber)
    }
  }, [])

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

  const handleLogin = async () => {
    const user = localStorage.getItem("user")
    if (user !== null && user !== "") {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userID: user, password }),
      })

      const data = await response.json();

      setMessage(data.message)
      if (data.status) {
        router.push('/demo');
        setIsError(false);
      }
      else setIsError(true);
    } else {
      alert("user not found")
    }

  }

  return (
    <div>
      {/* <IpBlockForm onBlockIp={handleBlockIp} onUnblockIp={handleUnblockIp} />
      */}
      <div>
        <h1>Login Page</h1>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
      </div>
      <Message message={message} isError={isError} />
    </div>
  );
}
