import React, {Component} from 'react'
import {Redirect, Link} from 'react-router-dom'
import { Steps, Icon,Button,message,Modal } from 'antd';
import {connect} from 'react-redux'
import style from './process_step.css'
import {setCurrentStep} from '../../actions/bookActions'
import {isMobile} from 'react-device-detect'
import {setStorage} from  '../../utils/helper'
const Step = Steps.Step;
const steps = [{
    link:'/book',
    title: 'Date & Location'
}, {
    link:'/book/photosesh-type',
    title: 'PhotoSesh Type'
}, {
    link:'/book/need-a-photosesh',
    title: 'Select Event'
}, {
    link:'/book/photographers',
    title: 'Select Photographer'
}, {
    link:'/book/booking-review',
    title: 'Review Booking'
}];

class StepBooking extends Component {
    constructor(props) {
        super(props);
    }


    checkPassStep(step){

        let booking_info = this.props.booking_info
        let result = false;
        switch (step){
            case 0:
                result = true;break;
            case 1:
                result = booking_info.place != '' && Object.keys(booking_info.position).length > 0;break;

            case 2:
                result =booking_info.photosesh_type_name != '';break;

            case 3:
                result =booking_info.photosesh_event_type != '';break;

            case 4:
                result =booking_info.photographers_request.length > 0;break;

        }

        if(!result){
            switch (step){
                case 0:
                    result = true;break;
                case 1:

                    message.error('Please choose date and location  before proceeding.')

                    break;

                case 2:
                    message.error('Please choose PhotoSesh or PhotoSesh LIGHT before proceeding.');break;

                case 3:
                    message.error('Please choose a PhotoSesh category before proceeding.');break;

                case 4:
                    message.error('Please choose a photographer before proceeding.');break;

            }
        }

        return result;

    }

    goTo(i) {
        if(this.checkPassStep(i)){
            this.props.setCurrentStep(i)
            this.props.history.replace(steps[i].link)
        }
    }
    next() {

        const { currentStep } = this.props;

        if(this.checkPassStep(currentStep+1)){
            this.props.history.replace(steps[currentStep + 1].link)
            this.props.setCurrentStep(currentStep + 1)
        }


    }

    prev() {
        const { currentStep } = this.props;
        if(this.checkPassStep(currentStep-1)){
            this.props.history.replace(steps[currentStep-1].link)
            this.props.setCurrentStep(currentStep - 1)
        }
    }

    componentDidMount(){

    }

    render() {


        const { currentStep } = this.props;


        let buttonStyle = {
            cursor:'pointer',
            display:'inline-block',
            padding:'5px 20px',
            borderRadius:4,
            background:'#ffffff',
            marginTop:10,
            color: '#1890ff',
            border: '1px solid #1890ff'
        }

        return (
            <div>
                <Steps current={currentStep}>
                    {steps.map((item,i) => {

                        return <Step  onClick={()=>this.goTo(i)} key={item.title} title={item.title} />
                    })}
                </Steps>
                <div className="steps-action ">
                    {currentStep > 0 && (
                        <span style={{float:'left',...buttonStyle }} onClick={() => this.prev()}>
                              <Icon type="double-left" />
                            Previous
                        </span>
                    )}

                    {currentStep < steps.length - 1 && (
                        <span style={{float:'right',...buttonStyle}} type="primary" onClick={() => this.next()}>
                            Next <Icon type="double-right" />
                        </span>
                    )}


                </div>
            </div>


        )
    }

}


class NavigateMobileClass extends Component {
    constructor(props) {

        super(props);
    }
    checkPassStepWithoutMessage(step) {

        let booking_info = this.props.booking_info
        let result = false;
        switch (step) {
            case 0:
                result = true;
                break;
            case 1:
                result = booking_info.place != '' && Object.keys(booking_info.position).length > 0;
                break;

            case 2:
                result = booking_info.photosesh_type_name != '';
                break;

            case 3:
                result = booking_info.photosesh_event_type != '';
                break;

            case 4:
                result = booking_info.photographers_request.length > 0;
                break;

        }
        return result;
    }

