import React, { Component } from "react";
import Navbar from "./Navbar";
import jwt_decode from "jwt-decode";
import Alert from "./Alert";
import Sidebar2 from "./Sidebar";
import "../../css/Header.css";
export default class Header extends Component {
  userId = this.getUserId();
  btnWrapperClicked = this.btnWrapperClicked.bind(this);

  state = {
    cursos: [],
    loading: true,
    classeWrapper: "wrapper active",
    alerts: [],
  };

  showAlert(msg, status) {
    let alerts = this.state.alerts;
    alerts.push(
      <Alert msg={msg} status={status} hide={this.closeAlert.bind(this)} />
    );
    this.setState({ alerts: alerts });
  }

  closeAlert() {
    let alerts = this.state.alerts;
    alerts.shift();
    this.setState({ alerts: alerts });
  }

  getUserId() {
    const token = localStorage.usertoken;
    const decoded = jwt_decode(token);
    return decoded.id;
  }

  btnWrapperClicked(e) {
    if (
      e.target.className === "hamburger" ||
      e.target.className === "hamburger__inner"
    ) {
      if (this.state.classeWrapper === "wrapper active") {
        this.setState({
          classeWrapper: "wrapper",
        });
      } else {
        this.setState({
          classeWrapper: "wrapper active",
        });
      }
    }
  }

  render() {
    return (
      <>
        <div className="box">
          <div
            className={this.state.classeWrapper}
            onClick={this.btnWrapperClicked}
          >
            <Navbar />
            <div className="main_container">
              <Sidebar2 />
            </div>
          </div>
          {this.state.alerts.length > 0 ? this.state.alerts[0] : null}
        </div>
      </>
    );
  }
}
