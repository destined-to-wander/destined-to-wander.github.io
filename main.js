function showContent(contentID){
    var sections = document.querySelectorAll(".section")
    for (let section of sections){
        section.style.display = "none";
    }
    
    let activeSections = document.querySelectorAll(".section"+contentID);
    for (let activeSection of activeSections){
        activeSection.style.display="flex";
    }
}

function formatInternalNavBar(contentID){
    var sections = document.querySelectorAll(".navbar")
    for (let section of sections){
        section.style.display = "none";
    }
    
    let activeSections = document.querySelectorAll("#navbar"+contentID);
    for (let activeSection of activeSections){
        activeSection.style.display="grid";
    }
}

function displaySection(contentID){
    showContent(contentID);
    formatInternalNavBar(contentID);
}

document.getElementById("history").addEventListener("click", function(){displaySection(1)})
document.getElementById("methods").addEventListener("click", function(){displaySection(2)})
document.getElementById("environ").addEventListener("click", function(){displaySection(3)})

function main(){
    displaySection(1);
}

main();
