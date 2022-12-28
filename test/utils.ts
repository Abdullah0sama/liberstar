import knex from "knex";
import { generateToken } from "../src/common/services/auth/auth";
import { PasswordHash } from "../src/common/services/auth/utils";
import { BaseUserInterface, UserInterfaceFull } from "../src/components/users/userInterface";
import { rootUser } from "./dataset";


export async function hashedUser (users: UserInterfaceFull[]): Promise<UserInterfaceFull[]> {
    let userHashedPassword = await Promise.all(users.map((user) => {
        return PasswordHash.hash(user.password);
    }))
    const userHashed = users.map((user, index) => {
        return Object.assign({}, user, {password: userHashedPassword[index]});
    })

    return userHashed
}

export async function getRootAccessToken(): Promise<string> {
    try {
        const  user = (await hashedUser([rootUser]))[0]
        const {role, username, name, id, ...rest} = user;
        const token = await generateToken({role, username, name, id}, {
            expiresIn: '1d'
        })
        return token;
    } catch(err: any) {
        throw err;
    }
}