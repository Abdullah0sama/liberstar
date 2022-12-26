import knex from "knex";
import { generateToken } from "../src/common/services/auth/auth";
import { PasswordHash } from "../src/common/services/auth/utils";
import { BaseUserInterface, UserInterfaceFull } from "../src/components/users/userInterface";
import { rootUser } from "./dataset";


export async function hashedUser (users: UserInterfaceFull[]): Promise<UserInterfaceFull[]> {
    const userHashed = await Promise.all(users.map(async (user) => {
        let password = await PasswordHash.hash(user.password);
        return Object.assign({}, user, {password});
    }))
    return userHashed
}

export async function getRootAccessToken(): Promise<string> {
    try {
        const  user = (await hashedUser([rootUser]))[0]
        const {role, username, name, id, ...rest} = user;
        const token = await generateToken({role, username, name, id})
        return token;
    } catch(err: any) {
        throw err;
    }
}