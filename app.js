const express = require("express");
const bodyParser=require("body-parser");
const request=require("request");
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/TodoList');

//DATA BASE

const List_schema=new mongoose.Schema({
    item: String
});



const list_items = new mongoose.model("Item",List_schema);


var arr= [{
    item: "oiafn"
},
{
    item: "obsdoa"
},
{
    item: "iansdsa"
}];

// list_items.insertMany(arr,function(err){
//     if(err){
//         console.log(err);
//     }

//     else{
//         console.log("Inserted all");
//     }
// })


const CustomListSchema=new mongoose.Schema({
    listname: String,
    items:[List_schema]
});

const custom_list=mongoose.model("list",CustomListSchema);
//

//
const app=express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+"/public"));

const day_arr=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","sunday"];

var items=[];
app.get("/",function(req,res){
    var date=new Date();
    var currentday=date.getDay();
    var day=day_arr[currentday];

    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    day= date.toLocaleDateString("en-US",options);
    
    list_items.find(function(err,doc){

        if(err){
            console.log(err);
        }
    
        else{
            res.render('list',{daytoday: "Today", newItem:doc, newListName:listname});
        }
    });
    // res.render('list',{daytoday: day, newItem: items}); 
});

app.post("/",function(req,res){
    //console.log(req.body.newpoint);

    if(req.body.button==="Today"){

        if(req.body.newpoint!=""){
            list_items.insertMany({item : req.body.newpoint},function(err){
                if(err){
                    console.log(err);
                }
    
                else{
                    //console.log("Inserted new Item");
                }
            });
        }

        res.redirect("/");

    }



    else{

        console.log(req.body.button);
        custom_list.findOne({ listname : req.body.button },function(err,doc){
            if(err){
                console.log(err);
            }

            else{
                doc.items.push({item: req.body.newpoint});
                doc.save();
                res.redirect("lists/"+req.body.button);
            }
        })

    }
    
    
    
})

//New List Get,Post

app.get("/newlist",function(req,res){ 
    res.render('newlist',{newListName:listname});
})

var listname=[];
var temp; 
app.post("/newlist",function(req,res){
    //console.log(req.body.newList);
   
    for(var i=0;i<listname.length;i++){
        if(listname[i]===req.body.newList){
            
        
            temp=1;
            break;
        }
        else{
            temp=0;
        }
    }

    if(temp===1){
        console.log("List with same name already exist");
    }

    else{
        listname.push(req.body.newList);
        console.log("New List Created");
    }

    res.redirect("/newlist");
});

//Custom List Add


app.get("/lists/:newpostTitle",function(req,res){
    console.log(req.params.newpostTitle);
    var custom_url=req.params.newpostTitle;


    custom_list.findOne({listname: custom_url},function(err,doc){
        
        if(!err){
            if(!doc){
                customList=new custom_list({
                    listname: custom_url,
                    items: arr
                });

                customList.save(); 
                console.log("Doesn't Exist but Created");
            }
            else{
                console.log("Exist");
                res.render("list",{daytoday: doc.listname, newItem: doc.items, newListName:listname});
            }
        }

        else{
            console.log(err);
        }

    });



});

const arr_new=[];

//delete 
app.post("/delete",function(req,res){
   
    const id_found=req.body.testName;
    const title= req.body.TitleName;
    console.log(id_found);
    console.log(title);
    
    if(title=='Today'){

        
        list_items.findByIdAndRemove(id_found,function(err){
        if(err){
            console.log(err);
            console.log("Not Deleted")
        }

        else{
            console.log("Deleted Successfully");
        }

        res.redirect("/");
    })

    }
    else{
        custom_list.findOneAndUpdate({listname: title},{$pull:{items:{_id: id_found}}},function(err,result){
            if(!err){
                console.log("Deleted successfully");
                res.redirect("/lists/"+title);
            }
        })
    }

    // else{
        
    //     custom_list.findOne({listname: title},function(err,doc){
            
    //         if(err){
    //             console.log(err);
    //         }

    //         else{
                
    //         }

    //     })

    // }
    
})



app.listen(3000,function(){
    console.log("Server Running on Port 3000");
})


function remove_array_element(array, n)
 {
   var index = array.indexOf(n);
   if (index > -1) {
    array.splice(index, 1);
}
   return array;
 }