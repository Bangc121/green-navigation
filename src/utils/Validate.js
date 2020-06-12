const numberRegex = /^\d+$/;
const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
const phoneRegex = /^(01[016789]{1})([1-9]{1})([0-9]{2,3})([0-9]{4})$/;

class Validate {
  constructor() {
    this.numberRegex = numberRegex;
    this.emailRegex = emailRegex;
    this.phoneRegex = phoneRegex;
  }

  isEmpty(...data) {
    for (let i = 0; i < data.length; i++) {
      if (!data[i]) return true;
    }
    return false;
  }

  isNumber(param) {
    return this.numberRegex.test(param);
  }

  isEmail(email) {
    return this.emailRegex.test(email);
  }

  isPhone(phone) {
    if (phone.length === 11 || phone.length === 10) {
      return this.phoneRegex.test(phone);
    } else {
      return false;
    }
  }
}

export default new Validate();
