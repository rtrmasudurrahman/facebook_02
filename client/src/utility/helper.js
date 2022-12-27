import { isEmail, isMobile } from "./validate";

export const hideMobileEmail = (data) => {
  if (isEmail(data)) {
    let com = data.split("@")[1];
    let mail = data.split("@")[0];

    let first = mail.substr(0, 1);
    let last = mail.substr(-1, 1);
    return `${first} ********** ${last}@${com}`;
  }
  if (isMobile(data)) {
    let first = data.substr(0, 3);
    let last = data.substr(-2);
    return `${first} ********** ${last}`;
  }
};
