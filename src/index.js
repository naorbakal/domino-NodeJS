import React from 'react';
import ReactDOM from 'react-dom';
import BaseContainer from "./components/baseContainer.js";

const App = () => (
    <div>
        <BaseContainer />       
    </div>
);

ReactDOM.render(<App />, document.getElementById("root"));
