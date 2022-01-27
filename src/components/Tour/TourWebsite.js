import React, {Component} from 'react'
import {Row, Icon, Card, Layout, Button} from 'antd';
import {Redirect, Link} from 'react-router-dom'
import {connect} from  'react-redux'
import axios from 'axios';
import Tour from "reactour";
import './assets/tour_website.scss';

import {getAllTours,getWelcomeTextMessage} from '../../actions/userActions';

import step3a from './assets/step3a.png'
import step3b from './assets/step3b.png'
import step3c from './assets/step3c.png'
import step3d from './assets/step3d.png'
import step4a from './assets/step4a.png'
import step4b from './assets/step4b.png'
import step5a from './assets/step5-a.png'
const {Header} = Layout

let originSteps = [
    {
        selector: '#add-new-button',
        content:  ({ goTo, inDOM }) => (
            <div>
                First Step
                <br />
                Click the button to make a PhotoSesh Booking
            </div>
        ),
        position: 'bottom',
    },  {
        selector: '.box-right',
        content:  ({ goTo, inDOM }) => (
            <div>
                <strong>
                    Enter Your time & location
                </strong>
                <br />
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur cum natus neque obcaecati voluptatum!
            </div>
        ),
        position: 'bottom',
    },
    {
        selector: '.step-left',
        content:  ({ goTo, inDOM }) => (
            <div>
                <strong>
                    Choose PhotoSesh Type
                </strong>
                <br />
                 At aut consequatur doloremque eius eos eum expedita, in nostrum nulla, odio odit, officia pariatur suscipit!
            </div>
        ),
        position: 'bottom',
    },    {
        selector: '.event-type',
        content:  ({ goTo, inDOM }) => (
            <div>
                <strong>
                    Choose Event Type
                </strong>
                <br />
                 At aut consequatur doloremque eius eos eum expedita, in nostrum nulla, odio odit, officia pariatur suscipit!
            </div>
        ),
        position: 'bottom',
    },   {
        selector: '.step4-select',
        content:  ({ goTo, inDOM }) => (
            <div style={{padding:'20px 0px'}}>
                <strong>
                    Choose Photographers
                </strong>
                <br />
                 Click on the heart to select photogrphers

            </div>
        ),
        position: 'bottom',
    },   {
        selector: '.step5-select',
        content:  ({ goTo, inDOM }) => (
            <div style={{padding:'20px 0px'}}>
                <strong>
                    Booking Review
                </strong>
                <br />
                 Enter Title / Description of Booking <br/>
                 then select credit card <br/>
                 then Click on the <strong>Book PhotoSesh</strong> button to success booking

                <br/>
                <div>
                    <Button type={'primary'}><Link to={'/'}>Done! Let's get started!</Link></Button>
                </div>
            </div>
        ),
        position: 'bottom',
    }
]


class TourWebsite extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isTourOpen:true,
            steps:[]
        }

    }

    goTo(route) {
        this.props.history.replace(route)
    }

    componentWillMount() {


        getAllTours().then(res=>{


            let steps = res.data.data;


            steps = steps.filter(item=>item.type == 'TOUR_STEP' && item.webtype == 'NORMAL')





            if(steps.length){
                steps = steps.map((step,i)=>{

                    let stepNew = {}

                    console.log(originSteps[i]);
                    stepNew.code =  step.code
                    stepNew.selector =  originSteps[i].selector
                    stepNew.position =  originSteps[i].position
                    stepNew.content = ()=>{

                        return (
                            <div>
                                <strong>
                                    {step.title}
                                </strong>
                                <br />

                                <div>
                                    {step.description}
                                </div>

                                {(i == 5) && (
                                    <div>
                                        <Button type={'primary'}><Link to={'/'}>Done! Let's get started!</Link></Button>
                                    </div>
                                )}

                            </div>
                        )

                    }


                    return stepNew;
                })
            }

            console.log({steps});
            this.setState({
                steps
            })

        })

    }


    render() {

        let {steps} = this.state


        if(steps.length != 6){
            steps = originSteps;
        }
        return (
            <div className={'tour-wrapper'}>


                <Tour
                    inViewThreshold={100}
                    accessibilityOptions={{
                        ariaLabelledBy: null,
                        // aria-label attribute for the close button
                        closeButtonAriaLabel: 'Close',
                        // Show/Hide Navigation Dots for screen reader software
                        showNavigationScreenReaders: true,
                    }}

                    className={'tour-box-component'}
                    steps={steps}
                    scrollDuration={100}
                    rounded={5}
                    isOpen={this.state.isTourOpen}
                    scrollOffset={0}
                    maskSpace={10}
                    onRequestClose={()=>{

                        console.log('close tour');

                        this.goTo('/')
                        this.setState({isTourOpen:false})
                    }} />



                    <div id="step1">
                        <div className="box-right">

                        </div>


                    </div>

                    <div id="step2">
                        <div className="top">

                        </div>
                       <div className="middle-row">
                           <div className="step-left">

                           </div>
                           <div className="step-right">

                           </div>
                       </div>
                    </div>

                    <div id="step3">
                        <div className="top">

                        </div>
                        <div className="middle-row">
                            <div className="box event-type">
                                <img src={step3a} alt=""/>
                            </div>
                            <div className="box">
                                <img src={step3b} alt=""/>
                            </div>
                            <div className="box">
                                <img src={step3c} alt=""/>
                            </div>
                            <div className="box">
                                <img src={step3d} alt=""/>
                            </div>
                        </div>
                    </div>

                <div id="step4">
                    <div className="top">

                    </div>
                    <div className="middle-row">
                        <div className={'step4-select'}>
                            <img src={step4a} alt=""/>
                        </div>

                        <div>
                            <img src={step4b} alt=""/>
                        </div>
                    </div>
                </div>
                <div id="step5">
                    <div className="top">

                    </div>
                    <div className="middle-row">
                        <div className={'step5-select'}>
                            <img src={step5a} alt=""/>
                        </div>
                    </div>
                </div>

            </div>
        )
    }

}

export default connect(null, {})(TourWebsite)
