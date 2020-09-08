let error = "";

export default function ValidationContract() {
  // @ts-ignore
    this.clear();
}

ValidationContract.prototype.isRequired = (value: any, message: string) => {
  if (!value || value.length <= 0) error = message;
};

ValidationContract.prototype.hasMinLen = (value: any, min: number, message: string) => {
  if (!value || value.length < min) error = message;
};

ValidationContract.prototype.hasMaxLen = (value: any, max: number, message: string) => {
  if (!value || value.length > max) error = message;
};

ValidationContract.prototype.isFixedLen = (value: any, len: number, message: string) => {
  if (value.length != len) error = message;
};

ValidationContract.prototype.isEmail = (value: any, message: string) => {
  var reg = new RegExp(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);
  if (!reg.test(value)) error = message;
};

ValidationContract.prototype.isAccountNumber = (value: any, message: string) => {
  var reg = new RegExp(/^[0-9]{7,14}$/);
  if (!reg.test(value)) error = message;
};

ValidationContract.prototype.isTaxInformation = (value: any, message: string) => {
  var taxArr = ["Tax0", "Tax1", "Tax2", "Tax3"];
  if (!taxArr.includes(value)) error = message;
};

ValidationContract.prototype.errors = () => {
  return error;
};

ValidationContract.prototype.clear = () => {
  error = "";
};

ValidationContract.prototype.isValid = () => {
  return error.length == 0;
};
