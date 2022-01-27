import React, {Component} from 'react'
import classnames from 'classnames'

import style from './rate2.css'

export default class Rate2 extends Component {
    constructor(props) {
        super(props);
    }

    render() {



        let _int = parseInt(this.props.defaultValue),
            _float = this.props.defaultValue.toFixed(1).split('.')[1],
            classLi = (i)=> {
                if (i <= _int) return 'ant-rate-star-full'
                else {
                    if (_float == '0' || i > _int + 1)
                        return 'ant-rate-star-zero'
                    else {
                        return 'ant-rate-star-f' + _float + " ant-rate-star-active"
                    }

                }

            }


        return (


            <div className="rate2">


                <ul className="ant-rate">



                    {Array.from({length: this.props.count}, (v, i) => i+1).map(i=> {
                        return (
                            <li key={Math.random()} className={classnames('ant-rate-star',classLi(i))}>
                                <span className={'star'}></span>
                            </li>
                        )
                    })}


                </ul>

                {
                    (this.props.defaultValue) ?
                        <span className="rate_number">({this.props.defaultValue})</span> : ''
                }


            </div>

        )

    }

}