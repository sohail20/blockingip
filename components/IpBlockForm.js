import { useState } from 'react';

const IpBlockForm = ({ onBlockIp, onUnblockIp }) => {
  const [ipAddress, setIpAddress] = useState('');

  const handleBlockIp = () => {
    onBlockIp(ipAddress);
    setIpAddress('');
  };

  const handleUnblockIp = () => {
    onUnblockIp(ipAddress);
    setIpAddress('');
  };

  return (
    <div>
      <h2>IP Blocker</h2>
      <input
        type="text"
        placeholder="Enter IP address"
        value={ipAddress}
        onChange={(e) => setIpAddress(e.target.value)}
      />
      <button onClick={handleBlockIp}>Block IP</button>
      <button onClick={handleUnblockIp}>Unblock IP</button>
    </div>
  );
};

export default IpBlockForm;
