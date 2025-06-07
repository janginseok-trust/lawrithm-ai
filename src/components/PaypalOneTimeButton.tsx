import { PayPalButtons } from "@paypal/react-paypal-js";

type PaypalOneTimeButtonProps = {
  amount: number;
  planType: string;
  onSuccess: (order: any) => void;
};

export default function PaypalOneTimeButton({ amount, planType, onSuccess }: PaypalOneTimeButtonProps) {
  return (
    <PayPalButtons
      style={{
        layout: "vertical",
        color: "gold",
        shape: "rect",
        label: "paypal"
      }}
      createOrder={(data, actions) => {
        return actions.order.create({
          intent: "CAPTURE",
          purchase_units: [{
            amount: { value: amount.toString(), currency_code: "USD" },
            description: planType,
          }],
        });
      }}
      onApprove={async (data, actions) => {
        const order = await actions?.order?.capture();
        onSuccess(order);
      }}
      onError={err => alert("결제 오류: " + err)}
    />
  );
}
