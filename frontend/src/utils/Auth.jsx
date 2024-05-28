import { Navigate } from "react-router-dom"

const Auth = ({children}) => {
    if(localStorage.getItem("sc-user")) {
        return children
    }

    // if(!localStorage.getItem("group")){
    //     return <Navigate to='/extension-settings'/>
    // }

    return <Navigate to='/onboard'/>
}

export default Auth