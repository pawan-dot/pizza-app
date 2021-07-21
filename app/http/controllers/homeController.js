 const Menu =require('../../models/menu');
 function homeController(){
     return{
        // index(req,res){
        //       return res.render('home');   //this method is only for render file

         async index(req,res){
             
             const pizzas=await Menu.find()
             //console.log(pizzas);
               return res.render('home',{ pizzas: pizzas }); 

            //up is better than down to fetch data from database
            // index(req,res){
            // Menu.find().then(function(pizzas){//give any name like pizzas
            //   console.log(pizzas);
            //   return res.render('home',{ pizzas: pizzas });   
             
             
     }
    }
}
 module.exports= homeController;