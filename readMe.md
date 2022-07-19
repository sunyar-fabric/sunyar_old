# Sunyar
> Sunyar is a distributed settlement platform, which can be used by charities for managing donation process. This can be done by an open-source platform, which can link to a distributed ledger for charities. The open-source platform helps them for automating their process and the distributed ledger can used for two main reasons: uniqueness of needy and their requirements, and transparent aid for them). 
> Live demo [_here_](https://www.example.com). <!-- If you have the project hosted somewhere, include the link here.  -->

## Table of Contents
<!--* [General Info](#general-information) -->
* [Server-main](#server-main)
* [Smart Contracts](#smart-contracts)
* [Sunyar Web Admin Main](#features)
* [Sunyar Portal](#sunyar-portal)
* [Setup](#setup)
* [Contact](#contact)
<!-- * [License](#license) -->


## Server Main
The backend part of the project which connects to PostgreSQL for submitting and querying data it also includes utilities such as middleware in order to send every related request to fabric SDK as a gateway of fabirc network and fetch back requested  data.

## Smart Contracts
The Sunyar's core has three chain codes. each chain code has some smart contracts: 
1. Needy : When needy was identified by a non-governmental organization (charity). The identity information of the person is registered in the network if it is not duplicate and the identity code is issued to that person.
2. Benevolent Projects: Whenever a non-governmental organization (charity) wants to introduce its benevolent project to help people in need, this benevolent project must be registered in the network under in the name of that charity (non-governmental organization). If the project of this charity is not duplicate, a unique code will be issued for that project.
3. Operations: It has three Main smart contracts.
  - Paying for aid to a needy: The donor through the portal in the form of a non-governmental organization (charity) through the payment Gateway helps the needy  belonging to that benevolent project. This donation transaction is recorded in the network. If there is no problem, an operation code will be issued to the donor.
  - Confirmation of payment of assistance to a needy: Islamic banking law defines a escrow account for charities to prevent money laundering. When a donor from a charity A donates to charity B, the money is deposited into an A's escrow account. The charity B must settle and approve the settlement in proportion to the amount of aid to a needy. This transaction will be registered in the network and the operation code will be issued. 
  - Settlement between charities: After confirming the payment, the donation amount will be deducted from the escrow account of Charity A and will be transferred to the escrow account of Charity B. This transaction will be registered in the network and the operation code will be issued.

<!-- You don't have to answer all the questions - just the ones relevant to your project. -->

## Sunyar Web Admin Main
This section describes the front-end of administration panel, which is owned by NGOs or charities to manage users, the needy, philanthropic projects, accounting, and more.


## Sunyar Portal
This section describes the front-end of the portal, which is dedicated to NGOs or charities collecting donations.


## Setup
<!-- What are the project requirements/dependencies? Where are they listed? A requirements.txt or a Pipfile.lock file perhaps? Where is it located?-->

<!--Proceed to describe how to install / setup one's local environment / get started with the project.-->


## Contact
Created by [Polwinno](http://polwinno.ir/EN/IndexEn.html) - feel free to contact us!


<!-- Optional -->
<!-- ## License -->
<!-- This project is open source and available under the [... License](). -->

<!-- You don't have to include all sections - just the one's relevant to your project -->
