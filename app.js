const express=require("express");
const app=express()
const mongoose=require("mongoose");
const port=8080;
const MONGO_URL="mongodb://127.0.0.1/wanderlust";
const Listing=require("./models/listing.js");
const path=require("path");
let methodOverride = require('method-override')
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.set("views",path.join(__dirname,"views/listings"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.listen(port,()=>{
    console.log(`server is listening through ${port}`);
})
async function main(){
    await mongoose.connect(MONGO_URL);
}

// app.get("/testListing",async(req,res)=>{
//     let sampleListing=new Listing({
//         title:"My new villa",
//         description:"By the beach",
//         price:1200,
//         location:"Calangute, Goa",
//         country:"India",
//     })
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("sucessful entry");
// })
main()
.then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
})
//Index Route
app.get("/listings",async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("index.ejs",{allListings});
})

//New Route
app.get("/listings/new",(req,res)=>{
    res.render("new.ejs");
})

//Show Route
app.get("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id);
    res.render("show.ejs",{listing});
})

//Create Route
app.post("/listings", async(req,res)=>{
    const newListing=new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings")
});

//Edit Route
app.get("/listings/:id/edit", async(req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id);
    res.render("edit.ejs",{listing});
})

//Update Route
app.put("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{ ...req.body.listing});
    res.redirect("/listings");
})

//Delete Route
app.delete("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    const deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
})

app.get("/",(req,res)=>{
    res.send("Hi, I am root");
})