let addToCart = document.querySelectorAll('.add-to-cart')//addToCart is a array type
console.log("hoooo")
addToCart.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        //
        console.log(e)
        function  updateCart(pizza){
            axios.post('/update-cart',pizza).then(res => {
             console.log(res)
            })
        }
     




        //get pizza object(data) after click button
        let pizza = JSON.parse (btn.dataset.pizza)//change string data json object
        //console.log(pizza)
        updateCart(pizza)

    })
})
