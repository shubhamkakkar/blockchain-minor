import ValidationContract from "../../../../utis/validator/validator";

export default function loginUser(args: any) {
    const contract = new ValidationContract();
    const {
        email,
        password,
    } = args;

}