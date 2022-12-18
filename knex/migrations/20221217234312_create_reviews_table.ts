import { Knex } from "knex";



function createReviewsTable(builder: Knex.CreateTableBuilder) {
    builder.increments('id', { primaryKey: true });
    builder.string('title', 240).notNullable();
    builder.string('body').notNullable();
    builder.integer('book_ref').references('books.id').notNullable();
    builder.integer('user_ref').references('users.id').notNullable();
}
export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('reviews', createReviewsTable);
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('reviews');
}

