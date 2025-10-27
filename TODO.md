# TODO: Update Backend and Database for Complete Profile Data

## Backend Updates
- [x] Run database migrations to add new columns (username, city, state, country, mobile_number) to users and lawyers tables
- [x] Update userController.js registerUser to accept and save new fields
- [x] Update lawyerController.js registerLawyer to accept and save new fields
- [x] Update authController.js getProfile to return new fields
- [x] Update authController.js updateProfile to update new fields
- [x] Update userController.js getProfile and updateProfile for new fields
- [x] Update lawyerController.js getProfile and updateProfile for new fields
- [x] Update validator.js if needed for new fields

## Frontend Updates
- [x] Update AuthForm.jsx to send new fields (username, city, state, country, mobile_number) in registration data

## Testing
- [x] Start backend server
- [ ] Register a new user and verify fields in phpMyAdmin
- [ ] Register a new lawyer and verify fields in phpMyAdmin
- [ ] Check profile endpoints return new fields
