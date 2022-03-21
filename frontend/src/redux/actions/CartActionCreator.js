// import axios from "axios";

// export const usersignup = (name, email, password) => async (dispatch)=>{
//     try{
//         let response = await axios.post('http://localhost:4000/usersignup', 
//         {username: name , 
//         email:email, 
//         password:password});
//         console.log("Response from usersignup action is",response);

//         if(response.status===200){
//             dispatch({
//                 type: "USER_REGISTRATION_SUCCESS",
//                 payload: {
//                   token: response.data.accessToken,
//                 },
//               });
//         }
//         else{
//             dispatch({type: "USER_REGISTRATION_FAIL"});
//         }
//     }
//     catch(e){}
// };
