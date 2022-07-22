export const setAdmin=()=>{
    return{
        type:"SETADMIN"
    }
}


export const desetAdmin=()=>{
    return{
        type:"DESETADMIN"
    }
}


export const setAuth=()=>{
    return{
        type:"SETAUTH"
    }
}


export const desetAuth=()=>{
    return{
        type:"DESETAUTH"
    }
}

export const setAlertShow=(alertType,title,text)=>{
    return{
        type:"SETALERTSHOW",alertType,title,text
    }
}
export const desetAlertShow=(alertType,title,text)=>{
    return{
        type:"DESETALERTSHOW",alertType,title,text
    }
}