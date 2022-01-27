import React, {useEffect, useState} from "react";
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry";
import {getAllCollectionFavorite} from "../../../actions/userActions";
import {DoubleLeftOutlined} from "@ant-design/icons";
import {withRouter} from 'react-router-dom'
import {getCollectionsBooking} from "../../../actions/bookActions";
import qs from "qs";

const ListFavourites = (props) => {
    const [categories, setCategories] = useState([]);
    const SERVER_DOMAIN = process.env.API_URL.split("/api/v1").shift();
    useEffect(() => {
        let queryObject = qs.parse(props.location.search, {
            ignoreQueryPrefix: true,
        });
        getCollectionsBooking(queryObject.bookingId).then((res) => {
            let email = localStorage.getItem("email");
            if (email && typeof res.data.data != "undefined") {
                getAllCollectionFavorite({
                    collectionIds: res.data.data.map(item => item._id),
                    email: localStorage.getItem("email"),
                }).then((res) => {
                    if (res.data) {
                        let result = [];
                        setCategories(res.data.filter(item => item.category));
                        for (const item of res.data.filter((i) => i.array_like.length)) {
                            result = [
                                ...result,
                                ...item.collectionId.images.filter((i) =>
                                    item.array_like.includes(i._id)
                                ),
                            ];
                        }
                    }
                });
            }
        });

    }, []);

    return (
        <div id="collection-page">
            <div className="favorite-wrapper">
                <h2><DoubleLeftOutlined style={{cursor: 'pointer'}} onClick={
                    
                    ()=>{

                        console.log (1);
                        let queryObject = qs.parse(props.location.search, {
                            ignoreQueryPrefix: true,
                        });
                        props.history.push(`/collections?bookingId=${queryObject.bookingId}`)


                    }
                  
                
                



                
                }/> FAVORITES</h2>
                <span>Curated by <strong>{localStorage.getItem("email")}</strong></span>
                <div className="list-masonry">
                    <ResponsiveMasonry columnsCountBreakPoints={{350: 1, 750: 2, 900: 3}}>
                        <Masonry>

                            {
                                categories.length > 0 &&
                                categories.map((cate, i) => {
                                    let image = cate.collectionId.images.find(item => item._id === cate.array_like[0]);
                                    return image ? (
                                        <div
                                            key={"list-image" + image._id}
                                            className={"box-img pad5"}
                                            style={{marginRight: 10}}
                                            onClick={() => {
                                                let queryObject = qs.parse(props.location.search, {
                                                    ignoreQueryPrefix: true,
                                                });
                                                props.history.push(`/collections/favorite?bookingId=${queryObject.bookingId}&collectionId=${cate.collectionId._id}&cate=${cate.category}`)
                                            }}
                                        >
                                            <img src={image.thumb}/>
                                            <div className="favorite-name">
                                                {cate.category} ({cate.array_like.length} PHOTOS)
                                            </div>
                                        </div>
                                    ) : null;
                                })

                            }
                        </Masonry>
                    </ResponsiveMasonry>

                    {categories.length === 0 && (
                        <div className={"text-center"}>
                            <br/>
                            There no category of booking
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default withRouter(ListFavourites);
