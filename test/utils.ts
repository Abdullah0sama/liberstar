import knex from "knex";
import { generateToken } from "../src/common/services/auth/auth";
import { PasswordHash } from "../src/common/services/auth/utils";
import { BaseUserInterface, UserInterfaceFull } from "../src/components/users/userInterface";
import { rootUser } from "./dataset";


export async function hashedUser (users: UserInterfaceFull[]): Promise<UserInterfaceFull> {
    const userHashed = await Promise.all(users.map(async (user) => {
        user.password = await PasswordHash.hash(user.password);
        return user;
    }))
    return userHashed[0]
}

export async function getRootAccessToken(): Promise<string> {
    try {
        const  user = await hashedUser([rootUser])
        const {role, username, name, id, ...rest} = user;
        const token = await generateToken({role, username, name, id})
        return token;
    } catch(err: any) {
        throw err;
    }
}