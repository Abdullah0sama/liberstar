import { Knex } from "knex";


function addColumns(tablebuilder: Knex.CreateTableBuilder) {

    tablebuilder.string('role').defaultTo('user')

}


function removeColumns(tablebuilder: Knex.CreateTableBuilder) {
    tablebuilder.dropColumn('role')
}
export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('users', addColumns)
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('users', removeColumns)
}

