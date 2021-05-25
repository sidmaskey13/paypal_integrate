
const express = require('express')
const paypal = require('paypal-rest-sdk');
const app = express()
const port = 4000

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': '####yourclientid######',
    'client_secret': '####yourclientsecret#####'
});


app.set('view engine', 'ejs');
app.set("views", __dirname + "/views");

app.get("/", function (req, res) {
    var tagline = "No programming concept is complete without a cute animal mascot.";
    res.render("table.ejs", { tagline: tagline });
});


app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`)
})
