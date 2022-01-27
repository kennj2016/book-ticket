import style from './layoutmaster.scss'
import React from 'react'
import {connect} from 'react-redux'
import classnames from 'classnames'
import LeftMenu from '../common/SideBar'
import {Layout} from 'antd'
const { Content} = Layout;
const EmptyWrapper = ({ children }) => (
    <Layout className={classnames(style.layout_master,'ant-layout-has-sider')}>

        <LeftMenu {...children.props} />
        <Layout className={style.right_layout}>
            <Content>
                {children}
            </Content>
        </Layout>
    </Layout>
);

export default EmptyWrapper

