function showContent(contentID){
    var sections = document.querySelectorAll(".section")
    for (let section of sections){
        if (section.classList.contains("section"+contentID)){
            section.style.display = "block";
            section.classList.add("activeSection");
        } else {
            section.classList.remove("activeSection");
            section.style.display = "none";
        }
    }
}

function formatInternalNavBar(contentID){
    var sections = document.querySelectorAll(".navbar")
    for (let section of sections){
        if (section.id == "navbar" + contentID){
            section.style.display="flex";
        } else {
            section.style.display = "none";
        }
    }
}

function displaySection(contentID){
    showContent(contentID);
    formatInternalNavBar(contentID);
}

document.getElementById("history").addEventListener("click", function(){displaySection(1)})
document.getElementById("methods").addEventListener("click", function(){displaySection(2)})
document.getElementById("environ").addEventListener("click", function(){displaySection(3)})

document.getElementById("external").addEventListener("click",function(evt){
    console.log(this.contentID); //see who is sender
})

document.getElementById("internalHBMenu").addEventListener("click",function(evt){
    document.getElementById("internal").style.right = "0"; //see who is sender
})

document.addEventListener("click", function(evt){
    if (evt.target.id != "internal" && !document.getElementById("internal").contains(evt.target))
        document.getElementById("internal").style.right = "-250px"; 
})


// main:
displaySection(1);
