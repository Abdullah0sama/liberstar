import { Knex } from "knex";

function createUserTable(builder: Knex.CreateTableBuilder) {
    builder.increments('id', { primaryKey: true });
    builder.string('name', 255).notNullable();
    builder.date('dob').notNullable();
    builder.string('bio', 255).notNullable();
    builder.string('image', 255);
    builder.string('username', 40).notNullable();
    builder.timestamps(true, true);
}

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('users', createUserTable);
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('users');
}

