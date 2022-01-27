import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom'
import {Row, Form, Alert, Spin, Tag} from 'antd';
import {connect} from 'react-redux'
import {message, notification, Tooltip, Button, Table,Switch} from 'antd';
import classnames from  'classnames'

import {getCards,setCardDefault,deleteCard} from '../../../actions/paymentActions'
import moment from 'moment';

class CardSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cards: [],
            loading: false,
            set_card_default_loading: false,
        }
    }

    setCardDefault = (card_id)=>{


            this.setState({set_card_default_loading:true})

            this.props.setCardDefault(card_id)


    }

    goTo(route) {
        this.props.history.replace(`${route}`)
    }

    componentWillMount() {

        this.setState({loading: true})

        this.props.getCards()

    }
    componentWillReceiveProps(props){
        this.setState({loading: false,set_card_default_loading:false})
    }


    deleteCard = (card_id)=>{
        this.setState({set_card_default_loading:true})

        deleteCard(card_id).then(res=>{
            this.props.getCards()
        }).catch(err=>{
            console.log(err.response.data)

            if(typeof err.response.data != 'undefined' && err.response.data.message ){
                this.setState({set_card_default_loading:false})
                //message.error(err.response.data.message)

                notification['error']({
                    message: 'Cannot Delete Card',
                    description: err.response.data.message,
                    duration: 10
                    
                });

            }

        })

    }


    render() {

        const AlertStyle = {
            padding: 100,
            textAlign: 'center',
            marginBottom: 10,
            background:"#ffffff",
            border:"1px solid #ddd"
        }

        const CardList = () => {
            const columns = [{
                title: 'No',
                dataIndex: 'no',
                // render: text => <a href="#">{text}</a>,
                }, {
                    title: 'Card Type',
                    dataIndex: 'card_type',
                }

                ,
                {
                    title: 'Card Number',
                    dataIndex: 'last_four_digits',
                }
                , {
                    title: 'Added At',
                    dataIndex: 'addedAt',
                }, {
                    title: 'Card Default',
                    dataIndex: 'card_default',
                },
                {
                    title: 'Active',
                    dataIndex: 'active',
                },{
                    title: 'Action',
                    dataIndex: 'action',
                }];

            let data_cards = this.props.cards.map((card, index) => {

                return {
                    key: card._id,
                    no: index + 1,
                    card_type: card.cardType,
                    last_four_digits: '*************' + card.lastFourDigits,
                    active: (card.isActive) ? (<Tag color="#87d068">Active</Tag>) : (<Tag>Inactive</Tag>),
                    card_default: (
                        <Tooltip placement="top" title={'set this card to Default'}>
                            <Switch
                                className={classnames({default_card:card.isDefault})}
                                defaultChecked={card.isDefault}
                                onChange={()=>{this.setCardDefault(card._id)}} />
                        </Tooltip>
                    ),
                    addedAt: moment(card.addedAt).format('LLL'),
                    action:(
                        <a onClick={()=>{this.deleteCard(card._id)}}>Delete</a>
                    ),
                }
            })

            return <Table columns={columns} dataSource={data_cards}/>

        }


        return (
            <div>

                {(this.state.loading) && (
                    <div style={{
                        textAlign: "center",
                        padding: "60px 0"
                    }}><Spin></Spin></div>
                )}
                {
                    (!this.state.loading) && ((this.props.cards.length == 0 ) ? (
                                <Alert style={AlertStyle} message="No Cards Found" type="info"/>) : (
                                <div  className={classnames({loading_card:this.state.set_card_default_loading})}><CardList/><Spin className="spin_loading_card" style={{display:'none'}} /></div>)
                    )
                }

                <Button><Link to="/settings/payment-credits/card/add-new">Add Card</Link></Button>
            </div>



        );
    }
}


const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
        cards:state.payment.cards
    }
}
export default connect(mapStateToProps, {getCards,setCardDefault})(CardSection)



