
import React from "react";
import ReactDOM from "react-dom";

import Edmund from "./react";

ReactDOM.render(
    <>
        <Edmund
            onFocus={() => { console.log('Focused!'); }}
            onBlur={() => { console.log('Blurred!'); }}
            onEdit={() => { console.log('Edited!') }} />
    </>
, document.getElementById('root')
);

