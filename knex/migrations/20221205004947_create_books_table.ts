import knex, { Knex } from "knex";

function createBookTable(builder: Knex.CreateTableBuilder) {
    builder.increments('id', { primaryKey: true });
    builder.string('title', 255).notNullable();
    builder.date('release_date');
    builder.string('description');
    builder.string('image', 255);
    builder.timestamps(true, true);
}

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('books', createBookTable);
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('books');
}

