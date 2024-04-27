import React from 'react';
import "../../css/Spinner.css";

export default function Spinner(){
    return (
        <React.Fragment>
            <div className="fundo-bg fundo-gray-dark" />
            <div className="text-center loading-cosmo">
                <div className="loader-inner">

                    <div className="lds-roller mb-3">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    
                </div>
            </div>
        </React.Fragment>
        
    )
}
