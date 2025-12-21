import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export const payment = async (req, res) => {
  const { money } = req.body;
  const userId = req.user.id;
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "czk",
            product_data: { name: "Kredity na kartu" },
            unit_amount: Math.round(money * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        userId: userId,
        creditsAmount: money,
      },
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ error: "Nepodařilo se vytvořit platební relaci" });
  }
};
