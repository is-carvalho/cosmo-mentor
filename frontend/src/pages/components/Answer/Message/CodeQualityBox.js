import React from "react";

const CodeQualityBox = ({ message, type = "info" }) => {
  const styles = {
    backgroundColor: {
      info: "#33b5e5",
      success: "#4caf50",
      warning: "#ff9800",
      error: "#f44336",
    }[type],
    color: "#ffffff",
    padding: "10px",
    borderRadius: "3px",
  };
  const messages = message

  return (
    messages.length > 0 ? (
    <div style={styles}>
      <h5>Aviso de complexidade!</h5>
      <ul>
      { messages.map( (message) => <li>{ message.message }</li>) }
     </ul>
    </div>
    ):
    <div></div>
  );
};

export default CodeQualityBox;
