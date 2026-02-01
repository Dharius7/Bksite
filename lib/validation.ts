export const isEmail = (value: string) => /\S+@\S+\.\S+/.test(value);

export const isPhone = (value: string) => /^[0-9()+\-\s]{7,20}$/.test(value);

export const isRoutingNumber = (value: string) => /^\d{9}$/.test(value);

export const isAccountNumber = (value: string) => /^\d{4,17}$/.test(value);

export const isPositiveAmount = (value: string | number) => {
  const num = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(num) && num > 0;
};

export const trimRequired = (value: string) => value.trim().length > 0;
