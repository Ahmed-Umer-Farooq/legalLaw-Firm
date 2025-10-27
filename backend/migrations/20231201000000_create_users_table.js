exports.up = function(knex) {
  return knex.schema.createTable('users', table => {
    table.increments('id');
    table.string('name');
    table.string('email').unique().notNullable();
    table.string('password').notNullable();
    table.enum('role', ['user', 'lawyer']).notNullable();
    table.string('registration_id');
    table.string('law_firm');
    table.string('speciality');
    table.string('reset_token');
    table.timestamp('reset_token_expiry');
    table.string('email_verification_code');
    table.boolean('email_verified').defaultTo(false);
    table.string('address');
    table.string('zip_code');
    table.boolean('lawyer_verified').defaultTo(false);
    table.string('otp');
    table.timestamp('otp_expiry');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
