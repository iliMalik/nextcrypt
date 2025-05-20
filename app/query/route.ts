import postgres from "postgres";

// Connect to the Postgres database using the connection string in your .env file
const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

// Query function to fetch invoice amount and customer name where amount is 666
async function listInvoices() {
  const data = await sql`
    SELECT invoices.amount, customers.name
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE invoices.amount = 666;
  `;
  return data;
}

// GET handler that runs the query and returns the data
export async function GET() {
  try {
    const invoices = await listInvoices();
    return Response.json(invoices);
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
