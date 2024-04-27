import React, { Component } from 'react'
import "../../css/Alert.css";
import { Modal } from "react-bootstrap"

export default class Alert extends Component {

    render() {
        return (
            <Modal className="modal-alert"
                show={true}
                onHide={() => this.props.hide()}
                animation={false}
                backdropClassName="modal-alert-backdrop"
            >
                <Modal.Header closeButton className={this.props.status}>
                    <div className="alert-icon"></div>
                    <div className="alert-msg">
                        {this.props.msg}
                    </div>
                </Modal.Header>
            </Modal>
        )
    }

}
