exports.up = function(knex) {
  return knex.schema.createTable('lawyers', table => {
    table.increments('id');
    table.string('name');
    table.string('email').unique().notNullable();
    table.string('password').notNullable();
    table.string('registration_id');
    table.string('law_firm');
    table.string('speciality');
    table.string('email_verification_code');
    table.boolean('email_verified').defaultTo(false);
    table.string('reset_token');
    table.timestamp('reset_token_expiry');
    table.string('address');
    table.string('zip_code');
    table.boolean('lawyer_verified').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('lawyers');
};
