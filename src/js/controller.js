
window.addEventListener("keydown", e => {
    if (e.key == "ArrowLeft" || e.key.toLowerCase() == "a"){
        console.log(this.fire);
    }
    if (e.key == "ArrowRight" || e.key.toLowerCase() == "d"){
        console.log("Moving Right");

    }
    if ((e.key == "ArrowUp" || e.key.toLowerCase() == "w")){
        console.log("Moving Left");

    }
    if ((e.key == "ArrowDown" || e.key.toLowerCase() == "s")) {
        console.log("Moving Left");

    }
    if (e.key.toLowerCase() == "q") {
        console.log("Moving Left");
        
    }
})

window.addEventListener("keyup", e => {
    if (e.key == "ArrowLeft" || e.key.toLowerCase() == "a"){
        console.log("");
    }
    
    if (e.key == "ArrowRight" || e.key.toLowerCase() == "d"){
        console.log("");
    }
})

module.exports = {
    window
}