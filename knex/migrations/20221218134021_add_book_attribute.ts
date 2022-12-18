import { Knex } from "knex";


function addColumns(tablebuilder: Knex.CreateTableBuilder) {
    tablebuilder.string('author', 120).notNullable()
}

function removeColumns(tablebuilder: Knex.CreateTableBuilder) {
    tablebuilder.dropColumn('author');
}

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('books', addColumns);
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('books', removeColumns);
}

