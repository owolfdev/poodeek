// Utility function to extract the first value from a string or array
function getFirstValue(param: string | string[] | undefined): string {
  return Array.isArray(param) ? param[0] : param || "";
}

const ThankYouPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const params = await searchParams;

  // Extract values from the URL parameters
  const paymentStatus = getFirstValue(params.payment) || "unknown";
  const clientName = getFirstValue(params.client) || "Customer";
  const amount = getFirstValue(params.amount) || "0.00";

  return (
    <div className="max-w-lg mx-auto py-10 text-center">
      <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
      <p className="text-lg mb-6">{`Payment Status: ${paymentStatus}`}</p>
      <p className="text-lg mb-6">{`Client: ${clientName}`}</p>
      <p className="text-lg mb-6">{`Amount Paid: $${amount}`}</p>
    </div>
  );
};

export default ThankYouPage;
