const {Router} = require("express");
const {allRecipes_DB_API,getRecipesQuery,idRecipes_API_DB,postRecipe} = require("../controllers/RecipesController");

const router = Router();
const {validateRecipe} = require("../middlewares/index");

router.get("/", async(req, res) => {
    const {name} = req.query;
    if(name){
        res.json(await getRecipesQuery(name))
    }else{
        res.json(await allRecipes_DB_API())
    }
})

router.get("/:idRecipes", async(req, res) =>{
    try{
        const {idRecipes} = req.params;
    
        res.json(await idRecipes_API_DB(idRecipes));
    }catch(err){
         res.json(err);
    }
});

router.post("/", validateRecipe, postRecipe);



module.exports = router;