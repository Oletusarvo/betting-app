import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {getData} from './Api';

function ManageGame(props){
    return (
        <div className="page" id="manage-games-page"> 
            <GameList username={props.username} token={props.token}/>
        </div>  
    );
}

export default ManageGame;