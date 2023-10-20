const Message = ({ message, isError }) => {
    return (
      <div style={{ color: isError ? 'red' : 'green' }}>
        {message}
      </div>
    );
  };
  
  export default Message;
  