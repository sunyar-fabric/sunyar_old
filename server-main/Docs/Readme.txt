setup hyperledger fabric on production

this project consist of 3 vm (master:192.168.9.90 worker1=192.168.9.91 worker2=192.168.9.92)


step1:
 set up a cluster of Swarm and pull the images required. To pull images, (https://docs.docker.com/engine/swarm/swarm-tutorial/create-swarm)
follow these commands

step2:

pull below images on vm master
Fabric tools:
docker pull hyperledger/fabric-tools:x86_64-1.1.0

Fabric orderer:
docker pull hyperledger/fabric-orderer:x86_64-1.1.0

Fabric peer:
docker pull hyperledger/fabric-peer:x86_64-1.1.0

Fabric chaincode environment:
docker pull hyperledger/fabric-ccenv:x86_64-1.1.0

Fabric CA:
docker pull hyperledger/fabric-ca:x86_64-1.1.0

Fabric CouchDB:
docker pull hyperledger/fabric-couchdb:x86_64-0.4.6

by command docker images we should show above images

step3:

install git on all of the vms then 

git clone https://github.com/SateDev/hlf-docker-swarm

step4:

cd hlf-docker-swarm

execute ./create_network.sh

step5:

once the setup for the network is complete, is to move the crypto 
material:
./move_crypo.sh
This will migrate all the crypto material to a desired location where your Docker 
service can read the same

step6:

Open the file with .env extension and change the hostname to the hostname/IP 
addresses of your VMs:
vi .env
org1_hostname:master
org2_hostname:worker1
org3_hostname:worker2

Now, quit out of vi editor by using :wq

step7:

Thus, our service will get created in these nodes
./populate_hostname.sh

step8:

Before we begin, let’s copy the crypto material in each VM.
Go to the second VM and clone the same repository

git clone https://github.com/SateDev/hlf-docker-swarm
cd hyperledger-swarm 
./move_crypto.sh

and the same work for third vm 

step9:

Now, go to the master VM (manager1 in our case), and use the below command to 
begin all the containers:
./start_all.sh

step10:

To verify that the services are running, you can run the following command:
docker service ls | grep “0/1”

This command will inform you about the services that have failed or are in process 
of starting. When the command does not return any value, it means all the services 
are running fine and you are good to move forward

step11:

We are now ready to interact with this network.
Firstly, let us set up the channel:
./scripts/create_channel.sh
If it fails to start, the orderer might not be up and running. In order to debug the 
same, follow the commands below
cd scripts
cd channel
vi create_channel.sh
Enter echo $ORDERER_NAME under set -ev:
Exit out of the editor

step12:

Go into the folder titled Network and run the following command again:
./scripts/create_channel.sh

step13:

Then, let us install the chaincode:
./scripts/install_chaincodes.sh

this chaincode language's with go and we should exchange code with nodejs for this project

step14:

Now that the chaincode is installed, you can begin interacting with it in real time.
The command shall fail if the organizations are more than three in number (for 
our example) as our setup has been done for only three organizations. If more than 
three VMs are set up, it can run on them as well


