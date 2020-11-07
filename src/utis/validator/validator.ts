export default class ValidationContract {
    error: string = '';

    isRequired = (value: any, message: string) => {
      if (!value || value.length <= 0) this.error = message;
    };

      hasMinLen = (value: any, min: number, message: string) => {
        if (!value || value.length < min) this.error = message;
      };

      hasMaxLen = (value: any, max: number, message: string) => {
        if (!value || value.length > max) this.error = message;
      };

      isFixedLen = (value: any, len: number, message: string) => {
        if (value.length !== +len) this.error = message;
      };

      isEmail = (value: any, message: string) => {
        const reg = new RegExp(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);
        if (!reg.test(value)) this.error = message;
      };

      isAccountNumber = (value: any, message: string) => {
        const reg = new RegExp(/^[0-9]{7,14}$/);
        if (!reg.test(value)) this.error = message;
      };

      isTaxInformation = (value: any, message: string) => {
        const taxArr = ['Tax0', 'Tax1', 'Tax2', 'Tax3'];
        if (!taxArr.includes(value)) this.error = message;
      };

      errors = () => this.error;

      clear = () => {
        this.error = '';
      };

      isValid = () => this.error.length === 0;
}
