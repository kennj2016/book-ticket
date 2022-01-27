import React, {Component} from 'react';
import {Route,Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {Form,Input,Button,message,Col,Checkbox} from 'antd';
import {updateStyleCode,updateListStyleCodesInRedux} from '../../../actions/userActions'
import {UPDATE_STYLE_CODE} from '../../../actions/types'
import {Editor} from "react-draft-wysiwyg";
import '../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {stateToHTML} from 'draft-js-export-html';
import {isDefine} from '../../../utils/helper'
import {ContentState, convertFromHTML, EditorState} from 'draft-js';
const { TextArea} = Input;
const FormItem = Form.Item;

class EditStyleCode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error:[],
            isPublic:false,
            description:''
        }

    }
    goTo(route) {
        this.props.history.replace(`${route}`)
    }
    onChange  = (e)=>{
        this.setState({ isPublic:e.target.checked });
    }

    componentWillReceiveProps(props){




        const blocksFromHTML = convertFromHTML(props.styleCode.description);
        const state = ContentState.createFromBlockArray(
            blocksFromHTML.contentBlocks,
            blocksFromHTML.entityMap
        );


        this.setState({loading: false,styleCode:props.styleCode,  description: EditorState.createWithContent(state)})
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, inputs) => {
            if (!err) {

                if(this.props.user.isStyleCodeAdmin ){
                    inputs.isPublic = this.state.isPublic
                }


                this.setState({
                    error:[]
                })
                console.log({inputs});
                let html = stateToHTML(this.state.description.getCurrentContent());
                updateStyleCode(this.props.match.params.code,{

                    ...inputs,
                    description:html

                }).then(res=>{
                    message.success(res.data.message)
                    this.props.form.resetFields()
                    this.props.updateListStyleCodesInRedux(UPDATE_STYLE_CODE,res.data.data)
                    this.goTo('/settings/style-code')
                },error=>{
                    let {response} = error
                    message.error(response.data.message)
                })

            }
        });
    }

    handleEditorChange = (html) => {
        this.setState({
            description: html
        });
    }

    render() {



        const {getFieldDecorator} = this.props.form;


        let style_error = {
            background:'rgba(206, 17, 38, 0.05)',
            border:'1px solid #ccc',
            textAlign:'center',
            marginBottom: 3
        }

        return (
            <div style={{maxWidth:800,paddingLeft:20}}>
                {this.state.error.length > 0 && (
                    <div style={{maxWidth:300,margin:'20px auto'}}>
                        {this.state.error.map(error=>(<div style={style_error}>{error.message}</div>))}
                    </div>
                )}

                {isDefine(this.props.styleCode) &&
                    <Form
                        style={{maxWidth:400,}}
                        onSubmit={this.handleSubmit}>


                        <h2 className="head-title">Add New PhotoSesh Style Code</h2>
                        <Col span={24}>
                            <FormItem
                                label="PhotoSesh Style Code"
                            >
                                {getFieldDecorator('code', {
                                    rules: [
                                        {required: true, message: 'Please enter Style Code'},
                                        {min:3, message: 'code at least 3 characters'},
                                        {pattern:/^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/ ,message:'The code invalid (please don\'t use space or special character)'}
                                    ],
                                    initialValue: this.props.styleCode.code

                                })(
                                    <Input placeholder=""/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={24}>



                            <FormItem
                                label="* Title / Description">
                                <Editor
                                    editorState={this.state.description}
                                    wrapperClassName="wrapper-description"
                                    editorClassName="wrapper-editor"
                                    onEditorStateChange={this.handleEditorChange}
                                    toolbarClassName="toolbar-class"
                                    toolbar={{
                                        options: ['inline', 'link', 'embedded', 'emoji', 'history'],
                                        inline: {
                                            inDropdown: false,
                                            options: ['bold', 'italic', 'underline']
                                        },
                                        textAlign: {
                                            inDropdown: true,
                                            options: [],
                                        },
                                        link: {
                                            options: ['link']
                                        }
                                    }}
                                />

                            </FormItem>

                        </Col>

                        {
                            this.props.user.isStyleCodeAdmin && (
                                <Col span={24}>
                                    <FormItem
                                        label=""
                                    >
                                        <Checkbox
                                            checked={this.state.isPublic}
                                            onChange={this.onChange}>public (anyone with code can use)</Checkbox>
                                    </FormItem>
                                </Col>
                            )
                        }

                        <Button
                            type="primary"
                            htmlType="submit"
                            icon="save"
                            loading={this.state.loading}
                        >
                            Update Style Code
                        </Button>


                    </Form>
                }

            </div>
        );
    }
}




const EditStyleCodeWrapper =  Form.create()(EditStyleCode);


const mapStateToProps = (state,props) => {
    let styleCode = state.auth.user.styleCodes.filter(item=>item._id == props.match.params.code)[0];

    return {
        styleCode,
        user:state.auth.user
    }
}
export default connect(mapStateToProps, {updateListStyleCodesInRedux})(EditStyleCodeWrapper)



