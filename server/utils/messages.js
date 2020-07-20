const formatId = require("./formatId");
const ourURL = "https://dolapk1.herokuapp.com/track";
const message_footer = (id) => {
  if (id)
    return `رقم الطلب: ${formatId(
      id
    )}\n يمكنكم الإطلاع على حالة الطلب من موقعنا: ${ourURL}`;
  return `يمكنك الإطلاع على حالة الطلب من موقعنا ${ourURL}`;
};

const added_message = (id = false) => {
  return `تم تسجيل الطلب الخاص بكم مع Dolapk بنجاح` + "\n" + message_footer(id);
};

const ready_for_shipment = (id = false) => {
  return (
    `تم تجهيز الطلب الخاص بكم مع Dolapk وجاري التسليم لشركة الشحن قريباً` +
    "\n" +
    message_footer(id)
  );
};
const shipped = (id = false) => {
  return `تم تسليم الطلب إلي شركة الشحن` + "\n" + message_footer(id);
};
const ready_for_distribution = (id = false) => {
  return (
    `جاري توزيع الطلب الخاصة بكم \nسوف يتواصل مندوب شركة الشحن معكم قريباً` +
    "\n" +
    message_footer(id)
  );
};
const delivered = (id = false) => {
  return (
    `تم تسليم الطلب بنجاح \nيُسعدنا التعامل معكم مجدداً` +
    "\n" +
    message_footer(id)
  );
};
const cancelled = () => {
  return `تم إلغاء الطلب الخاص بكم\nيُسعدنا التعامل معكم مجدداً`;
};

module.exports = {
  added_message,
  ready_for_distribution,
  ready_for_shipment,
  shipped,
  delivered,
  cancelled,
};
