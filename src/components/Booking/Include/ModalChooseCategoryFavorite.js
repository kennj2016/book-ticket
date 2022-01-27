import React, {useState} from 'react';
import {Button, Input, Modal, Form, notification} from "antd";
import {addCategory} from "../../../actions/bookActions";
import {HeartFilled, HeartOutlined, PlusOutlined} from "@ant-design/icons";
import {getArrayLikeImageCollection, likeImageCollectionBooking, unlikeImageCollectionBooking} from "../../../actions/userActions";

const FormItem = Form.Item;
const ModalChooseCategory = ({
                                 toggle,
                                 modal,
                                 categoryLike,
                                 imageLike,
                                 images,
                                 updateCategoryLike,
                                 categoryUnlike,
                                 emailFavorites,
                                 collection,
                                 setArrayLike,
                                 openNotificationWithIcon
                             }) => {
    const [loading, setLoading] = useState(false);
    const [isAdd, setIsAdd] = useState(false);
    const [category, setCategory] = useState("");
    const [message, setMessage] = useState("");

    const toggleAdd = () => {
        setIsAdd(!isAdd);
    }
    const handleAddCategory = () => {
        if (Object.keys(categoryLike).includes(category.toLowerCase())) {
            setMessage('Category name already exists')
        } else {
            setLoading(true);
            addCategory({collectionId: collection, category, email: emailFavorites}).then(res => {
                let newCategoryLike = {...categoryLike, [category]: []};
                updateCategoryLike(newCategoryLike);
                setLoading(false);
                toggleAdd();
            })
        }

    }
    const handleLike = (key) => () => {
        let data = {
            collectionId: collection,
            imageId: imageLike._id,
            email: emailFavorites,
            category: key
        };

        if (categoryLike[key].find(image => image === imageLike._id)) {
            unlikeImageCollectionBooking(data).then((res) => {
                if (res.data.statusCode === 200) {
                    getArrayLikeImageCollection({
                        collectionId: collection,
                        email: emailFavorites,
                    }).then((res) => {
                        setArrayLike(res);
                        openNotificationWithIcon("success", (<div>Removed from <strong>{key}</strong></div>));
                    });
                }
            });
        } else {
            likeImageCollectionBooking(data).then((res) => {
                if (res.data.statusCode === 200) {
                    getArrayLikeImageCollection({
                        collectionId: collection,
                        email: emailFavorites
                    }).then((res) => {
                        setArrayLike(res);
                        openNotificationWithIcon("success", (<div>Added to <strong>{key}</strong></div>));
                    });
                }
            });
        }
    }

    return (
        <Modal
            wrapClassName={"wrap-modal-category"}
            footer={null}
            header={null}
            title=""
            closeIcon
            centered
            width={800}
            visible={modal}
            onCancel={toggle}
        >
            <div className="category-wrap">
                <div className="category-left">
                    <img style={{width: '100%', height: '100%', objectFit: 'contain'}} src={imageLike.original} alt=""/>
                </div>
                <div className="category-right">
                    <h3>
                        ADD TO FAVORITES
                    </h3>
                    <div className="category-action">
                        <div className="category-content">
                            {isAdd ?
                                <div className="category-add">
                                    <label style={{color: 'red'}}>
                                        {message}
                                    </label>
                                    <FormItem hasFeedback className={"wrap-formitem-download"}>
                                        <Input
                                            type="email"
                                            onChange={e => setCategory(e.target.value)}
                                        />
                                    </FormItem>
                                    <Button
                                        className="btn-next"
                                        type="primary"
                                        htmlType="submit"
                                        disabled={!category}
                                        loading={loading}
                                        onClick={handleAddCategory}
                                        style={{background: 'rgb(90 89 89)', border: 'none', color: 'white'}}
                                    >
                                        CREATE
                                    </Button>
                                    <br/>
                                    <Button
                                        className="btn-next"
                                        type="primary"
                                        htmlType="submit"
                                        onClick={toggleAdd}
                                        style={{background: '#282828', border: 'none', color: 'white'}}
                                    >
                                        CANCEL
                                    </Button>
                                </div>
                                :
                                Object.keys(categoryLike).map((key, index) => {
                                    let image = images.find(item => item._id === categoryLike[key][0]);
                                    return <div key={index} className="category-list">
                                        <div style={{display: 'flex'}}>
                                            <img style={{borderRadius: '3px'}} width={50} src={image ? image.original : "https://upload.wikimedia.org/wikipedia/commons/b/b3/Solid_gray.png"} alt=""/>
                                            <div className="category-name">
                                                <span style={{fontWeight: 'bold'}}>{key}</span>
                                                <span>
                                            {categoryLike[key].length} PHOTOS
                                        </span>
                                            </div>
                                        </div>
                                        <div onClick={handleLike(key)}>
                                            {
                                                categoryLike[key].find(image => image === imageLike._id) ?
                                                    <HeartFilled className="icon-like" style={{color: '#c53b3b'}}/>
                                                    : <HeartOutlined className="icon-like"/>
                                            }
                                        </div>
                                    </div>
                                })

                            }

                        </div>
                        <div
                            style={{fontWeight: 'bold', color: 'gray', cursor: 'pointer'}}
                            onClick={toggleAdd}
                        >
                            <PlusOutlined className="category-icon"/> CREATE NEW LIST
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ModalChooseCategory;
