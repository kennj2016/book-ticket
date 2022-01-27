import React, {Component} from 'react'
import {Form,Input,Button,Upload,message,Icon,Spin,Card} from 'antd';
import {updateProfile} from '../../../../actions/userActions'
import {filterUserData} from '../../../../actions/authActions'
import PropTypes from 'prop-types';

const FormItem = Form.Item;


function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

function beforeUpload(file) {
    const isJPG = file.type
   /* const isJPG = file.type === 'image/jpeg';
    if (!isJPG) {
        message.error('You can only upload JPG file!');
    }*/
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJPG && isLt2M;
}

class EditProfileForm extends Component {

    constructor(props) {
        super(props)

        this.state = {
            user: {},
            loading:false,
            imageUrl:'',
            avatar_loading:false


        }
    }


    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, inputs) => {
            if (!err) {
                this.setState({
                    loading:true
                })

                let data = new FormData();

                Object.keys(inputs).forEach((key)=>{
                    data.append(key,inputs[key]);
                })

                if(this.state.avatar){
                    data.append('profileImage',this.state.avatar.originFileObj,this.state.avatar.filename);
                }


                updateProfile(data)
                .then(res=>{

                    let data_ = res.data.data
                    let user = filterUserData(data_)
                    this.props.setToken(data_.accessToken,user)


                    message.success('Update Profile Successful')

                    this.setState({ loading: false });
                },({response})=>{
                    message.error('Something was wrong')
                    this.setState({ loading: false });
                })
            }
        });
    }
    handleChangeAvatar = (info) => {

        this.setState({ avatar_loading:true })

        if (info.file.status === 'done') {
            this.setState({ avatar:info.file })
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, imageUrl => this.setState({ imageUrl , avatar_loading:false }));
        }
    }




    render() {
        const imageUrl = (this.props.user.profilePicURL.thumb != '' && this.state.imageUrl == '') ? this.props.user.profilePicURL.thumb : this.state.imageUrl;
        const {getFieldDecorator} = this.props.form;



        return (
            <Form style={{maxWidth:500}} onSubmit={this.handleSubmit}>

                <Card>
                    <p style={{
                        padding: '6px 10px',
                        background: " rgb(239, 239, 239)",
                        marginBottom: 10,
                        borderRadius: 3,
                        border: '1px solid #dcd6d6'
                    }}>Email : {this.props.user.email}</p>

                    <FormItem
                        label="First Name"
                        hasFeedback
                    >
                        {getFieldDecorator('firstName', {
                            rules: [{
                                required: true, message: 'First Name is not empty',
                            },
                            ],
                            initialValue: this.props.user.name.firstName
                        })(
                            <Input type="text"/>
                        )}
                    </FormItem>
                    <FormItem
                        label="Last Name"
                        hasFeedback
                    >
                        {getFieldDecorator('lastName', {
                            rules: [{
                                required: true, message: 'Last Name is not empty',
                            }
                            ],
                            initialValue: this.props.user.name.lastName
                        })(
                            <Input type="text"/>
                        )}
                    </FormItem>

                    <FormItem
                        label="Phone"
                        hasFeedback
                    >
                        {getFieldDecorator('phoneNumber', {
                            rules: [],
                            initialValue: (this.props.user.phone != '') ? this.props.user.phone : ''
                        })(
                            <Input type="text"/>
                        )}
                    </FormItem>

                    <FormItem
                        label="Avatar"
                        hasFeedback
                    >
                        <Upload
                            className={'avatar-uploader'}

                            style={{
                                width: 150,
                                height: 150,
                                display: "block",
                                border: "1px dashed #d9d9d9",
                                borderRadius: 6,
                                cursor: "pointer",
                                position:'relative'
                            }}

                            name="avatar"
                            showUploadList={false}
                            action="//jsonplaceholder.typicode.com/posts/"
                            beforeUpload={beforeUpload}
                            onChange={this.handleChangeAvatar}
                        >
                            {(this.state.avatar_loading)? (<Spin style={{

                                position: 'absolute',
                                background: 'white',
                                width: 32,
                                height: 30,
                                borderRadius:' 50%',
                                paddingTop: 4,
                                display: 'block',
                                left: 'calc(50% - 15px)',
                                marginTop:' calc(50% - 15px)',

                            }} size="small" />) : ''}

                            {
                                (imageUrl) ?
                                    <img src={imageUrl} alt="" className="avatar"    style={{
                                        width: 150,
                                        height: 150
                                    }} /> :
                                    <Icon type="plus" className="avatar-uploader-trigger"    style={{
                                        width: 150,
                                        height: 150,
                                        display: "table-cell",
                                        verticalAlign: "middle",
                                        fontSize: 28,
                                        color: "#999"
                                    }} />
                            }
                        </Upload>
                    </FormItem>

                    <Button
                        type="primary"
                        htmlType="submit"

                        icon="save"
                        loading={this.state.loading}
                    >
                        Save
                    </Button>
                </Card>



            </Form>
        )
    }
}

EditProfileForm.propTypes = {
    user: PropTypes.object.isRequired,
    setToken: PropTypes.func.isRequired
}




export default Form.create()(EditProfileForm);
