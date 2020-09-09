import ValidationContract from "../../../../utis/validator/validator";
import { TLoginArgs } from "../../../../generated/graphql";

export default function loginUser(args: TLoginArgs) {
    const contract = new ValidationContract();
    const {
        email,
        password,
    } = args;

}