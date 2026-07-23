import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MercadoPagoConfig, Preference } from "mercadopago";

dotenv.config();

const app = express();


// Permitir solo tu tienda
app.use(cors({
    origin: [
        "https://idolpets.shop",
        "https://www.idolpets.shop"
    ]
}));

app.use(express.json());


const client = new MercadoPagoConfig({
    accessToken: process.env.ACCESS_TOKEN,
});


app.post("/create-preference", async (req, res) => {

    try {

        const { items } = req.body;

        const preference = new Preference(client);


        const response = await preference.create({

            body: {

                items: items.map(item => ({
                    title: item.name,
                    quantity: item.quantity,
                    unit_price: Number(item.price),
                    currency_id: "MXN",
                })),


                back_urls: {

                    success:
                    "https://idolpets.shop/pedido-confirmado",

                    failure:
                    "https://idolpets.shop/checkout",

                    pending:
                    "https://idolpets.shop/checkout",

                },


                auto_return: "approved"

            }

        });


        res.json({
            id: response.id
        });



    } catch(error) {

        console.log(error);

        res.status(500).json({
            error:error.message
        });

    }

});



app.listen(process.env.PORT || 3001, ()=>{

    console.log(
      `Servidor corriendo en puerto ${process.env.PORT || 3001}`
    );

});