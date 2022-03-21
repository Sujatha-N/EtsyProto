const initialState = {
    currency: 'Dollars'
}

export const currencyreducer = (state = initialState, action) =>{
    console.log("ACTION IN USER_FAVOURITES_REDUCER",action);
    switch(action.type){
        case "CHANGE_CURRENCY":
            console.log("Change currency")
            return{
                currency: action.payload.currency
            };
        
        default:
            return state;
    }
    return state;
};


