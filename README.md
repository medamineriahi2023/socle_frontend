# Table of Contents

- Introduction

- Overview

- Defintions

- Quick Start

- Screenshots and Features


## Introduction

Our web application offers comprehensive user and inventory management features across multiple sections. Administrators can manage users by adding, editing, and assigning roles, as well as resetting passwords and printing user badges. User groups, roles, and organizations can also be efficiently managed, providing full control over the permissions and structure of the application.
Additionally, the application includes a robust stock management system, allowing users to handle categories, subcategories, products, and inventories. Users can add, edit, and filter products, as well as scan barcodes for quick inventory updates. The inventory system supports transaction management through a "sell mode" and allows users to check payment history, ensuring an efficient and streamlined management process.
By providing isolated management, the application ensures that tenants can securely oversee their operations without interference from others


## Overview

- Simplified User Management:

Administrators can easily manage users, groups, roles, and organizations across multiple sections, streamlining the process of onboarding, updating, and securing users.

- Efficient Inventory Management: 

With powerful tools for handling categories, subcategories, products, and inventories, the application simplifies the complex task of managing stock across different entities.

- Data Security: 

Each instance operates in complete isolation, ensuring that data remains secure and inaccessible to other clients, preventing unauthorized access and maintaining privacy.

- Tenant Isolation: 

The application is built to support a multitenant architecture, where each client has its own environment, allowing for tailored configurations, user management, and resource allocation without interference from other clients.


## Definitions


- Technologies Used:

npm : 9.6.2

Node.js : 18.15.0

Angular CLI : 15.2.4

- Organization:

Organization: In our application, an "Organization" refers to the concept of a "tenant" or "client." It represents a grouping of 
independent entities within the system, similar to what is called a "realm" in other contexts. Each organization can encompass multiple
independent entities, providing a flexible structure for managing distinct groups of users and members.

- Client: 

A "Client" in our application represents a separate client or instance, functioning as a self-contained unit with its own set of users, data, configurations, and resources. Each client is fully isolated from others, meaning that no data, user information, or settings are shared across clients. This architecture allows for strong data security and privacy, as operations within one client cannot impact another. Clients are often used to support multi-client scenarios, where each client requires customized configurations, unique data sets, and tailored user management. By isolating clients, our application can efficiently handle multiple clients simultaneously while ensuring that each client’s data and operations are kept separate, secure, and unaffected by the activities of other clients.


## Quick Start

Clone the repository:git clone https://gitlab.com/yassin_abdellaoui/socle-front.git

Navigate to the Angular folder: cd /socle-front/Security-socle

Install Node.js : nvm install 18.15.0

Install the Angular CLI: npm install -g @angular/cli@15.2.4

Install project dependencies: npm install

Start the Angular development server: ng serve

Open a web browser and navigate to http://localhost:4200 to view the application.

Note: Node.js need to be installed on your machine to run this project.

Documentation link : https://docs.google.com/document/d/1T3fVWkQnE9bsvv38ogykf8z_7YBzbcniQCXZeg2hjKI/edit#heading=h.cqm7rau93f7f


## Screenshots and Features


**Accessing the Application**

1. Open your web browser:
- Go to the URL where the application is hosted : http://localhost:4200
2. Login :
- Enter your username and password on the login page.
- If you don't have an account, request one from the administrator.
- After login choose an Organization.
![Screenshot_from_2024-08-20_17-32-37](/uploads/571207f2013f4b4a6a9a8393bf36e881/Screenshot_from_2024-08-20_17-32-37.png)

**User Management**
1. Users section:
- Navigate to the "Users" section. 
- Click on "Add" and fill in the require details.
- Actions: Add, edit, delete, edit user roles, init paswssord or check user information and you can print a badge for the user.
![Screenshot_from_2024-08-20_17-47-40](/uploads/c9660a057106225c49a22feefa7d468a/Screenshot_from_2024-08-20_17-47-40.png)

2. Groups section:
- Navigate to the "Groups" section. 
- Add, edit, delete, edit role groups and Edit user groups.
![Screenshot_from_2024-08-20_17-48-54](/uploads/59a6880b90f1d793ad70ea34d007290f/Screenshot_from_2024-08-20_17-48-54.png)

3. Roles section:
- Navigate to the "Roles" section. 
- Click on "Add" and fill in the require details.
- Actions: Add and delete roles.
![Screenshot_from_2024-08-20_17-49-50](/uploads/da1e9c808bbfd6a2eb529e3a4eaad44a/Screenshot_from_2024-08-20_17-49-50.png)

4. Organizations section:
- Navigate to the "Organizations" section. 
- Click on "Add" and fill in the require details.
-Actions: Add, delete and Edit org members.
![Screenshot_from_2024-08-20_17-50-26](/uploads/82131b5d4e1f66c3257a194c1edec7bc/Screenshot_from_2024-08-20_17-50-26.png)

**Stock Management**
![Screenshot_from_2024-08-20_17-51-14](/uploads/5e8891b05394e03bc41bdf8b1934a188/Screenshot_from_2024-08-20_17-51-14.png)

1. Categories section:
- Navigate to the "Categories" section.
- Click on "Add" and fill in the require details.
- Actions: edit, delete and edit subcategories.
![Screenshot_from_2024-08-20_17-53-05](/uploads/0b5cf174e3d0589cfd9115e201f664ca/Screenshot_from_2024-08-20_17-53-05.png)

2. Subcategory section

- Select the category you want to add a subcategory to.
- Click on "Add" and fill in the required details.
- Save the subcategory.
![Screenshot_from_2024-08-20_17-55-17](/uploads/43b4d6bec1c8fce7bedcd2cc08abbe68/Screenshot_from_2024-08-20_17-55-17.png)

3. Products section:
- Navigate to the "Products" section.
- Click on "Add" and fill in the require details.
- Actions: edit, delete and preview product.
![Screenshot_from_2024-08-20_17-56-41](/uploads/09ab883cf82a56282c9f00fd3757dc38/Screenshot_from_2024-08-20_17-56-41.png)

4. Inventory section:
- Navigate to the "inventories" section.
- Click on "Add" and fill in the require details.
- Actions: edit, delete, add products, add product with barcode, open sell mode and check payment history.
![Screenshot_from_2024-08-20_17-57-33](/uploads/b0843f7422d781b2a6adb95db0c453bf/Screenshot_from_2024-08-20_17-57-33.png)





