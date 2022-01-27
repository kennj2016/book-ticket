import style from './layoutauth.css'
import React from 'react'
import {Layout} from 'antd'
const LayoutAuth = ({ children }) => (
    <Layout className={style.layout_login} id="layout_auth">
        
        <div className={style.logo}><img src="/images/logo.png" alt=""/></div>
        
        {children}
    </Layout>
);
export default LayoutAuth

