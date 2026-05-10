const fs = require("node:fs");
const path = require("path");

const ex_curse_html = fs.readFileSync(path.join(__dirname, "ex_curse", "ex_curse.html"), "utf-8");
const ex_curse_mjs = fs.readFileSync(path.join(__dirname, "ex_curse", "ex_curse.mjs"), "utf-8");

const curse_name = process.argv[2];
const curse_path = path.join(__dirname, curse_name);
const curse_html_path = path.join(curse_path, curse_name + ".html"); 
const curse_mjs_path = path.join(curse_path, curse_name + ".mjs");

(async() => {
    fs.mkdirSync(curse_path);
    fs.writeFileSync(curse_html_path, ex_curse_html);
    fs.writeFileSync(curse_mjs_path, ex_curse_mjs);

    console.log(curse_name, "creer avec succes.")
})()