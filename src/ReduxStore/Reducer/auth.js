/* eslint-disable no-duplicate-case */
let isAuth=null;

const AuthStatus=(state = isAuth , action)=>{
    switch (action.type){
        case "SETAUTH" : 
            isAuth=true;
            return isAuth;
        case "DESETAUTH" : 
            isAuth=false;
            return isAuth;
        default:
            if(isAuth===null){
                if(localStorage.getItem('access_token') && localStorage.getItem('refresh_token')){
                    isAuth=true
                }else{
                    isAuth=false
                }
            }
            return isAuth
    }
}


export default AuthStatus