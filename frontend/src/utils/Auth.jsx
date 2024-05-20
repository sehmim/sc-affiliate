import { Navigate } from "react-router-dom"

const Auth = ({children}) => {
    if(localStorage.getItem("user")) {
        return children
    }

    if(!localStorage.getItem("group")){
        return <Navigate to='/creategroup'/>
    }

    return <Navigate to='/login'/>
}

export default Auth