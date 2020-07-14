const AdminMain = ({ users, name }) => {
  return (
    <div
      style={{
        width: "70%",
        margin: "2rem auto",
        display:
          name === "Omar Mohamed"
            ? "block"
            : name === "Mohamed Nasser"
            ? "block"
            : "none",
      }}
    >
      <h4>Online users:</h4>
      <ul style={{ color: "green" }}>
        <li>You</li>
        {users.map((user, i) => {
          return <li key={i}>{user}</li>;
        })}
      </ul>
    </div>
  );
};

export default AdminMain;
