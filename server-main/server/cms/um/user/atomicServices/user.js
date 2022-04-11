const Op = require('sequelize').Op;
var bcrypt = require('bcryptjs');
const db = require('../../../../config/dbIndex');
const {  dbErrorHandling } = require('../../../../utility/error/dbError');
const { setContextOutput } = require('../../../../utility/logging');

const User = db.tblUser;


const createUser = async (context) => {
    try {
        const { personId, username, password, expireDate, active } = context.input;
        const salt = await bcrypt.genSalt(10);
        let hashPassword = await bcrypt.hash(password, salt);
        return setContextOutput(context, await User.create({
            personId,
            username,
            password: hashPassword,
            expireDate,
            active
        }));

    } catch (error) {
        await dbErrorHandling(error, context);
    }
}


const updateUser = async (context) => {
    try {
        const { personId, username, password, expireDate, active, userId } = context.input;
        const salt = await bcrypt.genSalt(10);
        let hashPassword = await bcrypt.hash(password, salt);
        let user;
        if(password){
            user = await User.update({
                personId,
                username,
                password: hashPassword,
                expireDate,
                active
            }, { where: { userId } });
        }
        else{
            user = await User.update({
                personId,
                username,
                expireDate,
                active
            }, { where: { userId } });
        }
        if (user[0] == [1]) {
            return setContextOutput(context, await User.findByPk(context.input.userId))
        }
    } catch (error) {
        await dbErrorHandling(error, context);
    }
}

const loadUser = async (context) => {
    try {
        let input = context.input;
        let query = {};
        if (input.userId) query.userId = input.userId;
        if (input.personId) query.personId = input.personId;
        if (input.username) query.username = input.username;
        if (input.expireDate) query.expireDate = input.expireDate;
        if (input.active) query.active = input.active;
        return setContextOutput(context, await User.findOne({
            where: query,
            include: {
                model: db.tblPersonal,
                // required: true,
            }
        }));
    } catch (error) {
        await dbErrorHandling(error, context);
    }
}


const loadUserPaginate = async (context) => {
    try {
        let input = context.input;
        let offset = 12 * input.page;
        await delete context.input.page
        let query = {};
        if (input.userId) query.userId = input.userId;
        if (input.personId) query.personId = input.personId;
        if (input.username) query.username = { [Op.like]: `%${input.username}%` };
        if (input.expireDate) query.expireDate = input.expireDate;
        if (input.active) query.active = input.active;
       
        if(input.username || input.userId || input.personId){
            return setContextOutput(context, await User.findAndCountAll({
                where: query,
                include: {
                    model: db.tblPersonal,
                    required: true,
                },
                limit: 12,
                offset: offset
            }));
        }  
        else{
            return setContextOutput(context, await User.findAndCountAll({
                where: query,
                include: {
                    model: db.tblPersonal,
                    required: true,
                    attributes:{
                        exclude:["personPhoto"]
                    }
                },
                limit: 12,
                offset: offset
            }));
        }
           
        
    } catch (error) {
        await dbErrorHandling(error, context);
    }
}

const deleteUser = async (context) => {
    try {
        return setContextOutput(context, await User.destroy({ where: { userId: context.input.userId } }))
    } catch (error) {
        await dbErrorHandling(error, context);
    }
}

const isUserExistsByUsername = async (context) => {
    try {
        return setContextOutput(context, await User.findOne({ where: { username: context.input.username } }))
    } catch (error) {
        await dbErrorHandling(error, context)
    }
}

const countFailedTries = async (context) => {
    try {
        let bFlag = context.input.bFlag;
        const resetBanned = context.input.resetBanned;
        let user = await User.findOne({ where: { username: context.input.username } });
        if(resetBanned){
            await User.update({
                active: true,
                bannedTime: null,
                "failedTriesCount": 0,
            }, { where: { username: user.username } });
        };
        if (user && user.failedTriesCount >= 2 && bFlag) {
            await User.update({
                active: false,
                bannedTime: new Date()
            }, { where: { username: user.username } });
            return setContextOutput(context, user);
        } else if (user && user.failedTriesCount < 2 && bFlag) {
            console.log("THIS IS BAD!");
            user = await User.increment({
                'failedTriesCount': 1
            }, { where: { username: user.username } });
            return setContextOutput(context, user);
        } else if (user && !bFlag) {
            user = await User.update({
                bannedTime: null,
                'failedTriesCount': 0
            }, { where: { username: user.username } });
            return setContextOutput(context, user)
        }
    } catch (error) {
        await dbErrorHandling(error, context)
    }
}

const deactivateUser = async (context) => {
    try {
        return setContextOutput(context, await User.update({ active: false }, { where: { username: context.input.username } }))
    } catch (error) {
        dbErrorHandling(error, context)
    }
}

module.exports = { createUser, updateUser, loadUser, deleteUser, loadUserPaginate, isUserExistsByUsername,
     countFailedTries, deactivateUser };