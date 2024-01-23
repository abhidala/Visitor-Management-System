export const ApiConstants ={
    USER:{
        ADD: "/user/addUser",
        FIND_ALL: "/user/findAllUsers",
        DELETE:(userId:number)=>{
            return "/user/" + userId;
        },
        UPDATE:(userId: number, userType: String) => {
            return `user/update/${userId}/${userType}`;
        },
        FindOne:(userId:number|undefined)=>{
            return `user/findUser/${userId}`;
        },
        FINDALL:'/user/findAll'


    },
    VISITORS:{
        FIND_ALL_BY_NUMBER:(data,pageNumber:number,pageSize:number,)=>{
            return `/pass/findUserSearch/${data}/${pageNumber}/${pageSize}`;
        },
     FIND_ALL:(pageNumber:number,pageSize:number)=>{return `/pass/findAllvisitors/${pageNumber}/${pageSize}`},
     FIND_ALL_BY_DATE:(pageNumber:number,pageSize:number,startDate?:Date,endDate?:Date)=>{return `/pass/findAllvisitorsByDate/${pageNumber}/${pageSize}/${startDate}/${endDate}`},
     ADD:'/pass/addUser',
     FINDONE:(Id:any)=>{
        return `/pass/findUser/${Id}`;
     },
     Update:(Id:number)=>{
        return `/pass/editVisitor/${Id}`
     },
     UPDATEBLACKLIST:(visitorId:number)=>{
        return `pass/updateBlacklist/${visitorId}`;
    },
   
    },
    
    VISITORS_VISIT_DATE:{
        ADD:(Id:number)=>{
            return `/visits/${Id}`;
        },
       FINDALL:(pageNumber:number,pageSize:number)=>{{return `/visits/visiting-info/${pageNumber}/${pageSize}`}},
        FINDALLBYDATE:(pageNumber:number,pageSize:number,startdate,endDate)=>{return `/visits/visiting-info-byDate/${pageNumber}/${pageSize}/${startdate}/${endDate}`},
        FINDONE:(indexId:number)=>{
            return `/visits/oneVisit/${indexId}`
        },
        Update:(indexId:number,UserId:number)=>{
            return`/visits/${indexId}/${UserId}`
        }
     },
     LOGInOutReports:{
        LOGOUT:(userId:number)=>{
            return `/login-logs/update/${userId}`
        },
        FINDALL:'/login-logs/findAll',

     },
    APPOINTMENT :{
        CREATE:"/vag/createAppointment",
        GET_ALL:'/vag/findAll',
        DELETE:(id:number)=>{
            return "/vag/" + id;
        }
    },
    LOGIN : "/auth/login"
    
}