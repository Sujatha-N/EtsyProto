const initialState = {
    cart: [],
    // changeqty: false
}

export const cartreducer = (state = initialState, action) =>{
    console.log("ACTION IN CARTREDUCER",action.payload);
    switch(action.type){
        case "ADD_TO_CART":
            console.log("ACTION IN CARTREDUCER",action.payload[0].qty.qty, action.payload[0].item.item);
            let newitem = action.payload[0].item.item;
            newitem.qty = parseInt(action.payload[0].qty.qty);
            console.log("New item in cart reducer page is",newitem);
            console.log("CART IN REDUCER IS", state.cart)
            let output = []
            state.cart.forEach((item) => {
                console.log("item is", item);
                if(newitem !== null && item.id===newitem.id){
                    console.log("INSIDE SAME ITEM LOOP");
                    item.qty = parseInt(item.qty) + parseInt(newitem.qty);
                    console.log("State is", state);
                    output.push(item);
                    newitem = null;
                } else {
                    output.push(item);
                }
            })
            console.log("output is", output)
            if(newitem != null) output.push(newitem);
            
            return{
                cart: [...output]
            }
            
            
        case "REMOVE_FROM_CART":
            console.log("Remove fromcart in cartreducer", action.payload.item, state.cart)
            let removeitem = action.payload.item
            let newcart = state.cart.filter((item)=>{
                return(
                    item.id != removeitem.id 
                );
                    
            })
            console.log("NEW CART IS", newcart);
            return{
                cart : newcart
            }
        case "CHANGE_QUANTITY":
            console.log("Change Quantity in cartreducer", action.payload.item, action.payload.qty, state.cart)
            let changeitem = action.payload.item;
            changeitem.qty = parseInt(action.payload.qty);
            console.log("Change quantity in cart reducer page is",changeitem);
            console.log("CART IN REDUCER IS", state.cart)
            let newoutput = []
            state.cart.forEach((item) => {
                console.log("item is", item);
                if(changeitem !== null && item.id===changeitem.id){
                    console.log("INSIDE SAME ITEM LOOP", item.qty, changeitem.qty);
                    newoutput.push(item);
                    changeitem = null;
                }
                else {
                    newoutput.push(item);
                }
                
        
            })
            return{
                cart: [...newoutput],
                // changeqty:true
            }


        case "CLEAR_CART":
            console.log("inside clear cart")
            
            return{
                cart:[]
            };
        // return state;
            
    }
    return state;
}
