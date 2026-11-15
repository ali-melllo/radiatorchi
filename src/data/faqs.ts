import type { FaqItem } from "@/types";

/** Policy answers are intentionally neutral. Edit them to match real business policies before launch. */
export const faqs: FaqItem[] = [
  {
    id: "choose-radiator",
    category: "choosing",
    question: { fa: "چطور رادیاتور مناسب خودرویم را انتخاب کنم؟", en: "How do I choose the right radiator for my car?" },
    answer: {
      fa: "مدل و سال ساخت خودرو را آماده داشته باشید و با ما تماس بگیرید. اگر برای محصول فهرست سازگاری ثبت شده باشد، در صفحه همان محصول می‌بینید.",
      en: "Have your car model and year ready and contact us. If compatibility is listed for a product, you will see it on that product's page.",
    },
  },
  {
    id: "compatibility",
    category: "choosing",
    question: { fa: "سازگاری محصول با خودرو را چطور بررسی کنم؟", en: "How can I check that a product fits my vehicle?" },
    answer: {
      fa: "در صفحه محصول بخش سازگاری را ببینید. اگر خودرو شما در آن نیست، پیش از خرید از تیم رادیاتورچی بپرسید.",
      en: "Look at the compatibility section on the product page. If your vehicle is not listed, ask the Radiatorchi team before buying.",
    },
  },
  {
    id: "availability",
    category: "ordering",
    question: { fa: "از کجا بفهمم محصول موجود است؟", en: "How do I know if a product is available?" },
    answer: {
      fa: "موجودی در وب‌سایت نمایش داده نمی‌شود. برای اطلاع از موجودی با ما تماس بگیرید.",
      en: "Stock is not shown on the website. Contact us to confirm availability.",
    },
  },
  {
    id: "how-to-order",
    category: "ordering",
    question: { fa: "چطور سفارش بدهم؟", en: "How do I place an order?" },
    answer: {
      fa: "روی «تماس برای سفارش» بزنید و تلفن، ایمیل یا واتس‌اپ را انتخاب کنید. سفارش از طریق وب‌سایت ثبت نمی‌شود.",
      en: "Press “Contact to order” and choose phone, email or WhatsApp. Orders are not placed through the website.",
    },
  },
  {
    id: "online-payment",
    category: "ordering",
    question: { fa: "آیا می‌توانم آنلاین پرداخت کنم؟", en: "Can I pay online?" },
    answer: {
      fa: "خیر. این وب‌سایت پرداخت آنلاین ندارد. شیوه پرداخت هنگام تماس هماهنگ می‌شود.",
      en: "No. This website has no online payment. The payment method is arranged when you contact us.",
    },
  },
  {
    id: "shipping",
    category: "policies",
    question: { fa: "ارسال چگونه انجام می‌شود؟", en: "How does delivery work?" },
    answer: {
      fa: "شرایط ارسال هنگام سفارش و بر اساس سیاست‌های جاری رادیاتورچی اعلام می‌شود.",
      en: "Delivery terms are communicated when you order, according to Radiatorchi's current policies.",
    },
  },
  {
    id: "returns",
    category: "policies",
    question: { fa: "شرایط مرجوعی چیست؟", en: "What is the return policy?" },
    answer: {
      fa: "شرایط مرجوعی هنگام سفارش اعلام می‌شود. لطفاً پیش از خرید از تیم ما بپرسید.",
      en: "Return terms are communicated when you order. Please ask our team before buying.",
    },
  },
  {
    id: "warranty",
    category: "policies",
    question: { fa: "آیا محصولات گارانتی دارند؟", en: "Do products come with a warranty?" },
    answer: {
      fa: "وضعیت گارانتی هر محصول هنگام تماس اعلام می‌شود.",
      en: "The warranty status of each product is confirmed when you contact us.",
    },
  },
];
