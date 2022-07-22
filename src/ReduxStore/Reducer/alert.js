/* eslint-disable no-duplicate-case */
let show=false;
let title='';
let text='';
let alertType='';

const AlertStatus=(state = {show,title,text,alertType} , action)=>{
    switch (action.type){
        case "SETALERTSHOW" : 
            show=true
            title=action.title
            text=action.text
            alertType=action.alertType
            return {show,title,text,alertType};
        case "DESETALERTSHOW" : 
            show=false
            title=''
            text=''
            alertType=''
            return {show,title,text,alertType};
        default: return {show,title,text,alertType};
    }
}

export default AlertStatus