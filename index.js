require('dotenv').config()
const express = require('express')
var cors = require('cors')
const paypal = require('paypal-rest-sdk');
const app = express()
const port = 4000
app.use(cors())

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'Ae-IBehcksg_uUUtmf90x_R7oKJxxQHwsiE75t_x48ZFoKzIyJoCuVBD8-QJFj7RRZ7QTFsgIQjED2cl',
    'client_secret': `${process.env.PAYPAL_SECRET_KEY}`
});


app.set('view engine', 'ejs');
app.set("views", __dirname + "/views");

app.get("/", function (req, res) {
    var tagline = "Working on paypal integration";
    res.render("table.ejs", { tagline: tagline });
});

app.post("/pay", function (req, res) {
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:4000/success",
            "cancel_url": "http://localhost:4000/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "Mango",
                    "sku": "mango",
                    "price": "30",
                    "currency": "USD",
                    "quantity": 1
                },
                {
                    "name": "Banana",
                    "sku": "banana",
                    "price": "15",
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": "45"
            },
            "description": "Fruits"
        }]
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === 'approval_url') {
                    res.redirect(payment.links[i].href);
                }
            }
        }
    });
});

//validate
app.get('/success', (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": "45"
            }
        }]
    };

    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            console.log(JSON.stringify(payment));
            res.send('Success');
        }
    });
});

app.get('/cancel', (req, res) => res.send('Cancelled'));

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`)
})
