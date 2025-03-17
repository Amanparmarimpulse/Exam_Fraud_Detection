const { getCallLogsForAUser, createZoomMeeting } = require("../middleware/zoom/calls")
const {getUserIdByEmailMiddleWare, createZoomUser, getUserList} = require("../middleware/zoom/zoomUser")

async function getCallLogsByUserId(req , res){
    try {
        const startDate = '2022-06-20'
        const endDate = '2023-06-20'
        const x = await getCallLogsForAUser(req.body.userId , startDate , endDate)
        res.status(200).json(x)
    } catch (error) {
        console.log(error)
    }
}

async function getUserIdByEmail(req , res){
    try {
        console.log('email:',req.body.email)
        const x = await getUserIdByEmailMiddleWare(req.body.email)
        return res.status(200).json(x)
    } catch (error) {
        console.log(error)
    }
}

async function createUser(req, res){
    try {
        const email = req.body.email
        const firstName = req.body.firstName
        const lastName = req.body.lastName
        const password = req.body.password

        const x = await createZoomUser(email , firstName , lastName , password)
        res.status(201).json(x)
    } catch (error) {
        console.log(error)
    }
}

async function getUsers(req , res){
    try {
        const x  = await getUserList()
        res.status(200).json({success:true})
    } catch (error) {
        console.log(error)
    }
}

async function createMeeting(req , res){
    try {
        const x = await createZoomMeeting(req.body.id , req.body.data)
        res.status(201).json(x)
    } catch (error) {
        console.log(error)
    }
}

module.exports = {getCallLogsByUserId , getUserIdByEmail , createUser , getUsers , createMeeting}