import axios from 'axios'
import Noty from 'noty'
import { initAdmin } from './admin'
import moment from 'moment'
//const io = require('socket.io')(server)


let addToCart = document.querySelectorAll(".add-to-cart"); //addToCart is a array type
let cartCounter = document.querySelector(`#cartCounter`); //update cart item  no.

//function for receiving pizza
function updateCart(pizza) {
  axios
    .post("/update-cart", pizza)
    .then((res) => {
      //console.log(res)
      //update item no. in cart icon
      cartCounter.innerText = res.data.totalQty;
      new Noty({
        type: "success",
        timeout: 1000,
        text: "Item added to cart",
        progressBar: false,
      }).show();
    })
    .catch((err) => {
      new Noty({
        type: "error",
        timeout: 1000,
        text: "Something went wrong",
        progressBar: false,
      }).show();
    });
}

addToCart.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    //print event type
    //console.log(e);
    //get pizza object(data) after click add to cart button
    let pizza = JSON.parse(btn.dataset.pizza); //change string data json object
    //console.log(pizza)
    updateCart(pizza);

    // //get pizza object(data) after click add to cart button
    // let pizza = JSON.parse (btn.dataset.pizza)//change string data json object
    // //console.log(pizza)
    //
  });
});

// Remove alert message after  2 seconds
const alertMsg = document.querySelector("#success-alert");
if (alertMsg) {
  setTimeout(() => {
    alertMsg.remove();
  }, 2000);
}


// Change order status
let statuses = document.querySelectorAll('.status_line')
//console.log(statuses)//total status line
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? hiddenInput.value : null;
order = JSON.parse(order) //change string to object of order
//console.log(order) //look all status
let time = document.createElement('small') //apped time

function updateStatus(order) {
  statuses.forEach((status) => {//all status-line class iterate one by one
    status.classList.remove('step-completed')//data-stutus value receive
    status.classList.remove('current')
  })
  let stepCompleted = true;
  statuses.forEach((status) => {
    let dataProp = status.dataset.status //data attribute value get from admine status
    if (stepCompleted) {
      status.classList.add('step-completed')
    }
    if (dataProp === order.status) {
      stepCompleted = false
      time.innerText = moment(order.updatedAt).format("ll,h:mm:ss a");
      status.appendChild(time)
      if (status.nextElementSibling) {
        //if next step exist 
        status.nextElementSibling.classList.add('current')
      }
    }
  });
}
updateStatus(order);


initAdmin()//call function after change status

// Socket
let socket = io()
// Join in server
if (order) {
  socket.emit('join', `order_${order._id}`)//send data on server
}
//for admin
//let adminAreaPath = window.location.pathname
//console.log(adminAreaPath)
// if (adminAreaPath.includes('admin')) {
//   initAdmin(socket)
//   socket.emit('join', 'adminRoom')
// }
//recieve data from server socket when order update
socket.on('orderUpdated', (data) => {
  const updatedOrder = { ...order }//copy order
  updatedOrder.updatedAt = moment().format()//current time show
  updatedOrder.status = data.status
  // console.log(data)//print client side when update data from admin
  updateStatus(updatedOrder)
  new Noty({
    type: 'success',
    timeout: 1000,
    text: 'Order updated',
    progressBar: false,
  }).show();
})