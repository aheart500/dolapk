const formatId = require("./formatId");
const ourURL = "https://dolapk1.herokuapp.com/track";
const message_footer = (id) => {
  return `\nرقم الطلب: ${formatId(
    id
  )}\n يمكنكم الإطلاع على حالة الطلب من موقعنا: ${ourURL}`;
};

const added_message = (id) => {
  return `تم تسجيل الطلب الخاص بكم مع Dolapk بنجاح` + message_footer(id);
};

const ready_for_shipment = (id) => {
  return (
    `تم تجهيز الطلب الخاص بكم مع Dolapk وجاري التسليم لشركة الشحن قريباً` +
    message_footer(id)
  );
};
const shipped = (id) => {
  return `تم تسليم الطلب إلي شركة الشحن` + message_footer(id);
};
const ready_for_distribution = (id) => {
  return (
    `جاري توزيع الطلب الخاصة بكم \nسوف يتواصل مندوب شركة الشحن معكم قريباً` +
    message_footer(id)
  );
};
const delivered = (id) => {
  return (
    `تم تسليم الطلب بنجاح \nيُسعدنا التعامل معكم مجدداً` + message_footer(id)
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
