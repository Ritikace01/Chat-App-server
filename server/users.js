const users = [];

const addUser = ({ id, name, room }) => {
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();

    const existingUser = users.find(user => user.room === room && user.name === name);
    if(existingUser) {
        return { error: "Username is already taken" };
    }

    const user = { id, name, room };
    users.push(user);
    console.log("Users array : ", users);
    return { user };
}

const getUser = (id) => {
    return users.find(user => user.id === id);
 }

const removeUser = (id) => {
    const index = users.findIndex(user => user.id === id);
    console.log("Index value : ", index);
    if(index !== -1) {
        return users.splice(index, 1);
        console.log("After removing user in users.js : ", users);
    }
}

const getAllUsers = () => {
    console.log("All users : ", users);
}

const getUserInRoom = (room) => users.filter(user => user.room === room);

// exporting these functions
module.exports = { addUser, removeUser, getUser, getUserInRoom, getAllUsers};