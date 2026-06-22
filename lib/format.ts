export const formatIDR = (amount: number) =>
  "Rp " + new Intl.NumberFormat("id-ID").format(Math.round(amount));