# wiki-world

A collaborative site (modeled after Wikipedia) that allows users to create new wikis on virtually any topic and be able to contribute
their knowledge to the subject. 

Users can sign up as Standard users with the option to upgrade to Premium users where they will have
the option to create private wikis. Private wikis are only visible to the owner and anyone that is a collaborator on the project. 
Standard users can edit a private wiki that they are collaborating on but don't have access.

Premium Users
  - Create public wikis that anyone can access/edit
  - Create private wikis only visible to the owner and any collaborators of the wiki
  - Add collaborators to your private wikis, giving them access to edit the wiki

Standard Users
  - Create public wikis that anyone can access/edit
  - Collaborator on private wikis (if granted access). Cannot add/delete other collaborators.
   
Technologies implemented:
  - Testing - Jasmine
  - Views Engine - EJS
  - Authentication - PassportJS
  - Database - PostgreSQL (Sequelize ORM)
  - Express Framework
  - Encryption - BCryptJS
  - Payment - Stripe
