import React, {useState, useRef} from 'react';
import {Button, Input, Modal, Form, notification} from "antd";
import {updatePinCode} from "../../../actions/bookActions";
import PinInput from "react-pin-input";

const FormItem = Form.Item;
const ModalAddCodePin = ({toggle, modal, pin, bookingId, updateCodePin}) => {
    const [pinCode, setPin] = useState(pin);
    const pinRef = useRef();
    const [loading, setLoading] = useState(false);
    const openNotificationWithIcon = (type, description) => {
        notification.config({
            placement: 'topRight',
            bottom: 50,
            duration: 3,
            rtl: true,
        });

        notification[type]({
            message: "Pin Code",
            description,
        });
    };
    const onChange = value => {
        setPin(value)
    };

    // onClear = () => {
    //     this.setState({
    //         value: ""
    //     });
    //     this.pin.clear();
    // };
    const handleUpdatePin = () => {
        setLoading(true);
        updatePinCode(bookingId, pinCode).then(res => {
            openNotificationWithIcon('success', res.data.message);
            toggle();
            updateCodePin(pinCode);
            setLoading(false);
        })
    }
    return (
        <Modal
            wrapClassName={"wrap-modal-download"}
            footer={null}
            header={null}
            title=""
            closeIcon
            centered
            visible={modal}
            onCancel={toggle}
        >
            <div>
                <h2>Pin Code</h2>

                <FormItem hasFeedback className={"wrap-formitem-download"}>
                    <PinInput
                        length={4}
                        focus
                        // disabled
                        // secret
                        initialValue={pinCode}
                        ref={pinRef}
                        type="numeric"
                        onChange={onChange}
                    />
                    {/*<Input*/}
                    {/*    type="email"*/}
                    {/*    value={pinCode}*/}
                    {/*    onChange={(e) =>*/}
                    {/*        setPin(e.target.value)*/}
                    {/*    }*/}
                    {/*/>*/}
                </FormItem>
                <Button
                    className="btn-next"
                    type="primary"
                    htmlType="submit"
                    disabled={!pinCode || pinCode.length < 4}
                    onClick={handleUpdatePin}
                    loading={loading}
                >
                    {pinCode ? "Update" : "Add"}
                </Button>
            </div>
        </Modal>
    );
};

export default ModalAddCodePin;
