import React, { useState } from "react";
import {
    Avatar,
    Input,
    Layout,
    List,
    Menu,
    Badge,
    Row,
    Button,
    Dropdown,
    Divider
} from "antd";
import { useSelector } from "react-redux";
import selectors from "./selectors";
import { Link, useParams } from "react-router-dom";
import userSelectors from '../UserPage/selectors';

const getAvatar = (record, size = 40) => {
    if (!record) return <Avatar size={size} icon="user" />;
   

    if (record.picture) {
        return (
            <Avatar
                shape="circle"
                size={size}
                src={process.env.REACT_APP_STATIC_URI + "/" + record.picture}
            />
        );
    }

    if(record.firstname && record.lastname){
        return (
            <Avatar
                size={size}
                style={{
                    color: "#f56a00",
                    backgroundColor: "#fde3cf",
                }}
            >
                {record.firstname[0].toUpperCase() + record.lastname[0].toUpperCase()}
            </Avatar>
        );
    }
    
    return <Avatar size={size} icon="team" />;
};

const MessageList = () => {
    const {userId} = useParams();
    const messages = useSelector(selectors.selectMessages);
    const currentUser = useSelector(userSelectors.selectCurrentUser);


    return (
        <List
            style={{marginTop: "5px"}}
            className="scroll-y flex-1 bg-transparent"
            itemLayout="horizontal"
            dataSource={messages}
            renderItem={(item, index) => {
                if(!currentUser) return;
                let user = "";
                if(item.conversationType === "ChatGroup"){
                    user = item.receiver
                }else{
                    user = item.sender._id === currentUser.id
                        ? item.receiver
                        : item.sender;
                }
                return (
                    <Link to={`/m/${user._id}`}>
                        <List.Item
                            style={{
                                backgroundColor:
                                    user._id === userId ? "#e6f7ff" : "#fff",
                                cursor: "pointer",
                                borderRadius: "0.8rem",
                            }}
                            className={`${
                                user._id === userId ? "" : "border-0"
                            } border-0 px-4 py-3`}
                        >
                            <List.Item.Meta
                                avatar={getAvatar(user)}
                                title={
                                    <small
                                        style={{
                                            display: "flex",
                                            width: "100%",
                                        }}
                                    >
                                        <span style={{ fontSize: "14px" }}>
                                            {item.conversationType ===
                                            "ChatGroup"
                                                ? item.receiver.name
                                                : user.firstname +
                                                  " " +
                                                  user.lastname}
                                        </span>
                                    </small>
                                }
                                description={
                                    <p
                                        style={{
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            width: "200px",
                                            textOverflow: "ellipsis",
                                        }}
                                    >
                                        {item.type === "text"
                                            ? item.message
                                            : item.type === "image"
                                            ? "Photo(s)"
                                            : null}
                                    </p>
                                }
                            />
                        </List.Item>
                    </Link>
                );
            }}
        />
    );
};
export default MessageList;
