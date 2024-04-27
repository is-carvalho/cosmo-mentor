import React, { Component, useState } from 'react'
import "../../css/Alert.css";
import { Modal } from "react-bootstrap"

export default function Alert(props) {

    return (
        <div onClick={e => e.stopPropagation()}>
            <Modal className="modal-alert"
                show={true}
                onHide={props.hide}
                animation={false}
                backdropClassName="modal-alert-backdrop"
            >
                <Modal.Header closeButton className={props.status}>
                    <div className="alert-icon"></div>
                    <div className="alert-msg">
                        {props.msg}
                    </div>
                </Modal.Header>
            </Modal>
        </div>
    )

}
