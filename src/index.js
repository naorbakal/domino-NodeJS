import React from 'react';
import ReactDOM from 'react-dom';
import BaseContainer from "./components/baseContainer.js";

const App = () => (
    <div>
        <BaseContainer name='' location="login"/>       
    </div>
);

ReactDOM.render(<App />, document.getElementById("root"));
