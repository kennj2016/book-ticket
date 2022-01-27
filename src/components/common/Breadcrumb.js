import style from './breadcrumb.css'
import React, {Component} from 'react';
import {Route,Link} from 'react-router-dom'
import {getRouteName} from '../../utils/helper'




export default (props) =>{

    return (

        <div className={style.breadcrumbs}>
            {(props.match.path == '/')  ? HomeBreadcrumb :(<div><Route path='/:path' component={Breadcrumbs} /></div>)}
        </div>

    )

}


const HomeBreadcrumb = (
    <div  className={style.breadcrumb}><Link  className={style.link}  to={'/'}>Home</Link></div>
)

const BreadcrumbsItem = ({ ...rest, match }) => {
    const routeName = getRouteName(match.url)
    console.log({routeName});
    if (routeName) {
        return (
            match.isExact
                ?   <span>{routeName}</span>
                :   <Link  className={style.link} to={match.url || ''}>{routeName} <span className="ant-breadcrumb-separator">/</span></Link>
        )
    }
    return null
}

const Breadcrumbs = ({ ...rest, location : { pathname }, match }) => {
    const paths = []
    pathname.split('/').reduce((prev, curr, index) => {
        paths[index] = `${prev}/${curr}`
        return paths[index]
    })

    return (
        <div className={style.breadcrumb}>
            {paths.map((p,i) => <Route key={i} path={p} component={BreadcrumbsItem} />)}
        </div>
    )
}
