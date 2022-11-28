import React, {useContext} from 'react';

import GameList  from '../GameList/GameList.js';
import './Style.scss';
import AppContext from '../Contexts/AppContext.js';
import langStrings from '../lang';
import HomeNoLog from './HomeNoLog.js';
import HomeLog from './HomeLog.js';

function Home(){

    const {user} = useContext(AppContext);

    if(user === null){
        return <HomeNoLog/>
    }
    else {
        return <HomeLog/>
    }
}

export default Home;