    checkPassStep(step){

        let booking_info = this.props.booking_info
        let result = false;
        switch (step){
            case 0:
                result = true;break;
            case 1:
                result = booking_info.place != '' && Object.keys(booking_info.position).length > 0;break;

            case 2:
                result =booking_info.photosesh_type_name != '';break;

            case 3:
                result =booking_info.photosesh_event_type != '';break;

            case 4:
                result =booking_info.photographers_request.length > 0;break;

        }

        if(!result){
            switch (step){
                case 0:
                    result = true;break;
                case 1:

                    message.error('Please choose date and location  before proceeding.')

                    break;

                case 2:
                    message.error('Please choose PhotoSesh or PhotoSesh LIGHT before proceeding.');break;

                case 3:
                    message.error('Please choose a PhotoSesh category before proceeding.');break;

                case 4:
                    message.error('Please choose a photographer before proceeding.');break;

            }
        }

        return result;

    }

    goTo(i) {
        if(this.checkPassStep(i)){
            this.props.setCurrentStep(i)
            this.props.history.replace(steps[i].link)
        }
    }
    next() {

        const { currentStep } = this.props;

        if(currentStep == 2 && !this.props.isAuthenticated){


                Modal.confirm({
                    iconType:"login",
                    title: 'PhotoSesh Notification',
                    okText:'Ok',
                    cancelText	:'Cancel',
                    centered:true,
                    onOk:()=>{
                        setStorage('loginBackUrl',this.props.location.pathname)
                        console.log();
                        this.props.history.replace('/login'); Modal.destroyAll();
                    },
                    content: (<div>
                        Please login or create a FREE account to enjoy access to all the PhotoSesh photographers with upfront pricing, bios, and portfolios.
                    </div>),
                });

            }

        else{
            if(this.checkPassStep(currentStep+1)){
                this.props.history.replace(steps[currentStep + 1].link)
                this.props.setCurrentStep(currentStep + 1)
            }
        }








    }

    prev() {
        const { currentStep } = this.props;

        if(currentStep == 1 && isMobile){
            this.props.history.replace('/book/schedule')
            this.props.setCurrentStep(0)
        }else{
            if(this.checkPassStep(currentStep-1)){
                this.props.history.replace(steps[currentStep-1].link)
                this.props.setCurrentStep(currentStep - 1)
            }
        }


    }



    render() {


        const { currentStep } = this.props;


        let buttonStyle = {
            cursor:'pointer',
            display:'inline-block'
        }

        if(!isMobile) return null
        console.log({currentStep});
        return (
            <div>
                <div className="navigate-mobile">
                    {currentStep > 0  && (
                        <span style={{float:'left',...buttonStyle,...(this.checkPassStepWithoutMessage(this.props.currentStep - 1) ? {} :{opacity:'0.5'}) }} onClick={() => this.prev()}>
                              <Icon type="double-left" />
                            Previous
                        </span>
                    )}

                    {currentStep == 0  && (
                        <span style={{float:'left',...buttonStyle}} onClick={() =>  this.props.history.replace('/book/')}>
                              <Icon type="double-left" />
                            Previous
                        </span>
                    )}



                    {currentStep < steps.length - 1 && (
                        <span
                            style={{float:'right',...buttonStyle,...(this.checkPassStepWithoutMessage(this.props.currentStep + 1) ? {} :{opacity:'0.5'})}}
                            type="primary" onClick={() => this.next()}>
                            Next <Icon type="double-right" />
                        </span>
                    )}
                </div>
            </div>
        );



    }

}

const mapStateToProps = (state)=>{
    return {

        isAuthenticated : state.auth.isAuthenticated,
        booking_info : state.bookinfo.info,
        currentStep : state.bookinfo.currentStep
    }
}

export const ProcessStep = connect(mapStateToProps,{setCurrentStep})(StepBooking);
export const NavigateMobile = connect(mapStateToProps,{setCurrentStep})(NavigateMobileClass);