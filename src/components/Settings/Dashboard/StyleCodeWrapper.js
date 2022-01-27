import React, {Component} from 'react';
import {Route,Link} from 'react-router-dom'

import {connect} from 'react-redux'
import {Menu,Icon,Button} from 'antd';
import ListStyleCodes from './ListStyleCode'
import EditStyleCode from './EditStyleCode'
import AddStyleCode from './AddStyleCode'

class StyleCodeWrapper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current:'add'
        }
    }
    goTo(route) {
        this.props.history.replace(`${route}`)
    }

    handleClick = (e) => {
        this.setState({
            current: e.key,
        });
    }

    render() {

        return (
            <div id="style-code" style={{maxWidth:800}}>


                <div style={{marginBottom:30}}>
                    <Menu
                        onClick={this.handleClick}
                        mode="horizontal"
                        selectedKeys={[this.state.current]}

                    >
                        <Menu.Item key="add" style={{float:'right'}}>
                            <Link to={`${this.props.match.url}/add-new`} className="btn">
                                <Button icon="plus-circle-o">Add New</Button>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="list"  style={{float:'right'}} >


                            <Link to={`${this.props.match.url}`} className="btn">
                                <Icon type="bars" /> List

                            </Link>
                        </Menu.Item>
                    </Menu>
                </div>

                <Route exact={true} path={`${this.props.match.url}/`} component={ListStyleCodes}/>

                <Route exact={true} path={`${this.props.match.url}/add-new`} component={AddStyleCode} />
                <Route  path={`${this.props.match.url}/:code`} component={EditStyleCode} />

            </div>
        );
    }
}



const mapStateToProps = (state) => {
    return {
        user:state.auth.user
    }
}
export default connect(mapStateToProps, {})(StyleCodeWrapper)



