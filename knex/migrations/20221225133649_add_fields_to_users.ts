import { Knex } from "knex";


function addColumns(tablebuilder: Knex.CreateTableBuilder) {

    tablebuilder.unique(['username']);
    tablebuilder.string('email', 150).unique().notNullable();
    tablebuilder.string('password', 150).notNullable();

}

function removeColumns(tablebuilder: Knex.CreateTableBuilder) {
    tablebuilder.dropUnique(['username']);
    tablebuilder.dropColumns('email', 'password')
}

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('users', addColumns)
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('users', removeColumns)
}

