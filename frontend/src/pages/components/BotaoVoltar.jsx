import React from "react";
import { useHistory } from "react-router-dom";

function GoBackButton() {
  const history = useHistory();
  return (
    <div className="float-right">
      <button
        type="button"
        onClick={() => history.goBack()}
        className="btn btn-danger cosmo-color-1"
      >
        Voltar
      </button>
    </div>
  );
}

export default GoBackButton;
