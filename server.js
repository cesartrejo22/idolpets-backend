import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MercadoPagoConfig, Preference } from "mercadopago";

dotenv.config();

const app = express();


// Configuración CORS
app.use(cors({
    origin: [
        "http://localhost:5174",
        "http://localhost:5173",
        "https://idolpets.shop",
        "https://www.idolpets.shop"
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
}));


app.use(express.json());


// Configuración Mercado Pago
const client = new MercadoPagoConfig({
    accessToken: process.env.ACCESS_TOKEN,
});


// Ruta de prueba
app.get("/", (req, res) => {
    res.send("Backend Idol Pets funcionando 🚀");
});


// Crear preferencia Mercado Pago
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

        console.log("Error Mercado Pago:", error);

        res.status(500).json({
            error: error.message
        });

    }

});


// Levantar servidor
app.listen(process.env.PORT || 3001, ()=>{

    console.log(
        `Servidor corriendo en puerto ${process.env.PORT || 3001}`
    );

});