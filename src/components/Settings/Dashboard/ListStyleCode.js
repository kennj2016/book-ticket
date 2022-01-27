import React, {Component} from 'react';
import {Route,Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {getStyleCodes,deleteStyleCode} from '../../../actions/userActions'
import {getExcerptText} from '../../../utils/helper'

import {Alert, Popconfirm, Tag,Table} from 'antd';

import moment from 'moment';

class ListStyleCode extends Component {
    constructor(props) {
        super(props);

    }
    goTo(route) {
        this.props.history.replace(`${route}`)
    }
    render() {

        const StyleCodeList = () => {
            const columns = [
                {
                    title: 'No',
                    dataIndex: 'no',
                }, {
                    title: 'Code',
                    dataIndex: 'code',
                },
                {
                    title: 'Description',
                    dataIndex: 'description',
                    render: (text, record) => {

                        console.log({text, record});

                        return  (
                            <span
                                style={{maxWidth: 200, overflow: 'hidden', display: 'inline-block'}}
                                dangerouslySetInnerHTML={{__html: text }}
                            ></span>
                        )

                    }
                },
                {
                    title: 'Created At',
                    dataIndex: 'createdAt',
                },
                {
                    title: 'public',
                    dataIndex: 'isPublic',
                },
                {
                    title: 'Action',
                    dataIndex: 'action',
                }];

            let dataStyleCodes = this.props.styleCodes.map((item, index) => {

                return {
                    key: item._id,
                    no: index + 1,
                    code: item.code,
                    description: getExcerptText(item.description,4),
                    isPublic: (item.isPublic) ? (<Tag color="#87d068">public</Tag>) : (<Tag>private</Tag>),
                    createdAt: moment(item.createdAt).format('LLL'),
                    action:(
                        <div>
                            <a onClick={(e)=>{e.preventDefault(); this.goTo('/settings/style-code/' + item._id)}}>edit</a> |

                            <Popconfirm placement="top" title={'Are you sure to Delete ?'} onConfirm={()=>{this.props.deleteStyleCode(item._id)}} okText="Yes" cancelText="No">
                                <a>Delete</a>
                            </Popconfirm>

                        </div>
                    ),
                }
            })

            return <Table columns={columns} dataSource={dataStyleCodes}/>

        }



        return (
            <div style={{maxWidth:1000}}>

                {((this.props.styleCodes.length == 0 ) ? (
                    <Alert message="No Style Code Found" type="info"/>) : (
                    <div><StyleCodeList/></div>)
                )}

            </div>
        );
    }
}



const mapStateToProps = (state) => {
    return {
        styleCodes:state.auth.user.styleCodes
    }
}
export default connect(mapStateToProps, {deleteStyleCode})(ListStyleCode)



