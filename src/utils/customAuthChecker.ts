import { AuthChecker } from "type-graphql";


export const customAuthChecker: AuthChecker<any> = async ({ context }) => {
 if (!context.user) return false;
 return true;
};

