/* eslint-disable no-duplicate-case */
let isAdmin=null;

const AdminStatus=(state = isAdmin , action)=>{
    switch (action.type){
        case "SETADMIN" : 
            isAdmin=true;
            return isAdmin;
        case "DESETADMIN" : 
            isAdmin=false;
            return isAdmin;
        default: 
            if(isAdmin===null || isAdmin===undefined){
                if(localStorage.getItem('access_token') && localStorage.getItem('refresh_token') && localStorage.getItem('isAdmin')==="true"){
                    isAdmin=true
                }else{
                    isAdmin=false
                }
            }
            return isAdmin
    }
}


export default AdminStatus