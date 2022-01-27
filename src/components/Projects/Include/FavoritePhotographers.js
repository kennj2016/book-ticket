import React,{Component} from 'react'
import {  List, Avatar , Modal, Icon  ,Layout, Row, Col,Button} from 'antd';

import {setShowMode,setFilterStatus,setFilterType} from '../../../actions/projectAction'
import {connect} from 'react-redux';
import classnames from 'classnames'
import {Redirect, Link} from 'react-router-dom'
import  {getPhotogapherName} from '../../../utils/helper'
import style from './favoritephotographers.css'
import {BlackHeart, RedHeart} from '../../Booking/Include/ListPhotographers'

import {likePhotographer,updateFavoritePhotographerInRedux} from '../../../actions/userActions'
const {  Content } = Layout;


class FavoritePhotographers extends Component{
    constructor(props) {
        super(props);
        this.state = {
            showALlPhotographers: false,
            visible: false,
            photographers:[],
            loading:[]
        };
    }
    handleButtonClick = ()=>{
        console.log(1);
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };
    handleOk = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };
    handleLikePhotographer = (id)=>{

        console.log(id);

        let {photographers,loading} = this.state

        if(typeof photographers[id] == 'undefined'){
            photographers[id] = true
        }else{
            photographers[id] = !photographers[id]
        }
        loading[id] = true

        this.setState({loading})

        likePhotographer({photographerId:id,type:photographers[id] ? 'LIKE' : 'UNLIKE'} ).then(res=>{
            console.log(res.data);
            loading[id] = false
            this.setState({photographers})

            this.props.updateFavoritePhotographerInRedux(id,photographers[id])

        })



    }

    componentDidMount(){
        setTimeout(()=>{
            if(this.props.photographers.length){

                let {photographers} = this.state
                this.props.user.favoritePhotographers.forEach(id=>{
                    photographers[id] = true
                })
                this.setState({visible:true,photographers})

            }
        },5000)
    }


    render() {

        let {photographers,loading,showALlPhotographers} = this.state


        let listPhotographers = []


        console.log(this.props.photographers);

        if(this.props.isAuthenticated){
            if(showALlPhotographers){
                listPhotographers = this.props.photographers
            }else{
                listPhotographers = this.props.photographers.filter(item=>{
                    return this.props.user.unlikePhotographers.indexOf(item._id) == -1
                })
            }
        }


        console.log(listPhotographers);

        return (
            <div>
                <Modal
                    title="Review Your Photographers - Do you like them ?"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={(
                        <div>


                            {
                                (!Object.keys(photographers).filter(id=>photographers[id]).length) ?
                                    <Button type={'disabled'}>Re-Book</Button> :
                                    <Button type={'primary'}><Link to="/book/re-book">Re-Book</Link></Button>
                            }


                            <Button type={'primary'} onClick={e=>{this.handleCancel()}}>Done</Button>

                    </div>)}
                >
                    <p style={{textAlign:'center',marginBottom:30}}>If you want to re-book photographers , please like them</p>

                    <List
                        itemLayout="horizontal"
                        dataSource={listPhotographers}
                        renderItem={photographer => (
                            <List.Item >
                                <List.Item.Meta
                                    avatar={<Avatar shape="square" size={64} src={photographer.profilePicURL.thumb} />}
                                    title={getPhotogapherName(photographer.name.firstName + ' ' + photographer.name.lastName)}
                                    description={(<div dangerouslySetInnerHTML={{ __html: '' }}></div>)}

                                    className={loading[photographer._id]?'loading':''}

                                />


                                <span className={style.wrap_heart}>
                                      {(this.state.photographers[photographer._id]) ? (

                                          <Icon onClick={(e)=>this.handleLikePhotographer(photographer._id)}

                                                component={RedHeart}
                                          />
                                      ) : (

                                          <Icon
                                              component={BlackHeart}
                                              onClick={(e)=>this.handleLikePhotographer(photographer._id)}
                                          />


                                      )}

                                </span>


                            </List.Item>
                        )}
                    />




                    <span style={{color:'orange',cursor:'pointer'}} onClick={e=>this.setState({showALlPhotographers:true})}>show all your photographers</span>

                </Modal>
            </div>
        )
    }

}

const mapStateToProps = (state)=>{
    return {
        user:state.auth.user,
        isAuthenticated:state.auth.isAuthenticated,
        photographers : state.projects.bookings.map(item=>{
            let agent = item.agentData
            agent.recentJob = item
            return agent
        })
        .filter((item, pos, self)=> {
            return self.indexOf(self.find(a=>a._id == item._id)) == pos;
        })
    }
}


export default connect(mapStateToProps,{setShowMode,setFilterStatus,setFilterType,updateFavoritePhotographerInRedux})(FavoritePhotographers)

