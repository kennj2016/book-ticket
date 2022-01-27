import React, {Component} from 'react';
import {Route,Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {getCredits} from '../../../actions/paymentActions'
import helper from '../../../utils/helper'
import FormAddCredit from './Include/AddCreditForm'
class CreditSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cards:[]
        }
    }
    goTo(route) {
        this.props.history.replace(`${route}`)
    }

    componentWillMount(){
        this.props.getCredits()
    }
    render() {

        return (
            <div>

                <div
                    style={{
                        textAlign:'center',
                        background:'#f9f9f9',
                        padding:'50px',
                        fontSize:'16px',
                        textTransform:'uppercase',
                    }}
                >
                    PhotoSesh Credits : <strong>{helper.formatMoney(this.props.credits,"$")}</strong>
                </div>

                <div>

                    <FormAddCredit />

                </div>

            </div>
        );
    }
}



const mapStateToProps = (state) => {
    return {
        user:state.auth.user,
        credits:state.payment.credits
    }
}
export default connect(mapStateToProps, {getCredits})(CreditSection)



